"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/dashboard").then(setStats).catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#18181b", marginBottom: "24px" }}>Dashboard</h1>

      {!stats ? (
        <div style={{ color: "#a1a1aa" }}>Loading...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <StatCard label="Open Jobs" value={stats.openJobs || 0} />
          <StatCard label="Total Candidates" value={stats.totalCandidates || 0} />
          <StatCard label="Hired" value={stats.hired || 0} />
          <StatCard label="Rejected" value={stats.rejected || 0} />
        </div>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <Link
          href="/dashboard/jobs"
          style={{ padding: "8px 16px", background: "#18181b", color: "white", borderRadius: "8px", fontSize: "14px", textDecoration: "none" }}
        >
          View Jobs
        </Link>
        <Link
          href="/dashboard/candidates"
          style={{ padding: "8px 16px", border: "1px solid #d4d4d8", borderRadius: "8px", fontSize: "14px", color: "#18181b", textDecoration: "none" }}
        >
          View Candidates
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e4e4e7" }}>
      <div style={{ fontSize: "12px", color: "#71717a", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "#18181b" }}>{value}</div>
    </div>
  );
}
