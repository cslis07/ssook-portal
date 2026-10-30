"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { groupOf } from "@/lib/nav";
import MenuSheet from "./MenuSheet";
import { IconGift, IconHome, IconMedical, IconSprout, IconUser } from "./Icons";

// 모바일 하단 5탭: 홈 / 혜택 / 성장 / 생활(의료) / 내 정보. 899px 이하에서만 보임 (우리 동네 기능 제거로 동네 → 생활)
const TABS = [
  { key: "home", href: "/", label: "홈", Icon: IconHome },
  { key: "benefit", href: "/support", label: "혜택", Icon: IconGift },
  { key: "grow", href: "/calendar", label: "성장", Icon: IconSprout },
  { key: "life", href: "/medical", label: "생활", Icon: IconMedical },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const active = groupOf(pathname);
  const [meOpen, setMeOpen] = useState(false);
  useEffect(() => setMeOpen(false), [pathname]);

  return (
    <>
      <nav className="ss-tabbar" aria-label="하단 메뉴">
        {TABS.map(({ key, href, label, Icon }) => (
          <Link key={key} href={href} className="ss-tab" aria-current={active === key ? "page" : undefined}>
            <Icon size={24} strokeWidth={active === key ? 2.1 : 1.7} />
            {label}
          </Link>
        ))}
        <button type="button" className="ss-tab" onClick={() => setMeOpen(true)} aria-haspopup="dialog">
          <IconUser size={24} strokeWidth={1.7} />
          내 정보
        </button>
      </nav>
      <MenuSheet open={meOpen} onClose={() => setMeOpen(false)} withMe />
    </>
  );
}
