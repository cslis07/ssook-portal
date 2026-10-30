"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBaby, ageMonths, ageDays, todayISO, type Baby } from "@/lib/baby";
import { BabyAvatar, IconChevronDown } from "@/components/ui2/Icons";

// 어디서든 아기 정보 창을 열 수 있게 하는 공용 신호 (히어로 칩·CTA·모바일 '내 정보')
const OPEN_EVT = "ssook-open-baby";
export function openBabyModal() {
  window.dispatchEvent(new Event(OPEN_EVT));
}

// 화면에 보여줄 아기 요약 (프로필 없으면 null) — 이름·월령은 실제 저장값에서만 계산
export function babySummary(baby: Baby | null) {
  if (!baby) return null;
  const born = baby.mode === "born";
  const name = baby.name?.trim() || "우리 아이";
  const sub = born
    ? ageDays(baby) < 0 ? "곧 만나요" : `${ageMonths(baby)}개월`
    : `출산 예정 D-${Math.max(0, -ageDays(baby))}`;
  return { name, sub };
}

// 헤더 우측 프로필 버튼 — 미입력 시 "아기 정보 입력", 입력 시 애칭·월령 표시
// (UI 2.0: 첫 방문 강제 팝업은 하지 않음 — DESIGN_SPEC 5.3. 히어로 칩/CTA로 부드럽게 유도)
export default function BabyButton() {
  const [baby, setBaby, ready] = useBaby();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVT, onOpen);
    return () => window.removeEventListener(OPEN_EVT, onOpen);
  }, []);

  const s = babySummary(baby);

  return (
    <>
      <button onClick={() => setOpen(true)} className="ss-profile" aria-label={s ? `${s.name} 정보 보기·수정` : "아기 정보 입력"}>
        <BabyAvatar size={40} />
        {ready && (
          <span className="ss-profile-name">
            {s ? s.name : "아기 정보 입력"}
            {s && <span className="ss-profile-sub">{s.sub}</span>}
          </span>
        )}
        <IconChevronDown size={16} className="ss-profile-chev" />
      </button>

      {/* NavBar의 backdrop-blur가 fixed 기준을 헤더로 바꿔버리므로 body로 포털 렌더 */}
      {open && createPortal(
        <ProfileModal
          initial={baby}
          onClose={() => setOpen(false)}
          onSave={(b) => { setBaby(b); setOpen(false); }}
          onClear={baby ? () => { setBaby(null); setOpen(false); } : undefined}
        />,
        document.body
      )}
    </>
  );
}

function ProfileModal({ initial, onClose, onSave, onClear }: {
  initial: Baby | null; onClose: () => void; onSave: (b: Baby) => void; onClear?: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [mode, setMode] = useState<Baby["mode"]>(initial?.mode || "born");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [birthOrder, setBirthOrder] = useState<Baby["birthOrder"]>(initial?.birthOrder || "first");
  const [twins, setTwins] = useState(initial?.twins || false);
  const [region, setRegion] = useState<Baby["region"]>(initial?.region || "metro");

  // ESC로 닫기 (접근성)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] bg-[rgba(15,23,42,.38)] flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="ss-baby-title"
        className="bg-white w-full max-w-[290px] max-h-[75vh] overflow-y-auto rounded-[20px] p-3.5 shadow-[0_24px_60px_rgba(15,23,42,.22)] text-[color:var(--ss-text)]"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h2 id="ss-baby-title" className="text-sm font-extrabold text-[color:var(--ss-ink)]">🍼 우리 아기 정보 <span className="font-semibold text-[10px] text-[color:var(--ss-muted)]">(기기에만 저장)</span></h2>
          <button onClick={onClose} aria-label="닫기" className="text-[color:var(--ss-muted)] text-xl leading-none px-1">×</button>
        </div>

        <div className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="애칭 (선택) — 예: 콩이" aria-label="애칭"
            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E5EC] bg-white text-xs" />
          <div className="flex gap-1">
            <Pill on={mode === "born"} onClick={() => setMode("born")}>태어났어요</Pill>
            <Pill on={mode === "due"} onClick={() => setMode("due")}>출산 예정</Pill>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[color:var(--ss-muted)] block mb-0.5">{mode === "born" ? "생년월일" : "출산 예정일"}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={mode === "born" ? "생년월일" : "출산 예정일"}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[#E2E5EC] bg-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[color:var(--ss-muted)] block mb-0.5">출생 순위</label>
            <div className="flex gap-1">
              <Pill on={birthOrder === "first"} onClick={() => setBirthOrder("first")}>첫째</Pill>
              <Pill on={birthOrder === "second"} onClick={() => setBirthOrder("second")}>둘째</Pill>
              <Pill on={birthOrder === "third"} onClick={() => setBirthOrder("third")}>셋째+</Pill>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[color:var(--ss-muted)] block mb-0.5">거주 지역 (아동수당 기준)</label>
            <div className="flex flex-wrap gap-1">
              <Pill on={region === "metro"} onClick={() => setRegion("metro")}>수도권</Pill>
              <Pill on={region === "nonmetro"} onClick={() => setRegion("nonmetro")}>비수도권</Pill>
              <Pill on={region === "depop"} onClick={() => setRegion("depop")}>인구감소</Pill>
            </div>
          </div>
          <div className="flex gap-1">
            <Pill on={!twins} onClick={() => setTwins(false)}>단태아</Pill>
            <Pill on={twins} onClick={() => setTwins(true)}>다태아</Pill>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <button onClick={() => onSave({ name, mode, date, birthOrder, twins, region })}
            className="btn-pop flex-1 px-4 py-2 rounded-full font-bold text-xs text-[#1E1A1A] border border-[#FFC59E] bg-[linear-gradient(180deg,#FFE3CC,#FAB792)] shadow-[0_3px_0_rgba(222,154,115,.4)]">저장하기</button>
          {onClear && (
            <button onClick={onClear} className="btn-pop bg-white border border-[#E2E5EC] text-[color:var(--ss-muted)] px-3 py-2 rounded-full font-bold text-xs">삭제</button>
          )}
        </div>
        <a href="/my" onClick={onClose} className="mt-2 block text-center text-[11px] font-bold text-[color:var(--ss-muted)] underline">
          내 아이 기록 · 백업 · 가족 공유 →
        </a>
      </div>
    </div>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      aria-pressed={on}
      className={`btn-pop px-2.5 py-1 rounded-full text-[11px] font-bold border ${
        on ? "bg-[#FCEFE3] text-[color:var(--ss-ink)] border-[#FFC59E]" : "bg-white text-[color:var(--ss-text)] border-[#E2E5EC]"
      }`}>
      {children}
    </button>
  );
}
