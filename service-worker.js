const cacheName = 'pwa-task-list-v1';
const staticAssets = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/images/icon-192x192.png', // Assurez-vous d'avoir cette image
    '/images/icon-512x512.png'  // Assurez-vous d'avoir cette image
];

self.addEventListener('install', async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const freshResponse = await fetch(req);
        cache.put(req, freshResponse.clone());
        return freshResponse;
    } catch (e) {
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}
