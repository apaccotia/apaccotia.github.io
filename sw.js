/* Service worker do app APAC Cotia: guarda os arquivos do app para abrir rápido e sem internet.
   Busca sempre a versão nova primeiro, então as atualizações chegam assim que a pessoa abre o app. */
var CACHE = 'apac-0.3.4';
var ARQUIVOS = [
  './', 'index.html', 'style.css', 'config.js', 'pix.js', 'data.js', 'app.js', 'manifest.webmanifest',
  'vendor/supabase-2.118.0.js', 'vendor/qrcode-generator-2.0.4.js',
  'img/logo.jpg', 'img/gato.jpg', 'img/icone-192.png', 'img/icone-512.png',
  'fonts/oswald-latin-500-normal.woff2', 'fonts/oswald-latin-600-normal.woff2', 'fonts/oswald-latin-700-normal.woff2',
  'fonts/nunito-sans-latin-400-normal.woff2', 'fonts/nunito-sans-latin-600-normal.woff2', 'fonts/nunito-sans-latin-700-normal.woff2', 'fonts/nunito-sans-latin-800-normal.woff2'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARQUIVOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) { return; }
  // no-cache: confere sempre com o servidor, para a versão nova aparecer na hora
  e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (res) {
    if (res && res.ok) { var copia = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
  }));
});
