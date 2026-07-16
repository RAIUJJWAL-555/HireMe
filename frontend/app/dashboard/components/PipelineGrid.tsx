"use client";

interface Metric {
  label: string;
  value: number;
  color: string;
}

interface PipelineGridProps {
  metrics?: Metric[];
  loading?: boolean;
}

export default function PipelineGrid({ metrics = [], loading = false }: PipelineGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Pipeline</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/40 p-5 animate-pulse"
            >
              <div className="h-10 w-1 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700/50" />
              <div>
                <div className="h-3 w-12 rounded bg-zinc-300 dark:bg-zinc-700/50 mb-2" />
                <div className="h-6 w-10 rounded bg-zinc-300 dark:bg-zinc-700/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Pipeline</h2>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/40 p-5"
          >
            <div className={`h-10 w-1 shrink-0 rounded-full ${m.color}`} />
            <div>
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{m.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-zinc-900 dark:text-white">{m.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
