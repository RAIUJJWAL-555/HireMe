"use client";

export function Skeleton({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-zinc-700/50 ${className}`}
      style={style}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-4">
      <Skeleton style={{ width: "80px", height: "12px", marginBottom: "8px" }} />
      <Skeleton style={{ width: "60px", height: "28px" }} />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-t border-zinc-800/60">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-4 align-middle">
          <Skeleton style={{ width: i === 0 ? "120px" : "80px", height: "14px" }} />
        </td>
      ))}
    </tr>
  );
}

export function KanbanCardSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-800/60 border border-zinc-700/40 p-3">
      <Skeleton style={{ width: "100px", height: "14px", marginBottom: "6px" }} />
      <Skeleton style={{ width: "140px", height: "10px", marginBottom: "8px" }} />
      <Skeleton style={{ width: "60px", height: "16px", borderRadius: "4px" }} />
    </div>
  );
}

export function KanbanColumnSkeleton() {
  return (
    <div className="w-[260px] min-w-[260px] shrink-0 rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-3">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton style={{ width: "10px", height: "10px", borderRadius: "50%" }} />
        <Skeleton style={{ width: "80px", height: "14px" }} />
      </div>
      <div className="flex flex-col gap-2">
        <KanbanCardSkeleton />
        <KanbanCardSkeleton />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-[720px]">
      <Skeleton style={{ width: "60px", height: "14px", marginBottom: "16px" }} />
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-6 mb-4">
        <div className="flex justify-between">
          <div>
            <Skeleton style={{ width: "180px", height: "22px", marginBottom: "8px" }} />
            <Skeleton style={{ width: "140px", height: "14px" }} />
          </div>
          <Skeleton style={{ width: "80px", height: "24px", borderRadius: "9999px" }} />
        </div>
        <Skeleton style={{ width: "100%", height: "60px", marginTop: "16px", borderRadius: "8px" }} />
      </div>
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-6 mb-4">
        <Skeleton style={{ width: "60px", height: "16px", marginBottom: "12px" }} />
        <Skeleton style={{ width: "100%", height: "100px", borderRadius: "8px" }} />
        <Skeleton style={{ width: "100px", height: "36px", marginTop: "12px", borderRadius: "8px" }} />
      </div>
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-6">
        <Skeleton style={{ width: "100px", height: "16px", marginBottom: "16px" }} />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton style={{ width: "10px", height: "10px", borderRadius: "50%", marginTop: "4px" }} />
              <div>
                <Skeleton style={{ width: "120px", height: "14px", marginBottom: "4px" }} />
                <Skeleton style={{ width: "100px", height: "10px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="max-w-[600px]">
      <Skeleton style={{ width: "120px", height: "20px", marginBottom: "24px" }} />
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton style={{ width: "80px", height: "12px", marginBottom: "6px" }} />
            <Skeleton style={{ width: "100%", height: "36px", borderRadius: "8px" }} />
          </div>
        ))}
        <Skeleton style={{ width: "100px", height: "36px", borderRadius: "8px", marginTop: "8px" }} />
      </div>
    </div>
  );
}
