const appName = 'restaurant-reviews';
const staticCacheName = appName + '-1.0';
//const imageCache = appName + '-imgs';

const allCaches = [
    '/',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/register_sw.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

/* This caches all application assets on
* service worker install
*/
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll(allCaches);
        })
    );
});

/* This delete old static caches (if any) upon
*  service worker activation
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


/* Manage fetch requests */
self.addEventListener('fetch', function(e) {
    //let requestUrl = new URL(e.request.url);
    //if (requestUrl.origin === location.origin) {
        
    //    if (requestUrl.pathname.startsWith('/restaurant.html')) {
    //        e.respondWith(caches.match('/restaurant.html'));
    //        return;
    //    }

        //if (requestUrl.pathname.startsWith('/img')) {
        //    e.respondWith(serveImage(e.request));
        //    return;
        //}
    //}

    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response) {
                return response;
            } 
            else {
                return fetch(e.request)
                        .then(function(response) {
                            caches.open(staticCacheName)
                            .then(function(cache) {
                                cache.put(e.request, response.clone());
                            })
                            return response;
                        })
                        .catch(function(err) {
                            console.error(err);
                        })    
            }
        })
    );
});

/*function serveImage(request) {
    let imageStorageUrl = request.url;

    return caches.open(imageCache).then(function(cache) {
        return cache.match(imageStorageUrl).then(function(response) {
            return response || fetch(request).then(function(networkResponse) {
                cache.put(imageStorageUrl, networkResponse.clone());
                return networkResponse;
            });
        });
    });
}*/