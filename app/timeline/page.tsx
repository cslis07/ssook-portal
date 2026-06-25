import { TIMELINE } from "@/lib/data";

const colorMap: Record<string, string> = {
  rose: "bg-rose/40",
  lavender: "bg-lavender/50",
  mint: "bg-mint/50",
  peach: "bg-peach/60",
  butter: "bg-butter/50",
};

export default function TimelinePage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="chip bg-rose/40 text-ink">신청 타임라인</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">📅 언제 무엇을 신청해야 할까?</h1>
        <p className="text-ink/70 mt-2">임신 확인부터 출산 후 6개월까지 — 놓치면 손해예요.</p>
      </header>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-1 bg-rose/40 rounded-full" />
        {TIMELINE.map((step) => (
          <div key={step.phase} className="relative mb-8">
            <div className="absolute -left-8 top-2 w-7 h-7 rounded-full bg-white border-4 border-rose grid place-items-center text-sm">
              {step.icon}
            </div>
            <div className={`card p-6 ${colorMap[step.color]}`}>
              <h2 className="text-xl font-extrabold text-ink">{step.phase}</h2>
              <ul className="mt-3 space-y-2">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-rose font-bold">✓</span>
                    <span className="text-ink/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-rose/20">
        <h3 className="font-extrabold text-ink mb-2">⏰ 절대 잊지 마세요</h3>
        <ul className="space-y-1 text-ink/80">
          <li>• <b>출생 후 60일 이내</b> 부모급여·아동수당 신청 → 출생월부터 소급</li>
          <li>• <b>출생신고 당일</b> 전기요금 할인 신청 → 소급 불가</li>
          <li>• <b>출산예정 40일 전 ~ 출산 후 60일</b> 산모·신생아 건강관리</li>
          <li>• <b>분만 후 6개월 이내</b> 고위험 임산부 의료비</li>
        </ul>
      </div>
    </div>
  );
}
