import { VACCINES } from "@/lib/data";
import MonthCards from "@/components/MonthCards";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <header>
        <span className="chip bg-lavender/60 text-ink">개월별 가이드</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">👶 0~24개월 발달·꿀팁·접종</h1>
        <p className="text-ink/70 mt-2">아이마다 속도는 다르지만, 시기별 준비 포인트를 모았어요.</p>
      </header>

      {/* 국가예방접종 일정 — 접이식 */}
      <details className="card overflow-hidden group">
        <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-3">
          <span className="text-lg font-extrabold text-ink">💉 국가예방접종 일정 (전액 무료)</span>
          <span className="text-ink/40 text-sm transition group-open:rotate-180">▼</span>
        </summary>
        <div className="px-6 pb-6">
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1">
            {VACCINES.map((v) =>
              v.detail ? (
                <li key={v.name} className="border-b border-rose/20">
                  <details className="group/vax py-2">
                    <summary className="flex justify-between items-center gap-2 cursor-pointer list-none">
                      <span className="font-bold text-ink">{v.name}</span>
                      <span className="text-ink/70 text-sm text-right shrink-0">
                        {v.when} <span className="text-ink/30 text-xs group-open/vax:hidden">▾</span><span className="text-ink/30 text-xs hidden group-open/vax:inline">▴</span>
                      </span>
                    </summary>
                    <div className="mt-2 mb-1 rounded-xl bg-rose/10 p-3 text-xs text-ink/80 space-y-1">
                      {v.detail.how && <p>💉 <b>접종방법:</b> {v.detail.how}</p>}
                      {v.detail.side && <p>🌡️ <b>이상반응:</b> {v.detail.side}</p>}
                      {v.detail.no && <p>⛔ <b>접종 금기:</b> {v.detail.no}</p>}
                    </div>
                  </details>
                </li>
              ) : (
                <li key={v.name} className="flex justify-between border-b border-rose/20 py-2">
                  <span className="font-bold text-ink">{v.name}</span>
                  <span className="text-ink/70 text-sm">{v.when}</span>
                </li>
              )
            )}
          </ul>
          <p className="text-xs text-ink/60 mt-4">
            👉 보건소·지정 의료기관 무료. <b>예방접종도우미 nip.kdca.go.kr</b> 또는 &lsquo;The건강보험&rsquo; 앱에서 아이별 일정 확인.
            백신명을 누르면 접종방법·이상반응·금기사항이 펼쳐져요 (출처: 서울시 예방접종 종류별 실시방법).
            이상반응이 심하면 접종기관 또는 소아과에 바로 문의하세요.
          </p>
        </div>
      </details>

      {/* 영유아 건강검진 — 접이식 */}
      <details className="card overflow-hidden group bg-mint/30">
        <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-3">
          <span className="text-lg font-extrabold text-ink">🩺 영유아 건강검진 (무료, 건강보험)</span>
          <span className="text-ink/40 text-sm transition group-open:rotate-180">▼</span>
        </summary>
        <div className="px-6 pb-6">
          <p className="text-ink/80 text-sm">생후 14일 ~ 71개월, <b>일반검진 8회 + 구강검진 4회</b>.</p>
          <ul className="mt-2 text-sm text-ink/80 space-y-1">
            <li>• 1차: 생후 14~35일 / 2차: 4~6개월 / 3차: 9~12개월</li>
            <li>• 4차: 18~24개월 (+구강 1차) / 5차: 30~36개월 (+구강 2차)</li>
            <li>• 6차: 42~48개월 (+구강 3차) / 7차: 54~60개월 (+구강 4차)</li>
            <li>• 8차: 66~71개월</li>
          </ul>
          <p className="text-xs text-ink/60 mt-3">검진기관 조회: 국민건강보험공단 nhis.or.kr → 건강iN (☎1577-1000)</p>
        </div>
      </details>

      {/* 개월별 카드 — 우리 아기 시기만 표시 + 전체보기 토글 */}
      <MonthCards />
    </div>
  );
}
