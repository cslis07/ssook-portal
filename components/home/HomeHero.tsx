"use client";

import Link from "next/link";
import { useBaby } from "@/lib/baby";
import { babySummary, openBabyModal } from "@/components/BabyButton";
import { BabyAvatar, IconChevronRight } from "@/components/ui2/Icons";

// 프로필 칩 — 실제 저장된 아기 정보로만 표시. 없으면 입력 유도(강제 팝업 없음)
function ProfileChip({ avatar = 48 }: { avatar?: number }) {
  const [baby, , ready] = useBaby();
  const s = babySummary(baby);
  const label = !ready ? " " : s ? `${s.name} · ${s.sub}` : "아기 정보 입력하고 맞춤 안내 받기";
  return (
    <button type="button" className="ss-chip-profile" onClick={openBabyModal}
      aria-label={s ? `${s.name}, ${s.sub}. 아기 정보 수정` : "아기 정보 입력"}>
      <BabyAvatar size={avatar} className="ss-avatar" />
      {label}
      <IconChevronRight size={16} strokeWidth={2.2} className="ml-1.5" />
    </button>
  );
}

export default function HomeHero() {
  return (
    <>
      {/* 데스크톱 히어로 — 문구·칩·CTA는 실제 DOM, 아이·해 인형·유리블록·새싹은 분리 이미지 레이어 */}
      <section className="ss-hero" aria-labelledby="ss-hero-title">
        <div className="ss-hero-art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ssook2/hero-art.webp" alt="" width={810} height={365} fetchPriority="high" />
          <span className="ss-hero-hand">오늘도<br />더 크게 자라는<br />너의 하루</span>
          <svg className="ss-hero-stroke" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3 21C12 16 22 9 37 3" />
          </svg>
          <span className="ss-hero-side">작은<br /><b>변화가 모여</b><br />아이의 큰 내일이<br />됩니다.<i /></span>
        </div>
        <div className="ss-hero-content">
          <p className="ss-eyebrow">아이와 함께 만드는 더 나은 오늘</p>
          <h1 id="ss-hero-title">우리 아이와 함께,<br />오늘도 <em>쑥쑥</em></h1>
          <p className="ss-hero-sub">아이의 오늘이 더 큰 가능성이 되는 세상,<br />아이쑥쑥이 함께합니다.</p>
          <div><ProfileChip /></div>
          <Link href="/calculator" className="ss-btn3d">맞춤 혜택 확인하기 <IconChevronRight size={18} strokeWidth={2.4} /></Link>
        </div>
      </section>

      {/* 모바일 히어로 — 원본 모바일 구도(간결한 환영 카드 + 우측 새싹 장식) */}
      <section className="ss-mhero" aria-labelledby="ss-mhero-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ssook2/mobile-hero-deco.png" alt="" className="ss-mhero-deco" aria-hidden="true" />
        <h1 id="ss-mhero-title">안녕하세요,<br />오늘도 <em>쑥쑥</em></h1>
        <p className="ss-mhero-sub">아이의 오늘이 더 큰 가능성이 되는 세상,<br />아이쑥쑥이 함께합니다.</p>
        <ProfileChip avatar={44} />
        <Link href="/calculator" className="ss-btn3d">맞춤 혜택 확인하기 <IconChevronRight size={18} strokeWidth={2.4} /></Link>
      </section>
    </>
  );
}
