"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBaby, ageMonths, ageDays } from "@/lib/baby";
import { useStored, todayISO } from "@/lib/records";
import { AREA_LABEL, MILESTONE_SECTIONS, milestonesOf, sectionIdForMonths } from "@/lib/milestones";

const KEY = "ssook-milestone-v1"; // { [항목키]: 처음 확인한 날짜 }

export default function MilestonesPage() {
  const [baby, , babyReady] = useBaby();
  const [checks, setChecks, ready] = useStored<Record<string, string>>(KEY, {});
  const [tab, setTab] = useState(MILESTONE_SECTIONS[0]?.id || "");
  const [touched, setTouched] = useState(false);

  // 아기 월령에 맞는 구간을 기본 선택 (사용자가 직접 고르기 전까지)
  const born = baby?.mode === "born" && ageDays(baby) >= 0;
  const babySec = born ? sectionIdForMonths(ageMonths(baby!)) : null;
  useEffect(() => {
    if (!touched && babyReady && babySec && MILESTONE_SECTIONS.some((s) => s.id === babySec)) setTab(babySec);
  }, [babyReady, babySec, touched]);

  const sec = MILESTONE_SECTIONS.find((s) => s.id === tab) || MILESTONE_SECTIONS[0];
  const items = sec ? milestonesOf(sec) : [];
  const done = items.filter((m) => checks[m.key]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const areas = Array.from(new Set(items.map((m) => m.area)));

  const toggle = (k: string) => setChecks((p) => { const n = { ...p }; if (n[k]) delete n[k]; else n[k] = todayISO(); return n; });

  return (
    <div className="space-y-6">
      <header>
        <span className="chip bg-sky/60 text-ink">성장·육아</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">🌱 발달 체크</h1>
        <p className="text-ink/70 mt-2">월령별 발달 모습 중 우리 아이가 보여준 것을 체크해두세요. 영유아검진·진료 때 이야기하기 좋아요.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="월령 구간">
        {MILESTONE_SECTIONS.map((s) => (
          <button key={s.id} role="tab" aria-selected={tab === s.id} onClick={() => { setTab(s.id); setTouched(true); }}
            className={`btn-pop shrink-0 min-h-[40px] px-4 rounded-full text-sm font-bold border ${tab === s.id ? "bg-rose text-white border-rose" : "bg-white text-ink border-[#E2E5EC]"}`}>
            {s.icon} {s.label}{s.id === babySec ? " · 지금" : ""}
          </button>
        ))}
      </div>

      {sec && (
        <>
          <div className="card p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="font-extrabold text-ink">{sec.label} 체크</span>
              <span className="font-extrabold text-rose">{ready ? `${done} / ${items.length}` : " "}</span>
            </div>
            <div className="w-full bg-[#F1F2F5] rounded-full h-3 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${sec.label} 체크 비율`}>
              <div className="h-full bg-rose transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {areas.map((area) => (
              <section key={area} className="card p-5">
                <h2 className="font-extrabold text-ink mb-3">{AREA_LABEL[area]}</h2>
                <ul className="space-y-2">
                  {items.filter((m) => m.area === area).map((m) => (
                    <li key={m.key}>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={!!checks[m.key]} onChange={() => toggle(m.key)} className="mt-0.5 w-5 h-5 accent-rose shrink-0" />
                        <span className="text-sm text-ink/85 leading-relaxed">
                          {m.text}
                          {checks[m.key] && <span className="block text-xs font-bold text-[#3E8B5E] mt-0.5">✓ {checks[m.key]} 확인</span>}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {sec.warningSigns && sec.warningSigns.length > 0 && (
            <div className="card p-5 bg-[#FFF4F2] border-[#FFD9D2]">
              <h2 className="font-extrabold text-ink mb-2">🩺 이럴 땐 소아과 상담</h2>
              <ul className="space-y-1 text-sm text-ink/80 list-disc pl-5">
                {sec.warningSigns.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="card p-4 text-xs text-ink/60 space-y-1">
        <p>⚠️ 아이마다 발달 속도가 달라요. 체크는 <b>기록용</b>이며 발달을 진단하거나 판정하지 않아요. 걱정되면 영유아검진이나 소아청소년과에서 상담하세요.</p>
        <p>항목 출처: 아이사랑 포털 (childcare.go.kr) — <Link href="/growth" className="underline font-bold">월령별 성장</Link>의 발달 내용을 문장별로 나눈 것. 기록 요약·백업은 <Link href="/my" className="underline font-bold">내 아이</Link>에서.</p>
      </div>
    </div>
  );
}
