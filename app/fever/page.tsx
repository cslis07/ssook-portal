"use client";

import { useMemo, useState } from "react";

// 소아 해열제 용량 가이드 (참고용). 실제 복용은 제품 라벨·의사·약사 지시 우선.
// 아세트아미노펜: 10~15 mg/kg/회, 4~6시간 간격, 1일 최대 5회.
//   대표 시럽 160mg/5mL(=32mg/mL) 기준 mL 환산.
// 이부프로펜: 5~10 mg/kg/회, 6~8시간 간격. 생후 6개월 이상.
//   대표 시럽 100mg/5mL(=20mg/mL) 기준 mL 환산.

const ACET_CONC = 32; // mg/mL (160mg/5mL)
const IBU_CONC = 20;  // mg/mL (100mg/5mL)

export default function FeverPage() {
  const [weight, setWeight] = useState(10);

  const dose = useMemo(() => {
    const w = weight;
    const acetMgLow = w * 10, acetMgHigh = w * 15;
    const ibuMgLow = w * 5, ibuMgHigh = w * 10;
    return {
      acet: {
        mg: [Math.round(acetMgLow), Math.round(acetMgHigh)],
        ml: [round1(acetMgLow / ACET_CONC), round1(acetMgHigh / ACET_CONC)],
        maxDayMg: Math.round(w * 75),
      },
      ibu: {
        mg: [Math.round(ibuMgLow), Math.round(ibuMgHigh)],
        ml: [round1(ibuMgLow / IBU_CONC), round1(ibuMgHigh / IBU_CONC)],
      },
    };
  }, [weight]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="px-1">
        <span className="chip bg-rose/40 text-ink">해열제 가이드</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-ink mt-2">🌡️ 우리 아기 해열제 용량</h1>
        <p className="text-ink/70 text-sm md:text-base mt-1">몸무게를 입력하면 1회 복용량 범위를 알려드려요. (참고용)</p>
      </header>

      {/* 몸무게 입력 */}
      <section className="card p-5 md:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-ink/60 block mb-1">아기 몸무게</label>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-rose">{weight}</span>
              <span className="text-lg font-bold text-ink/70">kg</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[-1, -0.5, 0.5, 1].map((d) => (
              <button key={d} onClick={() => setWeight((w) => clamp(round1(w + d)))}
                className="btn-pop w-11 h-11 rounded-full bg-white border-2 border-rose/30 font-extrabold text-ink text-sm">
                {d > 0 ? `+${d}` : d}
              </button>
            ))}
          </div>
        </div>
        <input type="range" min={3} max={30} step={0.5} value={weight}
          onChange={(e) => setWeight(+e.target.value)} className="w-full mt-4 accent-rose" />
        <div className="flex justify-between text-xs text-ink/40 mt-1"><span>3kg</span><span>30kg</span></div>
      </section>

      {/* 결과 */}
      <div className="grid md:grid-cols-2 gap-4">
        <DoseCard
          color="bg-mint/30" icon="💊"
          title="아세트아미노펜"
          brands="타이레놀·챔프·세토펜 등"
          conc="160mg/5mL 시럽 기준"
          doseMl={dose.acet.ml} doseMg={dose.acet.mg}
          interval="4~6시간 간격"
          note="생후 4개월 미만은 의사 상담 후. 1일 최대 5회."
          extra={`1일 최대 약 ${dose.acet.maxDayMg.toLocaleString()}mg 이하`}
        />
        <DoseCard
          color="bg-sky/30" icon="💊"
          title="이부프로펜"
          brands="부루펜·이부서스펜 등"
          conc="100mg/5mL 시럽 기준"
          doseMl={dose.ibu.ml} doseMg={dose.ibu.mg}
          interval="6~8시간 간격"
          note="⚠️ 생후 6개월 미만은 원칙적으로 사용하지 않아요."
          warn
        />
      </div>

      {/* 교차복용 안내 */}
      <section className="card p-5 bg-butter/30">
        <h3 className="font-extrabold text-ink mb-2">🔄 교차복용(번갈아 먹이기)</h3>
        <p className="text-sm text-ink/80">
          열이 잘 안 떨어질 때 두 약을 번갈아 쓰기도 하지만, <b>같은 약을 정해진 간격보다 자주 주면 위험</b>해요.
          교차복용은 <b>2~3시간 간격</b>으로 하되, 각 약의 하루 최대 횟수를 넘기지 않도록 <b>복용 시간을 꼭 기록</b>하세요.
          가능하면 의사·약사와 먼저 상담하는 것이 안전합니다.
        </p>
      </section>

      {/* 병원 가야 하는 신호 */}
      <section className="card p-5 bg-rose/15">
        <h3 className="font-extrabold text-ink mb-2">🚨 이럴 땐 바로 병원·119</h3>
        <ul className="text-sm text-ink/80 space-y-1">
          <li>• 생후 3개월 미만인데 38°C 이상 열</li>
          <li>• 열이 39°C 이상으로 지속되거나 24시간 넘게 계속</li>
          <li>• 경련, 축 늘어짐, 의식 저하, 반복 구토</li>
          <li>• 목이 뻣뻣, 숨쉬기 힘들어함, 소변이 거의 없음</li>
          <li>• 피부에 눌러도 안 사라지는 발진</li>
        </ul>
      </section>

      <div className="card p-4 text-xs text-ink/60">
        ⚠️ 본 가이드는 일반적인 소아 해열제 표준 용량(아세트아미노펜 10~15mg/kg, 이부프로펜 5~10mg/kg)을 참고용으로 계산한 것이며,
        <b> 의사·약사의 처방·복약지도를 대체하지 않습니다.</b> 제품마다 농도가 다를 수 있으니 반드시 <b>구입한 제품의 라벨 용량</b>을 확인하고,
        미숙아·기저질환·다른 약 복용 중이라면 전문가와 상담하세요.
      </div>
    </div>
  );
}

function DoseCard({ color, icon, title, brands, conc, doseMl, doseMg, interval, note, extra, warn }: {
  color: string; icon: string; title: string; brands: string; conc: string;
  doseMl: number[]; doseMg: number[]; interval: string; note: string; extra?: string; warn?: boolean;
}) {
  return (
    <div className={`card p-5 ${color}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-extrabold text-ink">{title}</h3>
          <p className="text-xs text-ink/55">{brands}</p>
        </div>
      </div>
      <div className="mt-3 bg-white/70 rounded-2xl p-4 text-center">
        <div className="text-xs text-ink/60 font-semibold">1회 복용량</div>
        <div className="text-3xl font-extrabold text-rose mt-1">
          {doseMl[0]}~{doseMl[1]}<span className="text-lg">mL</span>
        </div>
        <div className="text-xs text-ink/55 mt-1">({doseMg[0]}~{doseMg[1]}mg · {conc})</div>
      </div>
      <div className="mt-3 text-sm text-ink/80 space-y-1">
        <p>⏱️ {interval}</p>
        <p className={warn ? "text-rose font-bold" : ""}>{note}</p>
        {extra && <p>📊 {extra}</p>}
      </div>
    </div>
  );
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function clamp(n: number): number { return Math.min(30, Math.max(3, n)); }
