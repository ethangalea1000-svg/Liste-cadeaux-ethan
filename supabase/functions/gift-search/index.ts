// Supabase Edge Function: gift-search
// Free-ish stack: SearXNG public web search + Hugging Face Inference Providers.
// HF_TOKEN is stored as a Supabase secret and never exposed in the browser.

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

async function searxSearch(base:string,query:string,category='general'){
  const u=new URL(base.replace(/\/$/,'')+'/search');
  u.searchParams.set('q',query.slice(0,480));
  u.searchParams.set('format','json');
  u.searchParams.set('language','fr-FR');
  u.searchParams.set('safesearch','1');
  if(category==='images')u.searchParams.set('categories','images');
  const r=await fetch(u.toString(),{headers:{Accept:'application/json','User-Agent':'ListeEthan/1.0 (wishlist search)'}});
  if(!r.ok)throw new Error('SearXNG '+r.status);
  return await r.json();
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
  if(req.method!=="POST")return json({error:"Méthode non autorisée."},405);

  const hfToken=Deno.env.get("HF_TOKEN");
  if(!hfToken)return json({error:'Token Hugging Face non configuré.',setup:'Ajoute HF_TOKEN dans les secrets Supabase.'},503);

  let body:{title?:string;description?:string};
  try{body=await req.json();}catch{return json({error:'JSON invalide.'},400);}
  const title=String(body.title??'').trim().slice(0,180);
  const description=String(body.description??'').trim().slice(0,700);
  if(!title)return json({error:'Nom du cadeau manquant.'},400);

  const searxUrls=[
    'https://search.inetol.net',
    'https://sx.xo.st'
  ];
  let searchData:any=null;
  let lastSearchError='';
  const queries=[
    `${title} ${description} acheter prix France`,
    `${title} ${description} disponibilité boutique France`
  ];
  const results:any[]=[];
  const imageResults:any[]=[];

  for(const base of searxUrls){
    try{
      for(const q of queries){
        const d=await searxSearch(base,q,'general');
        if(Array.isArray(d.results))results.push(...d.results);
      }
      const id=await searxSearch(base,`${title} ${description} produit officiel`,'images');
      if(Array.isArray(id.results))imageResults.push(...id.results);
      searchData=base;
      break;
    }catch(e){lastSearchError=String(e);}
  }

  const sources=uniqueBy(results.filter(x=>x&&typeof x.url==='string').map(x=>({
    title:String(x.title||x.url),url:String(x.url),snippet:String(x.content||'')
  })),x=>x.url).slice(0,20);

  if(!sources.length){
    return json({ok:false,error:'Aucun moteur Web gratuit disponible momentanément.',detail:lastSearchError});
  }

  const imageCandidates=uniqueBy(imageResults.filter(x=>x&&typeof (x.img_src||x.thumbnail)==='string'&&typeof x.url==='string').map(x=>({
    title:String(x.title||'Image'),imageUrl:String(x.img_src||x.thumbnail),sourceUrl:String(x.url),domain:''
  })),x=>x.imageUrl+'|'+x.sourceUrl).slice(0,8);

  const compactSources=sources.map((s,i)=>`[${i+1}] ${s.title}\nURL: ${s.url}\nExtrait: ${s.snippet.slice(0,900)}`).join('\n\n');
  const prompt=[
    'Tu analyses des résultats Web pour une liste de cadeaux en France.',
    'Produit demandé : '+title,
    'Description/légende : '+(description||'Aucune'),
    'Ne déduis rien qui n’apparaisse pas dans les résultats.',
    'Garde uniquement les résultats correspondant exactement au produit.',
    'Priorise les sites officiels, boutiques françaises ou pages indiquant clairement une disponibilité en France.',
    'Pour un prix ou un stock absent du résultat, indique Non vérifié.',
    'Réponds uniquement en JSON valide :',
    '{"productMatch":"...","summary":"...","offers":[{"shop":"...","price":"...","availability":"...","url":"..."}]}'
    ,
    compactSources
  ].join('\n');

  const hf=await fetch('https://router.huggingface.co/v1/chat/completions',{
    method:'POST',
    headers:{Authorization:'Bearer '+hfToken,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'openai/gpt-oss-20b:fastest',
      messages:[{role:'user',content:prompt}],
      temperature:0.1,
      max_tokens:900,
      stream:false
    })
  });
  const raw=await hf.text();
  if(!hf.ok){
    console.error('Hugging Face',hf.status,raw);
    return json({error:'La recherche IA Hugging Face a échoué.',detail:raw.slice(0,400)},502);
  }

  let data:any;
  try{data=JSON.parse(raw);}catch{return json({error:'Réponse Hugging Face invalide.'},502);}
  const text=String(data?.choices?.[0]?.message?.content||'');
  let result:any;
  try{result=JSON.parse(text);}catch{result={productMatch:title,summary:text||'Aucun résumé disponible.',offers:[]};}

  return json({
    ok:true,
    product:result.productMatch||title,
    summary:result.summary||'',
    offers:Array.isArray(result.offers)?result.offers.slice(0,8):[],
    images:imageCandidates,
    sources:sources.map(x=>({title:x.title,url:x.url})).slice(0,12),
    searchedAt:new Date().toISOString(),
    engine:searchData
  });
});