"use client";

import { useMemo, useState } from "react";
import { REGIONS } from "@/lib/regions";
import Pager from "@/components/Pager";

const PAGE_SIZE = 20;

// 이용대상(USETGTINFO 자유텍스트) → 버킷 분류
const TARGET_BUCKETS: { key: string; label: string; kw: string[] }[] = [
  { key: "infant", label: "👶 영유아", kw: ["유아", "영유아", "어린이집", "36개월", "48개월"] },
  { key: "child", label: "🧒 아동·어린이", kw: ["아동", "어린이", "초등"] },
  { key: "teen", label: "🧑 청소년", kw: ["청소년", "중등", "고등", "중학", "고교"] },
  { key: "family", label: "👨‍👩‍👧 가족", kw: ["가족"] },
  { key: "adult", label: "🧑‍💼 성인", kw: ["성인", "어른", "일반"] },
  { key: "anyone", label: "🌈 누구나", kw: ["누구나", "제한없음", "제한 없음"] },
];
function targetKeys(usetgt: string): string[] {
  const s = usetgt || "";
  return TARGET_BUCKETS.filter((b) => b.kw.some((k) => s.includes(k))).map((b) => b.key);
}

const SORTS = [
  { key: "recent", label: "접수 시작 최신순" },
  { key: "open", label: "접수중 먼저" },
  { key: "name", label: "이름순" },
];

const SEOUL_CATS = [
  { id: "all", label: "전체" },
  { id: "medical", label: "🩺 진료" },
  { id: "culture", label: "🎭 문화행사" },
  { id: "education", label: "📚 교육" },
  { id: "sport", label: "⚽ 체육시설" },
  { id: "institution", label: "🏛️ 시설대관" },
];

const SEOUL_GU = REGIONS["서울특별시"] || [];

