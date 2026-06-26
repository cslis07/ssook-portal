"use client";

import { useEffect, useMemo, useState } from "react";
import { REGIONS, SEVERE_TYPES } from "@/lib/regions";

type TabId = "er" | "hospital" | "pharmacy" | "night" | "aed" | "screening" | "seoul";

const TABS: { id: TabId; label: string; icon: string; color: string }[] = [
  { id: "er", label: "응급실", icon: "🚑", color: "bg-rose/40" },
  { id: "hospital", label: "병·의원", icon: "🏥", color: "bg-mint/40" },
  { id: "pharmacy", label: "약국", icon: "💊", color: "bg-lavender/40" },
  { id: "night", label: "심야약국", icon: "🌙", color: "bg-sky/40" },
  { id: "aed", label: "AED", icon: "❤️‍🩹", color: "bg-peach/50" },
  { id: "screening", label: "선별진료소", icon: "🩺", color: "bg-butter/50" },
  { id: "seoul", label: "서울 예약", icon: "🎫", color: "bg-rose/30" },
];

const ER_MODES = [
  { id: "realtime", label: "실시간 가용병상", op: "getEmrrmRltmUsefulSckbdInfoInqire", sigunguRequired: true },
  { id: "trauma", label: "🚨 외상센터", op: "getStrmListInfoInqire", sigunguRequired: false },
  { id: "severe", label: "🆘 중증질환 수용", op: "getSrsillDissAceptncPosblInfoInqire", sigunguRequired: true },
];

const HOSPITAL_MODES = [
  { id: "all", label: "전체 병·의원", op: "getHsptlMdcncListInfoInqire" },
  { id: "baby", label: "🌙 달빛어린이병원", op: "getBabyListInfoInqire" },
];

const SEOUL_CATS = [
  { id: "all", label: "전체" },
  { id: "medical", label: "🩺 진료" },
  { id: "culture", label: "🎭 문화" },
  { id: "education", label: "📚 교육" },
  { id: "sport", label: "⚽ 체육" },
  { id: "institution", label: "🏛️ 시설" },
];

