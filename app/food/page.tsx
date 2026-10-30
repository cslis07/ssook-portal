"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FOOD_GROUPS, NOT_BEFORE_ONE, FOOD_TIPS } from "@/lib/food";
import { useStored, todayISO } from "@/lib/records";

type Rec = { date: string; memo: string };
const KEY = "ssook-food-v1";
type Filter = "all" | "allergen" | "todo";

export default function FoodPage() {
  const [recs, setRecs, ready] = useStored<Record<string, Rec>>(KEY, {});
  const [filter, setFilter] = useState<Filter>("all");

  const total = FOOD_GROUPS.reduce((n, g) => n + g.foods.length, 0);
  const done = useMemo(() => Object.keys(recs).length, [recs]);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const toggle = (name: string) =>
    setRecs((p) => {
      const n = { ...p };
      if (n[name]) delete n[name];
      else n[name] = { date: todayISO(), memo: "" };
      return n;
    });
  const update = (name: string, patch: Partial<Rec>) =>
    setRecs((p) => ({ ...p, [name]: { ...p[name], ...patch } }));

  return (
    <div className="space-y-6">
      <header>
        <span className="chip bg-mint/60 text-ink">성장·육아</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">🥄 이유식 재료 체크</h1>
        <p className="text-ink/70 mt-2">먹어본 재료와 날짜, 반응 메모를 남겨두세요. 기록은 이 기기에만 저장돼요.</p>
      </header>

      <div className="card p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="font-extrabold text-ink">먹어본 재료</span>
          <span className="font-extrabold text-rose" aria-live="polite">{ready ? `${done} / ${total} (${pct}%)` : " "}</span>
        </div>
        <div className="w-full bg-[#F1F2F5] rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="먹어본 재료 비율">
          <div className="h-full bg-rose transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="보기 필터">
          {([["all", "전체"], ["todo", "아직 안 먹어본 것"], ["allergen", "알레르기 표시 대상"]] as [Filter, string][]).map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k}
              className={`btn-pop min-h-[40px] px-4 rounded-full text-sm font-bold border ${filter === k ? "bg-rose text-white border-rose" : "bg-white text-ink border-[#E2E5EC]"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5 bg-[#FFF4F2] border-[#FFD9D2]">
          <h2 className="font-extrabold text-ink mb-2">🚫 돌 전에는 주지 마세요</h2>
          <ul className="space-y-1.5 text-sm text-ink/80">
            {NOT_BEFORE_ONE.map((x) => <li key={x.name}><b className="text-ink">{x.name}</b> — {x.why}</li>)}
          </ul>
        </div>
        <div className="card p-5 bg-[#F5FAF7]">
          <h2 className="font-extrabold text-ink mb-2">💡 이렇게 기록해요</h2>
          <ul className="space-y-1.5 text-sm text-ink/80 list-disc pl-5">
            {FOOD_TIPS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </div>

      {FOOD_GROUPS.map((g) => {
        const foods = g.foods.filter((f) =>
          filter === "all" ? true : filter === "allergen" ? f.allergen : !recs[f.name]);
        if (!foods.length) return null;
        const gDone = g.foods.filter((f) => recs[f.name]).length;
        return (
          <section key={g.id} className="card p-5" aria-labelledby={`g-${g.id}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 id={`g-${g.id}`} className="font-extrabold text-ink text-lg">{g.icon} {g.label}</h2>
              <span className="text-sm font-bold text-ink/50">{gDone} / {g.foods.length}</span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {foods.map((f) => {
                const r = recs[f.name];
                return (
                  <li key={f.name} className={`rounded-2xl border p-3 ${r ? "border-[#CFE6D7] bg-[#F5FAF7]" : "border-[#ECEEF3] bg-white"}`}>
                    <label className="flex items-center gap-2.5 cursor-pointer min-h-[32px]">
                      <input type="checkbox" checked={!!r} onChange={() => toggle(f.name)} className="w-5 h-5 accent-rose shrink-0" />
                      <span className="font-bold text-ink">{f.name}</span>
                      {f.allergen && <span className="chip bg-[#FDECE6] text-[#B4462A] text-[11px]">알레르기 표시 대상</span>}
                      {r && <span className="ml-auto text-xs font-bold text-[#3E8B5E]">먹어봤어요</span>}
                    </label>
                    {f.note && <p className="text-xs text-ink/55 mt-1 ml-7">{f.note}</p>}
                    {r && (
                      <div className="mt-2 ml-7 grid gap-2">
                        <label className="text-xs text-ink/60 flex items-center gap-2">
                          처음 먹인 날
                          <input type="date" value={r.date} onChange={(e) => update(f.name, { date: e.target.value })}
                            className="px-2 py-1 rounded-lg border border-[#E2E5EC] bg-white text-xs" />
                        </label>
                        <input type="text" value={r.memo} placeholder="반응 메모 (예: 잘 먹음, 입가 붉어짐)" aria-label={`${f.name} 반응 메모`}
                          onChange={(e) => update(f.name, { memo: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E2E5EC] bg-white text-sm" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="card p-4 text-xs text-ink/60 space-y-1">
        <p>⚠️ 이 목록은 <b>기록용</b>이며 시작 시기·순서나 알레르기 여부를 판단해주지 않아요. 입술·얼굴 붓기, 두드러기, 반복 구토, 숨쉬기 힘들어함이 보이면 바로 진료받으세요(호흡 곤란 시 119).</p>
        <p>알레르기 표시 대상: 식품등의 표시·광고에 관한 법률 시행규칙 별표2 기준. 기록 백업·가족 공유는 <Link href="/my" className="underline font-bold">내 아이</Link>에서 할 수 있어요.</p>
      </div>
    </div>
  );
}
