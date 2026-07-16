"use client";

import { useState } from "react";
import { MONTHS } from "@/lib/data";
import { useBaby, ageMonths } from "@/lib/baby";

function monthRange(label: string): [number, number] {
  const nums = label.replace("개월", "").split("~").map((s) => parseInt(s, 10));
  return nums.length === 2 ? [nums[0], nums[1]] : [nums[0], nums[0]];
}

// 아기 개월수에 해당하는 카드만 표시 + 전체보기 토글
export default function MonthCards() {
  const [baby, , ready] = useBaby();
  const [showAll, setShowAll] = useState(false);

  const months = ready && baby?.mode === "born" ? ageMonths(baby) : null;
  const name = baby?.name?.trim() || "우리 아기";

  // 현재 개월에 해당하는 카드 (지난 시기면 마지막 카드)
  let curIdx = -1;
  if (months !== null) {
    curIdx = MONTHS.findIndex((m) => {
      const [lo, hi] = monthRange(m.month);
      return months >= lo && months <= hi;
    });
    if (curIdx === -1) {
      curIdx = MONTHS.findIndex((m) => monthRange(m.month)[0] >= months);
      if (curIdx === -1) curIdx = MONTHS.length - 1;
    }
  }

  const filtering = curIdx >= 0 && !showAll;
  const list = filtering ? [MONTHS[curIdx]] : MONTHS;

  return (
    <div className="space-y-4">
      {months !== null && (
        <div className="card p-4 bg-rose/20 flex items-center gap-3 flex-wrap">
          <span className="text-3xl">👶</span>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-ink">
              {name}는 지금 <span className="text-rose">{months}개월</span>이에요
            </div>
            <div className="text-xs text-ink/60">
              {filtering ? "해당 시기 내용만 보여드려요." : "전체 시기를 보여드려요."}
            </div>
          </div>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="btn-pop px-4 py-2 rounded-full text-sm font-bold bg-white border-2 border-rose/40 text-ink shrink-0"
          >
            {filtering ? "📋 전체 보기" : "👶 우리 아기 시기만"}
          </button>
        </div>
      )}

      <section className="grid md:grid-cols-2 gap-4">
        {list.map((m) => {
          const [lo, hi] = monthRange(m.month);
          const isCurrent = months !== null && months >= lo && months <= hi;
          return (
            <div
              key={m.month}
              id={`m-${lo}`}
              className={`card p-5 scroll-mt-24 transition ${isCurrent && !filtering ? "ring-[3px] ring-rose" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 min-w-12 px-3 grid place-items-center rounded-full bg-rose/40 font-extrabold text-ink text-sm whitespace-nowrap">
                  {m.month.replace("개월", "M").replace("~", "-")}
                </div>
                <div className="font-extrabold text-ink text-lg">{m.month}</div>
                {isCurrent && <span className="chip bg-rose text-white text-[11px] shrink-0">지금</span>}
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
    </div>
  );
}
