"use client";

import { useEffect, useState } from "react";
import { TIMELINE } from "@/lib/data";

const colorMap: Record<string, string> = {
  rose: "bg-rose/40", lavender: "bg-lavender/50", mint: "bg-mint/50",
  peach: "bg-peach/60", butter: "bg-butter/50",
};
const KEY = "ssook-timeline-check";

export default function TimelineChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setChecked(JSON.parse(r)); } catch {}
  }, []);

  const toggle = (k: string) => {
    setChecked((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const total = TIMELINE.reduce((n, s) => n + s.items.length, 0);
  const done = TIMELINE.reduce((n, s) => n + s.items.filter((i) => checked[`${s.phase}:${i}`]).length, 0);
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-6">
      <div className="card p-5 bg-rose/20">
        <div className="flex justify-between items-center mb-2">
          <span className="font-extrabold text-ink">신청 진행률</span>
          <span className="font-extrabold text-rose">{done} / {total} ({pct}%)</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden">
          <div className="h-full bg-rose transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-1 bg-rose/40 rounded-full" />
        {TIMELINE.map((step) => (
          <div key={step.phase} className="relative mb-8">
            <div className="absolute -left-8 top-2 w-7 h-7 rounded-full bg-white border-4 border-rose grid place-items-center text-sm">
              {step.icon}
            </div>
            <div className={`card p-6 ${colorMap[step.color]}`}>
              <h2 className="text-xl font-extrabold text-ink">{step.phase}</h2>
              <ul className="mt-3 space-y-1">
                {step.items.map((item) => {
                  const k = `${step.phase}:${item}`;
                  const on = checked[k];
                  return (
                    <li key={item}>
                      <label className="flex items-start gap-2 cursor-pointer py-1">
                        <input type="checkbox" checked={!!on} onChange={() => toggle(k)}
                          className="mt-1 w-5 h-5 accent-rose shrink-0" />
                        <span className={on ? "line-through text-ink/40" : "text-ink/85"}>{item}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
