// UI 2.0 선형 아이콘 (의존성 없이 인라인 SVG). 장식용은 aria-hidden.
type P = { size?: number; className?: string; strokeWidth?: number };

function S({ size = 22, className, strokeWidth = 1.8, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

export const IconSearch = (p: P) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></S>;
export const IconBell = (p: P) => <S {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20a2 2 0 0 0 4 0" /></S>;
export const IconChevronDown = (p: P) => <S {...p}><path d="m6 9 6 6 6-6" /></S>;
export const IconChevronRight = (p: P) => <S {...p}><path d="m9 6 6 6-6 6" /></S>;
export const IconClose = (p: P) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>;
export const IconHome = (p: P) => <S {...p}><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></S>;
export const IconGift = (p: P) => <S {...p}><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M4 12h16M12 8v12" /><path d="M12 8S10.5 4 8.5 4.5 7.5 8 12 8ZM12 8s1.5-4 3.5-3.5S16.5 8 12 8Z" /></S>;
export const IconSprout = (p: P) => <S {...p}><path d="M12 20v-8" /><path d="M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6Z" /><path d="M12 13c0-3 2.2-5.5 6.5-5.5 0 3-2.2 5.5-6.5 5.5Z" /></S>;
export const IconPin = (p: P) => <S {...p}><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></S>;
export const IconUser = (p: P) => <S {...p}><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></S>;
export const IconMenu = (p: P) => <S {...p}><path d="M4 7h16M4 12h16M4 17h16" /></S>;

// 기본 아바타 — 사진 대신 비식별 일러스트 (DESIGN_SPEC 5.3)
export function BabyAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ssAvBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE6D3" />
          <stop offset="1" stopColor="#FFD0B5" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#ssAvBg)" />
      <circle cx="24" cy="26" r="13" fill="#FFF3EA" />
      <path d="M17 16c2-4 9-5 12-1 1.5 2-1 4-3 2.5-1.4-1-3.2-1.6-5-.6-1.7.9-3.6.2-4-.9Z" fill="#8A5A44" />
      <circle cx="19.5" cy="26" r="1.5" fill="#3B2A2A" />
      <circle cx="28.5" cy="26" r="1.5" fill="#3B2A2A" />
      <path d="M20.5 30.5c1.9 1.6 5.1 1.6 7 0" stroke="#3B2A2A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="17" cy="29.5" r="1.6" fill="#FFB9A6" opacity=".7" />
      <circle cx="31" cy="29.5" r="1.6" fill="#FFB9A6" opacity=".7" />
    </svg>
  );
}
