const C='wlog-v28',A=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
// 인터넷이 되면 항상 최신 파일을 받고(성공 응답만 저장), 서버 오류·오프라인이면 저장해 둔 화면으로 엽니다.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r.ok){const c2=r.clone();caches.open(C).then(c=>c.put(e.request,c2));return r}
      return caches.match(e.request).then(m=>m||r);
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html')))
  );
});
