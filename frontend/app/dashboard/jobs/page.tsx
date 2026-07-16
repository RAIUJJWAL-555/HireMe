"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { colors } from "../../lib/design-tokens";
import { TableRowSkeleton } from "../../components/Skeleton";
import { JobsEmptyState } from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

const EXPERIENCE_LABELS: Record<string, string> = {
  Fresher: "Fresher",
  ZeroToOne: "0-1 Years",
  OneToThree: "1-3 Years",
  ThreeToFive: "3-5 Years",
  FivePlus: "5+ Years",
};

interface Job {
  id: string;
  title: string;
  qualification: string;
  experience: string;
  status: "open" | "closed";
  createdAt: string;
  _count: { candidates: number };
}

export default function JobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter ? `?status=${filter}` : "";
      const data = await api.get<{ jobs: Job[] }>(`/jobs${params}`);
      setJobs(data.jobs);
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast("success", "Job deleted");
    } catch (err: any) {
      toast("error", err.message || "Failed to delete job");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 min-h-screen flex flex-col justify-center">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#111827] m-0">Jobs</h1>
          <Link
            href="/dashboard/jobs/new"
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-all shadow-sm hover:shadow"
          >
            + New Job
          </Link>
        </div>

        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-sm text-[#6b7280] focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#e5e7eb] bg-white overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-white text-left">
                  {["Title", "Qualification", "Experience", "Status", "Candidates", "Actions"].map((h) => (
                    <th key={h} className={`px-4 py-4 text-xs font-semibold uppercase text-[#6b7280] ${h === "Candidates" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchJobs} />
        ) : jobs.length === 0 ? (
          <JobsEmptyState />
        ) : (
          <>
            {/* Mobile: stacked card view */}
            <div className="flex flex-col gap-3 md:hidden">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-[#111827] truncate">{job.title}</h3>
                      <p className="text-xs text-[#6b7280] mt-0.5">{job.qualification}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">{EXPERIENCE_LABELS[job.experience] || job.experience}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: job.status === "open" ? colors.successBg : "#f4f4f5",
                        color: job.status === "open" ? colors.successMuted : "#6b7280",
                      }}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e5e7eb]">
                    <span className="text-xs text-[#6b7280]">{job._count.candidates} candidates</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
                        className="text-xs text-[#6b7280] hover:text-orange-500 underline transition-colors"
                      >
                        Edit
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-xs text-red-500 hover:text-red-700 underline transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table view */}
            <div className="hidden md:block rounded-2xl border border-[#e5e7eb] bg-white overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-4 text-xs font-semibold uppercase text-[#6b7280]">Title</th>
                    <th className="px-4 py-4 text-xs font-semibold uppercase text-[#6b7280]">Qualification</th>
                    <th className="px-4 py-4 text-xs font-semibold uppercase text-[#6b7280]">Experience</th>
                    <th className="px-4 py-4 text-xs font-semibold uppercase text-[#6b7280]">Status</th>
                    <th className="px-4 py-4 text-xs font-semibold uppercase text-[#6b7280] text-right">Candidates</th>
                    <th className="px-4 py-4 text-xs font-semibold uppercase text-[#6b7280] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-t border-[#e5e7eb]">
                      <td className="px-4 py-4 text-sm font-medium text-[#111827] align-middle">{job.title}</td>
                      <td className="px-4 py-4 text-sm text-[#6b7280] align-middle">{job.qualification}</td>
                      <td className="px-4 py-4 text-sm text-[#6b7280] align-middle">{EXPERIENCE_LABELS[job.experience] || job.experience}</td>
                      <td className="px-4 py-4 align-middle">
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: job.status === "open" ? colors.successBg : "#f4f4f5",
                            color: job.status === "open" ? colors.successMuted : "#6b7280",
                          }}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#6b7280] align-middle text-right">{job._count.candidates}</td>
                      <td className="px-4 py-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
                            className="text-sm text-[#6b7280] hover:text-orange-500 underline transition-colors"
                          >
                            Edit
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="text-sm text-red-500 hover:text-red-700 underline transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
  );
}
