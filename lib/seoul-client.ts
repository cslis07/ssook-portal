"use client";

// 서울 공공서비스 예약 목록을 브라우저에서 한 번만 받아 공유한다.
// (홈의 TodayPick·우리 동네 카드가 같은 응답을 쓰므로 중복 요청 방지. 서버측 30분 캐시는 그대로)
let cache: Promise<any[]> | null = null;

export function getSeoulRows(): Promise<any[]> {
  if (!cache) {
    cache = fetch("/api/seoul-reserve?cat=all&start=1&end=1000")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data.rows) ? data.rows : []))
      .catch((e) => {
        cache = null; // 실패 시 다음 호출에서 재시도
        throw e;
      });
  }
  return cache;
}

export function decodeHtml(s: string): string {
  if (!s) return "";
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&middot;/g, "·");
}
