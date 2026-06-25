"use client";

import { useEffect, useState } from "react";
import { LOCAL_FEATURES, SIGUNGU_TOP } from "@/lib/local-data";

type Feature = (typeof LOCAL_FEATURES)[number];

export default function LocalPage() {
  const [active, setActive] = useState<Feature | null>(null);
  const [region, setRegion] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ source: string; notice?: string; items: any[] } | null>(null);
  const [savedRegion, setSavedRegion] = useState("");

  useEffect(() => {
    try {
      const r = localStorage.getItem("ssook-region") || "";
      setSavedRegion(r);
      setRegion(r);
    } catch {}
  }, []);

  const saveRegion = (r: string) => {
    setRegion(r);
    setSavedRegion(r);
    try { localStorage.setItem("ssook-region", r); } catch {}
  };

  const search = async (f: Feature) => {
    if (f.endpoint.startsWith("http")) { window.open(f.endpoint, "_blank"); return; }
    setLoading(true);
    setResult(null);
    try {
      const url = new URL(f.endpoint, window.location.origin);
      if (f.searchType === "sigungu" && region) url.searchParams.set("region", region.split(" ").pop() || region);
      if (f.searchType === "keyword" && keyword) url.searchParams.set("q", keyword);
      const r = await fetch(url);
      setResult(await r.json());
    } catch (e: any) {
      setResult({ source: "error", notice: e.message, items: [] });
    }
    setLoading(false);
  };

  const open = (f: Feature) => {
    setActive(f);
    setResult(null);
    setKeyword("");
    if (f.endpoint.startsWith("http")) {
      window.open(f.endpoint, "_blank");
      setActive(null);
    }
  };

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <header className="px-1">
        <span className="chip bg-sky/60 text-ink">우리 동네</span>
        <h1 className="text-2xl font-extrabold text-ink mt-2">🗺️ 내 주변 아기 정보</h1>
        <p className="text-ink/70 mt-1 text-sm">
          어린이집·놀이터·예방접종·안전정보를 한 곳에서.
        </p>
      </header>

      {/* REGION PICKER */}
      <div className="card p-4">
        <label className="text-xs font-bold text-ink/60 mb-2 block">📍 우리 동네 선택</label>
        <select
          value={savedRegion}
          onChange={(e) => saveRegion(e.target.value)}
          className="w-full p-3 rounded-2xl border-2 border-rose/30 bg-white text-ink font-semibold text-base"
        >
          <option value="">시군구를 선택해주세요</option>
          {SIGUNGU_TOP.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        {savedRegion && (
          <p className="text-xs text-ink/60 mt-2">✓ <b>{savedRegion}</b> 기준으로 검색됩니다 (다음에도 기억해요)</p>
        )}
      </div>

      {/* FEATURE GRID */}
      <div className="grid grid-cols-2 gap-3">
        {LOCAL_FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => open(f)}
            className={`btn-pop card p-4 text-left ${f.color}`}
          >
            <div className="text-4xl mb-2">{f.icon}</div>
            <div className="font-extrabold text-ink text-sm leading-tight">{f.title}</div>
            <div className="text-xs text-ink/65 mt-1 leading-snug">{f.desc}</div>
          </button>
        ))}
      </div>

      {/* SHEET */}
      {active && !active.endpoint.startsWith("http") && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-end md:items-center justify-center" onClick={() => setActive(null)}>
          <div
            className="bg-cream w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-blob md:rounded-blob p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{active.icon}</span>
                <h2 className="font-extrabold text-ink text-lg">{active.title}</h2>
              </div>
              <button onClick={() => setActive(null)} className="text-ink/60 text-2xl leading-none px-2">×</button>
            </div>
            <p className="text-xs text-ink/60 mb-3">출처 · {active.apiSource}</p>

            {active.searchType === "keyword" ? (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="제품명을 입력하세요"
                  className="flex-1 p-3 rounded-2xl border-2 border-rose/30 bg-white"
                />
                <button
                  onClick={() => search(active)}
                  className="btn-pop bg-rose text-white px-4 rounded-2xl font-bold whitespace-nowrap"
                >검색</button>
              </div>
            ) : (
              <div className="mb-3">
                {region ? (
                  <button
                    onClick={() => search(active)}
                    className="w-full btn-pop bg-rose text-white p-3 rounded-2xl font-bold"
                  >📍 {region} 에서 찾기</button>
                ) : (
                  <p className="text-sm text-ink/60 p-3 bg-butter/40 rounded-2xl">먼저 위에서 우리 동네를 선택해주세요.</p>
                )}
              </div>
            )}

            {loading && <p className="text-center text-ink/60 py-6">불러오는 중...</p>}

            {result && (
              <div className="space-y-2">
                {result.notice && (
                  <p className="text-xs text-ink/70 bg-butter/40 p-2 rounded-xl">ℹ️ {result.notice}</p>
                )}
                {result.source === "live" && (
                  <p className="text-xs text-mint bg-mint/20 p-2 rounded-xl">● 실시간 데이터</p>
                )}
                {result.items.length === 0 ? (
                  <p className="text-center text-ink/60 py-4">결과가 없어요.</p>
                ) : (
                  result.items.map((it: any, i: number) => (
                    <ResultCard key={i} feature={active.id} item={it} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card p-4 bg-lavender/30 text-xs text-ink/70">
        <b>ℹ️ 실시간 데이터 안내</b><br />
        대부분의 정부 API는 사용자별 인증키가 필요해요. 키 없이는 샘플 데이터로 화면을 보여드립니다.
        실시간 데이터를 원하면 Vercel 환경변수 <code className="bg-white px-1 rounded">DATA_API_KEY</code> 에
        data.go.kr 일반 인증키를 설정해주세요.
      </div>
    </div>
  );
}

function ResultCard({ feature, item }: { feature: string; item: any }) {
  return (
    <div className="card p-3">
      {feature === "daycare" && (
        <>
          <div className="font-extrabold text-ink">{item.name}</div>
          <div className="text-xs text-rose font-bold mt-0.5">{item.type} · 정원 {item.capacity} / 현원 {item.current}</div>
          <div className="text-xs text-ink/70 mt-1">📍 {item.address}</div>
          {item.tel && <div className="text-xs text-ink/70">☎ {item.tel}</div>}
        </>
      )}
      {feature === "clinic" && (
        <>
          <div className="font-extrabold text-ink">{item.name}</div>
          <div className="text-xs text-ink/70 mt-1">📍 {item.address}</div>
          {item.tel && <div className="text-xs text-ink/70">☎ {item.tel}</div>}
          <div className="text-xs text-mint mt-1 font-bold">💉 {item.vaccines}</div>
        </>
      )}
      {feature === "playground" && (
        <>
          <div className="font-extrabold text-ink">{item.name}</div>
          <div className="text-xs text-mint font-bold mt-0.5">등급: {item.grade} · 점검 {item.lastCheck}</div>
          <div className="text-xs text-ink/70 mt-1">🎠 {item.facilities}</div>
          <div className="text-xs text-ink/70">📍 {item.address}</div>
        </>
      )}
      {feature === "accident" && (
        <>
          <div className="font-extrabold text-ink">⚠️ {item.location}</div>
          <div className="text-xs text-rose font-bold mt-0.5">{item.year}년 사고 {item.accidents}건 · 부상 {item.injured}명 · 사망 {item.deaths}명</div>
          <div className="text-xs text-ink/60 mt-1">{item.type}</div>
        </>
      )}
      {feature === "snack" && (
        <>
          <div className="font-extrabold text-ink">{item.product}</div>
          <div className="text-xs text-rose mt-0.5">{item.maker} · {item.category}</div>
          <div className="text-xs text-ink/70 mt-1">인증 {item.certDate} ~ {item.expireDate}</div>
        </>
      )}
    </div>
  );
}
