const CACHE_NAME = 'kwiksend-cache-v1';
const ASSETS = [
  'index.html','style.css','ks-core.js',
  'portefeuille.html','wallet.js',
  'transferts.html','transfer.js',
  'manifest.webmanifest'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res=> res || fetch(req).then(r=>{
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c=>c.put(req, copy));
      return r;
    }).catch(()=>caches.match('index.html')))
  );
});
