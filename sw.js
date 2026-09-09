// ============================================
// GLAMOUR BEAUTY - Service Worker
// ============================================

const CACHE_NAME = 'glamour-beauty-v1';

// Arquivos que serão salvos para usar offline
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
                console.log('[SW] Arquivos em cache');
                return cache.addAll(ARQUIVOS_CACHE);
            })
            .catch(err => console.log('[SW] Erro ao cachear:', err))
    );
    self.skipWaiting();
});

// Busca os arquivos do cache (funciona offline)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se achou no cache, usa ele
                if (response) {
                    return response;
                }
                // Se não achou, busca da internet
                return fetch(event.request)
                    .then(networkResponse => {
                        // Opcional: salva no cache para próxima vez
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                        return networkResponse;
                    })
                    .catch(() => {
                        // Fallback se estiver offline e não tiver no cache
                        console.log('[SW] Offline - recurso não disponível:', event.request.url);
                    });
            })
    );
});

// Atualiza o cache quando o Service Worker é atualizado
self.addEventListener('activate', event => {
    console.log('[SW] Ativando...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Limpando cache antigo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
