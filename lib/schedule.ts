import type { Baby } from "./baby";
import { daysBetween, todayISO } from "./baby";

export type SchedItem = {
  id: string;
  kind: "vaccine" | "checkup";
  label: string;
  atDays: number;      // 출생일로부터 권장 시작일(대략)
  windowLabel: string; // 표시용 시기
};

// 국가예방접종·영유아검진 표준 일정 (출생일 기준 대략일). 정확 일정은 병원·건강iN 우선.
export const SCHEDULE: SchedItem[] = [
  { id: "bcg", kind: "vaccine", label: "BCG (결핵)", atDays: 21, windowLabel: "생후 4주 이내" },
  { id: "hepb1", kind: "vaccine", label: "B형간염 1차", atDays: 0, windowLabel: "출생 직후" },
  { id: "chk1", kind: "checkup", label: "1차 영유아검진", atDays: 20, windowLabel: "생후 14~35일" },
  { id: "hepb2", kind: "vaccine", label: "B형간염 2차", atDays: 30, windowLabel: "생후 1개월" },
  { id: "vac2m", kind: "vaccine", label: "DTaP·IPV·Hib·PCV·로타 1차", atDays: 60, windowLabel: "생후 2개월" },
  { id: "vac4m", kind: "vaccine", label: "DTaP·IPV·Hib·PCV·로타 2차", atDays: 120, windowLabel: "생후 4개월" },
  { id: "chk2", kind: "checkup", label: "2차 영유아검진", atDays: 150, windowLabel: "생후 4~6개월" },
  { id: "vac6m", kind: "vaccine", label: "DTaP·IPV·Hib·PCV 3차, B형간염 3차", atDays: 180, windowLabel: "생후 6개월" },
  { id: "flu", kind: "vaccine", label: "인플루엔자 (매년)", atDays: 183, windowLabel: "생후 6개월~ 매년" },
  { id: "chk3", kind: "checkup", label: "3차 영유아검진", atDays: 300, windowLabel: "생후 9~12개월" },
  { id: "vac12m", kind: "vaccine", label: "MMR·수두·일본뇌염·A형간염", atDays: 365, windowLabel: "생후 12~15개월" },
  { id: "chk4", kind: "checkup", label: "4차 영유아검진 + 구강 1차", atDays: 570, windowLabel: "생후 18~24개월" },
  { id: "vac18m", kind: "vaccine", label: "DTaP·IPV·Hib·PCV 추가, A형간염 2차", atDays: 550, windowLabel: "생후 18개월" },
  { id: "chk5", kind: "checkup", label: "5차 영유아검진 + 구강 2차", atDays: 990, windowLabel: "생후 30~36개월" },
];

export type UpcomingEvent = SchedItem & { dueISO: string; dday: number };

// 출생 아기 기준: 오늘 이후(또는 최근 지난) 이벤트를 D-day와 함께
export function upcomingEvents(baby: Baby, opts?: { max?: number; pastGraceDays?: number }): UpcomingEvent[] {
  if (baby.mode !== "born") return [];
  const max = opts?.max ?? 4;
  const grace = opts?.pastGraceDays ?? 14; // 최근 지난 것도 잠깐 노출
  const today = todayISO();
  const events = SCHEDULE.map((s) => {
    const due = addDaysISO(baby.date, s.atDays);
    const dday = daysBetween(today, due); // 양수=남음, 음수=지남
    return { ...s, dueISO: due, dday };
  })
    .filter((e) => e.dday >= -grace)
    .sort((a, b) => a.dday - b.dday);
  return events.slice(0, max);
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, (d || 1) + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
