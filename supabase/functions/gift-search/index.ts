// Supabase Edge Function: gift-search
// Uses Perplexity Agent API for real-time web research.
// The Perplexity API key stays server-side in Supabase Secrets.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

function uniqueBy<T>(items: T[], key: (x: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function collectSources(value: unknown, out: { title: string; url: string }[]) {
  if (Array.isArray(value)) {
    for (const item of value) collectSources(item, out);
    return;
  }
  if (!value || typeof value !== 'object') return;
  const obj = value as Record<string, unknown>;
  if (typeof obj.url === 'string') {
    const title = typeof obj.title === 'string' ? obj.title : obj.url;
    out.push({ title, url: obj.url });
  }
  for (const [key, child] of Object.entries(obj)) {
    if (key === 'input' && typeof child === 'string' && child.length > 50000) continue;
    collectSources(child, out);
  }
}

function getOutputText(response: any) {
  if (typeof response?.output_text === 'string') return response.output_text;
  let text = '';
  const output = Array.isArray(response?.output) ? response.output : [];
  for (const item of output) {
    if (!Array.isArray(item?.content)) continue;
    for (const part of item.content) {
      if (part?.type === 'output_text' && typeof part.text === 'string') text += part.text;
    }
  }
  return text;
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

  const perplexityKey = Deno.env.get("PERPLEXITY_API_KEY");
  if (!perplexityKey) {
    return json({
      error: "API Perplexity non configurée.",
      setup: "Ajoute le secret PERPLEXITY_API_KEY dans Supabase Edge Functions.",
    }, 503);
  }

  let body: { title?: string; description?: string };
  try { body = await req.json(); }
  catch { return json({ error: 'JSON invalide.' }, 400); }

  const title = String(body.title ?? '').trim().slice(0, 180);
  const description = String(body.description ?? '').trim().slice(0, 700);
  if (!title) return json({ error: 'Nom du cadeau manquant.' }, 400);

  const prompt = [
    'Tu es le moteur de recherche de produits d’une liste de cadeaux en France.',
    'Produit : ' + title,
    'Légende/description exacte : ' + (description || 'Aucune description supplémentaire.'),
    '',
    'Recherche largement sur le Web en temps réel.',
    'Vérifie l’identité exacte du produit avec le nom ET la description.',
    'Ne retiens que les pages encore accessibles et les offres qui correspondent réellement au produit.',
    'Écarte les pages supprimées, les produits différents et les offres manifestement indisponibles.',
    'Compare les prix actuels lorsqu’ils sont visibles.',
    'Indique la disponibilité uniquement quand elle est vérifiable.',
    'Donne les URL directes des offres.',
    'Cherche en priorité des vendeurs et services disponibles en France.',
    'Cherche aussi des pages d’images pertinentes pour le produit.',
    'Ne fabrique jamais un prix, une disponibilité, une URL ou une image.',
    '',
    'Réponds UNIQUEMENT avec un JSON valide, sans Markdown, selon cette structure :',
    '{"productMatch":"Produit exact identifié","summary":"Résumé très court","offers":[{"shop":"Nom du site","price":"29,99 €","availability":"Disponible","url":"https://..."}],"imageCandidates":[{"title":"Titre de la page image","imageUrl":"https://...","sourceUrl":"https://..."}]}'
  ].join('\n');

  const apiRes = await fetch("https://api.perplexity.ai/v1/responses", {
    method: 'POST',
    headers: {
      "Authorization": "Bearer " + perplexityKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      preset: "pro-search",
      input: prompt,
      instructions: "Recherche les informations actuelles sur le Web. Utilise le contexte français. Priorise les sources directes et les pages commerciales réellement accessibles.",
      tools: [{ type: 'web_search', user_location: { country: 'FR' } }],
    }),
  });

  const rawText = await apiRes.text();
  if (!apiRes.ok) {
    console.error('Perplexity API', apiRes.status, rawText);
    return json({ error: 'La recherche IA a échoué.', detail: rawText.slice(0, 500) }, 502);
  }

  let response: any;
  try { response = JSON.parse(rawText); }
  catch { return json({ error: 'Réponse API invalide.' }, 502); }

  const modelText = getOutputText(response);
  let result: any;
  try { result = JSON.parse(modelText); }
  catch { result = { productMatch: title, summary: modelText || 'Aucun résumé disponible.', offers: [], imageCandidates: [] }; }

  const sourceList: { title: string; url: string }[] = [];
  collectSources(response, sourceList);
  const sources = uniqueBy(sourceList.filter(x => /^https?:\/\//i.test(x.url)), x => x.url).slice(0, 12);

  const images = Array.isArray(result.imageCandidates)
    ? uniqueBy(result.imageCandidates.filter((x: any) => x && typeof x.imageUrl === 'string' && /^https?:\/\//i.test(x.imageUrl) && typeof x.sourceUrl === 'string' && /^https?:\/\//i.test(x.sourceUrl)), (x: any) => x.imageUrl + '|' + x.sourceUrl).slice(0, 8)
    : [];

  return json({
    ok: true,
    product: result.productMatch || title,
    summary: result.summary || '',
    offers: Array.isArray(result.offers) ? result.offers.slice(0, 8) : [],
    images,
    sources,
    searchedAt: new Date().toISOString(),
  });
});