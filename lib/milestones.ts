import { GROWTH, type GrowthSection } from "./growth";

// 발달 체크 항목 — 새 의학 내용을 만들지 않고, 기존 월령별 성장 데이터(아이사랑 포털 출처)의
// 발달 문장(운동·인지·언어·사회정서·감각)을 문장 단위로 나눠 체크 항목으로 쓴다.
export const AREA_LABEL: Record<string, string> = {
  motor: "운동", cognitive: "인지", language: "언어", social: "사회·정서", senses: "감각",
};

export type Milestone = { key: string; area: string; text: string };

export function splitSentences(s: string): string[] {
  return s
    .split(/(?<=[.!?。])\s+/)
    .map((x) => x.replace(/[.。]\s*$/, "").trim())
    .filter((x) => x.length > 3);
}

export function milestonesOf(sec: GrowthSection): Milestone[] {
  const dev = sec.development || {};
  const out: Milestone[] = [];
  for (const area of Object.keys(AREA_LABEL)) {
    const text = (dev as Record<string, string | undefined>)[area];
    if (!text) continue;
    splitSentences(text).forEach((t, i) => out.push({ key: `${sec.id}|${area}|${i}`, area, text: t }));
  }
  return out;
}

// 발달 문장이 있는 구간만 (이른둥이 구간은 안내 위주라 제외)
export const MILESTONE_SECTIONS = GROWTH.filter((g) => g.development && Object.keys(g.development).length > 0);

export function sectionIdForMonths(m: number) {
  if (m < 1) return "newborn";
  if (m <= 3) return "1to3";
  if (m <= 6) return "4to6";
  if (m <= 9) return "7to9";
  if (m <= 12) return "10to12";
  if (m <= 24) return "13to24";
  return "25to36";
}
