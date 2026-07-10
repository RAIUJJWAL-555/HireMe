"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";

interface StageHistoryEntry {
  id: string;
  fromStage: string;
  toStage: string;
  changedAt: string;
  changedBy: { name: string };
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  currentStage: string;
  notes: string;
  createdAt: string;
  job: { title: string; department: string };
  stageHistory: StageHistoryEntry[];
}

const STAGE_COLORS: Record<string, string> = {
  Applied: "#3b82f6",
  Screening: "#f59e0b",
  Interview: "#8b5cf6",
  Offer: "#06b6d4",
  Hired: "#22c55e",
  Rejected: "#ef4444",
};

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<{ candidate: Candidate }>(`/candidates/${id}`)
      .then((data) => {
        setCandidate(data.candidate);
        setNotes(data.candidate.notes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveNotes = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put(`/candidates/${id}`, { notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#a1a1aa" }}>Loading...</div>
    );
  }

  if (!candidate) {
    return <div style={{ padding: "40px", color: "#dc2626" }}>Candidate not found</div>;
  }

  return (
    <div style={{ maxWidth: "720px" }}>
      <button
        onClick={() => router.back()}
        style={{
          fontSize: "13px",
          color: "#71717a",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: "16px",
          display: "block",
        }}
      >
        &larr; Back
      </button>

      {/* Header Card */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid #e4e4e7",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#18181b", margin: 0 }}>{candidate.name}</h1>
            <p style={{ fontSize: "14px", color: "#52525b", marginTop: "4px" }}>{candidate.email}</p>
          </div>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
              background: `${STAGE_COLORS[candidate.currentStage]}18`,
              color: STAGE_COLORS[candidate.currentStage],
            }}
          >
            {candidate.currentStage}
          </span>
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#fafafa",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#52525b",
          }}
        >
          <span style={{ fontWeight: 500 }}>Job:</span> {candidate.job.title} &middot; {candidate.job.department}
          <br />
          <span style={{ fontWeight: 500 }}>Applied:</span>{" "}
          {new Date(candidate.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Notes */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid #e4e4e7",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#18181b", margin: "0 0 12px 0" }}>
          Notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Add notes about this candidate..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d4d4d8",
            fontSize: "14px",
            resize: "vertical",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px" }}>
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#18181b",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>
          {saved && (
            <span style={{ fontSize: "13px", color: "#22c55e" }}>Saved!</span>
          )}
        </div>
      </div>

      {/* Stage History */}
      <div
        style={{
          borderRadius: "12px",
          border: "1px solid #e4e4e7",
          padding: "24px",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#18181b", margin: "0 0 16px 0" }}>
          Stage History
        </h2>
        {candidate.stageHistory.length === 0 ? (
          <div style={{ fontSize: "13px", color: "#a1a1aa" }}>No stage changes yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {candidate.stageHistory.map((entry, i) => {
              const isLast = i === candidate.stageHistory.length - 1;
              return (
                <div key={entry.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                  {/* Timeline line */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: STAGE_COLORS[entry.toStage] || "#a1a1aa",
                        marginTop: "4px",
                        flexShrink: 0,
                      }}
                    />
                    {!isLast && (
                      <div
                        style={{
                          width: "2px",
                          flex: 1,
                          background: "#e4e4e7",
                          minHeight: "24px",
                        }}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingBottom: isLast ? 0 : "16px", flex: 1 }}>
                    <div style={{ fontSize: "14px", color: "#18181b" }}>
                      <span style={{ fontWeight: 500 }}>{entry.fromStage}</span>
                      {" → "}
                      <span style={{ fontWeight: 600, color: STAGE_COLORS[entry.toStage] }}>
                        {entry.toStage}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#71717a", marginTop: "2px" }}>
                      by {entry.changedBy.name} &middot;{" "}
                      {new Date(entry.changedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
