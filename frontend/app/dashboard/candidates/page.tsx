"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { colors } from "../../lib/design-tokens";
import { KanbanColumnSkeleton } from "../../components/Skeleton";
import { KanbanEmptyState } from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const STAGE_TOKEN_KEY: Record<string, keyof typeof colors.stage> = {
  Applied: "applied", Screening: "screening", Interview: "interview",
  Offer: "offer", Hired: "hired", Rejected: "rejected",
};

interface Candidate {
  id: string;
  name: string;
  email: string;
  currentStage: string;
  job: { title: string };
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};

export default function CandidatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (search) params.set("search", search);
      if (jobFilter) params.set("jobId", jobFilter);

      const data = await api.get<{ candidates: Candidate[] }>(`/candidates?${params}`);
      setCandidates(data.candidates);
    } catch (err: any) {
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [search, jobFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    api.get<{ jobs: Job[] }>("/jobs").then((d) => setJobs(d.jobs)).catch(console.error);
  }, []);

  const handleMove = async (candidateId: string, toStage: string) => {
    setMovingId(candidateId);
    try {
      await api.patch(`/candidates/${candidateId}/stage`, { toStage });
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, currentStage: toStage } : c))
      );
      toast("success", `Moved to ${toStage}`);
    } catch (err: any) {
      toast("error", err.message || "Failed to move candidate");
    } finally {
      setMovingId(null);
    }
  };

  const grouped = STAGES.map((stage) => ({
    stage,
    candidates: candidates.filter((c) => c.currentStage === stage),
  }));

  return (
    <div className="px-6 py-8 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-text-heading m-0">Candidates</h1>
          <Link
            href="/dashboard/candidates/list"
            className="rounded-full border border-divider bg-surface px-4 py-2 text-xs text-text-muted-token hover:text-text-heading hover:border-divider-strong transition-colors"
          >
            List View
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 rounded-full border border-divider bg-surface px-4 py-2 text-sm text-text-heading placeholder-text-faint focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          />
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="min-w-0 md:min-w-[180px] rounded-full border border-divider bg-surface px-4 py-2 text-sm text-text-heading focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          >
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <KanbanColumnSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCandidates} />
        ) : candidates.length === 0 ? (
          <KanbanEmptyState />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {grouped.map(({ stage, candidates: stageCandidates }) => (
              <div
                key={stage}
                className="w-[264px] min-w-[264px] shrink-0 rounded-2xl border border-divider bg-surface flex flex-col max-h-[calc(100vh-220px)]"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-divider">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: colors.stage[STAGE_TOKEN_KEY[stage]].dot }}
                  />
                  <span className="text-sm font-semibold text-text-heading">{stage}</span>
                  <span className="ml-auto rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-muted-token">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1">
                  {stageCandidates.length === 0 ? (
                    <div className="py-8 text-center text-xs text-text-faint">
                      No candidates
                    </div>
                  ) : (
                    stageCandidates.map((candidate) => {
                      const transitions = VALID_TRANSITIONS[stage] || [];
                      return (
                        <div
                          key={candidate.id}
                          className="rounded-2xl bg-background border border-divider shadow-sm p-3 transition-colors hover:border-divider-strong"
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                              style={{ backgroundColor: colors.stage[STAGE_TOKEN_KEY[stage]].dot }}
                            >
                              {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                onClick={() => router.push(`/dashboard/candidates/${candidate.id}`)}
                                className="text-sm font-medium text-text-heading truncate cursor-pointer hover:text-orange-400 transition-colors"
                              >
                                {candidate.name}
                              </div>
                              <div className="text-[11px] text-text-muted-token truncate">
                                {candidate.job.title}
                              </div>
                            </div>
                            <div
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: colors.stage[STAGE_TOKEN_KEY[stage]].dot }}
                            />
                          </div>

                          {transitions.length > 0 && (
                            <div className="mt-2.5 pt-2.5 border-t border-divider">
                              <select
                                value=""
                                onChange={(e) => {
                                  if (e.target.value) handleMove(candidate.id, e.target.value);
                                }}
                                disabled={movingId === candidate.id}
                                className={`w-full rounded-lg border border-divider bg-surface px-3 py-1.5 text-xs text-text-muted-token focus:border-orange-500 focus:outline-none min-h-[32px] ${
                                  movingId === candidate.id ? "opacity-40" : ""
                                }`}
                              >
                                <option value="">Move to...</option>
                                {transitions.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {stage === "Hired" && (
                            <div className="mt-2 pt-2 border-t border-divider text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              Hired
                            </div>
                          )}
                          {stage === "Rejected" && (
                            <div className="mt-2 pt-2 border-t border-divider text-[11px] font-medium text-red-500 dark:text-red-400">
                              Rejected
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
