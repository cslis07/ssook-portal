"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BabyButton from "@/components/BabyButton";
import MenuSheet from "@/components/ui2/MenuSheet";
import { NAV_GROUPS, groupOf } from "@/lib/nav";
import { IconBell, IconChevronDown, IconSearch } from "@/components/ui2/Icons";

// UI 2.0 헤더 — 로고 · 홈/혜택·지원금/성장·육아/우리동네/생활·의료 · 검색/알림/프로필
// 검색·알림은 아직 해당 기능이 없어 각각 '전체 메뉴'·'신청 할 일'로 연결 (UI_AUDIT_BEFORE §5)
export default function NavBar() {
  const pathname = usePathname();
  const active = groupOf(pathname);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => { setOpenGroup(null); setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenGroup(null); };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <header className="ss-header">
      <Link href="/" className="ss-logo" aria-label="아이쑥쑥 홈">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ssook2/logo-sprout.png" alt="" width={30} height={30} />
        <span>아이쑥쑥</span>
      </Link>

      <nav ref={navRef} className="ss-nav" aria-label="주 메뉴">
        <Link href="/" className="ss-nav-btn" aria-current={pathname === "/" ? "page" : undefined}>홈</Link>
        {NAV_GROUPS.map((g) => (
          <div key={g.id} className="ss-nav-item">
            <button
              type="button"
              className={`ss-nav-btn${active === g.id ? " is-active" : ""}`}
              aria-expanded={openGroup === g.id}
              aria-haspopup="true"
              onClick={(e) => { e.stopPropagation(); setOpenGroup(openGroup === g.id ? null : g.id); }}
            >
              {g.label}
              <IconChevronDown size={14} strokeWidth={2} className="opacity-50" />
            </button>
            {openGroup === g.id && (
              <div className="ss-dropdown">
                {g.items.map((it) => (
                  <Link key={it.href} href={it.href} aria-current={pathname === it.href ? "page" : undefined}>
                    <b>{it.label}</b>
                    {it.desc && <small>{it.desc}</small>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="ss-header-right">
        <button type="button" className="ss-icon-btn ss-search-btn" aria-label="전체 메뉴 열기" title="메뉴 찾기" onClick={() => setMenuOpen(true)}>
          <IconSearch />
        </button>
        <Link href="/timeline" className="ss-icon-btn" aria-label="신청 할 일" title="신청 할 일">
          <IconBell />
        </Link>
        <BabyButton />
      </div>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
