// ============================================
// L&L - Salão de Beleza - Service Worker
// ============================================

const CACHE_NAME = 'll-salao-v2';

const ARQUIVOS_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Instala o Service Worker e salva os arquivos
self.addEventListener('install', event => {
    console.log('[SW] Instalando...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Salvando arquivos no cache...');
                return cache.addAll(ARQUIVOS_CACHE);
            })
            .then(() => self.skipWaiting())
            .catch(err => {
                console.error('[SW] Erro ao cachear:', err);
            })
    );
});

// Ativa imediatamente
self.addEventListener('activate', event => {
    console.log('[SW] Ativando...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Apagando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Intercepta as requisições
self.addEventListener('fetch', event => {

    // Só trabalha com requisições GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {

                // Se estiver no cache, usa o cache
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Caso contrário, busca na internet
                return fetch(event.request)
                    .then(networkResponse => {

                        // Se a resposta não for válida, apenas retorna
                        if (
                            !networkResponse ||
                            networkResponse.status !== 200 ||
                            networkResponse.type !== 'basic'
                        ) {
                            return networkResponse;
                        }

                        // Salva uma cópia no cache
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        console.log(
                            '[SW] Offline - recurso não encontrado:',
                            event.request.url
                        );

                        // Tenta devolver o index.html quando estiver offline
                        return caches.match('./index.html');
                    });
            })
    );
});
