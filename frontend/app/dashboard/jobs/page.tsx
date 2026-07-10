"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Job {
  id: string;
  title: string;
  department: string;
  status: "open" | "closed";
  createdAt: string;
  _count: { candidates: number };
}

export default function JobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = filter ? `?status=${filter}` : "";
        const data = await api.get<{ jobs: Job[] }>(`/jobs${params}`);
        setJobs(data.jobs);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Inline styles for status badges
  const statusBadge = (status: string) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: 500,
    background: status === "open" ? "#dcfce7" : "#f3f4f6",
    color: status === "open" ? "#166534" : "#6b7280",
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#18181b" }}>Jobs</h1>
        <Link
          href="/dashboard/jobs/new"
          style={{
            padding: "8px 16px",
            background: "#18181b",
            color: "white",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          + New Job
        </Link>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #d4d4d8",
            fontSize: "14px",
            background: "white",
          }}
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>Loading...</div>
      ) : jobs.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>
          No jobs found.{" "}
          <Link href="/dashboard/jobs/new" style={{ color: "#18181b" }}>
            Create one
          </Link>
        </div>
      ) : (
        <div style={{ borderRadius: "12px", border: "1px solid #e4e4e7", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa", textAlign: "left" }}>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "#71717a", textTransform: "uppercase" }}>Title</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "#71717a", textTransform: "uppercase" }}>Department</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "#71717a", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "#71717a", textTransform: "uppercase" }}>Candidates</th>
                <th style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "#71717a", textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} style={{ borderTop: "1px solid #e4e4e7" }}>
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#18181b" }}>{job.title}</td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#52525b" }}>{job.department}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={statusBadge(job.status)}>{job.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "14px", color: "#52525b" }}>{job._count.candidates}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
                        style={{ fontSize: "13px", color: "#18181b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Edit
                      </button>
                      {user?.role === "admin" && (
                        <button
                          onClick={() => handleDelete(job.id)}
                          style={{ fontSize: "13px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
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
      )}
    </div>
  );
}
