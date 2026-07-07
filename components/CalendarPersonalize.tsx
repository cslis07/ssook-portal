"use client";

import { useEffect, useState } from "react";
import { loadBaby, ageMonths } from "@/lib/baby";

export default function CalendarPersonalize() {
  const [info, setInfo] = useState<{ months: number; name: string } | null>(null);

  useEffect(() => {
    const b = loadBaby();
    if (!b || b.mode !== "born") return;
    const months = ageMonths(b);
    setInfo({ months, name: b.name?.trim() || "우리 아기" });

    // 현재 개월수에 맞는 카드 하이라이트 + 스크롤
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-lo]"));
    const target = cards.find((c) => {
      const lo = Number(c.dataset.lo), hi = Number(c.dataset.hi);
      return months >= lo && months <= hi;
    }) || cards.find((c) => Number(c.dataset.lo) >= months);
    if (target) {
      target.style.boxShadow = "0 0 0 3px #ff8fab";
      // 진입 시 자동 스크롤(부드럽게)
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    }
  }, []);

  if (!info) return null;
  return (
    <div className="card p-4 bg-rose/20 flex items-center gap-3">
      <span className="text-3xl">👶</span>
      <div className="flex-1">
        <div className="font-extrabold text-ink">{info.name}는 지금 <span className="text-rose">{info.months}개월</span>이에요</div>
        <div className="text-xs text-ink/60">해당 시기 카드로 이동해 강조 표시했어요.</div>
      </div>
    </div>
  );
}
