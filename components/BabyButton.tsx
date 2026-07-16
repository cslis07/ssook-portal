"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBaby, ageMonths, ageDays, todayISO, type Baby } from "@/lib/baby";

// NavBar 좌측 상단 버튼 — 미입력 시 "아기 정보 입력하기", 입력 시 아이 이름 표시
export default function BabyButton() {
  const [baby, setBaby, ready] = useBaby();
  const [open, setOpen] = useState(false);

  // 아직 아기 정보를 입력하지 않았으면 팝업으로 유도 (세션당 1회)
  useEffect(() => {
    if (!ready || baby) return;
    try {
      if (!sessionStorage.getItem("ssook-baby-prompted")) {
        setOpen(true);
        sessionStorage.setItem("ssook-baby-prompted", "1");
      }
    } catch {
      setOpen(true);
    }
  }, [ready, baby]);

  const born = baby?.mode === "born";
  const name = baby?.name?.trim() || "우리 아기";
  const sub = baby
    ? born
      ? ageDays(baby) < 0 ? "곧 만나요" : `생후 ${ageMonths(baby)}개월`
      : "출산 예정"
    : "";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-pop flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-rose/20 transition min-w-0"
      >
        <span className="w-8 h-8 rounded-full bg-rose grid place-items-center text-base shrink-0">
          {baby ? "👶" : "🍼"}
        </span>
        {ready && (
          baby ? (
            <span className="text-left min-w-0">
              <span className="block text-sm font-extrabold text-ink leading-none truncate max-w-[110px]">{name}</span>
              <span className="block text-[10px] text-ink/50 leading-none mt-0.5">{sub}</span>
            </span>
          ) : (
            <span className="text-sm font-bold text-ink whitespace-nowrap">아기 정보 입력하기</span>
          )
        )}
        <span className="text-ink/30 text-xs">›</span>
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

  return (
    <div className="fixed inset-0 z-[60] bg-ink/40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-cream w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-blob md:rounded-blob p-5 md:p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-extrabold text-ink">🍼 우리 아기 정보</h2>
          <button onClick={onClose} className="text-ink/50 text-2xl leading-none px-2">×</button>
        </div>
        <p className="text-sm text-ink/60 mb-4">한 번만 입력하면 개월별 가이드·접종 D-day·지원금 계산이 우리 아기 기준으로 맞춰져요. (기기에만 저장)</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-ink/60 block mb-1">애칭 (선택)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 콩이"
              className="w-full p-3 rounded-2xl border-2 border-rose/30 bg-white" />
          </div>
          <div className="flex gap-2">
            <Pill on={mode === "born"} onClick={() => setMode("born")}>이미 태어났어요</Pill>
            <Pill on={mode === "due"} onClick={() => setMode("due")}>출산 예정이에요</Pill>
          </div>
          <div>
            <label className="text-xs font-bold text-ink/60 block mb-1">{mode === "born" ? "생년월일" : "출산 예정일"}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-rose/30 bg-white" />
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

        <div className="mt-5 flex items-center gap-2">
          <button onClick={() => onSave({ name, mode, date, birthOrder, twins, region })}
            className="btn-pop bg-rose text-white px-5 py-2.5 rounded-full font-bold flex-1">저장하기</button>
          {onClear && (
            <button onClick={onClear} className="btn-pop bg-white border-2 border-ink/10 text-ink/60 px-4 py-2.5 rounded-full font-bold text-sm">삭제</button>
          )}
        </div>
      </div>
    </div>
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
