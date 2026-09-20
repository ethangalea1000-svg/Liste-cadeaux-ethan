// Supabase Edge Function: gift-search
// Free-tier stack: Tavily for live web search + OpenRouter free models for summarization.
// API keys stay server-side in Supabase Secrets.

const corsHeaders={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
  "Content-Type":"application/json; charset=utf-8",
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:corsHeaders});

function uniqueBy<T>(items:T[],key:(x:T)=>string){
  const seen=new Set<string>();
  return items.filter(item=>{const k=key(item);if(!k||seen.has(k))return false;seen.add(k);return true;});
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
  if(req.method!=="POST")return json({error:"Méthode non autorisée."},405);

  const providedKey=req.headers.get("apikey")||"";
  const publishableKeysRaw=Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")||"";
  let publishableOk=false;
  try{const keys=JSON.parse(publishableKeysRaw);publishableOk=Object.values(keys).includes(providedKey);}catch{publishableOk=false;}
  if(!publishableOk)return json({error:"Accès refusé."},401);

  const tavilyKey=Deno.env.get("TAVILY_API_KEY");
  const openrouterKey=Deno.env.get("OPENROUTER_API_KEY");
  if(!tavilyKey||!openrouterKey)return json({error:'API gratuite non configurée.',setup:'Ajoute TAVILY_API_KEY et OPENROUTER_API_KEY dans les secrets Supabase.'},503);

  let body:{title?:string;description?:string};
  try{body=await req.json();}catch{return json({error:'JSON invalide.'},400);}
  const title=String(body.title??'').trim().slice(0,180);
  const description=String(body.description??'').trim().slice(0,700);
  if(!title)return json({error:'Nom du cadeau manquant.'},400);

  const queries=[
    `${title} ${description} prix France acheter`,
    `${title} ${description} disponibilité boutique France`,
    `${title} ${description} site officiel image`
  ];
  const tavilyResults:any[]=[];
  for(const query of queries){
    const tr=await fetch('https://api.tavily.com/search',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({api_key:tavilyKey,query,search_depth:'basic',topic:'general',max_results:7,include_answer:false,include_raw_content:false}),
    });
    if(!tr.ok){console.error('Tavily',tr.status,await tr.text());continue;}
    const data=await tr.json();
    if(Array.isArray(data.results))tavilyResults.push(...data.results);
  }
  const sources=uniqueBy(tavilyResults.filter(x=>x&&typeof x.url==='string'),x=>x.url).slice(0,18);

  if(!sources.length)return json({ok:true,product:title,summary:'Aucun résultat Web pertinent trouvé.',offers:[],images:[],sources:[],searchedAt:new Date().toISOString()});

  const sourceText=sources.map((s,i)=>`[${i+1}] ${s.title||''}\nURL: ${s.url}\nExtrait: ${String(s.content||'').slice(0,1200)}`).join('\n\n');
  const prompt=[
    'Tu analyses des résultats Web pour une liste de cadeaux en France.',
    `Produit demandé: ${title}`,
    `Description/légende: ${description||'Aucune'}`,
    '',
    'À partir UNIQUEMENT des résultats fournis ci-dessous:',
    '1. Identifie le produit exact.',
    '2. Garde uniquement les offres qui correspondent vraiment au produit.',
    '3. Compare les prix visibles.',
    '4. Indique la disponibilité seulement si le texte la permet.',
    '5. Priorise les sites français ou livrant clairement en France.',
    '6. Signale les informations non vérifiées.',
    '7. Ne fabrique jamais un prix, un stock ou un lien.',
    '8. Renvoie aussi jusqu’à 6 candidats image uniquement si une URL d’image est réellement présente dans les résultats.',
    '',
    'Réponds en JSON strict avec: productMatch, summary, offers[{shop,price,availability,url}], imageCandidates[{title,imageUrl,sourceUrl}].',
    '',
    sourceText
  ].join('\n');

  const or=await fetch('https://openrouter.ai/api/v1/chat/completions',{
    method:'POST',
    headers:{'Authorization':`Bearer ${openrouterKey}`,'Content-Type':'application/json','HTTP-Referer':'https://ethangalea1000-svg.github.io/Liste-cadeaux-ethan/','X-Title':'Liste de cadeaux Ethan'},
    body:JSON.stringify({model:'openrouter/free',messages:[{role:'user',content:prompt}],temperature:0.1}),
  });
  const orRaw=await or.text();
  if(!or.ok){console.error('OpenRouter',or.status,orRaw);return json({error:'L’IA gratuite a atteint sa limite ou a rencontré une erreur.',sources},502);}
  let orData:any;
  try{orData=JSON.parse(orRaw);}catch{return json({error:'Réponse IA invalide.',sources},502);}
  const text=orData?.choices?.[0]?.message?.content||'';
  let result:any;
  try{result=JSON.parse(text);}catch{result={productMatch:title,summary:text||'Aucun résumé disponible.',offers:[],imageCandidates:[]};}

  const offers=Array.isArray(result.offers)?result.offers.filter((x:any)=>x&&typeof x.url==='string').slice(0,8):[];
  const images=Array.isArray(result.imageCandidates)?uniqueBy(result.imageCandidates.filter((x:any)=>x&&typeof x.imageUrl==='string'&&typeof x.sourceUrl==='string'),(x:any)=>x.imageUrl+'|'+x.sourceUrl).slice(0,6):[];

  return json({ok:true,product:result.productMatch||title,summary:result.summary||'',offers,images,sources,searchedAt:new Date().toISOString()});
});