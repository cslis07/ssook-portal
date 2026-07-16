import Link from "next/link";
import { HERO } from "@/lib/data";
import TodayPick from "@/components/TodayPick";
import BabyProfile from "@/components/BabyProfile";
import HomeMenu from "@/components/HomeMenu";
import AdSlot from "@/components/AdSlot";

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

      {/* 전체 메뉴 (아이콘 그리드 허브) */}
      <HomeMenu />

      {/* 광고 (쿠팡 파트너스) */}
      <AdSlot />

      {/* 오늘의 공공서비스 픽 */}
      <TodayPick />

      {/* 광고 (하단) */}
      <AdSlot />
    </div>
  );
}
