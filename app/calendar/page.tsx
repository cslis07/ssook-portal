import { MONTHS, VACCINES } from "@/lib/data";
import CalendarPersonalize from "@/components/CalendarPersonalize";

function monthRange(label: string): [number, number] {
  const nums = label.replace("개월", "").split("~").map((s) => parseInt(s, 10));
  return nums.length === 2 ? [nums[0], nums[1]] : [nums[0], nums[0]];
}

export default function CalendarPage() {
  return (
    <div className="space-y-10">
      <header>
        <span className="chip bg-lavender/60 text-ink">개월별 가이드</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">👶 0~24개월 발달·꿀팁·접종</h1>
        <p className="text-ink/70 mt-2">아이마다 속도는 다르지만, 시기별 준비 포인트를 모았어요.</p>
      </header>

      <CalendarPersonalize />

      <section className="grid md:grid-cols-2 gap-4">
        {MONTHS.map((m) => {
          const [lo, hi] = monthRange(m.month);
          return (
          <div key={m.month} id={`m-${lo}`} data-lo={lo} data-hi={hi} className="card p-5 scroll-mt-24 transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 grid place-items-center rounded-full bg-rose/40 font-extrabold text-ink">
                {m.month.replace("개월", "M").replace("~", "-")}
              </div>
              <div className="font-extrabold text-ink text-lg">{m.month}</div>
            </div>
            <p className="text-ink/80 mt-3 text-sm">💡 {m.tip}</p>
            <p className="text-ink/70 mt-2 text-sm">🎀 <b>육아템:</b> {m.items}</p>
            {m.shots && (
              <p className="text-ink/70 mt-1 text-sm">💉 <b>예방접종:</b> {m.shots}</p>
            )}
            {m.checkup && (
              <p className="text-ink/70 mt-1 text-sm">🩺 <b>영유아검진:</b> {m.checkup}</p>
            )}
          </div>
          );
        })}
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-3">💉 국가예방접종 일정 (전액 무료)</h2>
        <div className="card p-6">
          <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">
            {VACCINES.map((v) => (
              <li key={v.name} className="flex justify-between border-b border-rose/20 py-2">
                <span className="font-bold text-ink">{v.name}</span>
                <span className="text-ink/70 text-sm">{v.when}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/60 mt-4">
            👉 보건소·지정 의료기관 무료. <b>예방접종도우미 nip.kdca.go.kr</b> 또는 'The건강보험' 앱에서 아이별 일정 확인.
          </p>
        </div>
      </section>

      <section className="card p-6 bg-mint/30">
        <h3 className="font-extrabold text-ink mb-2">🩺 영유아 건강검진 (무료, 건강보험)</h3>
        <p className="text-ink/80 text-sm">생후 14일 ~ 71개월, <b>일반검진 8회 + 구강검진 4회</b>.</p>
        <ul className="mt-2 text-sm text-ink/80 space-y-1">
          <li>• 1차: 생후 14~35일 / 2차: 4~6개월 / 3차: 9~12개월</li>
          <li>• 4차: 18~24개월 (+구강 1차) / 5차: 30~36개월 (+구강 2차)</li>
          <li>• 6차: 42~48개월 (+구강 3차) / 7차: 54~60개월 (+구강 4차)</li>
          <li>• 8차: 66~71개월</li>
        </ul>
        <p className="text-xs text-ink/60 mt-3">검진기관 조회: 국민건강보험공단 nhis.or.kr → 건강iN (☎1577-1000)</p>
      </section>
    </div>
  );
}
