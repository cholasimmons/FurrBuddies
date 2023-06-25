/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));


import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
    ...build, // the app itself
    ...files  // everything in `static`
];

sw.addEventListener('install', (event) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
    // self.skipWaiting();
});

sw.addEventListener('activate', (event) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
    const matchUrl = new URL(event.request.url);

    // ignore POST requests etc
    if (event.request.method !== 'GET') return;
    if (matchUrl.pathname.startsWith('/api')) return;
    if (matchUrl.pathname.startsWith('/admin')) return;
    if (matchUrl.pathname.startsWith('/dashboard')) return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // `build`/`files` can always be served from the cache
        if (ASSETS.includes(url.pathname)) {
            const existingAssets = await cache.match(url.pathname);
            if (existingAssets) return existingAssets;
        }

        // for everything else, try the network first, but
        // fall back to the cache if we're offline
        try {
            const response = await fetch(event.request);

            if (response.status === 200) {
                cache.put(event.request, response.clone());
            }

            return response;
        } catch {
            const fallbackResponse = await cache.match(event.request);
            if (fallbackResponse) {
                return fallbackResponse;
            }
            // when even the fallback response is not available,
            // there is nothing we can do, but we must always
            // return a Response object
            else
                return new Response('Network error happened', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' }
                });

        }
    }

    event.respondWith(respond());
});