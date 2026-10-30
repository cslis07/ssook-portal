// UI 2.0 내비게이션 — 기존 URL은 그대로, 메뉴 묶음만 재배치 (DESIGN_SPEC §4)

export type NavItem = { href: string; label: string; desc?: string };
export type NavGroup = { id: string; label: string; short: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "benefit",
    label: "혜택·지원금",
    short: "혜택",
    items: [
      { href: "/support", label: "지원금혜택", desc: "현금·바우처·감면·휴직 12종" },
      { href: "/calculator", label: "지원금계산기", desc: "우리 가족 예상 수령액" },
      { href: "/timeline", label: "시기별 신청 할 일", desc: "임신부터 출산 후 6개월까지" },
      { href: "/localgov", label: "지자체 지원금", desc: "서울 자치구 실제 금액" },
      { href: "/utility", label: "공과금혜택", desc: "전기·가스·난방 감면" },
    ],
  },
  {
    id: "grow",
    label: "성장·육아",
    short: "성장",
    items: [
      { href: "/calendar", label: "개월별 가이드", desc: "발달·접종·검진" },
      { href: "/growth", label: "월령별 성장", desc: "이른둥이~36개월" },
      { href: "/checklist", label: "출산준비물", desc: "체크리스트·출산가방" },
      { href: "/milestones", label: "발달 체크", desc: "월령별 발달 기록" },
      { href: "/food", label: "이유식 체크", desc: "먹어본 재료·반응 메모" },
      { href: "/my", label: "내 아이 기록", desc: "진료 전 요약·백업·가족 공유" },
    ],
  },
  {
    id: "life",
    label: "생활·의료",
    short: "의료",
    items: [
      { href: "/medical", label: "의료·약국", desc: "응급실·소아진료·약 검색" },
      { href: "/fever", label: "해열제", desc: "몸무게별 용량·대처법" },
      { href: "/seoul", label: "공공서비스예약", desc: "서울시 공공예약" },
    ],
  },
];

export const HELP_LINKS: NavItem[] = [
  { href: "/guide.html", label: "이용가이드" },
  { href: "/privacy", label: "개인정보 처리방침" },
];

export function groupOf(pathname: string): string | null {
  if (pathname === "/") return "home";
  const g = NAV_GROUPS.find((g) => g.items.some((it) => pathname === it.href || pathname.startsWith(it.href + "/")));
  return g ? g.id : null;
}
