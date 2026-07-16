import Link from "next/link";

// 홈 메인 메뉴 — 아이콘 그리드 허브 (전 기능 한눈에)
const MENU = [
  { href: "/support", icon: "💝", label: "지원금", bg: "bg-rose/40" },
  { href: "/calculator", icon: "🧮", label: "계산기", bg: "bg-peach/60" },
  { href: "/timeline", icon: "📅", label: "신청 타임라인", bg: "bg-lavender/50" },
  { href: "/localgov", icon: "🏘️", label: "지자체 지원금", bg: "bg-mint/50" },
  { href: "/calendar", icon: "👶", label: "개월별 가이드", bg: "bg-butter/60" },
  { href: "/growth", icon: "🌷", label: "월령별 성장", bg: "bg-sky/50" },
  { href: "/checklist", icon: "🎀", label: "준비물", bg: "bg-rose/30" },
  { href: "/utility", icon: "💡", label: "공과금", bg: "bg-peach/50" },
  { href: "/local", icon: "🗺️", label: "우리 동네", bg: "bg-lavender/40" },
  { href: "/medical", icon: "🏥", label: "의료·약국", bg: "bg-mint/40" },
  { href: "/fever", icon: "🌡️", label: "해열제", bg: "bg-butter/50" },
  { href: "/seoul", icon: "🎫", label: "서울 예약", bg: "bg-sky/40" },
];

export default function HomeMenu() {
  return (
    <section className="card p-4 md:p-5">
      <h2 className="text-base font-extrabold text-ink mb-3 px-1">🌈 전체 메뉴</h2>
      <div className="grid grid-cols-4 gap-y-4 gap-x-2">
        {MENU.map((m) => (
          <Link key={m.href} href={m.href} className="btn-pop flex flex-col items-center gap-1.5">
            <span className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl grid place-items-center text-3xl md:text-4xl shadow-soft ${m.bg}`}>
              {m.icon}
            </span>
            <span className="text-[11px] md:text-xs font-bold text-ink text-center leading-tight">{m.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
