"use client";

import { useEffect, useMemo, useState } from "react";
import { REGIONS, SEVERE_TYPES } from "@/lib/regions";
import Pager from "@/components/Pager";

type TabId = "medical" | "drug" | "aed" | "night" | "screening";
type ModeId =
  | "realtime" | "erNearby" | "trauma" | "severe"
  | "hospitalAll" | "baby"
  | "pharmacyRegion" | "phNearby";

type Mode = {
  id: ModeId;
  group: string;
  service: "emergency" | "hospital" | "pharmacy";
  label: string;
  input: "region" | "geo";
  op: string;
  sigunguRequired?: boolean;
  keyword?: boolean;
  hint?: string;
};

const MEDICAL_MODES: Mode[] = [
  { id: "realtime", group: "🚑 응급실", service: "emergency", label: "실시간 가용병상", input: "region", op: "getEmrrmRltmUsefulSckbdInfoInqire", sigunguRequired: true, hint: "※ 실시간 가용병상은 시/군/구까지 선택해야 조회됩니다. (병상 정렬·여유/포화 필터 가능)" },
  { id: "erNearby", group: "🚑 응급실", service: "emergency", label: "📍 내 주변", input: "geo", op: "getEgytLcinfoInqire" },
  { id: "trauma", group: "🚑 응급실", service: "emergency", label: "🚨 외상센터", input: "region", op: "getStrmListInfoInqire" },
  { id: "severe", group: "🚑 응급실", service: "emergency", label: "🆘 중증질환 수용", input: "region", op: "getSrsillDissAceptncPosblInfoInqire", sigunguRequired: true, hint: "🆘 시/군/구까지 선택하세요. 특정 중증질환 수용 병원만 보려면 질환을 선택하세요." },
  { id: "hospitalAll", group: "🏥 병·의원", service: "hospital", label: "병·의원", input: "region", op: "getHsptlMdcncListInfoInqire", keyword: true },
  { id: "baby", group: "🏥 병·의원", service: "hospital", label: "🌙 달빛어린이병원", input: "region", op: "getBabyListInfoInqire", hint: "🌙 달빛어린이병원은 야간·휴일 소아 진료 기관입니다." },
  { id: "pharmacyRegion", group: "💊 약국", service: "pharmacy", label: "지역 검색", input: "region", op: "getParmacyListInfoInqire", keyword: true },
  { id: "phNearby", group: "💊 약국", service: "pharmacy", label: "📍 내 주변", input: "geo", op: "getParmacyLcinfoInqire" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "medical", label: "🏥 의료" },
  { id: "drug", label: "💊 약 안전" },
  { id: "aed", label: "❤️ AED" },
  { id: "night", label: "🌙 심야약국" },
  { id: "screening", label: "🩺 선별진료소" },
];

