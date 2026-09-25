const CACHE_NAME="liste-ethan-pwa-v1";
const APP_SHELL=[
  "/Liste-cadeaux-ethan/",
  "/Liste-cadeaux-ethan/index.html",
  "/Liste-cadeaux-ethan/manifest.webmanifest",
  "/Liste-cadeaux-ethan/assets/pwa-icon.svg"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  event.respondWith(
    fetch(request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)).catch(()=>{});
      return response;
    }).catch(()=>caches.match(request))
  );
});