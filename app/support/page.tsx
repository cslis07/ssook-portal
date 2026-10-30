import Link from "next/link";
import { SUPPORTS, SUPPORTS_2027, REFORM_2027 } from "@/lib/data";

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
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">💝 받을 수 있는 모든 지원금 <span className="text-xl md:text-2xl text-ink/50">2027</span></h1>
        <p className="text-ink/70 mt-2">현금·바우처·감면·휴직 — 카테고리별로 정리했어요. ({REFORM_2027.asOf} 기준)</p>
        <a href="#reform-2027" className="mt-3 block rounded-2xl border-2 border-[#FFC59E] bg-[#FFF4EA] px-4 py-3 text-sm text-ink hover:bg-[#FFEEDD]">
          📢 <b>2027년 7월 1일 이후 출생아</b>는 아이맞이지원금·아동기본수당으로 바뀌는 개편안이 국회 심의 중이에요. <span className="underline font-bold">개편안 보기 ↓</span>
        </a>
      </header>

      <h2 className="text-xl font-extrabold text-ink">현행 제도 <span className="text-sm font-bold text-ink/50">— 2027년 6월 30일까지 출생아</span></h2>
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


      <section id="reform-2027" className="scroll-mt-28 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-extrabold text-ink">🆕 2027년 개편안</h2>
          <span className="chip bg-[#FED8D9] text-[#B4232E]">{REFORM_2027.status}</span>
        </div>
        <div className="rounded-2xl bg-[#FFF8F1] border border-[#FFE2C9] p-4 text-sm text-ink/80 space-y-1">
          <p>📅 <b>적용 대상:</b> {REFORM_2027.appliesTo}</p>
          <p>👶 {REFORM_2027.legacy}</p>
          <p className="text-xs text-ink/60">⚠️ 국회 예산·아동수당법 개정 심의 결과에 따라 금액·대상·시기가 바뀔 수 있어요. 확정되면 다시 반영합니다.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {SUPPORTS_2027.map((s) => (
            <div key={s.key} className="card p-6 border-dashed">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{s.icon}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-ink text-lg">{s.name}</h3>
                    <span className="chip bg-[#FED8D9] text-[#B4232E]">정부안</span>
                  </div>
                  <div className="text-rose font-bold text-lg mt-1">{s.amount}</div>
                  <p className="text-sm text-ink/75 mt-2">{s.detail}</p>
                  <div className="mt-3 text-xs text-ink/60 bg-cream rounded-full px-3 py-1 inline-block">📌 {s.apply}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/60">
          출처:{" "}
          {REFORM_2027.sources.map((x, i) => (
            <span key={x.url}>{i > 0 && " · "}<a href={x.url} target="_blank" rel="noopener" className="underline">{x.label}</a></span>
          ))}
        </p>
      </section>

      <div className="card p-6 bg-mint/30">
        <h3 className="font-extrabold text-ink mb-2">🏘️ 지자체 출산축하금</h3>
        <p className="text-ink/80 text-sm">
          전국 227개 시·군·구가 자체 출산지원금을 운영합니다. 같은 조건이어도 수백만~수천만원 차이가 날 수 있어요.
        </p>
        <p className="text-ink/60 text-xs mt-2">
          거주기간(6개월·1년), 분할지급, 신청기한(30·90·365일) 조건이 지역마다 다르니 시·군·구청 확인 필수.
        </p>
        <Link href="/localgov" className="inline-block mt-3 btn-pop bg-ink text-cream px-4 py-2 rounded-full text-sm font-bold">
          🏘️ 우리 지역 출산지원금 찾기 →
        </Link>
      </div>
    </div>
  );
}
