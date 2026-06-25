"use client";

import { useState } from "react";
import { GROWTH } from "@/lib/growth";

export default function GrowthPage() {
  const [active, setActive] = useState(GROWTH[0].id);
  const cur = GROWTH.find((g) => g.id === active)!;

  return (
    <div className="space-y-6">
      <header>
        <span className="chip bg-lavender/60 text-ink">월령별 성장 및 돌보기</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">🌷 우리 아기 발달 가이드</h1>
        <p className="text-ink/70 mt-2">이른둥이부터 36개월까지 — 시기별 성장·발달·놀이·주의 신호</p>
      </header>

      {/* TAB BAR */}
      <div className="card p-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {GROWTH.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={`btn-pop px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                active === g.id
                  ? "bg-rose text-white shadow-soft"
                  : "bg-white text-ink hover:bg-rose/20"
              }`}
            >
              <span className="mr-1">{g.icon}</span>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="card p-6 bg-peach/40">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{cur.icon}</div>
          <div>
            <h2 className="text-2xl font-extrabold text-ink">{cur.label}</h2>
            <p className="text-xs text-ink/60 mt-1">출처: {cur.source}</p>
          </div>
        </div>
      </div>

      {/* SPECIAL (이른둥이) */}
      {cur.special && (
        <div className="grid md:grid-cols-2 gap-4">
          {cur.special.map((s) => (
            <div key={s.title} className={`card p-5 ${s.title.includes("응급") ? "bg-rose/20" : ""}`}>
              <h3 className="font-extrabold text-ink mb-3">{s.title}</h3>
              <ul className="space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-2 text-ink/85 text-sm">
                    <span className="text-rose">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* GROWTH TABLE */}
      {cur.growth && (
        <div className="card p-6 bg-butter/30">
          <h3 className="font-extrabold text-ink mb-3">📏 성장 (평균치)</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {cur.growth.boys && (
              <div className="bg-white rounded-2xl p-4">
                <div className="text-xs text-sky font-bold mb-1">남아 👦</div>
                <div className="text-ink font-semibold">{cur.growth.boys}</div>
              </div>
            )}
            {cur.growth.girls && (
              <div className="bg-white rounded-2xl p-4">
                <div className="text-xs text-rose font-bold mb-1">여아 👧</div>
                <div className="text-ink font-semibold">{cur.growth.girls}</div>
              </div>
            )}
          </div>
          {cur.growth.note && <p className="text-xs text-ink/60 mt-3">💡 {cur.growth.note}</p>}
        </div>
      )}

      {/* DEVELOPMENT */}
      {cur.development && (
        <div>
          <h3 className="text-xl font-extrabold text-ink mb-3">🌱 발달</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {cur.development.motor && <DevCard label="운동" emoji="🏃" text={cur.development.motor} color="bg-mint/40" />}
            {cur.development.cognitive && <DevCard label="인지" emoji="🧠" text={cur.development.cognitive} color="bg-lavender/40" />}
            {cur.development.language && <DevCard label="언어" emoji="💬" text={cur.development.language} color="bg-peach/40" />}
            {cur.development.social && <DevCard label="사회·정서" emoji="💕" text={cur.development.social} color="bg-rose/30" />}
            {cur.development.senses && <DevCard label="감각" emoji="👀" text={cur.development.senses} color="bg-sky/40" />}
          </div>
        </div>
      )}

      {/* FEEDING / SLEEP / SAFETY 한 줄짜리 */}
      <div className="grid md:grid-cols-3 gap-3">
        {cur.feeding && (
          <div className="card p-5">
            <div className="font-extrabold text-ink mb-1">🍼 수유·식사</div>
            <p className="text-sm text-ink/80">{cur.feeding}</p>
          </div>
        )}
        {cur.sleep && (
          <div className="card p-5">
            <div className="font-extrabold text-ink mb-1">😴 수면</div>
            <p className="text-sm text-ink/80">{cur.sleep}</p>
          </div>
        )}
        {cur.safety && (
          <div className="card p-5 bg-butter/40">
            <div className="font-extrabold text-ink mb-1">🛡️ 안전</div>
            <p className="text-sm text-ink/80">{cur.safety}</p>
          </div>
        )}
      </div>

      {/* PLAY */}
      {cur.play && cur.play.length > 0 && (
        <div className="card p-6 bg-mint/30">
          <h3 className="font-extrabold text-ink mb-3">🎈 추천 놀이</h3>
          <div className="flex flex-wrap gap-2">
            {cur.play.map((p) => (
              <span key={p} className="chip bg-white text-ink">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* WARNING SIGNS */}
      {cur.warningSigns && cur.warningSigns.length > 0 && (
        <div className="card p-6 bg-rose/20">
          <h3 className="font-extrabold text-ink mb-3">⚠️ 이런 경우 소아과 상담</h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {cur.warningSigns.map((w) => (
              <li key={w} className="flex gap-2 text-ink/85 text-sm">
                <span className="text-rose font-bold">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink/60 mt-3">
            발달 속도는 아이마다 달라요. 걱정되면 영유아 건강검진이나 소아과에서 확인해보세요.
          </p>
        </div>
      )}
    </div>
  );
}

function DevCard({ label, emoji, text, color }: { label: string; emoji: string; text: string; color: string }) {
  return (
    <div className={`card p-5 ${color}`}>
      <div className="font-extrabold text-ink mb-1">{emoji} {label}</div>
      <p className="text-sm text-ink/85">{text}</p>
    </div>
  );
}
