"use client";

import { useMemo, useState } from "react";
import { CHILDCARE_REGIONS } from "@/lib/childcare-regions";

// 2026 대표 사례 (거주지·조건에 따라 크게 다름. 참고용 — 반드시 관할 확인)
const EXAMPLES = [
  { region: "서울시 (공통)", detail: "산후조리경비 첫째 100 · 둘째 120 · 셋째+ 150만원", cond: "거주 90일↑, 출생 180일 내 신청" },
  { region: "서울시 (공통)", detail: "임산부 교통비 첫째 70 · 둘째 80 · 셋째+ 100만원", cond: "임신 3개월~출산 6개월 내" },
  { region: "서울 강남구", detail: "출산지원금 첫째·둘째 200 · 셋째 300만원", cond: "구 자체 추가 (서울시와 별도)" },
  { region: "경기 동두천시", detail: "장려금 첫째 100·둘째 150·셋째 250·넷째+ 500만 + 산후조리(시100+도250)", cond: "현금성 지원 큰 대표 사례" },
  { region: "충북 음성군", detail: "셋째 100만 · 넷째 500만원 (분할)", cond: "주거자금 대출잔액 3% 지원 병행" },
  { region: "강원 태백시", detail: "난임시술 최대 200만 · 공공산후조리원 90% 감면", cond: "생애 1회 등 조건" },
];

export default function LocalGovPage() {
  const [sido, setSido] = useState("");
  const [gu, setGu] = useState("");

  const guList = useMemo(() => (CHILDCARE_REGIONS[sido] || []).map((g) => g.name), [sido]);
  const region = [sido, gu].filter(Boolean).join(" ");
  const q = encodeURIComponent(`${region} 2026 출산지원금`);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="px-1">
        <span className="chip bg-peach/60 text-ink">지자체 지원금</span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-ink mt-2">🏘️ 우리 지역 출산지원금 찾기</h1>
        <p className="text-ink/70 text-sm md:text-base mt-1">
          같은 조건이어도 사는 지역에 따라 <b>수백만~수천만원</b> 차이가 나요. 우리 동네를 정확히 확인하세요.
        </p>
      </header>

      {/* 지역 선택 */}
      <section className="card p-5 md:p-6">
        <label className="text-xs font-bold text-ink/60 block mb-2">📍 지역 선택</label>
        <div className="grid grid-cols-2 gap-2 md:max-w-md">
          <select value={sido} onChange={(e) => { setSido(e.target.value); setGu(""); }}
            className="p-3 rounded-2xl border-2 border-rose/30 bg-white font-semibold">
            <option value="">시·도</option>
            {Object.keys(CHILDCARE_REGIONS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={gu} onChange={(e) => setGu(e.target.value)} disabled={!sido}
            className="p-3 rounded-2xl border-2 border-rose/30 bg-white font-semibold disabled:opacity-50">
            <option value="">시·군·구</option>
            {guList.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {region ? (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-bold text-ink">🔎 <span className="text-rose">{region}</span> 출산지원금 바로 확인</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <LinkBtn href="https://www.childcare.go.kr/?menuno=279" icon="📋" title="아이사랑 공식 공고" desc="지자체별 2026 출산지원금 게시판" />
              <LinkBtn href={`https://search.naver.com/search.naver?query=${q}`} icon="🟢" title="네이버 검색" desc={`"${region} 2026 출산지원금"`} />
              <LinkBtn href={`https://www.google.com/search?q=${q}`} icon="🔍" title="구글 검색" desc="구청·보건소 공고 찾기" />
              <LinkBtn href="https://www.gov.kr/portal/rcvfvrSvc/dtlEx/ND_SVC_2016061417070342" icon="🏛️" title="정부24 보조금24" desc="맞춤형 혜택 조회 (로그인)" />
            </div>
            <p className="text-xs text-ink/50 mt-1">
              ※ 블로그 글보다 <b>시청·구청·보건소 공고</b>를 최종 근거로 삼으세요. 거주기간·신청기한·분할지급 조건이 지역마다 달라요.
            </p>
          </div>
        ) : (
          <p className="text-sm text-ink/60 mt-3 p-3 bg-butter/40 rounded-2xl">시·도 → 시·군·구를 선택하면 우리 지역 검색 링크가 나와요.</p>
        )}
      </section>

      {/* 확인 항목 */}
      <section className="card p-5 bg-mint/20">
        <h3 className="font-extrabold text-ink mb-2">✅ 지역마다 자주 있는 지원 (검색 키워드)</h3>
        <div className="flex flex-wrap gap-1.5">
          {["출산축하금", "산후조리비", "산후도우미 본인부담", "임산부 교통비", "임산부 택시비", "유축기 대여", "출산용품", "기저귀 지원", "다자녀 혜택", "난임시술비", "돌 축하금", "아빠 육아휴직 장려금", "백일·돌상 대여"].map((k) => (
            <span key={k} className="chip bg-white text-ink">{k}</span>
          ))}
        </div>
      </section>

      {/* 대표 사례 */}
      <section>
        <h3 className="font-extrabold text-ink mb-2 px-1">💡 2026 대표 사례 (참고용)</h3>
        <div className="space-y-2">
          {EXAMPLES.map((e, i) => (
            <div key={i} className="card p-4">
              <div className="font-extrabold text-ink text-sm">{e.region}</div>
              <div className="text-rose font-bold text-sm mt-0.5">{e.detail}</div>
              <div className="text-xs text-ink/60 mt-0.5">{e.cond}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="card p-4 bg-rose/15 text-xs text-ink/70">
        ⚠️ 지자체 출산지원금은 금액·조건이 자주 바뀌고 지역 편차가 매우 큽니다. 위 사례는 2026년 공개자료 기준 <b>참고용</b>이며,
        신청 전 반드시 <b>관할 시·군·구청·보건소</b>에서 최신 내용을 확인하세요. 중앙정부 지원금은 <a className="text-rose font-bold underline" href="/calculator">계산기</a>에서 합산할 수 있어요.
      </div>
    </div>
  );
}

function LinkBtn({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <a href={href} target="_blank" rel="noopener"
      className="btn-pop card p-3 flex items-center gap-3 hover:bg-rose/5">
      <span className="text-2xl shrink-0">{icon}</span>
      <span className="min-w-0">
        <span className="block font-extrabold text-ink text-sm">{title}</span>
        <span className="block text-xs text-ink/60 truncate">{desc}</span>
      </span>
      <span className="ml-auto text-ink/30 shrink-0">↗</span>
    </a>
  );
}
