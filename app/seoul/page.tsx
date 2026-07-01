"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/regions";
import Pager from "@/components/Pager";

const PAGE_SIZE = 20;

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

  async function search() {
    setStatus({ msg: "조회 중…", type: "loading" });
    setItems([]);
    setPage(1);
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
        <div className="pb-8">
          <p className="text-xs text-ink/50 px-1 mb-2">{items.length.toLocaleString()}건 · {page}/{Math.ceil(items.length / PAGE_SIZE)}페이지</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((it, i) => <SeoulCard key={i} it={it} />)}
          </div>
          <Pager
            page={page}
            totalPages={Math.ceil(items.length / PAGE_SIZE)}
            onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
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
  const rcpt = (it.RCPTBGNDT || it.RCPTENDDT) ? `${(it.RCPTBGNDT || "").slice(0, 16)} ~ ${(it.RCPTENDDT || "").slice(0, 16)}` : "";
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>{decodeHtml(it.SVCNM || "")}</h3>
        {statNm && <span className={`med-bed ${statCls}`}>{statNm}</span>}
      </div>
      <p className="addr">📍 {decodeHtml(it.PLACENM || "")}{it.AREANM && ` · ${it.AREANM}`}</p>
      {rcpt && <p className="meta">🗓️ 접수 {rcpt}</p>}
      {it.PAYATNM && <p className="meta">{it.PAYATNM}{it.USETGTINFO && ` · ${decodeHtml(it.USETGTINFO)}`}</p>}
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