export default function SeoulReservePage() {
  const [cat, setCat] = useState("all");
  const [area, setArea] = useState("");
  const [stat, setStat] = useState("");
  const [kw, setKw] = useState("");
  const [status, setStatus] = useState<{ msg: string; type?: "ok" | "warn" | "error" | "loading" }>({ msg: "" });
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  // 결과 내 세부 필터/정렬
  const [fCat, setFCat] = useState("");     // 카테고리(MINCLASSNM)
  const [fPay, setFPay] = useState("");     // 무료/유료
  const [fTarget, setFTarget] = useState(""); // 대상 버킷
  const [fStat, setFStat] = useState("");   // 상태
  const [sortBy, setSortBy] = useState("recent");

  const resetSubFilters = () => { setFCat(""); setFPay(""); setFTarget(""); setFStat(""); setSortBy("recent"); };

  // 결과에서 옵션 목록 추출
  const catOptions = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((x) => { const c = decodeHtml(x.MINCLASSNM || "").trim(); if (c) m.set(c, (m.get(c) || 0) + 1); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);
  const statOptions = useMemo(() => {
    const s = new Set<string>();
    items.forEach((x) => { if (x.SVCSTATNM) s.add(x.SVCSTATNM); });
    return [...s];
  }, [items]);

  // 필터 + 정렬 적용
  const filtered = useMemo(() => {
    let r = items;
    if (fCat) r = r.filter((x) => decodeHtml(x.MINCLASSNM || "").trim() === fCat);
    if (fPay) r = r.filter((x) => (x.PAYATNM || "") === fPay);
    if (fStat) r = r.filter((x) => (x.SVCSTATNM || "") === fStat);
    if (fTarget) r = r.filter((x) => targetKeys(decodeHtml(x.USETGTINFO || "")).includes(fTarget));
    const arr = [...r];
    if (sortBy === "name") arr.sort((a, b) => decodeHtml(a.SVCNM || "").localeCompare(decodeHtml(b.SVCNM || "")));
    else if (sortBy === "open") arr.sort((a, b) => (a.SVCSTATNM === "접수중" ? 0 : 1) - (b.SVCSTATNM === "접수중" ? 0 : 1));
    else arr.sort((a, b) => String(b.RCPTBGNDT || "").localeCompare(String(a.RCPTBGNDT || "")));
    return arr;
  }, [items, fCat, fPay, fStat, fTarget, sortBy]);

  async function search() {
    setStatus({ msg: "조회 중…", type: "loading" });
    setItems([]);
    setPage(1);
    resetSubFilters();
    try {
      const r = await fetch(`/api/seoul-reserve?cat=${cat}&start=1&end=1000`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      let rows: any[] = data.rows || [];
      if (area) rows = rows.filter((x) => x.AREANM === area);
      if (stat) rows = rows.filter((x) => (x.SVCSTATNM || "") === stat);
      if (kw) rows = rows.filter((x) => decodeHtml(x.SVCNM || "").includes(kw));
      if (!rows.length) return setStatus({ msg: "조회 결과가 없습니다. (필터를 완화해 보세요)", type: "warn" });
      setItems(rows);
      setStatus({ msg: `전체 ${data.total}건 · 조건 일치 ${rows.length}건`, type: "ok" });
    } catch (e: any) {
      setStatus({ msg: `오류: ${e.message}`, type: "error" });
    }
  }

  return (
    <div className="med-root space-y-5 max-w-5xl mx-auto">
      <header className="px-1">
        <span className="chip bg-sky/60 text-ink">서울 공공서비스 예약</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-ink mt-2">🎫 서울시 공공서비스 예약</h1>
        <p className="text-ink/70 text-sm md:text-base mt-1">진료·문화·교육·체육·시설대관까지 한 곳에서</p>
      </header>

      <div className="med-card space-y-4">
        <div>
          <div className="med-group-label mb-2">카테고리</div>
          <div className="flex flex-wrap gap-2">
            {SEOUL_CATS.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`med-tab ${cat === c.id ? "active" : ""}`}>{c.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="med-field">
            <label>자치구</label>
            <select className="med-input" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="">전체</option>
              {SEOUL_GU.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="med-field">
            <label>접수상태</label>
            <select className="med-input" value={stat} onChange={(e) => setStat(e.target.value)}>
              <option value="">전체</option>
              <option value="접수중">접수중만</option>
            </select>
          </div>
          <div className="med-field md:col-span-2">
            <label>서비스명 <span className="text-ink/40">(선택)</span></label>
            <input className="med-input" type="text" value={kw}
              onChange={(e) => setKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="예: 테니스장, 강좌, 의료" />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button className="med-search-btn" onClick={search}>조회</button>
          </div>
        </div>
      </div>

      {status.msg && <div className={`med-status ${status.type || ""}`}>{status.msg}</div>}

      {items.length > 0 && (
        <div className="pb-8 space-y-3">
          {/* 결과 내 세부 필터 · 정렬 */}
          <div className="med-card p-3 md:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="med-group-label">🔎 결과 정렬 · 필터</span>
              {(fCat || fPay || fTarget || fStat) && (
                <button onClick={() => { resetSubFilters(); setPage(1); }}
                  className="text-xs text-rose font-bold underline">필터 초기화</button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <select className="med-input !text-sm" value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <select className="med-input !text-sm" value={fCat}
                onChange={(e) => { setFCat(e.target.value); setPage(1); }}>
                <option value="">전체 카테고리</option>
                {catOptions.map(([c, n]) => <option key={c} value={c}>{c} ({n})</option>)}
              </select>
              <select className="med-input !text-sm" value={fTarget}
                onChange={(e) => { setFTarget(e.target.value); setPage(1); }}>
                <option value="">전체 대상</option>
                {TARGET_BUCKETS.map((b) => <option key={b.key} value={b.key}>{b.label}</option>)}
              </select>
              <select className="med-input !text-sm" value={fPay}
                onChange={(e) => { setFPay(e.target.value); setPage(1); }}>
                <option value="">무료·유료</option>
                <option value="무료">무료</option>
                <option value="유료">유료</option>
              </select>
              <select className="med-input !text-sm" value={fStat}
                onChange={(e) => { setFStat(e.target.value); setPage(1); }}>
                <option value="">전체 상태</option>
                {statOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-ink/60 py-6">선택한 조건에 맞는 예약이 없어요. 필터를 완화해보세요.</p>
          ) : (
            <>
              <p className="text-xs text-ink/50 px-1">
                {filtered.length.toLocaleString()}건{filtered.length !== items.length ? ` (전체 ${items.length}건 중)` : ""} · {page}/{Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}페이지
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((it, i) => <SeoulCard key={i} it={it} />)}
              </div>
              <Pager
                page={page}
                totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
                onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            </>
          )}
        </div>
      )}

      <footer className="text-xs text-ink/60 border-t border-rose/20 pt-3">
        출처: 서울 열린데이터광장 (openapi.seoul.go.kr) · 상위 1,000건 내에서 필터 적용
      </footer>
    </div>
  );
}

function SeoulCard({ it }: { it: any }) {
  const statNm = it.SVCSTATNM || "";
  const statCls = statNm === "접수중" ? "ok" : "full";
  const rcpt = (it.RCPTBGNDT || it.RCPTENDDT) ? `${(it.RCPTBGNDT || "").slice(0, 10)} ~ ${(it.RCPTENDDT || "").slice(0, 10)}` : "";
  const cat = decodeHtml(it.MINCLASSNM || "").trim();
  const pay = it.PAYATNM || "";
  const target = decodeHtml(it.USETGTINFO || "").trim();
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>{decodeHtml(it.SVCNM || "")}</h3>
        {statNm && <span className={`med-bed ${statCls}`}>{statNm}</span>}
      </div>
      {/* 배지: 카테고리 · 무료/유료 */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {cat && <span className="med-chip">🏷️ {cat}</span>}
        {pay && <span className={`med-chip ${pay === "무료" ? "" : "chip-no"}`}>{pay === "무료" ? "🆓 무료" : "💳 유료"}</span>}
      </div>
      <p className="addr mt-1">📍 {decodeHtml(it.PLACENM || "")}{it.AREANM && ` · ${it.AREANM}`}</p>
      {target && <p className="meta">👥 대상 · {target}</p>}
      {rcpt && <p className="meta">🗓️ 접수 {rcpt}</p>}
      {it.SVCURL && (
        <div className="med-actions">
          <a className="med-btn tel" href={decodeHtml(it.SVCURL)} target="_blank" rel="noopener">🔗 예약 페이지</a>
        </div>
      )}
    </article>
  );
}

function decodeHtml(s: string): string {
  if (!s) return "";
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&middot;/g, "·");
}
