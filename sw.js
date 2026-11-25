/* Simpan fail apps dalam telefon supaya boleh buka tanpa internet.
   Ambil dari internet dulu (supaya versi baru terus nampak); kalau tiada internet
   atau lambat lebih 4 saat, guna salinan tersimpan. */
// Apps lain di alamat github.io yang sama ada simpanan sendiri; hanya urus yang bermula dengan awalan ini.
const AWALAN = 'bajet-bulanan-';
const CACHE = AWALAN + 'v18';
const FAIL = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'tarikh-gaji.js',
  'config.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
];

// cache: 'reload' supaya fail diambil terus dari GitHub, bukan salinan lama dalam cache pelayar.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(FAIL.map((f) => fetch(new Request(f, { cache: 'reload' })).then((res) => { if (res.ok) return c.put(f, res); }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith(AWALAN) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const rangkaian = fetch(req, { cache: 'no-cache' })
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      const lambat = new Promise((ok) => setTimeout(() => ok(null), 4000));
      const res = await Promise.race([rangkaian, lambat]);
      if (res) return res;
      const tersimpan = await cache.match(req, { ignoreSearch: true });
      if (tersimpan) { e.waitUntil(rangkaian); return tersimpan; }
      return (await rangkaian) || (await cache.match('index.html')) || Response.error();
    })
  );
});
