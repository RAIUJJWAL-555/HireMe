"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import CandidateGrid from "./components/CandidateGrid";
import StatsRing from "./components/StatsRing";
import PipelineGrid from "./components/PipelineGrid";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";

interface Stats {
  openJobs: number;
  totalCandidates: number;
  hired: number;
  rejected: number;
  screening: number;
  interview: number;
  offer: number;
  applied: number;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [limit, setLimit] = useState(5);
  const [totalCandidates, setTotalCandidates] = useState(0);

  // Reset limit when search or stageFilter changes
  useEffect(() => {
    setLimit(5);
  }, [search, stageFilter]);

  // Fetch stats once on mount
  useEffect(() => {
    async function loadStats() {
      try {
        setLoadingStats(true);
        const statsData = await api.get<Stats>("/dashboard");
        setStats(statsData);
      } catch (err: any) {
        toast("error", err.message || "Failed to load dashboard stats");
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, [toast]);

  // Fetch candidates when search, stageFilter, or limit changes (with debounce)
  useEffect(() => {
    async function loadCandidates() {
      try {
        setLoadingCandidates(true);
        const params = new URLSearchParams();
        params.set("limit", limit.toString());
        if (search) params.set("search", search);
        if (stageFilter) params.set("stage", stageFilter);

        const candidatesData = await api.get<{ candidates: any[]; pagination: { total: number } }>(`/candidates?${params}`);
        setCandidates(candidatesData.candidates);
        setTotalCandidates(candidatesData.pagination.total);
      } catch (err: any) {
        toast("error", err.message || "Failed to load candidates");
      } finally {
        setLoadingCandidates(false);
      }
    }

    const timer = setTimeout(() => {
      loadCandidates();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, stageFilter, limit, toast]);

  const hiringRate = stats && stats.totalCandidates > 0
    ? Math.round((stats.hired / stats.totalCandidates) * 100)
    : 0;

  const metrics = stats
    ? [
        { label: "Total", value: stats.totalCandidates, color: "bg-purple-500" },
        { label: "Hired", value: stats.hired, color: "bg-teal-400" },
        { label: "In Progress", value: stats.applied + stats.screening + stats.interview + stats.offer, color: "bg-orange-400" },
        { label: "Rejected", value: stats.rejected, color: "bg-red-400" },
      ]
    : [];

  return (
    <div className="flex flex-1">
      {/* ── Center: header + candidate grid ── */}
      <main className="flex-1 min-w-0 p-5 md:p-6 lg:p-8">
        <DashboardHeader
          breadcrumbs={["Dashboard", "Candidates"]}
          title={loadingStats ? "Candidates" : `${stats?.totalCandidates || 0} Candidates`}
          searchValue={search}
          onSearchChange={setSearch}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
        />
        <div className="mt-6">
          <CandidateGrid candidates={candidates} loading={loadingCandidates} />
          {!loadingCandidates && candidates.length < totalCandidates && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setLimit((prev) => prev + 6)}
                className="rounded-full border border-divider bg-surface px-6 py-2 text-xs font-semibold text-text-heading hover:text-text-heading hover:border-divider-strong transition-colors cursor-pointer"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Right panel: stats + pipeline ── */}
      <aside className="hidden w-80 shrink-0 flex-col gap-6 border-l border-divider bg-background p-6 lg:flex xl:w-[340px]">
        <StatsRing
          label="Hired Rate"
          value={hiringRate}
          unit="%"
          delta={stats?.hired || 0}
          loading={loadingStats}
        />
        <PipelineGrid metrics={metrics} loading={loadingStats} />
      </aside>
    </div>
  );
}
