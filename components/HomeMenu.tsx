import Link from "next/link";

// 홈 하단 '전체 메뉴' — 기존 12개 기능 진입점 (URL·라벨 유지, UI 2.0 카드 스타일)
const MENU = [
  { href: "/support", icon: "💝", label: "지원금혜택", bg: "#FDEDEF" },
  { href: "/calculator", icon: "🧮", label: "지원금계산기", bg: "#FDF1E4" },
  { href: "/timeline", icon: "📅", label: "시기별 신청 할 일", bg: "#EFEBFB" },
  { href: "/localgov", icon: "🏘️", label: "지자체 지원금", bg: "#EAF6EE" },
  { href: "/calendar", icon: "👶", label: "개월별 가이드", bg: "#FFF5DA" },
  { href: "/growth", icon: "🌷", label: "월령별 성장", bg: "#EBF3FE" },
  { href: "/checklist", icon: "🎀", label: "출산준비물", bg: "#FDEDEF" },
  { href: "/utility", icon: "💡", label: "공과금혜택", bg: "#FDF1E4" },
  { href: "/medical", icon: "🏥", label: "의료·약국", bg: "#EAF6EE" },
  { href: "/fever", icon: "🌡️", label: "해열제", bg: "#FFF5DA" },
  { href: "/seoul", icon: "🎫", label: "공공서비스예약", bg: "#EBF3FE" },
  { href: "/milestones", icon: "🌱", label: "발달 체크", bg: "#EAF6EE" },
  { href: "/food", icon: "🥄", label: "이유식 체크", bg: "#FFF5DA" },
  { href: "/my", icon: "🧸", label: "내 아이 기록", bg: "#FDF1E4" },
];

export default function HomeMenu() {
  return (
    <section className="ss-section" aria-labelledby="ss-allmenu">
      <h2 id="ss-allmenu" className="ss-section-title">전체 메뉴</h2>
      <div className="ss-menu-grid">
        {MENU.map((m) => (
          <Link key={m.href} href={m.href}>
            <span className="ss-menu-ic" style={{ background: m.bg }} aria-hidden="true">{m.icon}</span>
            {m.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
