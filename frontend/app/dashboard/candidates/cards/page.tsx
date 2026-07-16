"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { api } from "../../../lib/api";
import { colors } from "../../../lib/design-tokens";
import { CandidatesEmptyState } from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";

const STAGES = ["", "Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const STAGE_TOKEN_KEY: Record<string, keyof typeof colors.stage> = {
  Applied: "applied", Screening: "screening", Interview: "interview",
  Offer: "offer", Hired: "hired", Rejected: "rejected",
};

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  resumeUrl: string | null;
  currentStage: string;
  createdAt: string;
  job: { id: string; title: string };
}

interface Job {
  id: string;
  title: string;
}

export default function CandidateCardsPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (search) params.set("search", search);
      if (stageFilter) params.set("stage", stageFilter);
      if (jobFilter) params.set("jobId", jobFilter);

      const data = await api.get<{ candidates: Candidate[] }>(`/candidates?${params}`);
      setCandidates(data.candidates);
    } catch (err: any) {
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter, jobFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    api.get<{ jobs: Job[] }>("/jobs").then((d) => setJobs(d.jobs)).catch(console.error);
  }, []);

  const hasFilters = !!(search || stageFilter || jobFilter);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white m-0">Candidates</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/candidates"
            className="rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            Kanban View
          </Link>
          <Link
            href="/dashboard/candidates/list"
            className="rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            List View
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="min-w-0 sm:min-w-[140px] rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{s || "All stages"}</option>
          ))}
        </select>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="min-w-0 sm:min-w-[180px] rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
        >
          <option value="">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/60 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-zinc-200 dark:bg-zinc-700/30 shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-700/30 mb-2" />
                  <div className="h-3 w-36 rounded bg-zinc-200 dark:bg-zinc-700/30" />
                </div>
              </div>
              <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700/30 mb-3" />
              <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700/30" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCandidates} />
      ) : candidates.length === 0 ? (
        <CandidatesEmptyState hasFilters={hasFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {candidates.map((candidate) => {
            const stageKey = STAGE_TOKEN_KEY[candidate.currentStage];
            const stageColor = stageKey ? colors.stage[stageKey] : null;
            const initials = candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={candidate.id}
                onClick={() => router.push(`/dashboard/candidates/${candidate.id}`)}
                className="group rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/60 p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 hover:border-zinc-300 dark:hover:border-zinc-700/60"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: stageColor?.dot || "#6b7280" }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate m-0 group-hover:text-orange-400 transition-colors">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate m-0 mt-0.5">
                      {candidate.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
                  <span className="truncate">{candidate.job.title}</span>
                  <span className="text-zinc-400 dark:text-zinc-700">&middot;</span>
                  <span className="shrink-0">
                    {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {stageColor ? (
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: stageColor.bg, color: stageColor.text }}
                    >
                      {candidate.currentStage}
                    </span>
                  ) : (
                    <span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500">
                      {candidate.currentStage}
                    </span>
                  )}

                  {candidate.resumeUrl && (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-orange-400 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Resume
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
