import Link from "next/link";

const links = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/timeline", label: "신청 타임라인", icon: "📅" },
  { href: "/support", label: "지원금 총정리", icon: "💝" },
  { href: "/calendar", label: "개월별 가이드", icon: "👶" },
  { href: "/growth", label: "월령별 성장", icon: "🌷" },
  { href: "/checklist", label: "준비물", icon: "🎀" },
  { href: "/utility", label: "공과금 혜택", icon: "💡" },
  { href: "/calculator", label: "계산기", icon: "🧮" },
  { href: "/local", label: "우리 동네", icon: "🗺️" },
  { href: "/medical", label: "의료/약국", icon: "🏥" },
  { href: "/seoul", label: "서울 예약", icon: "🎫" },
  { href: "/guide.html", label: "이용가이드", icon: "📖", external: true },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-cream/80 border-b-2 border-rose/30">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-ink text-xl">
          <span className="inline-block w-9 h-9 rounded-full bg-rose grid place-items-center shadow-soft">
            <span className="text-lg">🌱</span>
          </span>
          <span>쑥쑥 포털</span>
        </Link>
        <div className="flex gap-1 flex-wrap ml-auto">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                className="btn-pop px-3 py-1.5 rounded-full text-sm font-semibold text-ink hover:bg-rose/30 transition"
              >
                <span className="mr-1">{l.icon}</span>
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="btn-pop px-3 py-1.5 rounded-full text-sm font-semibold text-ink hover:bg-rose/30 transition"
              >
                <span className="mr-1">{l.icon}</span>
                {l.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
