import { UTILITY } from "@/lib/data";

const colorMap: Record<string, string> = {
  butter: "bg-butter/50",
  peach: "bg-peach/60",
  rose: "bg-rose/40",
  lavender: "bg-lavender/50",
  mint: "bg-mint/50",
  sky: "bg-sky/60",
};

export default function UtilityPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="chip bg-butter/60 text-ink">공과금 혜택</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">💡 전기·가스·난방 감면</h1>
        <p className="text-ink/70 mt-2">신청해야 적용돼요. 출생신고 당일 함께 신청하는 게 안전합니다.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {UTILITY.map((u) => (
          <div key={u.name} className={`card p-6 ${colorMap[u.color]}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl">{u.icon}</div>
              <h3 className="font-extrabold text-ink text-lg">{u.name}</h3>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-bold text-ink/60">대상</dt>
                <dd className="text-ink">{u.target}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink/60">혜택</dt>
                <dd className="text-rose font-bold">{u.discount}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink/60">기간</dt>
                <dd className="text-ink">{u.period}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink/60">신청</dt>
                <dd className="text-ink">{u.apply}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink/70 bg-white/60 rounded-xl p-2">{u.warning}</p>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-rose/20">
        <h3 className="font-extrabold text-ink mb-2">⚠️ 중복 적용 주의</h3>
        <p className="text-ink/80 text-sm">
          여러 자격이 있어도 복지할인은 보통 <b>가장 높은 1가지만</b> 적용됩니다.
          이사하면 새 주소지에서 <b>재신청</b>이 필요해요.
        </p>
      </div>
    </div>
  );
}
