"use client";

import { useMemo, useState } from "react";

export default function CalculatorPage() {
  const [birthOrder, setBirthOrder] = useState<"first" | "second" | "third">("first");
  const [twins, setTwins] = useState(false);
  const [region, setRegion] = useState<"metro" | "nonmetro" | "depop">("metro");
  const [careType, setCareType] = useState<"home" | "daycare">("home");
  const [period, setPeriod] = useState(24);
  const [heating, setHeating] = useState<"none" | "citygas" | "district">("citygas");

  const result = useMemo(() => {
    const months0 = Math.min(12, period);
    const months1 = Math.max(0, Math.min(12, period - 12));

    const med = twins ? 140 : 100;
    const first = birthOrder === "first" ? 200 : 300;
    const DAYCARE_VOUCHER = 58.4;
    const parent0Monthly = careType === "home" ? 100 : Math.max(0, 100 - DAYCARE_VOUCHER);
    const parent1Monthly = careType === "home" ? 50 : Math.max(0, 50 - DAYCARE_VOUCHER);
    const parent0 = months0 * parent0Monthly;
    const parent1 = months1 * parent1Monthly;

    const childMonthly = region === "metro" ? 10 : region === "nonmetro" ? 10.5 : 12;
    const child = period * childMonthly;

    const elecMonths = Math.min(36, Math.max(period, 12));
    const elec = elecMonths * 1.6;

    const isMulti = birthOrder === "third";
    const months = Math.max(period, 12);
    const winterMonths = Math.round((months / 12) * 4);
    const nonWinterMonths = months - winterMonths;
    const gas = isMulti && heating === "citygas"
      ? (winterMonths * 1.8 + nonWinterMonths * 0.247)
      : 0;
    const district = isMulti && heating === "district" ? (months / 12) * 4.8 : 0;
    const heatingTotal = gas + district;

    const total = med + first + parent0 + parent1 + child + elec + heatingTotal;

    const breakdown = [
      { name: "임신·출산 진료비", val: med, note: twins ? "다태아 기본 140만원" : "단태아 100만원" },
      { name: "첫만남이용권", val: first, note: birthOrder === "first" ? "첫째 200만원" : "둘째 이상 300만원" },
      { name: `부모급여 0세 × ${months0}개월`, val: parent0, note: careType === "home" ? "월 100만원" : `월 100만 − 보육료 58.4만 = 약 ${parent0Monthly.toFixed(1)}만` },
      { name: `부모급여 1세 × ${months1}개월`, val: parent1, note: careType === "home" ? "월 50만원 (0세 100만에서 절반↓)" : "월 50만 < 보육료 58.4만 → 현금 0원" },
      { name: `아동수당 × ${period}개월`, val: child, note: `월 ${childMonthly}만원` },
      { name: `출산가구 전기할인 (최대 ${elecMonths}개월)`, val: elec, note: "월 1.6만원 한도" },
    ];
    if (gas > 0) breakdown.push({ name: "도시가스 다자녀 할인", val: gas, note: "동절기 月 1.8만 · 비동절기 月 0.247만 (3자녀+)" });
    if (district > 0) breakdown.push({ name: "지역난방 다자녀 할인", val: district, note: "月 4,000원 × 12개월 일괄지급 (3자녀+)" });

    return { med, first, parent0, parent1, child, elec, heatingTotal, total, breakdown, isMulti };
  }, [birthOrder, twins, region, careType, period, heating]);

  return (
    <div className="space-y-8">
      <header>
        <span className="chip bg-sky/60 text-ink">지원금 계산기</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">🧮 우리 가족 받을 금액</h1>
        <p className="text-ink/70 mt-2">중앙정부 대표 지원금만 합산했어요. 지자체·산후도우미·세제 혜택은 별도예요.</p>
      </header>

      <section className="card p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Field label="🎀 출생 순위">
            <Pills value={birthOrder} onChange={setBirthOrder} options={[
              { v: "first", l: "첫째" }, { v: "second", l: "둘째" }, { v: "third", l: "셋째+" },
            ]} />
          </Field>

          <Field label="👯 쌍둥이/다태아">
            <Pills value={twins ? "y" : "n"} onChange={(v) => setTwins(v === "y")} options={[
              { v: "n", l: "단태아" }, { v: "y", l: "다태아" },
            ]} />
          </Field>

          <Field label="🏙️ 거주 지역">
            <Pills value={region} onChange={setRegion} options={[
              { v: "metro", l: "수도권 (월 10만)" },
              { v: "nonmetro", l: "비수도권 (월 10.5만)" },
              { v: "depop", l: "인구감소·특별 (월 12만)" },
            ]} />
          </Field>

          <Field label="🏠 양육 형태">
            <Pills value={careType} onChange={setCareType} options={[
              { v: "home", l: "가정양육" }, { v: "daycare", l: "어린이집 이용" },
            ]} />
          </Field>

          <Field label={`📅 계산 기간: ${period}개월`}>
            <input type="range" min={1} max={36} value={period} onChange={(e) => setPeriod(+e.target.value)}
              className="w-full accent-rose" />
          </Field>

          <Field label="🔥 난방 방식 (3자녀+만 감면)">
            <Pills value={heating} onChange={setHeating} options={[
              { v: "citygas", l: "도시가스" },
              { v: "district", l: "지역난방" },
              { v: "none", l: "해당없음" },
            ]} />
            {birthOrder !== "third" && (
              <p className="text-xs text-ink/50 mt-2">⚠️ 도시가스·지역난방 다자녀 감면은 3자녀 이상부터 적용돼요.</p>
            )}
          </Field>
        </div>

        <div className="card bg-rose/20 p-6">
          <div className="text-center mb-4">
            <div className="text-sm text-ink/70 font-semibold">예상 총 수령액</div>
            <div className="text-4xl md:text-5xl font-extrabold text-rose mt-1">
              약 {Math.round(result.total).toLocaleString()}<span className="text-2xl">만원</span>
            </div>
          </div>
          <ul className="space-y-2">
            {result.breakdown.map((b) => (
              <li key={b.name} className="flex justify-between items-baseline border-b border-rose/30 pb-1">
                <div>
                  <div className="font-bold text-ink text-sm">{b.name}</div>
                  <div className="text-xs text-ink/60">{b.note}</div>
                </div>
                <div className="font-extrabold text-ink whitespace-nowrap">{Math.round(b.val).toLocaleString()}만</div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/60 mt-4">
            * 어린이집 이용 시 부모급여 일부는 보육료 바우처로 지급돼 실제 현금 입금액은 줄어듭니다.
            * 지자체 출산축하금·산후조리비·산후도우미·세액공제는 별도예요.
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-bold text-ink mb-2">{label}</div>
      {children}
    </div>
  );
}

function Pills<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { v: T; l: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`btn-pop px-3 py-2 rounded-full text-sm font-bold border-2 ${
            value === o.v ? "bg-rose text-white border-rose" : "bg-white text-ink border-rose/30 hover:bg-rose/10"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
