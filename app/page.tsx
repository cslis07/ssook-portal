import Link from "next/link";
import { HERO } from "@/lib/data";
import TodayPick from "@/components/TodayPick";
import BabyProfile from "@/components/BabyProfile";

// 홈 바로가기 — 부모가 자주 쓰는 기능 (딥링크 포함)
const SHORTCUTS = [
  { href: "/fever", icon: "🌡️", title: "해열제 용량", desc: "몸무게별 복용량", color: "bg-rose/40" },
  { href: "/medical?tab=drug", icon: "💊", title: "약 안전 검색", desc: "임신·수유·아기 주의", color: "bg-mint/50" },
  { href: "/medical?tab=night", icon: "🌙", title: "심야·응급", desc: "문 연 약국·응급실", color: "bg-peach/60" },
  { href: "/local", icon: "🗺️", title: "우리 동네", desc: "어린이집·예방접종", color: "bg-lavender/50" },
  { href: "/calendar", icon: "👶", title: "개월별 가이드", desc: "발달·접종·꿀팁", color: "bg-butter/60" },
  { href: "/checklist", icon: "🎀", title: "준비물 체크", desc: "꼭·나중에·주의", color: "bg-sky/50" },
  { href: "/growth", icon: "🌷", title: "월령별 성장", desc: "이른둥이~36개월", color: "bg-mint/40" },
  { href: "/utility", icon: "💡", title: "공과금 혜택", desc: "전기·가스·난방", color: "bg-lavender/40" },
];

export default function Home() {
  return (
    <div className="space-y-6">
      {/* HERO (컴팩트) */}
      <section className="relative overflow-hidden card px-5 py-5 md:px-7 md:py-6 dotbg">
        <div className="absolute -top-4 -right-3 text-5xl opacity-25 pointer-events-none">🌷</div>
        <div className="relative">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink">
              {HERO.brand} <span className="text-rose">🌱</span>
            </h1>
            <span className="chip bg-rose/40 text-ink">2026 기준 · 최신</span>
          </div>
          <p className="mt-1 text-sm md:text-base text-ink/70 font-semibold">{HERO.tagline} · {HERO.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/timeline" className="btn-pop bg-ink text-cream px-4 py-2 rounded-full text-sm font-bold shadow-soft">
              📅 신청 타임라인
            </Link>
            <Link href="/calculator" className="btn-pop bg-white border-2 border-ink/10 text-ink px-4 py-2 rounded-full text-sm font-bold">
              🧮 지원금 계산
            </Link>
            <Link href="/support" className="btn-pop bg-rose text-white px-4 py-2 rounded-full text-sm font-bold shadow-soft">
              💝 핵심 지원금
            </Link>
          </div>
        </div>
      </section>

      {/* 아기 프로필 (개인화) */}
      <BabyProfile />

      {/* 바로가기 그리드 */}
      <section>
        <h2 className="text-lg font-extrabold text-ink mb-2 px-1">🚀 바로가기</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
          {SHORTCUTS.map((s) => (
            <Link key={s.href} href={s.href} className={`btn-pop card p-3 md:p-4 text-center ${s.color}`}>
              <div className="text-3xl md:text-4xl">{s.icon}</div>
              <div className="font-extrabold text-ink text-xs md:text-sm mt-1.5 leading-tight">{s.title}</div>
              <div className="text-[10px] md:text-xs text-ink/60 mt-0.5 leading-snug hidden sm:block">{s.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 오늘의 공공서비스 픽 */}
      <TodayPick />
    </div>
  );
}
