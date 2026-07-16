// 광고 슬롯 — 쿠팡 파트너스(제휴) 네이티브 배너. 표시광고법 고지 포함.
// 실제 링크는 환경변수로 교체:
//   NEXT_PUBLIC_COUPANG_URL   = 쿠팡 파트너스 추적 링크 (없으면 육아 카테고리 기본)
//   NEXT_PUBLIC_COUPANG_TITLE = 배너 문구
// 추후 AdSense(웹) 등 다른 네트워크로 교체 가능.

const DEFAULT_URL = "https://www.coupang.com/np/categories/115622"; // 출산/육아 카테고리
const DEFAULT_TITLE = "출산·육아 준비물 쿠팡에서 한 번에";

export default function AdSlot({ variant = "banner" }: { variant?: "banner" | "inline" }) {
  const url = process.env.NEXT_PUBLIC_COUPANG_URL || DEFAULT_URL;
  const title = process.env.NEXT_PUBLIC_COUPANG_TITLE || DEFAULT_TITLE;

  return (
    <section aria-label="광고">
      <a
        href={url}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="btn-pop block card overflow-hidden bg-gradient-to-r from-peach/50 to-rose/30"
      >
        <div className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-2xl bg-white grid place-items-center text-3xl shrink-0 shadow-soft">🛒</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-ink/50 bg-white/70 px-1.5 py-0.5 rounded">광고 · AD</span>
            </div>
            <div className="font-extrabold text-ink text-sm md:text-base mt-1 leading-tight">{title}</div>
          </div>
          <span className="text-ink/40 text-lg shrink-0">›</span>
        </div>
      </a>
      <p className="text-[10px] text-ink/40 mt-1 px-1">
        쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.
      </p>
    </section>
  );
}
