// 第一次段考單字卡：離線快取（版本 a08b91a196）
const CACHE = 'vocab-a08b91a196';
const FILES = ["./", "index.html", "words.json", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "atkinson-hyperlegible-latin-400-normal.woff2", "atkinson-hyperlegible-latin-700-normal.woff2", "noto-sans-greek-400-normal.woff2", "noto-sans-latin-400-normal.woff2", "noto-sans-latin-ext-400-normal.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('vocab-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(c => c.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      if (req.mode === 'navigate') return c.match('index.html').then(r => r || fetch(req));
      return fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; });
    }))
  );
});
