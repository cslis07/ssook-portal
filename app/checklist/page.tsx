"use client";

import { useEffect, useState } from "react";
import { CHECKLIST } from "@/lib/data";

const STORAGE_KEY = "ssook-checklist-v1";

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const totalMust = CHECKLIST.mustHave.reduce((n, c) => n + c.items.length, 0);
  const doneMust = CHECKLIST.mustHave.reduce(
    (n, c) => n + c.items.filter((i) => checked[`must:${c.title}:${i.name}`]).length,
    0
  );
  const pct = Math.round((doneMust / totalMust) * 100);

  return (
    <div className="space-y-8">
      <header>
        <span className="chip bg-mint/60 text-ink">준비물 체크리스트</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">🎀 출산 전 꼭 필요한 것들</h1>
        <p className="text-ink/70 mt-2">체크 상태는 브라우저에 저장돼요. 부담 없이 체크하세요.</p>
      </header>

      <div className="card p-5 bg-rose/20">
        <div className="flex justify-between items-center mb-2">
          <span className="font-extrabold text-ink">필수 준비물 진행률</span>
          <span className="font-extrabold text-rose">{doneMust} / {totalMust} ({pct}%)</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden">
          <div className="h-full bg-rose transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-3">✅ 꼭 준비</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {CHECKLIST.mustHave.map((cat) => (
            <div key={cat.title} className="card p-5">
              <div className="font-extrabold text-ink mb-3 flex items-center gap-2">
                <span className="text-2xl">{cat.icon}</span> {cat.title}
              </div>
              <ul className="space-y-2">
                {cat.items.map((item) => {
                  const k = `must:${cat.title}:${item.name}`;
                  const isOn = checked[k];
                  return (
                    <li key={item.name}>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!isOn}
                          onChange={() => toggle(k)}
                          className="mt-1 w-5 h-5 accent-rose"
                        />
                        <div className={isOn ? "line-through text-ink/40" : ""}>
                          <span className="font-semibold text-ink">{item.name}</span>
                          {item.qty && <span className="text-ink/60 ml-1 text-sm">({item.qty})</span>}
                          {item.note && <div className="text-xs text-ink/55 mt-0.5">{item.note}</div>}
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-3">🕒 상황 보고 구입</h2>
        <div className="card p-5">
          <ul className="grid md:grid-cols-2 gap-2">
            {CHECKLIST.later.map((i) => (
              <li key={i.name} className="flex gap-2">
                <span className="text-butter font-bold">○</span>
                <div>
                  <span className="font-semibold text-ink">{i.name}</span>
                  {i.note && <span className="text-ink/60 text-sm ml-1">— {i.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-3">🚫 사지 말거나 주의</h2>
        <div className="card p-5 bg-rose/10">
          <ul className="grid md:grid-cols-2 gap-2">
            {CHECKLIST.avoid.map((i) => (
              <li key={i.name} className="flex gap-2">
                <span className="text-rose font-bold">✕</span>
                <div>
                  <span className="font-semibold text-ink">{i.name}</span>
                  {i.note && <span className="text-ink/60 text-sm ml-1">— {i.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
