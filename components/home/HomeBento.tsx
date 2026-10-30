"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBaby, ageMonths, ageDays, type Baby } from "@/lib/baby";
import { upcomingEvents } from "@/lib/schedule";
import { calcSupport, CALC_DEFAULTS } from "@/lib/calc";
import { GROWTH } from "@/lib/growth";
import { SUPPORTS } from "@/lib/data";
import { getSeoulRows, decodeHtml } from "@/lib/seoul-client";
import { IconChevronRight } from "@/components/ui2/Icons";

// ⚠️ 원본 시안의 '첫만남이용권 D-5 · 2026.1.31 · 3,420,000원 · 공동육아나눔터'는 설명용 더미.
//    여기서는 기존 데이터·로직(아기 프로필, schedule.ts, calc.ts, growth.ts, 서울 공공예약 API)으로만 채운다.

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}. ${m}. ${d}.(${DOW[new Date(y, m - 1, d).getDay()]})`;
}
function ddayText(n: number) {
  return n === 0 ? "D-DAY" : n > 0 ? `D-${n}` : `D+${-n}`;
}

function CardHead({ icon, title, mTitle, more, href }: { icon: string; title: string; mTitle?: string; more: string; href: string }) {
  return (
    <div className="ss-card-head">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" aria-hidden="true" />
      <h2>
        {mTitle ? <><span className="ss-d">{title}</span><span className="ss-m">{mTitle}</span></> : title}
      </h2>
      <Link href={href} className="ss-card-more">{more}<IconChevronRight size={14} strokeWidth={2.2} /></Link>
    </div>
  );
}

/* ---------- 놓치지 마세요 (민트) ---------- */
function MissCard({ baby, ready }: { baby: Baby | null; ready: boolean }) {
  let more = { label: "전체보기", href: "/timeline" };
  let body: React.ReactNode;
  let inner = { title: "출산가구 전기요금 할인", sub: "출생신고 당일 신청해야 해요 (소급 불가)", href: "/timeline" };

  if (!ready) {
    body = <div aria-hidden="true"><div className="ss-skel" style={{ height: 64, marginTop: 22, maxWidth: "70%" }} /><div className="ss-skel" style={{ height: 30, marginTop: 16, width: 220 }} /></div>;
  } else if (baby?.mode === "born" && upcomingEvents(baby, { max: 2 }).length > 0) {
    // 출생일 기준 국가예방접종·영유아검진 권장 시기 (lib/schedule.ts — 기존 표준일정)
    const [e1, e2] = upcomingEvents(baby, { max: 2 });
    more = { label: "전체 일정", href: "/calendar" };
    const what = e1.kind === "vaccine" ? `${e1.label} 예방접종` : e1.label;
    body = (
      <>
        <p className="ss-card-title">{e1.dday < 0 ? `${what} 권장 시기가 지났어요` : `${what} 시기가 다가와요`}</p>
        <div className="ss-dday-row">
          <span className="ss-dday">{ddayText(e1.dday)}</span>
          <span>{fmtDate(e1.dueISO)} 무렵</span>
        </div>
        <p className="ss-caption">권장 시기 {e1.windowLabel} · 정확한 일정은 접종기관·예방접종도우미에서 확인하세요.</p>
      </>
    );
    inner = e2
      ? { title: e2.label, sub: `${e2.windowLabel} · ${fmtDate(e2.dueISO)} 무렵`, href: "/calendar" }
      : { title: "개월별 접종·검진 일정", sub: "전체 일정 보기", href: "/calendar" };
  } else if (baby?.mode === "due") {
    const left = Math.max(0, -ageDays(baby));
    body = (
      <>
        <p className="ss-card-title">출생 후 60일 안에 꼭 신청하세요</p>
        <div className="ss-dday-row">
          <span className="ss-dday">{ddayText(left)}</span>
          <span>출산 예정 {fmtDate(baby.date)}</span>
        </div>
        <p className="ss-caption">첫만남이용권·부모급여·아동수당은 출생신고 때 행복출산 원스톱으로 한 번에 신청할 수 있어요.</p>
      </>
    );
  } else {
    body = (
      <>
        <p className="ss-card-title">출생 후 60일, 놓치면 못 받는 지원금이 있어요</p>
        <div className="ss-dday-row">
          <span className="ss-dday is-soft">TIP</span>
          <span>부모급여는 60일 안에 신청해야 출생월부터 받아요</span>
        </div>
        <p className="ss-caption">아기 정보를 입력하면 접종·검진 일정을 D-day로 알려드려요.</p>
      </>
    );
  }

  return (
    <article className="ss-card ss-card-mint">
      <CardHead icon="/ssook2/ic-bell.png" title="놓치지 마세요" mTitle="신청 할 일" more={more.label} href={more.href} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ssook2/deco-list.png" alt="" aria-hidden="true" className="ss-deco-list" />
      {body}
      <Link href={more.href} className="ss-card-go" aria-label={`${more.label} 보기`}><IconChevronRight size={20} strokeWidth={2.2} /></Link>
      <div className="ss-mint-spacer" />
      <Link href={inner.href} className="ss-inner-card">
        <div><b>{inner.title}</b><small>{inner.sub}</small></div>
        <IconChevronRight size={20} strokeWidth={2} />
      </Link>
    </article>
  );
}

/* ---------- 예상 지원금 (피치) ---------- */
function SupportCard({ baby, ready }: { baby: Baby | null; ready: boolean }) {
  // 계산기와 같은 함수·같은 기본값. 프로필의 순위·지역·다태아만 반영 (계산기 프리필과 동일)
  const r = baby ? calcSupport({ ...CALC_DEFAULTS, birthOrder: baby.birthOrder, region: baby.region, twins: baby.twins }) : null;
  return (
    <article className="ss-card ss-card-peach">
      <CardHead icon="/ssook2/ic-wallet.png" title="예상 지원금" mTitle="맞춤 지원금" more="자세히 보기" href="/calculator" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ssook2/deco-chart.png" alt="" aria-hidden="true" className="ss-deco-chart" />
      {!ready ? (
        <div aria-hidden="true"><div className="ss-skel" style={{ height: 20, marginTop: 18, width: 180 }} /><div className="ss-skel" style={{ height: 40, marginTop: 10, width: 220 }} /></div>
      ) : r ? (
        <>
          <p className="ss-amount-label">
            <span className="ss-d">우리 아이가 받을 수 있는<br />예상 지원금 <em>총액</em></span>
            <span className="ss-m">예상 지원금 총액</span>
          </p>
          <p className="ss-amount">약 {Math.round(r.total).toLocaleString()}<small>만원</small></p>
          <p className="ss-caption" style={{ marginTop: 2 }}>
            {baby && baby.date >= "2027-07-01"
              ? <>현행 제도 기준이에요 · 2027.7 이후 출생은 <Link href="/support#reform-2027" style={{ textDecoration: "underline" }}>개편안(심의 중)</Link> 적용 예정</>
              : "가정양육·24개월 기준 예상치 · 실제와 다를 수 있어요"}
          </p>
          <Link href="/calculator" className="ss-card-go" aria-label="지원금 계산기에서 자세히 보기"><IconChevronRight size={20} strokeWidth={2.2} /></Link>
        </>
      ) : (
        <>
          <p className="ss-amount-label">우리 아이가 받을 수 있는 예상 지원금</p>
          <p className="ss-amount-empty">조건을 입력하면<br />확인할 수 있어요</p>
        </>
      )}
      {r || !ready ? (
        <Link href="/support" className="ss-pill-link"><span><em>지원금 {SUPPORTS.length}종</em> 한눈에 보기</span><IconChevronRight size={16} strokeWidth={2.2} /></Link>
      ) : (
        <Link href="/calculator" className="ss-pill-link"><span><em>지원금 계산기</em>에서 바로 계산해보기</span><IconChevronRight size={16} strokeWidth={2.2} /></Link>
      )}
    </article>
  );
}

/* ---------- 월령별 성장 가이드 (블루) ---------- */
function sectionIdFor(m: number) {
  if (m < 1) return "newborn";
  if (m <= 3) return "1to3";
  if (m <= 6) return "4to6";
  if (m <= 9) return "7to9";
  if (m <= 12) return "10to12";
  if (m <= 24) return "13to24";
  return "25to36";
}
function firstSentence(s?: string) {
  if (!s) return "";
  return s.split(/(?<=[.!?])\s+/)[0].replace(/[.。]\s*$/, "").trim();
}

function GrowthCard({ baby, ready }: { baby: Baby | null; ready: boolean }) {
  const born = baby?.mode === "born" && ageDays(baby) >= 0;
  const sec = born ? GROWTH.find((g) => g.id === sectionIdFor(ageMonths(baby!))) : undefined;
  const points = sec
    ? [sec.development?.language, sec.development?.social, sec.development?.motor, ...(sec.play || [])]
        .map(firstSentence).filter(Boolean).slice(0, 3)
    : ["이른둥이부터 36개월까지 8단계", "발달·놀이·주의 신호 정리", "아이사랑 포털 자료 기반"];

  return (
    <article className="ss-card ss-card-blue">
      <CardHead icon="/ssook2/ic-chart.png" title="월령별 성장 가이드" more={sec ? sec.label : "전체보기"} href="/growth" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ssook2/deco-sprout.png" alt="" aria-hidden="true" className="ss-deco-sprout" />
      {!ready ? (
        <div aria-hidden="true"><div className="ss-skel" style={{ height: 52, marginTop: 18, width: "60%" }} /><div className="ss-skel" style={{ height: 70, marginTop: 12, width: "70%" }} /></div>
      ) : (
        <>
          <p className="ss-growth-title">{sec ? <>지금, 이런 성장을<br />응원해요</> : <>개월수에 맞춰<br />성장 정보를 보여드려요</>}</p>
          <ul className="ss-checks">
            {points.map((p) => (
              <li key={p}>
                <span className="ss-check-dot" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m2.5 6.2 2.3 2.3 4.7-4.9" /></svg>
                </span>
                <span title={p}>{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

/* ---------- 우리 동네 프로그램 (서울 공공예약 실데이터) ---------- */
const INFANT_KW = ["유아", "영유아", "어린이집", "36개월", "48개월"];
function pickProgram(rows: any[]) {
  const infant = rows.filter((x) => INFANT_KW.some((k) => decodeHtml(x.USETGTINFO || "").includes(k)));
  const open = infant.filter((x) => x.SVCSTATNM === "접수중");
  const withImg = (arr: any[]) => arr.find((x) => String(x.IMGURL || "").startsWith("http"));
  return withImg(open) || open[0] || withImg(infant) || infant[0] || null;
}

function LocalCard() {
  const [state, setState] = useState<{ status: "loading" | "ok" | "empty" | "error"; item?: any }>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    getSeoulRows()
      .then((rows) => { if (!alive) return; const it = pickProgram(rows); setState(it ? { status: "ok", item: it } : { status: "empty" }); })
      .catch(() => alive && setState({ status: "error" }));
    return () => { alive = false; };
  }, []);

  const it = state.item;
  const url = it ? decodeHtml(it.SVCURL || "") : "";
  const img = it && String(it.IMGURL || "").startsWith("http") ? it.IMGURL : "";
  const tags = it ? [decodeHtml(it.MINCLASSNM || "").trim(), it.PAYATNM, it.SVCSTATNM].filter(Boolean).slice(0, 3) : [];

  return (
    <article className="ss-card ss-card-local">
      <div className="ss-local-head-m">
        <CardHead icon="/ssook2/ic-pin.png" title="우리 동네 프로그램" more="전체보기" href="/seoul" />
      </div>
      <div className="ss-local">
        <div className="ss-local-intro">
          <div className="ss-card-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ssook2/ic-pin.png" alt="" aria-hidden="true" />
            <h2>우리 동네 프로그램</h2>
          </div>
          <p>지금, 우리 아이와 함께할 수 있는<br />다양한 프로그램을 만나보세요.</p>
        </div>

        {state.status === "loading" ? (
          <>
            <div className="ss-skel" style={{ height: 100, borderRadius: 14 }} aria-hidden="true" />
            <div aria-hidden="true"><div className="ss-skel" style={{ height: 18, width: 80 }} /><div className="ss-skel" style={{ height: 22, marginTop: 8 }} /><div className="ss-skel" style={{ height: 22, marginTop: 8, width: "70%" }} /></div>
            <span />
          </>
        ) : state.status === "ok" ? (
          <>
            <div className="ss-local-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {img ? <img src={img} alt="" loading="lazy" /> : <span style={{ fontSize: 30 }} aria-hidden="true">🎪</span>}
            </div>
            <div style={{ minWidth: 0 }}>
              {it.AREANM && <span className="ss-local-area">서울시 {decodeHtml(it.AREANM)}</span>}
              {url ? (
                <a href={url} target="_blank" rel="noopener" className="ss-local-name">{decodeHtml(it.SVCNM || "")}</a>
              ) : (
                <span className="ss-local-name">{decodeHtml(it.SVCNM || "")}</span>
              )}
              <div className="ss-tags">{tags.map((t: string) => <span key={t}>{t}</span>)}</div>
            </div>
            <Link href="/seoul" className="ss-local-go" aria-label="공공서비스 예약 전체 보기"><IconChevronRight size={20} strokeWidth={2} /></Link>
          </>
        ) : (
          <>
            <div className="ss-local-photo" aria-hidden="true"><span style={{ fontSize: 30 }}>🎪</span></div>
            <p className="ss-empty">{state.status === "error" ? "지금은 프로그램을 불러올 수 없어요." : "지금 접수 중인 영유아 프로그램을 찾지 못했어요."}<br /><Link href="/seoul">공공서비스 예약에서 찾아보기</Link></p>
            <span />
          </>
        )}
      </div>
      <p className="ss-local-src">출처: 서울시 공공서비스 예약(서울 열린데이터광장) · 영유아 대상 프로그램 중 하나를 보여드려요</p>
    </article>
  );
}

export default function HomeBento() {
  const [baby, , ready] = useBaby();
  return (
    <div className="ss-bento">
      <MissCard baby={baby} ready={ready} />
      <SupportCard baby={baby} ready={ready} />
      <GrowthCard baby={baby} ready={ready} />
      <LocalCard />
    </div>
  );
}
