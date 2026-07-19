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
        <p className="text-ink/70 text-sm md:text-base mt-1">몸무게별 복용량 + 열날 때 흔한 질병·대처법까지. (참고용)</p>
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

      {/* 열날 때 흔한 질병 & 대처법 */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-ink">🤒 열날 때 흔한 질병 &amp; 대처법</h2>
          <p className="text-ink/60 text-sm mt-1">병명을 누르면 증상·대처·주의 신호가 펼쳐져요. (참고용 — 진단은 의사)</p>
        </div>
        {FEVER_ILLNESS.map((d) => (
          <details key={d.name} className="card overflow-hidden group">
            <summary className="cursor-pointer list-none p-4 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-2xl shrink-0">{d.icon}</span>
                <span className="min-w-0">
                  <span className="block font-extrabold text-ink">{d.name}</span>
                  <span className="block text-xs text-ink/55 truncate">{d.brief}</span>
                </span>
              </span>
              <span className="text-ink/40 text-sm transition group-open:rotate-180 shrink-0">▼</span>
            </summary>
            <div className="px-4 pb-4 space-y-3 text-sm">
              <div>
                <div className="font-bold text-ink/70 text-xs mb-1">🔎 주요 증상</div>
                <p className="text-ink/80">{d.symptoms}</p>
              </div>
              <div className="rounded-2xl bg-mint/20 p-3">
                <div className="font-bold text-ink/70 text-xs mb-1">🏠 집에서 이렇게</div>
                <p className="text-ink/80">{d.care}</p>
              </div>
              <div className="rounded-2xl bg-rose/15 p-3">
                <div className="font-bold text-rose text-xs mb-1">🚨 이럴 땐 병원</div>
                <p className="text-ink/80">{d.danger}</p>
              </div>
            </div>
          </details>
        ))}
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

// 영유아 발열을 동반하는 흔한 질병 — 참고용(질병관리청·대한소아청소년과학회 일반 정보 요약)
const FEVER_ILLNESS: { icon: string; name: string; brief: string; symptoms: string; care: string; danger: string }[] = [
  {
    icon: "⚡", name: "열성경련",
    brief: "생후 6개월~5세, 열이 오를 때 갑자기 발생",
    symptoms: "열이 오르는 초기에 몸을 뻣뻣하게 떨거나 눈이 돌아가고 잠시 의식을 잃어요. 대부분 5분 이내에 저절로 멈춰요.",
    care: "당황하지 말고 아이를 옆으로 눕혀 토물이 기도를 막지 않게 하세요. 입에 아무것도 넣지 말고(혀 깨묾 방지용 손가락·수건 금지), 경련 시간과 모습을 관찰·기록하세요. 꽉 붙잡거나 흔들지 마세요.",
    danger: "경련이 5분 이상 지속, 하루에 2번 이상 반복, 경련 후에도 의식이 잘 안 돌아옴, 생후 6개월 미만·5세 이상 첫 경련, 한쪽만 떠는 경련이면 바로 119·응급실.",
  },
  {
    icon: "🖐️", name: "수족구병",
    brief: "여름·가을 유행, 손·발·입에 물집",
    symptoms: "미열~고열과 함께 입안(혀·잇몸)에 물집·궤양, 손바닥·발바닥·엉덩이에 붉은 발진이나 작은 물집이 생겨요. 입이 아파 잘 안 먹고 침을 흘려요.",
    care: "특효약은 없고 대개 7~10일이면 좋아져요. 물·차가운 음식(아이스크림·요구르트)으로 수분을 자주 주고, 자극적·뜨겁고 신 음식은 피하세요. 전염성이 강하니 어린이집은 쉬고 손 씻기를 철저히.",
    danger: "소변이 8시간 이상 없거나 축 늘어지고 물도 못 삼킴(탈수), 39°C 넘는 고열 지속, 경련·심한 두통·구토, 팔다리에 힘이 빠지면 바로 병원.",
  },
  {
    icon: "🌡️", name: "돌발진(장미진)",
    brief: "생후 6~24개월, 고열 뒤 발진",
    symptoms: "특별한 증상 없이 3~4일간 39~40°C 고열이 나다가, 열이 뚝 떨어진 뒤 몸통부터 장밋빛 발진이 돋아요. 발진은 가렵지 않고 3일쯤 지나면 사라져요.",
    care: "해열제로 열을 조절하고 수분을 충분히 주세요. 발진은 저절로 없어지므로 특별한 치료가 필요 없어요. 열이 높아도 아이 컨디션이 괜찮으면 대개 경과가 좋아요.",
    danger: "열이 5일 이상 지속, 열성경련 동반, 축 늘어지고 잘 안 깨어남, 발진이 물집·자반(눌러도 안 없어짐)으로 보이면 진료.",
  },
  {
    icon: "😷", name: "독감(인플루엔자)",
    brief: "겨울철, 갑작스러운 고열·전신 통증",
    symptoms: "38~40°C 고열이 갑자기 시작되고 기침·콧물·인후통과 함께 몸살(근육통)·오한·심한 처짐이 동반돼요. 감기보다 전신 증상이 훨씬 심해요.",
    care: "충분한 휴식과 수분, 해열제로 증상을 완화하세요. 발병 48시간 내 진료하면 항바이러스제(타미플루 등) 처방이 도움이 될 수 있어요. 매년 예방접종이 최선의 예방.",
    danger: "숨쉬기 힘들어하거나 가슴이 답답, 입술이 파래짐, 탈수, 열이 내렸다 다시 오르며 악화, 경련·의식저하 시 즉시 병원.",
  },
  {
    icon: "👂", name: "중이염",
    brief: "감기 끝무렵, 귀 통증과 열",
    symptoms: "감기 뒤 열이 다시 나면서 귀를 자꾸 만지거나 잡아당기고, 밤에 심하게 보채며 울어요. 귀에서 진물이 나오기도 해요. 말 못 하는 아기는 수유 거부·수면 방해로 나타나요.",
    care: "해열진통제로 통증·열을 조절하고 병원에서 진찰받으세요. 상당수는 항생제 없이 좋아지지만 의사 판단에 따라요. 누워서 젖병 물리기를 피하면 예방에 도움돼요.",
    danger: "귀 뒤가 붓고 빨개짐, 고열이 지속, 심한 두통·목 뻣뻣함, 진물에 피가 섞이거나 증상이 3일 이상 악화되면 진료.",
  },
  {
    icon: "🦠", name: "인두편도염(목감기)",
    brief: "목 빨갛게 붓고 열, 삼킴 곤란",
    symptoms: "목이 빨갛게 붓고 아파 침·음식을 삼키기 힘들어하며 열이 나요. 세균(연쇄구균)성이면 편도에 하얀 삼출물이 보이기도 해요.",
    care: "따뜻한 물·부드러운 음식으로 수분을 주고 해열진통제로 통증을 완화하세요. 세균성으로 진단되면 항생제를 처방받아 정해진 기간 끝까지 복용해야 해요.",
    danger: "침도 못 삼켜 흘림, 입 벌리기·숨쉬기 힘듦, 목소리가 먹먹하고 침 흘리며 목을 젖힘(기도 부종 의심), 고열 지속 시 응급.",
  },
];
