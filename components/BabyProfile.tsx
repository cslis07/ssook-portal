"use client";

import Link from "next/link";
import { useState } from "react";
import { useBaby, ageMonths, ageDays, ddayLabel, todayISO, type Baby } from "@/lib/baby";
import { upcomingEvents as upcoming } from "@/lib/schedule";

export default function BabyProfile() {
  const [baby, setBaby, ready] = useBaby();
  const [editing, setEditing] = useState(false);

  if (!ready) return <div className="card p-5 h-24 animate-pulse bg-white/60" />;

  if (!baby || editing) {
    return <ProfileForm initial={baby} onSave={(b) => { setBaby(b); setEditing(false); }} onCancel={baby ? () => setEditing(false) : undefined} />;
  }

  const born = baby.mode === "born";
  const months = ageMonths(baby);
  const days = ageDays(baby);
  const events = upcoming(baby, { max: 3 });
  const name = baby.name?.trim() || "우리 아기";

  return (
    <section className="card p-5 md:p-6 bg-gradient-to-br from-rose/25 to-peach/25">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-ink/60 font-semibold">🍼 {name}</div>
          {born ? (
            days < 0 ? (
              <div className="text-2xl md:text-3xl font-extrabold text-ink mt-0.5">
                곧 만나요 <span className="text-rose">D{days}</span>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-extrabold text-ink mt-0.5">
                생후 {months}개월 <span className="text-rose">D+{days}</span>
              </div>
            )
          ) : (
            <div className="text-2xl md:text-3xl font-extrabold text-ink mt-0.5">
              출산 예정 <span className="text-rose">{days > 0 ? `D-${days}` : "D-DAY"}</span>
            </div>
          )}
        </div>
        <button onClick={() => setEditing(true)} className="text-xs font-bold text-ink/50 underline shrink-0">수정</button>
      </div>

      {/* 다음 접종·검진 D-day */}
      {born && events.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-extrabold text-ink/50 mb-1.5">📅 다가오는 접종·검진</div>
          <div className="space-y-1.5">
            {events.map((e) => (
              <div key={e.id} className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2">
                <span className="text-lg">{e.kind === "vaccine" ? "💉" : "🩺"}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink text-sm truncate">{e.label}</div>
                  <div className="text-xs text-ink/55">{e.windowLabel} · {e.dueISO}</div>
                </div>
                <span className={`chip shrink-0 ${e.dday < 0 ? "bg-butter/70" : e.dday <= 14 ? "bg-rose text-white" : "bg-white text-ink"}`}>
                  {e.dday < 0 ? "지남" : ddayLabel(e.dday)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 개인화 바로가기 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={born ? `/calendar#m${Math.min(months, 24)}` : "/timeline"}
          className="btn-pop bg-ink text-cream px-4 py-2 rounded-full text-sm font-bold">
          {born ? `👶 ${months}개월 가이드 보기` : "📅 출산 준비 타임라인"}
        </Link>
        <Link href="/calculator" className="btn-pop bg-white border-2 border-ink/10 text-ink px-4 py-2 rounded-full text-sm font-bold">
          🧮 우리 아기 지원금
        </Link>
      </div>
    </section>
  );
}

function ProfileForm({ initial, onSave, onCancel }: {
  initial: Baby | null; onSave: (b: Baby) => void; onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [mode, setMode] = useState<Baby["mode"]>(initial?.mode || "born");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [birthOrder, setBirthOrder] = useState<Baby["birthOrder"]>(initial?.birthOrder || "first");
  const [twins, setTwins] = useState(initial?.twins || false);
  const [region, setRegion] = useState<Baby["region"]>(initial?.region || "metro");

  return (
    <section className="card p-5 md:p-6">
      <h2 className="text-lg font-extrabold text-ink">🍼 우리 아기 정보</h2>
      <p className="text-sm text-ink/60 mt-1">한 번만 입력하면 개월별 가이드·접종 D-day·지원금 계산이 우리 아기 기준으로 맞춰져요. (기기에만 저장)</p>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-bold text-ink/60 block mb-1">애칭 (선택)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 콩이"
            className="w-full md:max-w-xs p-3 rounded-2xl border-2 border-rose/30 bg-white" />
        </div>
        <div className="flex gap-2">
          <Pill on={mode === "born"} onClick={() => setMode("born")}>이미 태어났어요</Pill>
          <Pill on={mode === "due"} onClick={() => setMode("due")}>출산 예정이에요</Pill>
        </div>
        <div>
          <label className="text-xs font-bold text-ink/60 block mb-1">{mode === "born" ? "생년월일" : "출산 예정일"}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full md:max-w-xs p-3 rounded-2xl border-2 border-rose/30 bg-white" />
        </div>
        <div>
          <label className="text-xs font-bold text-ink/60 block mb-1">출생 순위</label>
          <div className="flex gap-2">
            <Pill on={birthOrder === "first"} onClick={() => setBirthOrder("first")}>첫째</Pill>
            <Pill on={birthOrder === "second"} onClick={() => setBirthOrder("second")}>둘째</Pill>
            <Pill on={birthOrder === "third"} onClick={() => setBirthOrder("third")}>셋째+</Pill>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-ink/60 block mb-1">거주 지역 (아동수당 기준)</label>
          <div className="flex flex-wrap gap-2">
            <Pill on={region === "metro"} onClick={() => setRegion("metro")}>수도권</Pill>
            <Pill on={region === "nonmetro"} onClick={() => setRegion("nonmetro")}>비수도권</Pill>
            <Pill on={region === "depop"} onClick={() => setRegion("depop")}>인구감소·특별</Pill>
          </div>
        </div>
        <div className="flex gap-2">
          <Pill on={!twins} onClick={() => setTwins(false)}>단태아</Pill>
          <Pill on={twins} onClick={() => setTwins(true)}>다태아(쌍둥이)</Pill>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button onClick={() => onSave({ name, mode, date, birthOrder, twins, region })}
          className="btn-pop bg-rose text-white px-5 py-2.5 rounded-full font-bold">저장하기</button>
        {onCancel && (
          <button onClick={onCancel} className="btn-pop bg-white border-2 border-ink/10 text-ink px-5 py-2.5 rounded-full font-bold">취소</button>
        )}
      </div>
    </section>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`btn-pop px-3 py-2 rounded-full text-sm font-bold border-2 ${
        on ? "bg-rose text-white border-rose" : "bg-white text-ink border-rose/30"
      }`}>
      {children}
    </button>
  );
}
