const appName = 'restaurant-reviews';
const staticCacheName = appName + '-1.0';
const imageCache = appName + '-imgs';

let allCaches = [
    staticCacheName,
    imageCache
];

/* This caches all static application assets on
* service worker install
*/
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                '/restaurant.html',
                '/css/styles.css',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/register_sw.js',
                '/js/restaurant_info.js',
                '/data/restaurants.json'
            ]);
        })
    );
});

/* This delete old static caches (if any) upon
*  upon service worker activation
*/
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith(appName) &&
                        (!allCaches.includes(cacheName));
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});