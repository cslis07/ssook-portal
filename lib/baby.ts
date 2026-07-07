"use client";

import { useEffect, useState } from "react";

export type Baby = {
  name?: string;
  mode: "due" | "born";       // 출산예정 | 출생
  date: string;               // yyyy-mm-dd
  birthOrder: "first" | "second" | "third";
  twins: boolean;
  region: "metro" | "nonmetro" | "depop";
};

const KEY = "ssook-baby-v1";
const EVT = "ssook-baby-change";

export function loadBaby(): Baby | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Baby) : null;
  } catch { return null; }
}

export function saveBaby(b: Baby | null) {
  try {
    if (b) localStorage.setItem(KEY, JSON.stringify(b));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVT));
  } catch {}
}

// localStorage 기반 아기 프로필 훅 (컴포넌트 간 동기화)
export function useBaby(): [Baby | null, (b: Baby | null) => void, boolean] {
  const [baby, setBaby] = useState<Baby | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBaby(loadBaby());
    setReady(true);
    const onChange = () => setBaby(loadBaby());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const set = (b: Baby | null) => { saveBaby(b); setBaby(b); };
  return [baby, set, ready];
}

// ---- 날짜 계산 ----
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parse(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
export function daysBetween(fromISO: string, toISO: string): number {
  const ms = parse(toISO).getTime() - parse(fromISO).getTime();
  return Math.round(ms / 86400000);
}
// 출생일 기준 오늘까지 일수 (출생 전이면 음수)
export function ageDays(baby: Baby): number {
  if (baby.mode === "born") return daysBetween(baby.date, todayISO());
  return -daysBetween(todayISO(), baby.date); // 예정일까지 남은 일수의 음수
}
// 만 개월수 (출생 후에만 유효, 0 이상)
export function ageMonths(baby: Baby): number {
  if (baby.mode !== "born") return 0;
  const b = parse(baby.date), t = parse(todayISO());
  let m = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth());
  if (t.getDate() < b.getDate()) m -= 1;
  return Math.max(0, m);
}
// D-day 문자열 (+ 지남, - 남음)
export function ddayLabel(fromToday: number): string {
  if (fromToday === 0) return "D-DAY";
  return fromToday > 0 ? `D+${fromToday}` : `D${fromToday}`;
}
