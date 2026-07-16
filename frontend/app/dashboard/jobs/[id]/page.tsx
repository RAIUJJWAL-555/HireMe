"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import { colors } from "../../../lib/design-tokens";
import { DetailSkeleton } from "../../../components/Skeleton";
import ErrorState from "../../../components/ErrorState";

const EXPERIENCE_LABELS: Record<string, string> = {
  Fresher: "Fresher",
  ZeroToOne: "0-1 Years",
  OneToThree: "1-3 Years",
  ThreeToFive: "3-5 Years",
  FivePlus: "5+ Years",
};

interface Candidate {
  id: string;
  name: string;
  email: string;
  currentStage: string;
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  qualification: string;
  experience: string;
  status: "open" | "closed";
  description: string;
  createdAt: string;
  candidates: Candidate[];
}

const STAGE_TOKEN_KEY: Record<string, keyof typeof colors.stage> = {
  Applied: "applied", Screening: "screening", Interview: "interview",
  Offer: "offer", Hired: "hired", Rejected: "rejected",
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = () => {
    setLoading(true);
    setError(null);
    api.get<{ job: Job }>(`/jobs/${id}`)
      .then((d) => setJob(d.job))
      .catch((e) => setError(e.message || "Failed to load job"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJob(); }, [id]);

  if (loading) return <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8"><DetailSkeleton /></div>;
  if (error) return <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8"><ErrorState message={error} onRetry={fetchJob} /></div>;
  if (!job) return <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8"><ErrorState title="Job not found" message="This job doesn't exist or has been removed." onRetry={() => router.push("/dashboard/jobs")} /></div>;

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8">
        <button onClick={() => router.back()} className="block mb-4 text-sm text-zinc-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
          &larr; Back
        </button>

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-6 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-white m-0 break-words">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5">{job.qualification}</span>
                <span className="text-zinc-700">&middot;</span>
                <span>{EXPERIENCE_LABELS[job.experience] || job.experience}</span>
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: job.status === "open" ? colors.successBg : "rgba(255,255,255,0.06)",
                color: job.status === "open" ? colors.successMuted : colors.textMuted,
              }}
            >
              {job.status}
            </span>
          </div>

          {job.description && (
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <Link
              href={`/dashboard/jobs/${job.id}/edit`}
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-all shadow-sm hover:shadow"
            >
              Edit Job
            </Link>
            <Link
              href="/dashboard/jobs"
              className="rounded-full border border-zinc-700/50 bg-zinc-800/80 px-5 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            >
              All Jobs
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-4 md:p-6">
          <h2 className="text-base font-semibold text-white m-0 mb-4">
            Candidates <span className="text-zinc-500 font-normal">({job.candidates.length})</span>
          </h2>

          {job.candidates.length === 0 ? (
            <p className="text-sm text-zinc-600 py-6 text-center">No candidates have applied yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {job.candidates.map((c) => {
                const stageKey = STAGE_TOKEN_KEY[c.currentStage];
                const stageColor = stageKey ? colors.stage[stageKey].dot : "#6b7280";
                const initials = c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/dashboard/candidates/${c.id}`)}
                    className="flex items-center gap-3 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 p-3 cursor-pointer transition-colors hover:border-zinc-600/60"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: stageColor }}>
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate hover:text-orange-400 transition-colors">{c.name}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{c.email}</div>
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: colors.stage[stageKey]?.bg, color: colors.stage[stageKey]?.text }}>
                      {c.currentStage}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
  );
}
