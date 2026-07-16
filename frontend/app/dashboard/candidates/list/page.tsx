"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { api } from "../../../lib/api";
import { colors } from "../../../lib/design-tokens";
import { TableRowSkeleton } from "../../../components/Skeleton";
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
  currentStage: string;
  createdAt: string;
  job: { id: string; title: string };
}

interface Job {
  id: string;
  title: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CandidateListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (stageFilter) params.set("stage", stageFilter);
      if (jobFilter) params.set("jobId", jobFilter);

      const data = await api.get<{ candidates: Candidate[]; pagination: Pagination }>(
        `/candidates?${params}`
      );
      setCandidates(data.candidates);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter, jobFilter, page]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    api.get<{ jobs: Job[] }>("/jobs").then((d) => setJobs(d.jobs)).catch(console.error);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, stageFilter, jobFilter]);

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
  const hasFilters = !!(search || stageFilter || jobFilter);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-white m-0">Candidates</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/candidates/import"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Import CSV
            </Link>
            <Link
              href="/dashboard/candidates"
              className="rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
            >
              Kanban View
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="min-w-0 sm:min-w-[140px] rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s || "All stages"}
              </option>
            ))}
          </select>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="min-w-0 sm:min-w-[180px] rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          >
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="text-left">
                  {["Name", "Email", "Job", "Stage", "Applied", "Actions"].map((h) => (
                    <th key={h} className={`px-4 py-3 text-sm font-semibold text-zinc-400 border-b border-zinc-800/60 ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchCandidates} />
        ) : candidates.length === 0 ? (
          <CandidatesEmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="text-left">
                    {["Name", "Email", "Job", "Stage", "Applied", "Actions"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-sm font-semibold text-zinc-400 border-b border-zinc-800/60 ${h === "Actions" ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => {
                    const stageKey = STAGE_TOKEN_KEY[candidate.currentStage];
                    const stageColor = stageKey ? colors.stage[stageKey] : null;
                    return (
                      <tr key={candidate.id} className="border-b border-zinc-800/60">
                        <td className="px-4 py-3 font-medium text-white">
                          {candidate.name}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{candidate.email}</td>
                        <td className="px-4 py-3 text-zinc-400">{candidate.job.title}</td>
                        <td className="px-4 py-3">
                          {stageColor ? (
                            <span
                              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                              style={{ backgroundColor: stageColor.bg, color: stageColor.text }}
                            >
                              {candidate.currentStage}
                            </span>
                          ) : (
                            <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-500">
                              {candidate.currentStage}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">
                          {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/dashboard/candidates/${candidate.id}`}
                            className="min-h-[44px] inline-flex items-center rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-5 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800/80 px-3 py-1.5 text-xs text-white disabled:opacity-40 disabled:cursor-default hover:bg-zinc-800 transition-colors"
                >
                  Prev
                </button>
                <span className="hidden sm:inline text-xs text-zinc-500 px-2">
                  {page} / {pagination.totalPages}
                </span>
                <div className="flex sm:hidden gap-1">
                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`rounded-full border px-2.5 py-1.5 text-xs transition-colors ${
                        p === page
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-zinc-700/50 bg-zinc-800/80 text-white hover:bg-zinc-800"
                      } ${Math.abs(p - page) <= 1 || p === 1 || p === pagination.totalPages ? "" : "hidden"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex gap-1">
                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        p === page
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-zinc-700/50 bg-zinc-800/80 text-white hover:bg-zinc-800"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-zinc-700/50 bg-zinc-800/80 px-3 py-1.5 text-xs text-white disabled:opacity-40 disabled:cursor-default hover:bg-zinc-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
  );
}
