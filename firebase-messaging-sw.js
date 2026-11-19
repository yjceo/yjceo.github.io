/* 여주시기업인협의회 앱: 휴대폰 알림 담당 (화면이 꺼져 있어도 알림 표시) */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({ apiKey: 'AIzaSyDVoL7aBae23IP8pcSys5K0xMv21tqon2E', authDomain: 'yjceo-app.firebaseapp.com', projectId: 'yjceo-app',
  storageBucket: 'yjceo-app.firebasestorage.app', messagingSenderId: '556991791953', appId: '1:556991791953:web:76b96f690a15788db44970' });
firebase.messaging();
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(){ /* 설치 조건용: 네트워크 그대로 사용 */ });
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cs){
    for (var i = 0; i < cs.length; i++) if (cs[i].url.indexOf(self.registration.scope) === 0 && 'focus' in cs[i]) return cs[i].focus();
    return self.clients.openWindow('./');
  }));
});

/* 앱 아이콘에 숫자(읽지 않은 알림 수) 표시 — 아이폰(iOS 16.4+)·PC 지원, 안드로이드는 휴대폰 설정의 '숫자 배지'로 표시 */
function bumpBadge(){
  return caches.open('yceo-badge').then(function(c){
    return c.match('n').then(function(r){ return r ? r.text() : '0'; }).then(function(t){
      var n = (parseInt(t, 10) || 0) + 1;
      return c.put('n', new Response(String(n))).then(function(){ if (self.navigator && self.navigator.setAppBadge) return self.navigator.setAppBadge(n).catch(function(){}); });
    });
  }).catch(function(){});
}
self.addEventListener('push', function(e){ e.waitUntil(bumpBadge()); });
