// 쑥쑥 포털 서비스워커 — 앱 셸 오프라인 캐시 (최소 구성)
const CACHE = "ssook-v3";
const SHELL = ["/", "/calculator", "/fever", "/checklist", "/timeline"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 해시된 정적 자산·앱아이콘: 캐시 우선(불변) — 재방문 로딩 속도 개선
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/api/appicon")) {
    e.respondWith(
      caches.match(req).then(
        (r) =>
          r ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
      )
    );
    return;
  }

  // 그 외 API는 항상 네트워크 (신선도 중요)
  if (url.pathname.startsWith("/api/")) return;

  // 정적 셸: 네트워크 우선, 실패 시 캐시
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/")))
  );
});
