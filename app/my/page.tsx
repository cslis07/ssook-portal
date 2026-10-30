"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useBaby, ageMonths, ageDays } from "@/lib/baby";
import { upcomingEvents } from "@/lib/schedule";
import { useStored, collectBackup, backupFileName, parseBackup, applyBackup, describeBackup, type BackupFile } from "@/lib/records";
import { MILESTONE_SECTIONS, milestonesOf, sectionIdForMonths, AREA_LABEL } from "@/lib/milestones";
import { babySummary, openBabyModal } from "@/components/BabyButton";
import { BabyAvatar } from "@/components/ui2/Icons";

type FoodRec = { date: string; memo: string };

export default function MyPage() {
  const [baby, , ready] = useBaby();
  const [food] = useStored<Record<string, FoodRec>>("ssook-food-v1", {});
  const [checks] = useStored<Record<string, string>>("ssook-milestone-v1", {});
  const [memo, setMemo] = useStored<string>("ssook-visit-memo-v1", "");
  const s = babySummary(baby);

  const born = baby?.mode === "born" && ageDays(baby) >= 0;
  const months = born ? ageMonths(baby!) : null;
  const events = baby?.mode === "born" ? upcomingEvents(baby, { max: 3 }) : [];
  const sec = months !== null ? MILESTONE_SECTIONS.find((x) => x.id === sectionIdForMonths(months)) : undefined;
  const secItems = sec ? milestonesOf(sec) : [];
  const secDone = secItems.filter((m) => checks[m.key]);
  const foodNames = Object.keys(food);
  const foodMemos = foodNames.filter((n) => food[n].memo?.trim());

  return (
    <div className="space-y-6">
      <header className="no-print">
        <span className="chip bg-peach/70 text-ink">내 아이</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink mt-2">🧸 내 아이 기록</h1>
        <p className="text-ink/70 mt-2">아기 정보와 기록을 한눈에 보고, 진료 전 요약을 만들거나 가족과 공유하세요. 모든 기록은 이 기기에만 저장돼요.</p>
      </header>

      {/* 프로필 */}
      <div className="card p-5 flex items-center gap-4 no-print">
        <BabyAvatar size={56} />
        <div className="min-w-0">
          <p className="font-extrabold text-ink text-lg">{ready ? (s ? s.name : "아기 정보가 없어요") : " "}</p>
          <p className="text-sm text-ink/60">{s ? s.sub : "입력하면 개월수·접종 일정에 맞춰 안내해요"}</p>
        </div>
        <button onClick={openBabyModal} className="btn-pop ml-auto min-h-[44px] px-5 rounded-full font-bold text-sm bg-rose text-white border border-rose">
          {s ? "수정" : "입력하기"}
        </button>
      </div>

      {/* 진료 전 요약 (인쇄 영역) */}
      <section className="card p-6 print-area" aria-labelledby="visit-h">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 id="visit-h" className="text-xl font-extrabold text-ink">🩺 진료 전 요약</h2>
          <button onClick={() => window.print()} className="no-print btn-pop min-h-[44px] px-5 rounded-full font-bold text-sm bg-ink text-cream">
            🖨️ 인쇄 · PDF로 저장
          </button>
        </div>
        <p className="text-xs text-ink/50 mt-1">작성일 {new Date().toLocaleDateString("ko-KR")} · 아이쑥쑥 기록 요약 (진단 자료 아님)</p>

        <dl className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-[#F7F8FA] p-3"><dt className="text-ink/50 text-xs">이름(애칭)</dt><dd className="font-bold text-ink">{s?.name || "-"}</dd></div>
          <div className="rounded-2xl bg-[#F7F8FA] p-3"><dt className="text-ink/50 text-xs">{baby?.mode === "due" ? "출산 예정일" : "생년월일"}</dt><dd className="font-bold text-ink">{baby?.date || "-"}</dd></div>
          <div className="rounded-2xl bg-[#F7F8FA] p-3"><dt className="text-ink/50 text-xs">월령</dt><dd className="font-bold text-ink">{months !== null ? `${months}개월` : s?.sub || "-"}</dd></div>
        </dl>

        <div className="mt-5 grid md:grid-cols-2 gap-5 text-sm">
          <div>
            <h3 className="font-extrabold text-ink mb-2">다가오는 접종·검진 (권장 시기)</h3>
            {events.length ? (
              <ul className="space-y-1 text-ink/80">{events.map((e) => <li key={e.id}>• {e.label} — {e.windowLabel} ({e.dueISO} 무렵)</li>)}</ul>
            ) : <p className="text-ink/50">아기 정보(생년월일)를 입력하면 표시돼요.</p>}
          </div>
          <div>
            <h3 className="font-extrabold text-ink mb-2">발달 체크 {sec ? `(${sec.label})` : ""}</h3>
            {sec ? (
              secDone.length ? (
                <ul className="space-y-1 text-ink/80">{secDone.slice(0, 8).map((m) => <li key={m.key}>✓ [{AREA_LABEL[m.area]}] {m.text}</li>)}
                  {secDone.length > 8 && <li className="text-ink/50">외 {secDone.length - 8}개</li>}</ul>
              ) : <p className="text-ink/50">아직 체크한 항목이 없어요. <Link href="/milestones" className="underline no-print">발달 체크하기</Link></p>
            ) : <p className="text-ink/50">출생 후 월령에 맞춰 표시돼요.</p>}
            {sec && <p className="text-xs text-ink/50 mt-1">{secDone.length} / {secItems.length}개 체크</p>}
          </div>
          <div>
            <h3 className="font-extrabold text-ink mb-2">이유식 — 먹어본 재료 {foodNames.length}개</h3>
            {foodMemos.length ? (
              <ul className="space-y-1 text-ink/80">{foodMemos.map((n) => <li key={n}>• {n} ({food[n].date}): {food[n].memo}</li>)}</ul>
            ) : <p className="text-ink/50">반응 메모를 남긴 재료가 없어요. <Link href="/food" className="underline no-print">이유식 체크하기</Link></p>}
          </div>
          <div>
            <h3 className="font-extrabold text-ink mb-2">진료 때 물어볼 것</h3>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={4} aria-label="진료 때 물어볼 것 메모"
              placeholder="예: 밤에 자주 깨요 / 2~3일째 변비가 있어요"
              className="w-full px-3 py-2 rounded-xl border border-[#E2E5EC] bg-white text-sm" />
          </div>
        </div>
        <p className="text-xs text-ink/50 mt-4">※ 접종·검진은 표준 권장 시기 기준이며 실제 일정은 접종기관·예방접종도우미에서 확인하세요. 이 요약은 보호자 기록이며 의학적 진단이 아니에요.</p>
      </section>

      <BackupCard />
    </div>
  );
}

/* ---------- 백업·가족 공유 ---------- */
function BackupCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, setPending] = useState<BackupFile | null>(null);

  const makeFile = () => {
    const b = collectBackup();
    return { b, file: new File([JSON.stringify(b, null, 2)], backupFileName(), { type: "application/json" }) };
  };

  const download = () => {
    const { b, file } = makeFile();
    if (!Object.keys(b.data).length) { setMsg({ kind: "err", text: "아직 저장된 기록이 없어요." }); return; }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMsg({ kind: "ok", text: `${file.name} 파일로 저장했어요.` });
  };

  const share = async () => {
    const { b, file } = makeFile();
    if (!Object.keys(b.data).length) { setMsg({ kind: "err", text: "아직 저장된 기록이 없어요." }); return; }
    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: "아이쑥쑥 기록 백업" });
        setMsg({ kind: "ok", text: "공유했어요. 받은 사람은 '파일에서 가져오기'로 열면 돼요." });
      } catch { /* 사용자가 취소 */ }
    } else {
      download();
      setMsg({ kind: "ok", text: "이 기기는 파일 공유를 지원하지 않아 파일로 저장했어요. 메신저로 직접 보내주세요." });
    }
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const r = parseBackup(await f.text());
    if (!r.ok) { setMsg({ kind: "err", text: r.error }); setPending(null); return; }
    setPending(r.file); setMsg(null);
  };

  const confirm = () => {
    if (!pending) return;
    applyBackup(pending);
    setPending(null);
    setMsg({ kind: "ok", text: "기록을 가져왔어요." });
  };

  return (
    <section className="card p-6 no-print" aria-labelledby="bk-h">
      <h2 id="bk-h" className="text-xl font-extrabold text-ink">💾 기록 백업 · 가족 공유</h2>
      <p className="text-sm text-ink/70 mt-1">
        기록은 이 기기에만 있어서 폰을 바꾸거나 브라우저 데이터를 지우면 사라져요. 파일로 내보내 두거나, 배우자에게 보내 같은 기록을 볼 수 있어요.
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={share} className="btn-pop min-h-[44px] px-5 rounded-full font-bold text-sm bg-rose text-white border border-rose">📤 가족에게 공유</button>
        <button onClick={download} className="btn-pop min-h-[44px] px-5 rounded-full font-bold text-sm bg-white text-ink border border-[#E2E5EC]">⬇️ 파일로 내보내기</button>
        <button onClick={() => fileRef.current?.click()} className="btn-pop min-h-[44px] px-5 rounded-full font-bold text-sm bg-white text-ink border border-[#E2E5EC]">📥 파일에서 가져오기</button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onPick} aria-label="백업 파일 선택" />
      </div>

      {pending && (
        <div className="mt-4 rounded-2xl border border-[#FFC59E] bg-[#FFF4EA] p-4 text-sm" role="alertdialog" aria-label="가져오기 확인">
          <p className="font-bold text-ink">이 파일의 기록으로 덮어쓸까요?</p>
          <p className="text-ink/70 mt-1">포함된 기록: {describeBackup(pending).join(", ") || "없음"}</p>
          {pending.exportedAt && <p className="text-xs text-ink/50 mt-0.5">내보낸 시각: {new Date(pending.exportedAt).toLocaleString("ko-KR")}</p>}
          <p className="text-xs text-ink/60 mt-1">같은 항목은 이 기기의 기록이 파일 내용으로 바뀌어요. 파일에 없는 항목은 그대로 둬요.</p>
          <div className="flex gap-2 mt-3">
            <button onClick={confirm} className="btn-pop min-h-[40px] px-4 rounded-full font-bold text-sm bg-rose text-white border border-rose">가져오기</button>
            <button onClick={() => setPending(null)} className="btn-pop min-h-[40px] px-4 rounded-full font-bold text-sm bg-white text-ink border border-[#E2E5EC]">취소</button>
          </div>
        </div>
      )}
      {msg && <p className={`mt-3 text-sm font-bold ${msg.kind === "ok" ? "text-[#3E8B5E]" : "text-[#B4232E]"}`} role="status">{msg.text}</p>}

      <p className="text-xs text-ink/50 mt-4">🔒 백업 파일에는 아기 정보(애칭·생년월일 등)가 들어 있어요. 믿을 수 있는 가족에게만 보내고, 서버에는 저장되지 않아요.</p>
    </section>
  );
}
