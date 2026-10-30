"use client";

import { useCallback, useEffect, useState } from "react";

// 기기 저장(localStorage) 기록 공용 훅. 서버로 보내지 않는다.
// 같은 키를 쓰는 다른 컴포넌트·탭과 'ssook-store-change' 이벤트로 동기화.
const EVT = "ssook-store-change";

export function useStored<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const [val, setVal] = useState<T>(init);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(key);
        setVal(raw ? (JSON.parse(raw) as T) : init);
      } catch { setVal(init); }
    };
    load();
    setReady(true);
    const on = (e: Event) => {
      const d = e instanceof CustomEvent ? e.detail : null;
      if (d === key || d === "*") load();
    };
    window.addEventListener(EVT, on);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener(EVT, on); window.removeEventListener("storage", load); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback((v: T | ((p: T) => T)) => {
    setVal((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
      return next;
    });
  }, [key]);

  return [val, set, ready];
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* ===== 백업·가족 공유 =====
   기기에 저장된 아이쑥쑥 기록(ssook-* 키) 전체를 JSON 파일 하나로 내보내고 가져온다.
   세션 전용 플래그(스플래시·팝업)는 제외. 개인정보가 담기므로 파일은 사용자가 직접 보관·전달한다. */
const SKIP = new Set(["ssook-splash", "ssook-baby-prompted"]);
export const BACKUP_APP = "ssook-portal";

export type BackupFile = { app: string; version: 1; exportedAt: string; data: Record<string, string> };

export function collectBackup(): BackupFile {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("ssook-") && !SKIP.has(k)) {
      const v = localStorage.getItem(k);
      if (v != null) data[k] = v;
    }
  }
  return { app: BACKUP_APP, version: 1, exportedAt: new Date().toISOString(), data };
}

export function backupFileName() {
  return `아이쑥쑥-백업-${todayISO()}.json`;
}

// 검증 후 반환 (실패 시 에러 메시지)
export function parseBackup(text: string): { ok: true; file: BackupFile } | { ok: false; error: string } {
  let obj: any;
  try { obj = JSON.parse(text); } catch { return { ok: false, error: "백업 파일을 읽을 수 없어요. 아이쑥쑥에서 내보낸 .json 파일인지 확인해주세요." }; }
  if (!obj || obj.app !== BACKUP_APP || typeof obj.data !== "object" || obj.data === null) {
    return { ok: false, error: "아이쑥쑥 백업 파일이 아니에요." };
  }
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj.data)) {
    if (k.startsWith("ssook-") && !SKIP.has(k) && typeof v === "string") data[k] = v;
  }
  return { ok: true, file: { app: BACKUP_APP, version: 1, exportedAt: String(obj.exportedAt || ""), data } };
}

// 가져오기 — 파일에 있는 항목으로 이 기기의 같은 항목을 덮어쓴다 (파일에 없는 항목은 그대로)
export function applyBackup(file: BackupFile) {
  for (const [k, v] of Object.entries(file.data)) localStorage.setItem(k, v);
  window.dispatchEvent(new Event("ssook-baby-change"));
  window.dispatchEvent(new CustomEvent(EVT, { detail: "*" }));
}

// 사람이 읽을 수 있는 백업 내용 요약
const LABELS: Record<string, string> = {
  "ssook-baby-v1": "아기 정보",
  "ssook-checklist-v1": "출산준비물 체크",
  "ssook-timeline-check": "신청 할 일 체크",
  "ssook-food-v1": "이유식 재료 기록",
  "ssook-milestone-v1": "발달 체크",
  "ssook-visit-memo-v1": "진료 메모",
  "ssook-region-v2": "우리 동네 지역",
  "ssook-med-region": "의료 지역",
};
export function describeBackup(file: BackupFile) {
  return Object.keys(file.data).map((k) => LABELS[k] || k);
}
