"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { NAV_GROUPS, HELP_LINKS } from "@/lib/nav";
import { useBaby } from "@/lib/baby";
import { babySummary, openBabyModal } from "@/components/BabyButton";
import { BabyAvatar, IconClose } from "./Icons";

// 전체 메뉴 시트 — 12개 기능·이용가이드·개인정보로 1~2탭 내 이동 보장
// withMe=true 면 상단에 '내 아이' 카드(아기 정보 보기·수정) 표시 (모바일 '내 정보' 탭)
export default function MenuSheet({ open, onClose, withMe = false }: { open: boolean; onClose: () => void; withMe?: boolean }) {
  const [baby] = useBaby();
  const s = babySummary(baby);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="ss-sheet-backdrop" onClick={onClose}>
      <div className="ss-sheet" role="dialog" aria-modal="true" aria-label={withMe ? "내 정보" : "전체 메뉴"} onClick={(e) => e.stopPropagation()}>
        <div className="ss-sheet-head">
          <h2>{withMe ? "내 정보" : "전체 메뉴"}</h2>
          <button className="ss-icon-btn" onClick={onClose} aria-label="닫기"><IconClose /></button>
        </div>

        {withMe && (
          <div className="ss-me-card">
            <BabyAvatar size={48} />
            <div>
              <b>{s ? s.name : "아기 정보가 없어요"}</b>
              <small>{s ? s.sub : "입력하면 개월수·D-day에 맞춰 안내해요 (기기에만 저장)"}</small>
            </div>
            <button onClick={() => { onClose(); openBabyModal(); }}>{s ? "수정" : "입력하기"}</button>
          </div>
        )}

        {NAV_GROUPS.map((g) => (
          <div key={g.id} className="ss-sheet-group">
            <h3>{g.label}</h3>
            <div className="ss-sheet-links">
              {g.items.map((it) => (
                <Link key={it.href} href={it.href} onClick={onClose}>
                  <b>{it.label}</b>
                  {it.desc && <small>{it.desc}</small>}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="ss-sheet-group">
          <h3>도움말</h3>
          <div className="ss-sheet-links">
            {HELP_LINKS.map((it) => (
              <a key={it.href} href={it.href} onClick={onClose}><b>{it.label}</b></a>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
