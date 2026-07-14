import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div className="card p-8 md:p-12 max-w-md dotbg">
        <div className="text-6xl">🌱</div>
        <h1 className="text-2xl font-extrabold text-ink mt-4">페이지를 찾을 수 없어요</h1>
        <p className="text-ink/60 mt-2 text-sm">주소가 바뀌었거나 없는 페이지예요. 홈에서 다시 찾아볼까요?</p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Link href="/" className="btn-pop bg-ink text-cream px-5 py-2.5 rounded-full font-bold">🏠 홈으로</Link>
          <Link href="/calculator" className="btn-pop bg-white border-2 border-ink/10 text-ink px-5 py-2.5 rounded-full font-bold">🧮 지원금 계산</Link>
        </div>
      </div>
    </div>
  );
}
