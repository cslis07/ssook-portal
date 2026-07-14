"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* 필요 시 로깅 훅 위치 */ }, [error]);
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div className="card p-8 md:p-12 max-w-md">
        <div className="text-6xl">🍼</div>
        <h1 className="text-2xl font-extrabold text-ink mt-4">잠시 문제가 생겼어요</h1>
        <p className="text-ink/60 mt-2 text-sm">일시적인 오류일 수 있어요. 다시 시도해보세요.</p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <button onClick={reset} className="btn-pop bg-ink text-cream px-5 py-2.5 rounded-full font-bold">🔄 다시 시도</button>
          <Link href="/" className="btn-pop bg-white border-2 border-ink/10 text-ink px-5 py-2.5 rounded-full font-bold">🏠 홈으로</Link>
        </div>
      </div>
    </div>
  );
}
