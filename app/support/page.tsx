import { SUPPORTS } from "@/lib/data";

const catColor: Record<string, string> = {
  현금: "bg-mint/60",
  바우처: "bg-peach/60",
  감면: "bg-butter/60",
  휴직: "bg-lavender/60",
};

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="chip bg-peach/60 text-ink">지원금 총정리</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">💝 받을 수 있는 모든 지원금</h1>
        <p className="text-ink/70 mt-2">현금·바우처·감면·휴직 — 카테고리별로 정리했어요.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {SUPPORTS.map((s) => (
          <div key={s.key} className="card p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{s.icon}</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-ink text-lg">{s.name}</h3>
                  <span className={`chip ${catColor[s.category]} text-ink`}>{s.category}</span>
                </div>
                <div className="text-rose font-bold text-lg mt-1">{s.amount}</div>
                <p className="text-sm text-ink/75 mt-2">{s.detail}</p>
                <div className="mt-3 text-xs text-ink/60 bg-cream rounded-full px-3 py-1 inline-block">
                  📌 {s.apply}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-mint/30">
        <h3 className="font-extrabold text-ink mb-2">🏘️ 지자체 출산축하금</h3>
        <p className="text-ink/80 text-sm">
          전국 227개 시·군·구가 자체 출산지원금을 운영합니다. 같은 조건이어도 수백만~수천만원 차이가 날 수 있어요.
        </p>
        <p className="text-ink/80 text-sm mt-2">
          👉 <b>아이사랑 포털 (childcare.go.kr)</b> → 출산 → 출산지원금 에서 거주지로 검색하세요.
        </p>
        <p className="text-ink/60 text-xs mt-2">
          거주기간(6개월·1년), 분할지급, 신청기한(30·90·365일) 조건이 지역마다 다르니 시·군·구청 확인 필수.
        </p>
      </div>
    </div>
  );
}
