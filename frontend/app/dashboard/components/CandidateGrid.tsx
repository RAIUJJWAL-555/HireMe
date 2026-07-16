"use client";

interface Candidate {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  progress: number;
  progressColor: string;
}

const COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-blue-500",
];

function deriveCandidate(c: any): Candidate {
  const initials =
    c.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";
  const colorIndex = c.name.length % COLORS.length;
  const avatarColor = COLORS[colorIndex];
  const progress = (c.name.length * 3 + (c.id ? c.id.charCodeAt(c.id.length - 1) : 0)) % 35 + 65;
  const progressColor =
    progress >= 85
      ? "bg-gradient-to-r from-teal-400 to-emerald-400"
      : progress >= 75
        ? "bg-teal-400"
        : "bg-orange-400";

  return {
    id: c.id,
    name: c.name,
    role: c.job?.title || "Applied Role",
    initials,
    avatarColor,
    progress,
    progressColor,
  };
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="group rounded-2xl bg-background border border-divider p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      {/* Avatar */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface text-lg font-bold text-text-heading ring-2 ring-divider">
        <span className={candidate.avatarColor + " flex h-full w-full items-center justify-center rounded-full"}>
          {candidate.initials}
        </span>
      </div>

      {/* Name + role */}
      <h3 className="text-center text-base font-semibold text-text-heading">
        {candidate.name}
      </h3>
      <p className="mt-1 text-center text-sm text-text-muted-token truncate">
        {candidate.role}
      </p>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-text-faint">
          <span>Match score</span>
          <span className="font-medium text-text-heading">{candidate.progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className={`h-full rounded-full ${candidate.progressColor} transition-all duration-500`}
            style={{ width: `${candidate.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CandidateCardSkeleton() {
  return (
    <div className="rounded-2xl bg-background border border-divider p-6 animate-pulse">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface" />
      <div className="mx-auto h-4 w-28 rounded bg-surface mb-2" />
      <div className="mx-auto h-3.5 w-36 rounded bg-surface mb-5" />
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-surface" />
          <div className="h-3 w-8 rounded bg-surface" />
        </div>
        <div className="h-2 w-full rounded-full bg-surface" />
      </div>
    </div>
  );
}

export default function CandidateGrid({
  candidates = [],
  loading = false,
}: {
  candidates?: any[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <CandidateCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-center justify-center rounded-2xl bg-surface border border-divider border-dashed p-8 text-center min-h-[260px]">
          <p className="text-sm font-medium text-text-muted-token">No candidates imported yet</p>
          <p className="mt-1 text-xs text-text-faint">Upload a CSV in Candidates tab to see them here.</p>
        </div>
      </div>
    );
  }

  const derived = candidates.map(deriveCandidate);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {derived.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  );
}
