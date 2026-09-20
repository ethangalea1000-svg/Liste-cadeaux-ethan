// Supabase Edge Function: gift-search
// Calls Gemini with Google Web + Image Search and returns grounded results
// to the wishlist UI without exposing the Gemini API key in the browser.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

function collectGrounding(value: unknown, out: { sources: any[]; images: any[]; searchSuggestions: string[] }) {
  if (Array.isArray(value)) {
    for (const item of value) collectGrounding(item, out);
    return;
  }
  if (!value || typeof value !== "object") return;

  const obj = value as Record<string, unknown>;

  if (typeof obj.uri === "string" && typeof obj.title === "string") {
    out.sources.push({ title: obj.title, url: obj.uri });
  }
  if (typeof obj.sourceUri === "string" && typeof obj.imageUri === "string") {
    out.images.push({
      title: typeof obj.title === "string" ? obj.title : "Image",
      imageUrl: obj.imageUri,
      sourceUrl: obj.sourceUri,
      domain: typeof obj.domain === "string" ? obj.domain : "",
    });
  }
  if (typeof obj.search_suggestions === "string") {
    out.searchSuggestions.push(obj.search_suggestions);
  }

  for (const [key, child] of Object.entries(obj)) {
    if (key === "data" && typeof child === "string" && child.length > 500000) continue;
    collectGrounding(child, out);
  }
}

function uniqueBy<T>(items: T[], key: (x: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  const providedKey = req.headers.get("apikey") || "";
  const publishableKeysRaw = Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") || "";
  let publishableOk = false;
  try {
    const keys = JSON.parse(publishableKeysRaw);
    publishableOk = Object.values(keys).includes(providedKey);
  } catch {
    publishableOk = false;
  }
  if (!publishableOk) return json({ error: "Accès refusé." }, 401);

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiKey) {
    return json({
      error: "API IA non configurée.",
      setup: "Ajoute le secret GEMINI_API_KEY dans Supabase Edge Functions.",
    }, 503);
  }

  let body: { title?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON invalide." }, 400);
  }

  const title = String(body.title ?? "").trim().slice(0, 180);
  const description = String(body.description ?? "").trim().slice(0, 700);
  if (!title) return json({ error: "Nom du cadeau manquant." }, 400);

  const prompt = [
    "Tu es le moteur de recherche IA d'une liste de cadeaux en France.",
    "Recherche largement sur le Web en temps réel avec les outils fournis.",
    "",
    `Produit demandé : ${title}`,
    `Description/légende : ${description || "Aucune description supplémentaire."}`,
    "",
    "OBJECTIF :",
    "1. Vérifier l'identité exacte du produit à partir du nom ET de la description.",
    "2. Chercher des offres réellement pertinentes en France.",
    "3. Écarter les pages supprimées, les produits différents, les résultats manifestement hors sujet et les pages dont l'indisponibilité est évidente.",
    "4. Comparer les prix lorsque le prix est visible et suffisamment fiable.",
    "5. Indiquer la disponibilité seulement lorsqu'elle est explicitement visible ou clairement déductible de la page.",
    "6. Donner les liens directs vers les sources et offres.",
    "7. Rechercher aussi des images du bon produit en utilisant le nom ET la description.",
    "",
    "IMPORTANT : ne fabrique jamais un prix, un stock, un lien, une boutique ou une image.",
    "Lorsqu'une donnée n'est pas vérifiable, écris null ou indique 'Non vérifié'.",
    "Ne confonds pas abonnement, édition, modèle ou version avec un autre produit.",
  ].join("\n");

  const schema = {
    type: "object",
    properties: {
      productMatch: { type: "string" },
      summary: { type: "string" },
      offers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            shop: { type: "string" },
            price: { type: "string" },
            availability: { type: "string" },
            url: { type: "string" },
          },
          required: ["shop", "price", "availability", "url"],
        },
      },
    },
    required: ["productMatch", "summary", "offers"],
  };

  const geminiRes = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "x-goog-api-key": geminiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3.1-flash-image",
        input: prompt,
        tools: [{
          type: "google_search",
          search_types: ["web_search", "image_search"],
        }],
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema,
        },
      }),
    },
  );

  const rawText = await geminiRes.text();
  if (!geminiRes.ok) {
    console.error("Gemini API", geminiRes.status, rawText);
    return json({ error: "La recherche IA a échoué.", detail: rawText.slice(0, 500) }, 502);
  }

  let interaction: any;
  try {
    interaction = JSON.parse(rawText);
  } catch {
    return json({ error: "Réponse IA invalide." }, 502);
  }

  let modelText = "";
  if (typeof interaction.output_text === "string") modelText = interaction.output_text;

  if (!modelText && Array.isArray(interaction.steps)) {
    for (const step of interaction.steps) {
      if (step?.type === "model_output" && Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block?.type === "text" && typeof block.text === "string") {
            modelText += block.text;
          }
        }
      }
    }
  }

  let result: any = null;
  try {
    result = JSON.parse(modelText);
  } catch {
    result = {
      productMatch: title,
      summary: modelText || "Aucun résumé disponible.",
      offers: [],
    };
  }

  const grounding = { sources: [], images: [], searchSuggestions: [] } as {
    sources: any[];
    images: any[];
    searchSuggestions: string[];
  };
  collectGrounding(interaction, grounding);

  const sources = uniqueBy(
    grounding.sources,
    (x) => x.url,
  ).slice(0, 12);

  const images = uniqueBy(
    grounding.images,
    (x) => x.imageUrl + "|" + x.sourceUrl,
  ).slice(0, 8);

  return json({
    ok: true,
    product: result.productMatch || title,
    summary: result.summary || "",
    offers: Array.isArray(result.offers) ? result.offers.slice(0, 8) : [],
    sources,
    images,
    searchSuggestionsHtml: grounding.searchSuggestions[0] || null,
    searchedAt: new Date().toISOString(),
  });
});
