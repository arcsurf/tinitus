/* Tinitus · Service worker for offline use. Bump VERSION when publishing changes. */
const VERSION = 'tinitus-v1.1.0';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './js/data.js', './js/i18n/en.js', './js/i18n/es.js', './js/i18n/de.js', './js/i18n/fr.js', './js/i18n/ja.js',
  './js/audio.js', './js/app.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Red primero (para recibir actualizaciones) y caché como respaldo sin conexión
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
