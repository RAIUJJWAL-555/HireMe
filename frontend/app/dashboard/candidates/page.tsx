"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

const STAGE_COLORS: Record<string, string> = {
  Applied: "#3b82f6",
  Screening: "#f59e0b",
  Interview: "#8b5cf6",
  Offer: "#06b6d4",
  Hired: "#22c55e",
  Rejected: "#ef4444",
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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (search) params.set("search", search);
      if (jobFilter) params.set("jobId", jobFilter);

      const data = await api.get<{ candidates: Candidate[] }>(`/candidates?${params}`);
      setCandidates(data.candidates);
    } catch (err) {
      console.error(err);
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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setMovingId(null);
    }
  };

  const grouped = STAGES.map((stage) => ({
    stage,
    candidates: candidates.filter((c) => c.currentStage === stage),
  }));

  return (
    <div>
      <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#18181b", marginBottom: "16px" }}>
        Candidates
      </h1>

      {/* Search + Filter Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #d4d4d8",
            fontSize: "14px",
          }}
        />
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #d4d4d8",
            fontSize: "14px",
            background: "white",
            minWidth: "180px",
          }}
        >
          <option value="">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "16px" }}>
          {grouped.map(({ stage, candidates: stageCandidates }) => (
            <div
              key={stage}
              style={{
                minWidth: "260px",
                maxWidth: "260px",
                flexShrink: 0,
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                background: "#fafafa",
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 220px)",
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #e4e4e7",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: STAGE_COLORS[stage],
                  }}
                />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#18181b" }}>
                  {stage}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "12px",
                    color: "#71717a",
                    background: "#e4e4e7",
                    padding: "0 8px",
                    borderRadius: "9999px",
                  }}
                >
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards */}
              <div
                style={{
                  padding: "8px",
                  overflowY: "auto",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {stageCandidates.length === 0 ? (
                  <div style={{ padding: "24px 8px", textAlign: "center", fontSize: "13px", color: "#a1a1aa" }}>
                    No candidates
                  </div>
                ) : (
                  stageCandidates.map((candidate) => {
                    const transitions = VALID_TRANSITIONS[stage] || [];
                    return (
                      <div
                        key={candidate.id}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          background: "white",
                          border: "1px solid #e4e4e7",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div
                          onClick={() => router.push(`/dashboard/candidates/${candidate.id}`)}
                          style={{ fontSize: "14px", fontWeight: 500, color: "#18181b", cursor: "pointer" }}
                        >
                          {candidate.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#71717a", marginTop: "2px" }}>
                          {candidate.email}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#a1a1aa",
                            marginTop: "4px",
                            padding: "2px 6px",
                            background: "#f4f4f5",
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {candidate.job.title}
                        </div>

                        {transitions.length > 0 && (
                          <div style={{ marginTop: "10px" }}>
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) handleMove(candidate.id, e.target.value);
                              }}
                              disabled={movingId === candidate.id}
                              style={{
                                width: "100%",
                                padding: "4px 8px",
                                fontSize: "12px",
                                borderRadius: "6px",
                                border: "1px solid #d4d4d8",
                                background: "white",
                                color: movingId === candidate.id ? "#a1a1aa" : "#18181b",
                              }}
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
                          <div style={{ marginTop: "8px", fontSize: "11px", color: "#22c55e", fontWeight: 500 }}>
                            ✓ Hired
                          </div>
                        )}
                        {stage === "Rejected" && (
                          <div style={{ marginTop: "8px", fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>
                            ✕ Rejected
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
