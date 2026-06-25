import Link from "next/link";
import { HERO, SUPPORTS, MISS_TOP7 } from "@/lib/data";

const QUICK = [
  { href: "/timeline", title: "신청 타임라인", desc: "임신 확인부터 출산 후 6개월까지", icon: "📅", color: "bg-rose/40" },
  { href: "/support", title: "지원금 총정리", desc: "현금·바우처·휴직 모두 한 눈에", icon: "💝", color: "bg-peach/60" },
  { href: "/calendar", title: "개월별 가이드", desc: "0~24개월 발달·접종·꿀팁", icon: "👶", color: "bg-lavender/60" },
  { href: "/checklist", title: "준비물 체크리스트", desc: "꼭·나중에·사지 마세요", icon: "🎀", color: "bg-mint/60" },
  { href: "/utility", title: "공과금 혜택", desc: "전기·가스·난방 감면", icon: "💡", color: "bg-butter/60" },
  { href: "/calculator", title: "지원금 계산기", desc: "내가 받을 금액 합산", icon: "🧮", color: "bg-sky/60" },
];

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
          </div>
        </div>
      </section>

      {/* QUICK CARDS */}
      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-4">🎈 빠른 메뉴</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {QUICK.map((q) => (
            <Link key={q.href} href={q.href} className={`btn-pop card p-6 ${q.color}`}>
              <div className="text-4xl mb-2">{q.icon}</div>
              <div className="font-extrabold text-ink text-lg">{q.title}</div>
              <div className="text-sm text-ink/70 mt-1">{q.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP 지원금 */}
      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-4">💝 핵심 지원금 한눈에</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {SUPPORTS.slice(0, 6).map((s) => (
            <div key={s.key} className="card p-5 flex items-start gap-4">
              <div className="text-3xl">{s.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-ink">{s.name}</h3>
                  <span className="chip bg-lavender/60 text-ink">{s.category}</span>
                </div>
                <div className="text-rose font-bold mt-1">{s.amount}</div>
                <p className="text-sm text-ink/70 mt-1">{s.detail}</p>
                <p className="text-xs text-ink/50 mt-1">신청 · {s.apply}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/support" className="inline-block mt-4 text-ink/70 hover:text-rose font-semibold">
          전체 지원금 보기 →
        </Link>
      </section>

      {/* 가장 많이 놓치는 7가지 */}
      <section className="card p-6 bg-butter/30">
        <h2 className="text-2xl font-extrabold text-ink mb-3">⚠️ 가장 많이 놓치는 7가지</h2>
        <ol className="space-y-2">
          {MISS_TOP7.map((m, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 grid place-items-center rounded-full bg-rose text-white font-bold text-sm shrink-0">{i + 1}</span>
              <span className="text-ink/80">{m}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
