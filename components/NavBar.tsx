"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BabyButton from "@/components/BabyButton";

type Item = { href: string; label: string; icon: string; external?: boolean };
type Group = { id: string; label: string; icon: string; items: Item[] };

const GROUPS: Group[] = [
  {
    id: "money",
    label: "지원금·신청",
    icon: "💰",
    items: [
      { href: "/timeline", label: "신청 타임라인", icon: "📅" },
      { href: "/support", label: "지원금 총정리", icon: "💝" },
      { href: "/localgov", label: "지자체 지원금", icon: "🏘️" },
      { href: "/calculator", label: "지원금 계산기", icon: "🧮" },
      { href: "/utility", label: "공과금 혜택", icon: "💡" },
    ],
  },
  {
    id: "baby",
    label: "아기 키우기",
    icon: "👶",
    items: [
      { href: "/calendar", label: "개월별 가이드", icon: "👶" },
      { href: "/growth", label: "월령별 성장", icon: "🌷" },
      { href: "/checklist", label: "준비물 체크리스트", icon: "🎀" },
    ],
  },
  {
    id: "life",
    label: "생활·의료",
    icon: "🗺️",
    items: [
      { href: "/local", label: "우리 동네", icon: "🗺️" },
      { href: "/medical", label: "의료 / 약국", icon: "🏥" },
      { href: "/fever", label: "해열제 용량", icon: "🌡️" },
      { href: "/seoul", label: "공공서비스예약", icon: "🎫" },
    ],
  },
];

const GUIDE: Item = { href: "/guide.html", label: "이용가이드", icon: "📖", external: true };

export default function NavBar() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // 라우트 변경 시 닫기
  useEffect(() => { setOpenGroup(null); }, [pathname]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const isActiveGroup = (g: Group) => g.items.some((it) => pathname === it.href);

  return (
    <header ref={navRef} className="sticky top-0 z-50 backdrop-blur bg-cream/85 border-b-2 border-rose/30">
      <nav className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2">
        {/* 좌측: 홈 버튼(모바일 전용 — 데스크톱은 메뉴에 🏠 홈 있음) + 아기 정보 버튼 */}
        <Link href="/" aria-label="홈으로"
          className="btn-pop md:hidden w-9 h-9 grid place-items-center rounded-full bg-white border-2 border-rose/30 text-base shrink-0">
          🏠
        </Link>
        <BabyButton />

        {/* 우측 클러스터 */}
        <div className="ml-auto flex items-center gap-1">
          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" active={pathname === "/"}>🏠 홈</NavLink>
            {GROUPS.map((g) => (
              <div key={g.id} className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenGroup(openGroup === g.id ? null : g.id); }}
                  className={`btn-pop px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    openGroup === g.id || isActiveGroup(g) ? "bg-rose/40 text-ink" : "text-ink hover:bg-rose/25"
                  }`}
                >
                  <span className="mr-1">{g.icon}</span>{g.label}
                  <span className="ml-1 text-xs opacity-60">▾</span>
                </button>
                {openGroup === g.id && (
                  <div className="absolute right-0 mt-2 w-52 card p-2 shadow-pop z-50">
                    {g.items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                          pathname === it.href ? "bg-rose/30 text-ink" : "text-ink hover:bg-rose/15"
                        }`}
                      >
                        <span>{it.icon}</span>{it.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 이용가이드 버튼 (항상 노출 — 구 햄버거 자리) */}
          <a href={GUIDE.href}
            className="btn-pop flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-white border-2 border-rose/30 text-ink hover:bg-rose/15 whitespace-nowrap">
            <span>📖</span><span>이용가이드</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`btn-pop px-3 py-1.5 rounded-full text-sm font-semibold transition ${
        active ? "bg-rose/40 text-ink" : "text-ink hover:bg-rose/25"
      }`}
    >
      {children}
    </Link>
  );
}
