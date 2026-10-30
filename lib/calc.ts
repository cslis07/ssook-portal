// 지원금 계산식 — app/calculator/page.tsx 의 useMemo 본문을 수식 변경 없이 그대로 옮긴 것.
// 계산기 페이지와 홈 "예상 지원금" 카드가 같은 함수를 쓴다. (단위: 만원)

export type CalcInput = {
  birthOrder: "first" | "second" | "third";
  twins: boolean;
  region: "metro" | "nonmetro" | "depop";
  careType: "home" | "daycare";
  period: number;
  heating: "none" | "citygas" | "district";
};

// 계산기 페이지의 초기값과 동일 (아기 프로필이 있으면 순위·지역·다태아만 덮어씀)
export const CALC_DEFAULTS: CalcInput = {
  birthOrder: "first",
  twins: false,
  region: "metro",
  careType: "home",
  period: 24,
  heating: "citygas",
};

export function calcSupport({ birthOrder, twins, region, careType, period, heating }: CalcInput) {
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
}
