import Link from "next/link";
import { HERO } from "@/lib/data";
import TodayPick from "@/components/TodayPick";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden card p-8 md:p-12 dotbg">
        <div className="absolute -top-6 -right-6 text-7xl opacity-30">🌷</div>
        <div className="absolute -bottom-6 -left-6 text-7xl opacity-20">🌼</div>
        <div className="relative">
          <span className="chip bg-rose/40 text-ink">2026 기준 · 최신</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-ink leading-tight">
            {HERO.brand} <span className="text-rose">🌱</span>
          </h1>
          <p className="mt-2 text-lg md:text-xl text-ink/80 font-semibold">{HERO.tagline}</p>
          <p className="mt-1 text-ink/60">{HERO.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/timeline" className="btn-pop bg-ink text-cream px-5 py-3 rounded-full font-bold shadow-soft">
              📅 신청 타임라인 보기
            </Link>
            <Link href="/calculator" className="btn-pop bg-white border-2 border-ink/10 text-ink px-5 py-3 rounded-full font-bold">
              🧮 내 지원금 계산하기
            </Link>
            <Link href="/support" className="btn-pop bg-rose text-white px-5 py-3 rounded-full font-bold shadow-soft">
              💝 핵심 지원금 한눈에
            </Link>
          </div>
        </div>
      </section>

      {/* 오늘의 공공서비스 픽 */}
      <TodayPick />
    </div>
  );
}
