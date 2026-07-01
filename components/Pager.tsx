"use client";

export default function Pager({
  page,
  totalPages,
  onPage,
  loading,
}: {
  page: number; // 1-based
  totalPages: number;
  onPage: (p: number) => void;
  loading?: boolean;
}) {
  if (totalPages <= 1) return null;

  // 현재 페이지 주변 최대 5개 번호
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const nums: number[] = [];
  for (let i = start; i <= end; i++) nums.push(i);

  const btn = "min-w-9 h-9 px-2 rounded-xl font-bold text-sm transition disabled:opacity-40";

  return (
    <div className="flex items-center justify-center gap-1.5 py-2 flex-wrap">
      <button className={`${btn} bg-white border-2 border-rose/30 text-ink`}
        disabled={page <= 1 || loading} onClick={() => onPage(page - 1)}>‹</button>
      {start > 1 && (
        <>
          <button className={`${btn} bg-white border-2 border-rose/30 text-ink`} onClick={() => onPage(1)}>1</button>
          {start > 2 && <span className="text-ink/40 px-1">…</span>}
        </>
      )}
      {nums.map((n) => (
        <button key={n}
          className={`${btn} border-2 ${n === page ? "bg-rose text-white border-rose" : "bg-white border-rose/30 text-ink"}`}
          disabled={loading} onClick={() => onPage(n)}>{n}</button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-ink/40 px-1">…</span>}
          <button className={`${btn} bg-white border-2 border-rose/30 text-ink`} onClick={() => onPage(totalPages)}>{totalPages}</button>
        </>
      )}
      <button className={`${btn} bg-white border-2 border-rose/30 text-ink`}
        disabled={page >= totalPages || loading} onClick={() => onPage(page + 1)}>›</button>
    </div>
  );
}
