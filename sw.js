const CACHE='moy-sport-v3.8.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('moy-sport-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(new Request(e.request,{cache:'no-store'})).then(response=>{
   if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)))}
   return response
  }).catch(()=>caches.match(e.request).then(cached=>cached||caches.match('./index.html'))));
  return
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)))
});