export default function MedicalPage() {
  const [tab, setTab] = useState<TabId>("er");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [keyword, setKeyword] = useState("");
  const [erMode, setErMode] = useState(ER_MODES[0].id);
  const [hospMode, setHospMode] = useState(HOSPITAL_MODES[0].id);
  const [seoulCat, setSeoulCat] = useState(SEOUL_CATS[0].id);
  const [severeType, setSevereType] = useState("");
  const [seoulGu, setSeoulGu] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("ssook-medical-region");
      if (s) {
        const [a, b] = s.split("|");
        if (a) setSido(a);
        if (b) setSigungu(b);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("ssook-medical-region", `${sido}|${sigungu}`); } catch {}
  }, [sido, sigungu]);

  const sigunguList = useMemo(() => REGIONS[sido] || [], [sido]);

  async function search() {
    setLoading(true);
    setResult(null);
    try {
      let url = "";
      if (tab === "er") {
        const m = ER_MODES.find((x) => x.id === erMode)!;
        const p = new URLSearchParams({ service: "emergency", op: m.op });
        if (erMode === "trauma") {
          if (sido) p.set("Q0", sido);
          if (sigungu) p.set("Q1", sigungu);
          p.set("ORD", "NAME");
        } else {
          if (!sigungu) { alert("시·군·구까지 선택해주세요"); setLoading(false); return; }
          p.set("STAGE1", sido);
          p.set("STAGE2", sigungu);
          if (erMode === "severe" && severeType) p.set("SM_TYPE", severeType);
        }
        url = `/api/medical?${p}`;
      } else if (tab === "hospital") {
        const m = HOSPITAL_MODES.find((x) => x.id === hospMode)!;
        const p = new URLSearchParams({ service: "hospital", op: m.op });
        if (sido) p.set("Q0", sido);
        if (sigungu) p.set("Q1", sigungu);
        if (keyword && hospMode === "all") p.set("QN", keyword);
        p.set("ORD", "NAME");
        url = `/api/medical?${p}`;
      } else if (tab === "pharmacy") {
        const p = new URLSearchParams({ service: "pharmacy", op: "getParmacyListInfoInqire" });
        if (sido) p.set("Q0", sido);
        if (sigungu) p.set("Q1", sigungu);
        if (keyword) p.set("QN", keyword);
        p.set("ORD", "NAME");
        url = `/api/medical?${p}`;
      } else if (tab === "night") {
        const p = new URLSearchParams();
        if (sido) p.set("sido", sido);
        if (sigungu) p.set("sigungu", sigungu);
        url = `/api/night-pharmacy?${p}`;
      } else if (tab === "aed") {
        const p = new URLSearchParams();
        if (sido) p.set("sido", sido);
        if (sigungu) p.set("sigungu", sigungu);
        url = `/api/aed?${p}`;
      } else if (tab === "screening") {
        url = `/api/screening-clinic`;
      } else if (tab === "seoul") {
        url = `/api/seoul-reserve?cat=${seoulCat}&start=1&end=50`;
      }
      const r = await fetch(url);
      const data = await r.json();
      setResult({ ...data, _gu: seoulGu });
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <header className="px-1">
        <span className="chip bg-rose/40 text-ink">공공의료 정보</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-ink mt-2">🏥 우리 가족 의료 찾기</h1>
        <p className="text-ink/70 text-sm md:text-base mt-1">응급실·병의원·약국·AED·심야약국·서울예약</p>
      </header>

      {/* TAB BAR (모바일: 가로 스크롤 / PC: 줄바꿈 그리드) */}
      <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex md:flex-wrap gap-2 min-w-max md:min-w-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setResult(null); }}
              className={`btn-pop px-4 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold whitespace-nowrap ${
                tab === t.id ? "bg-ink text-cream shadow-soft" : `${t.color} text-ink`
              }`}
            >
              <span className="mr-1">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* REGION (서울예약·선별진료소 제외) */}
      {tab !== "seoul" && tab !== "screening" && (
        <div className="card p-4 md:p-5 space-y-2">
          <label className="text-xs md:text-sm font-bold text-ink/60 block">📍 지역 선택</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select value={sido} onChange={(e) => { setSido(e.target.value); setSigungu(""); }}
              className="p-3 rounded-2xl border-2 border-rose/30 bg-white font-semibold">
              <option value="">시·도</option>
              {Object.keys(REGIONS).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sigungu} onChange={(e) => setSigungu(e.target.value)}
              className="p-3 rounded-2xl border-2 border-rose/30 bg-white font-semibold" disabled={!sido}>
              <option value="">전체</option>
              {sigunguList.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* TAB-SPECIFIC CONTROLS */}
      {tab === "er" && (
        <div className="card p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {ER_MODES.map((m) => (
              <button key={m.id} onClick={() => setErMode(m.id)}
                className={`btn-pop px-3 py-1.5 rounded-full text-xs font-bold ${
                  erMode === m.id ? "bg-rose text-white" : "bg-white border-2 border-rose/30 text-ink"
                }`}>{m.label}</button>
            ))}
          </div>
          {erMode === "severe" && (
            <select value={severeType} onChange={(e) => setSevereType(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-rose/30 bg-white">
              <option value="">중증질환 전체</option>
              {Object.entries(SEVERE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          )}
        </div>
      )}

      {tab === "hospital" && (
        <div className="card p-4 space-y-3">
          <div className="flex gap-2">
            {HOSPITAL_MODES.map((m) => (
              <button key={m.id} onClick={() => setHospMode(m.id)}
                className={`btn-pop px-3 py-1.5 rounded-full text-xs font-bold ${
                  hospMode === m.id ? "bg-mint text-ink" : "bg-white border-2 border-mint/40 text-ink"
                }`}>{m.label}</button>
            ))}
          </div>
          {hospMode === "all" && (
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
              placeholder="병원명 (선택)" className="w-full p-3 rounded-2xl border-2 border-mint/30 bg-white" />
          )}
        </div>
      )}

      {tab === "pharmacy" && (
        <div className="card p-4">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="약국명 (선택)" className="w-full p-3 rounded-2xl border-2 border-lavender/40 bg-white" />
        </div>
      )}

      {tab === "seoul" && (
        <div className="card p-4">
          <label className="text-xs font-bold text-ink/60 block mb-2">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {SEOUL_CATS.map((c) => (
              <button key={c.id} onClick={() => setSeoulCat(c.id)}
                className={`btn-pop px-3 py-1.5 rounded-full text-xs font-bold ${
                  seoulCat === c.id ? "bg-rose text-white" : "bg-white border-2 border-rose/30 text-ink"
                }`}>{c.label}</button>
            ))}
          </div>
          <p className="text-xs text-ink/60 mt-3">서울 자치구 결과를 받은 후 자치구별로 필터링됩니다.</p>
        </div>
      )}

      <button onClick={search} disabled={loading}
        className="w-full md:max-w-xs md:mx-auto block btn-pop bg-ink text-cream py-4 rounded-2xl font-extrabold text-base disabled:opacity-60">
        {loading ? "불러오는 중..." : "🔍 검색하기"}
      </button>

      {/* RESULTS */}
      {result && (
        <div className="space-y-2">
          {result.error && <p className="card p-3 bg-rose/30 text-ink text-sm">⚠️ {result.error}</p>}
          {result.notice && <p className="card p-3 bg-butter/40 text-ink text-xs">ℹ️ {result.notice}</p>}
          {result.source === "live" && <p className="text-xs text-mint font-bold">● 실시간 데이터</p>}
          <div className="grid md:grid-cols-2 gap-2">
            <Results tab={tab} data={result} />
          </div>
        </div>
      )}

      <div className="card p-4 bg-rose/15 text-xs text-ink/70">
        <b>🆘 응급시 119</b> · 실시간 정보는 의료기관 입력 시점 기준이며 실제와 다를 수 있어요.
      </div>
    </div>
  );
}

function Results({ tab, data }: { tab: TabId; data: any }) {
  const items: any[] = data.items || data.rows || [];
  if (!items.length && !data.error) return <p className="text-center text-ink/50 py-6">결과 없음</p>;

  if (tab === "er") {
    return <>{items.map((x, i) => (
      <div key={i} className="card p-3">
        <div className="font-extrabold text-ink">{x.dutyName || x.hpid || "-"}</div>
        {x.dutyAddr && <div className="text-xs text-ink/70 mt-1">📍 {x.dutyAddr}</div>}
        {x.dutyTel3 && <div className="text-xs text-ink/70">☎ 응급 {x.dutyTel3}</div>}
        {x.hvec !== undefined && <div className="text-xs text-rose font-bold mt-1">응급실 가용 {x.hvec} · 일반 {x.hv27 ?? "-"} · 소아 {x.hv28 ?? "-"}</div>}
      </div>
    ))}</>;
  }
  if (tab === "hospital" || tab === "pharmacy") {
    return <>{items.map((x, i) => (
      <div key={i} className="card p-3">
        <div className="font-extrabold text-ink">{x.dutyName}</div>
        <div className="text-xs text-ink/70 mt-1">📍 {x.dutyAddr}</div>
        {x.dutyTel1 && <div className="text-xs text-ink/70">☎ {x.dutyTel1}</div>}
        {x.dutyDivNam && <div className="text-xs text-rose mt-1">{x.dutyDivNam}</div>}
      </div>
    ))}</>;
  }
  if (tab === "night") {
    return <>{items.map((x, i) => (
      <div key={i} className="card p-3">
        <div className="font-extrabold text-ink">{x.name}</div>
        <div className="text-xs text-ink/70 mt-1">📍 {x.address}</div>
        <div className="text-xs text-ink/70">☎ {x.tel}</div>
        <div className="text-xs text-sky font-bold mt-1">🌙 오늘 마감 {fmtTime(x.todayClose)}</div>
      </div>
    ))}</>;
  }
  if (tab === "aed") {
    return <>{items.map((x, i) => (
      <div key={i} className="card p-3">
        <div className="font-extrabold text-ink">❤️ {x.name}</div>
        <div className="text-xs text-ink/70 mt-1">📍 {x.address || x.place}</div>
        {x.tel && <div className="text-xs text-ink/70">☎ {x.tel}</div>}
      </div>
    ))}</>;
  }
  if (tab === "screening") {
    return <>
      {items.map((x: any, i: number) => (
        <div key={i} className="card p-3">
          <div className="font-extrabold text-ink">🩺 {x.name}</div>
          <div className="text-xs text-ink/70 mt-1">📍 {x.address}</div>
          <div className="text-xs text-ink/70">☎ {x.tel}</div>
          <div className="text-xs text-mint font-bold mt-1">🕐 {x.hours}</div>
        </div>
      ))}
      {data.links && (
        <div className="card p-3 bg-mint/20 text-xs">
          {data.links.map((l: any) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="block text-ink underline">{l.label}</a>
          ))}
        </div>
      )}
    </>;
  }
  if (tab === "seoul") {
    const filtered = data._gu ? items.filter((x: any) => (x.AREANM || "").includes(data._gu)) : items;
    return <>{filtered.slice(0, 50).map((x: any, i: number) => (
      <div key={i} className="card p-3">
        <div className="font-extrabold text-ink text-sm">{x.SVCNM || x.SVCNAME}</div>
        <div className="text-xs text-rose mt-0.5">{x.AREANM} · {x.PLACENM}</div>
        <div className="text-xs text-ink/70 mt-1">접수 {x.SVCOPNBGNDT?.slice(0,10)} ~ {x.SVCOPNENDDT?.slice(0,10)}</div>
        <div className="text-xs text-mint font-bold mt-1">{x.SVCSTATNM} · {x.PAYATNM}</div>
        {x.SVCURL && <a href={x.SVCURL} target="_blank" rel="noopener" className="text-xs text-sky underline mt-1 inline-block">예약하러 가기 →</a>}
      </div>
    ))}</>;
  }
  return null;
}

function fmtTime(t: string) {
  if (!t || t.length < 4) return "-";
  return `${t.slice(0,2)}:${t.slice(2,4)}`;
}
