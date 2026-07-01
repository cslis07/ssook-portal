"use client";

import { useEffect, useMemo, useState } from "react";
import { LOCAL_FEATURES } from "@/lib/local-data";
import { CHILDCARE_REGIONS } from "@/lib/childcare-regions";
import Pager from "@/components/Pager";

type Feature = (typeof LOCAL_FEATURES)[number];
type Result = { source: string; notice?: string; items: any[]; total?: number; page?: number; pageSize?: number };

const CLIENT_SIZE = 12; // 클라이언트 분할 페이지 크기

export default function LocalPage() {
  const [active, setActive] = useState<Feature | null>(null);
  const [sido, setSido] = useState("");
  const [guName, setGuName] = useState("");
  const [arcode, setArcode] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [clientPage, setClientPage] = useState(1); // 클라이언트 분할용(어린이집·교통사고)

  const guList = useMemo(() => CHILDCARE_REGIONS[sido] || [], [sido]);
  const hasRegion = !!sido && !!guName;
  const regionLabel = hasRegion ? `${sido} ${guName}` : "";

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ssook-region-v2");
      if (raw) {
        const o = JSON.parse(raw);
        if (o.sido) setSido(o.sido);
        if (o.guName) setGuName(o.guName);
        if (o.arcode) setArcode(o.arcode);
      }
    } catch {}
  }, []);

  const pickGu = (code: string) => {
    const gu = guList.find((g) => g.arcode === code);
    setArcode(code);
    setGuName(gu?.name || "");
    try { localStorage.setItem("ssook-region-v2", JSON.stringify({ sido, guName: gu?.name || "", arcode: code })); } catch {}
  };
  const pickSido = (s: string) => {
    setSido(s);
    setGuName("");
    setArcode("");
  };

  // 서버 페이지네이션 대상: 예방접종(clinic)
  const isServerPaged = (f: Feature | null) => f?.id === "clinic";

  const search = async (f: Feature, page = 1) => {
    if (f.endpoint.startsWith("http")) { window.open(f.endpoint, "_blank"); return; }
    setLoading(true);
    if (page === 1) { setResult(null); setClientPage(1); }
    try {
      const url = new URL(f.endpoint, window.location.origin);
      if (f.searchType === "sigungu") {
        if (f.regionParam === "arcode") url.searchParams.set("arcode", arcode);
        else url.searchParams.set("region", guName);
      }
      if (f.searchType === "keyword" && keyword) url.searchParams.set("q", keyword);
      if (isServerPaged(f)) url.searchParams.set("page", String(page));
      const r = await fetch(url);
      const data: Result = await r.json();
      setResult({ ...data, page });
    } catch (e: any) {
      setResult({ source: "error", notice: e.message, items: [] });
    }
    setLoading(false);
  };

  const open = (f: Feature) => {
    setResult(null);
    setKeyword("");
    setClientPage(1);
    if (f.endpoint.startsWith("http")) { window.open(f.endpoint, "_blank"); return; }
    setActive(f);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <header className="px-1">
        <span className="chip bg-sky/60 text-ink">우리 동네</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-ink mt-2">🗺️ 내 주변 아기 정보</h1>
        <p className="text-ink/70 mt-1 text-sm md:text-base">
          어린이집·놀이터·예방접종·안전정보를 한 곳에서.
        </p>
      </header>

      {/* REGION PICKER — 전국 시도 → 시군구 */}
      <div className="card p-4 md:p-5">
        <label className="text-xs md:text-sm font-bold text-ink/60 mb-2 block">📍 우리 동네 선택</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:max-w-lg">
          <select
            value={sido}
            onChange={(e) => pickSido(e.target.value)}
            className="p-3 rounded-2xl border-2 border-rose/30 bg-white text-ink font-semibold"
          >
            <option value="">시·도</option>
            {Object.keys(CHILDCARE_REGIONS).map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select
            value={arcode}
            onChange={(e) => pickGu(e.target.value)}
            disabled={!sido}
            className="p-3 rounded-2xl border-2 border-rose/30 bg-white text-ink font-semibold disabled:opacity-50"
          >
            <option value="">시·군·구</option>
            {guList.map((g) => (<option key={g.arcode} value={g.arcode}>{g.name}</option>))}
          </select>
        </div>
        {hasRegion && (
          <p className="text-xs text-ink/60 mt-2">✓ <b>{regionLabel}</b> 기준으로 검색됩니다 (다음에도 기억해요)</p>
        )}
      </div>

      {/* FEATURE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {LOCAL_FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => open(f)}
            className={`btn-pop card p-4 md:p-5 text-left ${f.color}`}
          >
            <div className="text-4xl md:text-5xl mb-2">{f.icon}</div>
            <div className="font-extrabold text-ink text-sm md:text-base leading-tight">{f.title}</div>
            <div className="text-xs text-ink/65 mt-1 leading-snug">{f.desc}</div>
          </button>
        ))}
      </div>

      {/* SHEET */}
      {active && !active.endpoint.startsWith("http") && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-end md:items-center justify-center" onClick={() => setActive(null)}>
          <div
            className="bg-cream w-full max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto rounded-t-blob md:rounded-blob p-5 md:p-7"
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
                {hasRegion ? (
                  <button
                    onClick={() => search(active)}
                    className="w-full btn-pop bg-rose text-white p-3 rounded-2xl font-bold"
                  >📍 {regionLabel} 에서 찾기</button>
                ) : (
                  <p className="text-sm text-ink/60 p-3 bg-butter/40 rounded-2xl">먼저 위에서 우리 동네(시·도 → 시·군·구)를 선택해주세요.</p>
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
                ) : (() => {
                  const serverPaged = isServerPaged(active);
                  const pageSize = result.pageSize || CLIENT_SIZE;
                  const total = result.total ?? result.items.length;
                  const cur = serverPaged ? (result.page || 1) : clientPage;
                  const totalPages = Math.max(1, Math.ceil(total / pageSize));
                  const shown = serverPaged
                    ? result.items
                    : result.items.slice((clientPage - 1) * CLIENT_SIZE, clientPage * CLIENT_SIZE);
                  return (
                    <>
                      <p className="text-xs text-ink/50 px-1">총 {total.toLocaleString()}건 · {cur}/{totalPages}페이지</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {shown.map((it: any, i: number) => (
                          <ResultCard key={i} feature={active.id} item={it} />
                        ))}
                      </div>
                      <Pager
                        page={cur}
                        totalPages={totalPages}
                        loading={loading}
                        onPage={(p) => {
                          if (serverPaged) search(active, p);
                          else { setClientPage(p); }
                        }}
                      />
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card p-4 bg-lavender/30 text-xs text-ink/70">
        <b>ℹ️ 데이터 안내</b><br />
        어린이집은 <b>아이사랑(childcare.go.kr)</b> 실시간 데이터로 전국 조회돼요.
        놀이터·예방접종·교통사고 등 일부 정보는 정부 API 키(<code className="bg-white px-1 rounded">DATA_API_KEY</code>)가 있으면 실데이터,
        없으면 샘플로 표시됩니다.
      </div>
    </div>
  );
}

function ResultCard({ feature, item }: { feature: string; item: any }) {
  if (feature === "daycare") {
    return (
      <div className="card p-3">
        <div className="font-extrabold text-ink">{item.name}</div>
        {item.capacity && <div className="text-xs text-rose font-bold mt-0.5">정원 {item.capacity}명</div>}
        {item.address && <div className="text-xs text-ink/70 mt-1">📍 {item.address}</div>}
        {item.tel && <div className="text-xs text-ink/70">☎ {item.tel}</div>}
        {item.home && <a href={item.home.startsWith("http") ? item.home : `https://${item.home}`} target="_blank" rel="noopener" className="text-xs text-sky underline">홈페이지 →</a>}
      </div>
    );
  }
  if (feature === "clinic") {
    return (
      <div className="card p-3">
        <div className="font-extrabold text-ink">{item.name}</div>
        <div className="text-xs text-ink/70 mt-1">📍 {item.address}</div>
        {item.tel && <div className="text-xs text-ink/70">☎ {item.tel}</div>}
        {item.vaccines && <div className="text-xs text-mint font-bold mt-1">💉 {item.vaccines}</div>}
      </div>
    );
  }
  if (feature === "playground") {
    return (
      <div className="card p-3">
        <div className="font-extrabold text-ink">{item.name}</div>
        {item.grade && <div className="text-xs text-mint font-bold mt-0.5">등급 {item.grade}{item.lastCheck ? ` · 점검 ${item.lastCheck}` : ""}</div>}
        {item.facilities && <div className="text-xs text-ink/70 mt-1">🎠 {item.facilities}</div>}
        {item.address && <div className="text-xs text-ink/70">📍 {item.address}</div>}
      </div>
    );
  }
  if (feature === "accident") {
    return (
      <div className="card p-3">
        <div className="font-extrabold text-ink">⚠️ {item.location}</div>
        <div className="text-xs text-rose font-bold mt-0.5">{item.year}년 사고 {item.accidents}건 · 부상 {item.injured}명 · 사망 {item.deaths}명</div>
        {item.type && <div className="text-xs text-ink/60 mt-1">{item.type}</div>}
      </div>
    );
  }
  if (feature === "snack") {
    return (
      <div className="card p-3">
        <div className="font-extrabold text-ink">{item.product}</div>
        <div className="text-xs text-rose mt-0.5">{item.maker}{item.category ? ` · ${item.category}` : ""}</div>
        {(item.certDate || item.expireDate) && <div className="text-xs text-ink/70 mt-1">인증 {item.certDate} ~ {item.expireDate}</div>}
      </div>
    );
  }
  return null;
}
