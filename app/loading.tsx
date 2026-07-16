export default function Loading() {
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl sprout-loading">🌱</div>
        <div className="text-ink/50 text-sm font-semibold">불러오는 중…</div>
      </div>
    </div>
  );
}
