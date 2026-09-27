const CACHE="hydra-os-v3";
self.addEventListener("install",e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE),s=self.registration.scope;
  try{
    await c.addAll([
      new URL("./",s).href,
      new URL("hydra-interactive.html",s).href,
      new URL("hydra-manifest.json",s).href,
      new URL("hydra-webos-config.json",s).href,
      new URL("hydra-terminal-config.json",s).href
    ]);
  }catch(_){}
  await self.skipWaiting();
})()));
self.addEventListener("activate",e=>e.waitUntil((async()=>{
  const k=await caches.keys();
  await Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)));
  await self.clients.claim();
})()));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.match(r);
    try{
      const f=await fetch(r);
      if(f&&f.ok){
        const cache=await caches.open(CACHE);
        await cache.put(r,f.clone());
      }
      return f;
    }catch(_){return c||Response.error();}
  })());
});