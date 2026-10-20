'use strict';
const CACHE='clean-shell-v6';
const FILES=['./','./index.html','./style.css?v=6','./core.js?v=6','./app.js?v=6','./pwa.js?v=6','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('clean-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),base=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{if(!response.ok)throw Error('Navigation failed');return response;}).catch(()=>caches.open(CACHE).then(cache=>cache.match(new URL('./index.html',base).href))));return;}
 const allowed=FILES.map(path=>new URL(path,base).href);
 if(!allowed.includes(url.href))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{const hit=await cache.match(event.request);if(hit)return hit;return fetch(event.request);}));
});
