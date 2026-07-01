"use client";

import { useEffect, useMemo, useState } from "react";

// 이용대상(USETGTINFO 자유텍스트) → 버킷 분류 (seoul 페이지와 동일 기준)
const BUCKETS: { key: string; label: string; icon: string; kw: string[] }[] = [
  { key: "infant", label: "영유아", icon: "👶", kw: ["유아", "영유아", "어린이집", "36개월", "48개월"] },
  { key: "child", label: "아동·어린이", icon: "🧒", kw: ["아동", "어린이", "초등"] },
  { key: "teen", label: "청소년", icon: "🧑", kw: ["청소년", "중등", "고등", "중학", "고교"] },
  { key: "family", label: "가족", icon: "👨‍👩‍👧", kw: ["가족"] },
  { key: "adult", label: "성인", icon: "🧑‍💼", kw: ["성인", "어른", "일반"] },
  { key: "anyone", label: "누구나", icon: "🌈", kw: ["누구나", "제한없음", "제한 없음"] },
];

function decodeHtml(s: string): string {
  if (!s) return "";
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&middot;/g, "·");
}
function matchBucket(usetgt: string, bucketKey: string): boolean {
  const b = BUCKETS.find((x) => x.key === bucketKey);
  if (!b) return false;
  const s = usetgt || "";
  return b.kw.some((k) => s.includes(k));
}

export default function TodayPick() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [bucket, setBucket] = useState("infant");
  const [pick, setPick] = useState<any | null>(null);
  const [seed, setSeed] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/seoul-reserve?cat=all&start=1&end=1000");
        const data = await r.json();
        if (!alive) return;
        setRows(Array.isArray(data.rows) ? data.rows : []);
      } catch {
        if (alive) setError(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  const candidates = useMemo(() => {
    if (!rows) return [];
    const inBucket = rows.filter((x) => matchBucket(decodeHtml(x.USETGTINFO || ""), bucket));
    // 접수중 우선, 없으면 전체
    const open = inBucket.filter((x) => x.SVCSTATNM === "접수중");
    return open.length ? open : inBucket;
  }, [rows, bucket]);

  useEffect(() => {
    if (!candidates.length) { setPick(null); return; }
    // seed로 랜덤 선택 (Math.random은 클라이언트에서만 실행돼 안전)
    const idx = Math.floor(Math.random() * candidates.length);
    setPick(candidates[idx]);
  }, [candidates, seed]);

  return (
    <section className="card p-6 bg-gradient-to-br from-sky/30 via-lavender/20 to-rose/20">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h2 className="text-2xl font-extrabold text-ink">🎯 오늘의 공공서비스 픽</h2>
        <span className="chip bg-white/70 text-ink">서울시 공공예약</span>
      </div>
      <p className="text-sm text-ink/70 mb-3">카테고리를 고르면 오늘의 추천을 하나 뽑아드려요.</p>

      {/* 카테고리 칩 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {BUCKETS.map((b) => (
          <button
            key={b.key}
            onClick={() => { setBucket(b.key); setSeed((s) => s + 1); }}
            className={`btn-pop px-3 py-1.5 rounded-full text-sm font-bold border-2 transition ${
              bucket === b.key ? "bg-ink text-cream border-ink" : "bg-white/80 text-ink border-rose/30 hover:bg-rose/20"
            }`}
          >
            {b.icon} {b.label}
          </button>
        ))}
      </div>

      {/* 픽 카드 (광고 느낌) */}
      {error ? (
        <p className="text-sm text-ink/60 bg-white/60 rounded-2xl p-4">지금은 추천을 불러올 수 없어요. 잠시 후 다시 열어보세요.</p>
      ) : !rows ? (
        <div className="animate-pulse bg-white/60 rounded-blob h-40" />
      ) : !pick ? (
        <p className="text-sm text-ink/60 bg-white/60 rounded-2xl p-4">이 카테고리의 열린 예약을 찾지 못했어요. 다른 카테고리를 골라보세요.</p>
      ) : (
        <PickCard pick={pick} onReroll={() => setSeed((s) => s + 1)} more={candidates.length} />
      )}
    </section>
  );
}

function PickCard({ pick, onReroll, more }: { pick: any; onReroll: () => void; more: number }) {
  const img = pick.IMGURL && String(pick.IMGURL).startsWith("http") ? pick.IMGURL : "";
  const cat = decodeHtml(pick.MINCLASSNM || "").trim();
  const pay = pick.PAYATNM || "";
  const target = decodeHtml(pick.USETGTINFO || "").trim();
  const stat = pick.SVCSTATNM || "";
  const rcpt = (pick.RCPTBGNDT || pick.RCPTENDDT) ? `${(pick.RCPTBGNDT || "").slice(0, 10)} ~ ${(pick.RCPTENDDT || "").slice(0, 10)}` : "";
  const url = decodeHtml(pick.SVCURL || "");

  return (
    <div className="bg-white rounded-blob overflow-hidden border-2 border-rose/20 shadow-soft">
      <div className="md:flex">
        {/* 이미지 (없으면 그라데이션 플레이스홀더) */}
        <div className="md:w-2/5 h-40 md:h-auto min-h-[140px] relative bg-gradient-to-br from-rose/40 to-lavender/40 shrink-0">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full grid place-items-center text-5xl">🎪</div>
          )}
          {stat && (
            <span className={`absolute top-2 left-2 chip ${stat === "접수중" ? "bg-mint text-ink" : "bg-white/90 text-ink/70"}`}>{stat}</span>
          )}
        </div>
        {/* 본문 */}
        <div className="p-5 flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {cat && <span className="chip bg-lavender/50 text-ink">🏷️ {cat}</span>}
            {pay && <span className={`chip ${pay === "무료" ? "bg-mint/60" : "bg-butter/60"} text-ink`}>{pay === "무료" ? "🆓 무료" : "💳 유료"}</span>}
          </div>
          <h3 className="font-extrabold text-ink text-lg leading-snug">{decodeHtml(pick.SVCNM || "")}</h3>
          <div className="mt-2 space-y-1 text-sm text-ink/75">
            <p>📍 {decodeHtml(pick.PLACENM || "")}{pick.AREANM && ` · ${pick.AREANM}`}</p>
            {target && <p>👥 {target}</p>}
            {rcpt && <p>🗓️ 접수 {rcpt}</p>}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {url && (
              <a href={url} target="_blank" rel="noopener"
                className="btn-pop bg-ink text-cream px-4 py-2.5 rounded-full font-bold text-sm">🔗 예약하러 가기</a>
            )}
            {more > 1 && (
              <button onClick={onReroll}
                className="btn-pop bg-white border-2 border-rose/30 text-ink px-4 py-2.5 rounded-full font-bold text-sm">🎲 다른 픽 보기</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
