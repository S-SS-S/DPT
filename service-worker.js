const CACHE="neuropt-v1.2.0";
const CORE=["./","./index.html","./css/styles.css","./css/components.css","./css/responsive.css","./js/app.js","./js/router.js","./js/state.js","./js/storage.js","./js/utils.js","./js/scoring-engine.js","./js/clinical-engine.js","./js/goal-engine.js","./js/ai-service.js","./js/data/conditions.js","./js/data/measures.js","./js/data/assessment-domains.js","./js/data/references.js","./assets/icons/icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
      return r;
    }).catch(async()=>{
      const cached=await caches.match(e.request);
      if(cached)return cached;
      if(e.request.mode==="navigate")return caches.match("./index.html");
      throw new Error("Offline resource unavailable");
    })
  );
});