export default function MedicalPage() {
  const [tab, setTab] = useState<TabId>("medical");
  const [modeId, setModeId] = useState<ModeId>("realtime");
  const mode = useMemo(() => MEDICAL_MODES.find((m) => m.id === modeId)!, [modeId]);

  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [keyword, setKeyword] = useState("");
  const [bedSort, setBedSort] = useState<"" | "free" | "full">("");
  const [severeType, setSevereType] = useState("");
  const [drugQ, setDrugQ] = useState(""); // 약 안전 검색어

  const [status, setStatus] = useState<{ msg: string; type?: "ok" | "warn" | "error" | "loading" }>({ msg: "" });
  const [items, setItems] = useState<any[]>([]);
  // 페이지네이션
  const [clientPage, setClientPage] = useState(1); // 목록 표시용(20/페이지)
  const [srvPage, setSrvPage] = useState(1);        // 병의원·약국 서버 페이지
  const [srvTotal, setSrvTotal] = useState(0);
  const PAGE_SIZE = 20;

  // 서버 페이지네이션 대상(대량 목록): 병·의원, 약국(지역)
  const isServerPaged = modeId === "hospitalAll" || modeId === "pharmacyRegion";

  const sigunguList = useMemo(() => REGIONS[sido] || [], [sido]);

  // URL ?tab= 로 딥링크 진입 (예: /medical?tab=drug)
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t && ["medical", "drug", "aed", "night", "screening"].includes(t)) setTab(t as TabId);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ssook-med-region");
      if (raw) {
        const [a, b] = raw.split("|");
        if (a) setSido(a);
        if (b) setSigungu(b);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("ssook-med-region", `${sido}|${sigungu}`); } catch {}
  }, [sido, sigungu]);

  function setMode(id: ModeId) {
    setModeId(id);
    setItems([]);
    setStatus({ msg: "" });
    setClientPage(1);
    setSrvPage(1);
    setSrvTotal(0);
  }

  async function searchRegion(page = 1) {
    if (!sido) return setStatus({ msg: "시/도를 선택하세요.", type: "warn" });
    if (mode.sigunguRequired && !sigungu) return setStatus({ msg: "이 조회는 시/군/구를 선택해야 합니다.", type: "warn" });
    const serverPaged = mode.id === "hospitalAll" || mode.id === "pharmacyRegion";
    // 서버 페이지네이션: 20건씩. 그 외(응급실·중증)는 정렬/필터 위해 100건 받아 클라이언트 분할.
    const params: Record<string, string> = {
      service: mode.service, op: mode.op,
      numOfRows: serverPaged ? String(PAGE_SIZE) : "100",
      pageNo: serverPaged ? String(page) : "1",
    };
    if (mode.id === "realtime" || mode.id === "severe") {
      params.STAGE1 = sido;
      params.STAGE2 = sigungu;
      if (mode.id === "severe" && severeType) params.SM_TYPE = severeType;
    } else {
      params.Q0 = sido;
      if (sigungu) params.Q1 = sigungu;
      params.ORD = "NAME";
      if (mode.keyword && keyword) params.QN = keyword;
    }
    if (serverPaged) setSrvPage(page);
    await runQuery(params);
  }

  function searchGeo() {
    if (!navigator.geolocation) return setStatus({ msg: "이 브라우저는 위치 기능을 지원하지 않습니다.", type: "error" });
    setStatus({ msg: "위치 확인 중…", type: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => runQuery({
        service: mode.service, op: mode.op, numOfRows: "50",
        WGS84_LON: String(pos.coords.longitude),
        WGS84_LAT: String(pos.coords.latitude),
      }, true),
      (err) => setStatus({ msg: `위치 가져오기 실패: ${err.message}`, type: "error" }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function runQuery(params: Record<string, string>, sortByDistance = false) {
    setStatus({ msg: "조회 중…", type: "loading" });
    setItems([]);
    setClientPage(1);
    try {
      const qs = new URLSearchParams(params).toString();
      const r = await fetch(`/api/medical?${qs}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      if (data.resultCode && data.resultCode !== "00") throw new Error(`API [${data.resultCode}] ${data.resultMsg}`);
      let list: any[] = data.items || [];
      if (!list.length) return setStatus({ msg: "조회 결과가 없습니다.", type: "warn" });
      if (sortByDistance) list = [...list].sort((a, b) => num(a.distance) - num(b.distance));
      let note = "";
      if (mode.id === "realtime") {
        const free = (x: any) => num(x.hvec) > 0;
        if (bedSort === "free") { list = list.filter(free); note = "여유 병원만"; }
        else if (bedSort === "full") { list = list.filter((x) => !free(x)); note = "포화 병원만"; }
        list = [...list].sort((a, b) => (num(b.hvec) || -1) - (num(a.hvec) || -1));
        if (!list.length) return setStatus({ msg: "해당 조건의 병원이 없습니다.", type: "warn" });
      }
      setItems(list);
      setSrvTotal(Number(data.totalCount) || list.length);
      setStatus({ msg: `총 ${data.totalCount ?? list.length}건${note ? " · " + note : ""}`, type: "ok" });
    } catch (e: any) {
      setStatus({ msg: `오류: ${e.message}`, type: "error" });
    }
  }

  async function searchDrug(page = 1) {
    const q = drugQ.trim();
    if (!q) return setStatus({ msg: "약 이름을 입력하세요. (예: 타이레놀, 판콜)", type: "warn" });
    setStatus({ msg: "조회 중…", type: "loading" });
    if (page === 1) { setItems([]); setClientPage(1); }
    setSrvPage(page);
    try {
      const r = await fetch(`/api/drug?q=${encodeURIComponent(q)}&page=${page}`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      const list: any[] = data.items || [];
      if (!list.length) return setStatus({ msg: "검색 결과가 없어요. 제품명을 다시 확인해주세요.", type: "warn" });
      setItems(list);
      setSrvTotal(Number(data.total) || list.length);
      setStatus({ msg: `총 ${data.total ?? list.length}건`, type: "ok" });
    } catch (e: any) {
      setStatus({ msg: `오류: ${e.message}`, type: "error" });
    }
  }

  async function searchSimple(url: string) {
    setStatus({ msg: "조회 중…", type: "loading" });
    setItems([]);
    setClientPage(1);
    try {
      const r = await fetch(url);
      const data = await r.json();
      if (data.notice) setStatus({ msg: data.notice, type: "warn" });
      setItems(data.items || []);
      if (data.items?.length && !data.notice) setStatus({ msg: `${data.items.length}건 표시`, type: "ok" });
      if (!data.items?.length && !data.notice) setStatus({ msg: "결과가 없습니다.", type: "warn" });
    } catch (e: any) {
      setStatus({ msg: `오류: ${e.message}`, type: "error" });
    }
  }

  return (
    <div className="med-root space-y-5 max-w-5xl mx-auto">
      <header className="px-1">
        <span className="chip bg-rose/40 text-ink">공공의료 정보</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-ink mt-2">🏥 우리 가족 의료 찾기</h1>
        <p className="text-ink/70 text-sm md:text-base mt-1">국립중앙의료원 · 실시간 가용병상 · 외상센터 · 달빛어린이병원 · AED · 심야약국 · 서울 예약</p>
      </header>

      {/* 상위 탭 */}
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-2 min-w-max md:flex-wrap md:min-w-0">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setItems([]); setStatus({ msg: "" }); }}
              className={`med-tab ${tab === t.id ? "active" : ""}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* 의료 탭: 그룹화된 모드 바 */}
      {tab === "medical" && (
        <div className="med-card p-4 space-y-3">
          {["🚑 응급실", "🏥 병·의원", "💊 약국"].map((g) => (
            <div key={g}>
              <div className="med-group-label mb-2">{g}</div>
              <div className="flex flex-wrap gap-2">
                {MEDICAL_MODES.filter((m) => m.group === g).map((m) => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`med-tab ${mode.id === m.id ? "active" : ""}`}>{m.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 의료 탭: 컨트롤 */}
      {tab === "medical" && (
        <div className="med-card">
          {mode.input === "region" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="med-field">
                <label>시/도</label>
                <select className="med-input" value={sido}
                  onChange={(e) => { setSido(e.target.value); setSigungu(""); }}>
                  <option value="">선택</option>
                  {Object.keys(REGIONS).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="med-field">
                <label>시/군/구</label>
                <select className="med-input" value={sigungu} disabled={!sido}
                  onChange={(e) => setSigungu(e.target.value)}>
                  <option value="">전체</option>
                  {sigunguList.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              {mode.keyword && (
                <div className="med-field">
                  <label>기관명 <span className="text-ink/40">(선택)</span></label>
                  <input className="med-input" type="text" value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchRegion()}
                    placeholder="예: 삼성서울병원" />
                </div>
              )}
              {mode.id === "severe" && (
                <div className="med-field">
                  <label>중증질환 <span className="text-ink/40">(선택)</span></label>
                  <select className="med-input" value={severeType} onChange={(e) => setSevereType(e.target.value)}>
                    <option value="">전체</option>
                    {Object.entries(SEVERE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              )}
              {mode.id === "realtime" && (
                <div className="med-field">
                  <label>병상</label>
                  <select className="med-input" value={bedSort} onChange={(e) => setBedSort(e.target.value as any)}>
                    <option value="">여유 순 (병상 많은 순)</option>
                    <option value="free">여유 병원만</option>
                    <option value="full">포화 병원만</option>
                  </select>
                </div>
              )}
              <div className="md:col-span-4 flex justify-end">
                <button className="med-search-btn" onClick={() => searchRegion(1)}>조회</button>
              </div>
            </div>
          ) : (
            <button className="med-search-btn w-full md:w-auto" onClick={searchGeo}>📍 내 위치로 검색</button>
          )}
        </div>
      )}

      {/* AED / 심야약국 / 선별진료소: 시/도·시/군/구 + 검색 */}
      {(tab === "aed" || tab === "night") && (
        <div className="med-card grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="med-field">
            <label>시/도</label>
            <select className="med-input" value={sido}
              onChange={(e) => { setSido(e.target.value); setSigungu(""); }}>
              <option value="">선택</option>
              {Object.keys(REGIONS).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="med-field">
            <label>시/군/구</label>
            <select className="med-input" value={sigungu} disabled={!sido}
              onChange={(e) => setSigungu(e.target.value)}>
              <option value="">전체</option>
              {sigunguList.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex md:items-end">
            <button className="med-search-btn w-full md:w-auto md:ml-auto"
              onClick={() => searchSimple(`/api/${tab === "aed" ? "aed" : "night-pharmacy"}?${new URLSearchParams({ sido, sigungu })}`)}>
              조회
            </button>
          </div>
        </div>
      )}

      {tab === "screening" && (
        <div className="med-card">
          <button className="med-search-btn w-full md:w-auto" onClick={() => searchSimple("/api/screening-clinic")}>
            선별진료소 안내 보기
          </button>
        </div>
      )}

      {/* 약 안전 검색 */}
      {tab === "drug" && (
        <div className="med-card space-y-2">
          <label className="med-field"><span className="block mb-1">💊 약 이름으로 검색 (식약처 e약은요)</span></label>
          <div className="flex gap-2">
            <input className="med-input" type="text" value={drugQ}
              onChange={(e) => setDrugQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchDrug(1)}
              placeholder="예: 타이레놀, 판콜, 어린이부루펜" />
            <button className="med-search-btn shrink-0" onClick={() => searchDrug(1)}>검색</button>
          </div>
          <p className="med-hint">효능·복용법·주의사항·상호작용·부작용을 확인하고, 🤰 임신·수유 관련 주의는 자동 표시돼요.</p>
        </div>
      )}

      {/* 힌트·상태 */}
      {tab === "medical" && mode.hint && <p className="med-hint">{mode.hint}</p>}
      {status.msg && <div className={`med-status ${status.type || ""}`}>{status.msg}</div>}

      {/* 결과 그리드 + 페이지네이션 */}
      {items.length > 0 && (() => {
        // 병·의원/약국(지역)·약 안전은 서버 페이지네이션, 그 외는 클라이언트 분할
        const serverPaged = (isServerPaged && tab === "medical") || tab === "drug";
        const total = serverPaged ? srvTotal : items.length;
        const cur = serverPaged ? srvPage : clientPage;
        const totalPages = Math.max(1, Math.ceil((serverPaged ? total : items.length) / PAGE_SIZE));
        const shown = serverPaged ? items : items.slice((clientPage - 1) * PAGE_SIZE, clientPage * PAGE_SIZE);
        return (
          <div className="pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {shown.map((it, i) => (
                <ResultCard key={i} tab={tab} modeId={modeId} item={it} />
              ))}
            </div>
            <Pager
              page={cur}
              totalPages={totalPages}
              loading={status.type === "loading"}
              onPage={(p) => {
                if (tab === "drug") searchDrug(p);
                else if (serverPaged) searchRegion(p);
                else setClientPage(p);
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        );
      })()}

      <footer className="text-xs text-ink/60 border-t border-rose/20 pt-3">
        {tab === "drug" ? (
          <p>출처: 식품의약품안전처 e약은요 (data.go.kr). 본 정보는 일반 안내이며 의사·약사의 진료·복약지도를 대체하지 않습니다. <strong>임신·수유 중이거나 영유아 복용 시 반드시 전문가와 상담하세요.</strong></p>
        ) : (
          <>
            <p>출처: 국립중앙의료원 · 행안부 · 서울 열린데이터광장 (data.go.kr · openapi.seoul.go.kr)</p>
            <p>실시간 정보는 의료기관 입력 시점 기준이며 실제와 다를 수 있습니다. 응급상황 시 <strong>119</strong>.</p>
          </>
        )}
      </footer>
    </div>
  );
}

function ResultCard({ tab, modeId, item }: { tab: TabId; modeId: ModeId; item: any }) {
  if (tab === "medical") {
    if (modeId === "realtime") return <EmergencyCard it={item} />;
    if (modeId === "erNearby" || modeId === "phNearby") return <NearbyCard it={item} />;
    if (modeId === "trauma") return <TraumaCard it={item} />;
    if (modeId === "severe") return <SevereCard it={item} />;
    return <FacilityCard it={item} />;
  }
  if (tab === "drug") return <DrugCard it={item} />;
  if (tab === "aed") return <AedCard it={item} />;
  if (tab === "night") return <NightCard it={item} />;
  if (tab === "screening") return <ScreeningCard it={item} />;
  return null;
}

function DrugCard({ it }: { it: any }) {
  const rows: { label: string; icon: string; text: string }[] = [
    { label: "효능", icon: "💡", text: it.efficacy },
    { label: "복용법", icon: "🥄", text: it.howto },
    { label: "경고", icon: "🚨", text: it.warn },
    { label: "주의사항", icon: "⚠️", text: it.caution },
    { label: "상호작용", icon: "🔀", text: it.interact },
    { label: "부작용", icon: "🤕", text: it.side },
    { label: "보관법", icon: "📦", text: it.storage },
  ].filter((r) => r.text);
  return (
    <article className="med-card">
      <div className="flex items-start gap-3">
        {it.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={it.image} alt="" className="w-16 h-12 object-contain rounded-lg bg-white shrink-0" loading="lazy" />
        ) : <div className="w-16 h-12 grid place-items-center text-2xl shrink-0">💊</div>}
        <div className="min-w-0">
          <h3 className="leading-snug">{it.name}</h3>
          <p className="text-xs text-med-muted" style={{ color: "var(--med-muted)" }}>{it.company}</p>
        </div>
      </div>
      {it.pregnancyNote && (
        <div className="mt-2 text-xs font-bold rounded-lg px-2 py-1.5" style={{ background: "#fdeaea", color: "#a13030" }}>
          🤰 임신·수유 관련 주의 문구가 포함돼 있어요. 아래 주의사항·상호작용을 꼭 확인하고 의사·약사와 상담하세요.
        </div>
      )}
      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-bold" style={{ color: "var(--med-primary-dark)" }}>상세 정보 펼치기</summary>
        <div className="mt-2 space-y-2">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="text-xs font-extrabold" style={{ color: "var(--med-ink)" }}>{r.icon} {r.label}</div>
              <p className="text-xs whitespace-pre-line" style={{ color: "var(--med-muted)" }}>{r.text}</p>
            </div>
          ))}
        </div>
      </details>
    </article>
  );
}

function EmergencyCard({ it }: { it: any }) {
  const beds = num(it.hvec), op = num(it.hvoc), ward = num(it.hvgc);
  const ambulance = it.hvamyn === "Y";
  const pedAvail = num(it.hvncc) > 0 || it.hvincuayn === "Y" || it.hvventisoayn === "Y";
  const pedItems = pediatricItems(it);
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>{it.dutyName}</h3>
        {Number.isNaN(beds) ? null : beds > 0
          ? <span className="med-bed ok">병상 {beds}</span>
          : <span className="med-bed full">포화</span>}
      </div>
      <p className="meta">입력시각: {it.hvidate || "-"}{pedAvail && <span style={{ color: "#6d28a8", fontWeight: 700 }}> · 🧒 소아 가용</span>}</p>
      <ul className="med-stats">
        <li><span>응급실 일반</span><b>{disp(beds)}</b></li>
        <li><span>수술실</span><b>{disp(op)}</b></li>
        <li><span>입원실 일반</span><b>{disp(ward)}</b></li>
        <li><span>구급차</span><b>{ambulance ? "가용" : "불가"}</b></li>
        <li><span>CT</span><b>{it.hvctayn === "Y" ? "○" : "×"}</b></li>
        <li><span>MRI</span><b>{it.hvmriayn === "Y" ? "○" : "×"}</b></li>
      </ul>
      {pedItems.length > 0 && (
        pedItems.some((p) => p.ok) ? (
          <div className="med-ped-row">
            <span className="med-ped-label">🧒 소아 가용</span>
            {pedItems.map((p) => (
              <span key={p.t} className={`med-chip ${p.ok ? "" : "chip-no"}`}>{p.t}</span>
            ))}
          </div>
        ) : (
          <div className="med-ped-row"><span className="med-ped-none">🧒 소아 응급 가용 자원 없음</span></div>
        )
      )}
      {it.dutyTel3 && <div className="med-actions"><TelBtn n={it.dutyTel3} label="🚑 응급실" /></div>}
    </article>
  );
}

function NearbyCard({ it }: { it: any }) {
  const d = num(it.distance);
  const open = it.startTime && it.endTime ? `오늘 ${fmtTime(it.startTime)} ~ ${fmtTime(it.endTime)}` : "";
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>{it.dutyName}</h3>
        {!Number.isNaN(d) && <span className="med-bed ok">{d.toFixed(2)}km</span>}
      </div>
      <p className="addr">📍 {it.dutyAddr}</p>
      <p className="meta">{it.dutyDivName || ""}{open && ` · ${open}`}</p>
      <div className="med-actions">
        <TelBtn n={it.dutyTel1} />
        <MapBtn name={it.dutyName} lat={it.latitude} lon={it.longitude} />
      </div>
    </article>
  );
}

function TraumaCard({ it }: { it: any }) {
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>{it.dutyName}</h3>
        {it.dutyEmclsName && <span className="med-bed ok">{it.dutyEmclsName}</span>}
      </div>
      <p className="addr">📍 {it.dutyAddr}</p>
      <div className="med-actions">
        <TelBtn n={it.dutyTel1} />
        {it.dutyTel3 && <TelBtn n={it.dutyTel3} label="🚑 응급실" />}
        <MapBtn name={it.dutyName} lat={it.wgs84Lat} lon={it.wgs84Lon} />
      </div>
    </article>
  );
}

function SevereCard({ it }: { it: any }) {
  const chips: string[] = [];
  for (let n = 1; n <= 28; n++) {
    const v = it["MKioskTy" + n] ?? it["mkioskty" + n];
    if (isYes(v) && SEVERE_TYPES[String(n)]) chips.push(SEVERE_TYPES[String(n)]);
  }
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>{it.dutyName || it.hpid || "-"}</h3>
        <span className={`med-bed ${chips.length ? "ok" : "full"}`}>수용 {chips.length}</span>
      </div>
      {chips.length ? (
        <div className="mt-2">{chips.map((c) => <span key={c} className="med-chip">{c}</span>)}</div>
      ) : (
        <p className="meta">현재 수용 가능 항목 없음 또는 정보 미제공</p>
      )}
    </article>
  );
}

function FacilityCard({ it }: { it: any }) {
  return (
    <article className="med-card">
      <h3>{it.dutyName}</h3>
      <p className="addr">📍 {it.dutyAddr}</p>
      <p className="hours">🕒 {todayHours(it)}</p>
      <div className="med-actions">
        <TelBtn n={it.dutyTel1} />
        <MapBtn name={it.dutyName} lat={it.wgs84Lat} lon={it.wgs84Lon} />
      </div>
    </article>
  );
}

function AedCard({ it }: { it: any }) {
  return (
    <article className="med-card">
      <h3>❤️ {it.name}</h3>
      <p className="addr">📍 {it.address || it.place}</p>
      {it.tel && <p className="meta">☎ {it.tel}</p>}
    </article>
  );
}

function NightCard({ it }: { it: any }) {
  return (
    <article className="med-card">
      <div className="med-card-top">
        <h3>🌙 {it.name}</h3>
        <span className="med-bed ok">오늘 마감 {fmtTime(it.todayClose)}</span>
      </div>
      <p className="addr">📍 {it.address}</p>
      {it.tel && <TelBtn n={it.tel} />}
    </article>
  );
}

function ScreeningCard({ it }: { it: any }) {
  return (
    <article className="med-card">
      <h3>🩺 {it.name}</h3>
      <p className="addr">📍 {it.address}</p>
      <p className="meta">🕐 {it.hours}</p>
      {it.tel && <div className="med-actions"><TelBtn n={it.tel} /></div>}
    </article>
  );
}

function TelBtn({ n, label }: { n: string; label?: string }) {
  if (!n) return null;
  return <a className="med-btn tel" href={`tel:${String(n).replace(/[^0-9]/g, "")}`}>{label || `📞 ${n}`}</a>;
}
function MapBtn({ name, lat, lon }: { name: string; lat: any; lon: any }) {
  if (!lat || !lon) return null;
  return <a className="med-btn map" href={`https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lon}`} target="_blank" rel="noopener">🗺️ 지도</a>;
}

function num(v: any): number { return v === undefined || v === "" || v === null ? NaN : Number(v); }
function disp(v: number): string { return Number.isNaN(v) ? "-" : String(v); }
function fmtTime(t: string): string { return t && t.length === 4 ? `${t.slice(0, 2)}:${t.slice(2, 4)}` : t || "-"; }
function isYes(v: any): boolean { return v === "Y" || v === "y" || v === true || v === "true"; }

function todayHours(it: any): string {
  const days = ["", "월", "화", "수", "목", "금", "토", "일"];
  const jsDay = new Date().getDay();
  const n = jsDay === 0 ? 7 : jsDay;
  const s = it[`dutyTime${n}s`], c = it[`dutyTime${n}c`];
  if (!s || !c) return "운영시간 정보 없음";
  return `오늘(${days[n]}) ${fmtTime(s)} ~ ${fmtTime(c)}`;
}

function pediatricItems(it: any): { ok: boolean; t: string }[] {
  const items: { ok: boolean; t: string }[] = [];
  if (it.hvncc !== undefined && it.hvncc !== "") {
    const n = num(it.hvncc);
    items.push({ ok: !Number.isNaN(n) && n > 0, t: `신생아중환자실 ${disp(n)}병상` });
  }
  if (it.hvincuayn !== undefined) items.push({ ok: it.hvincuayn === "Y", t: `인큐베이터 ${it.hvincuayn === "Y" ? "가능" : "불가"}` });
  if (it.hvventisoayn !== undefined) items.push({ ok: it.hvventisoayn === "Y", t: `소아 인공호흡기 ${it.hvventisoayn === "Y" ? "가능" : "불가"}` });
  return items;
}

