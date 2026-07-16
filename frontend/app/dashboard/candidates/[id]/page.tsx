"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, ExternalLink } from "lucide-react";
import { api } from "../../../lib/api";
import { useToast } from "../../../context/ToastContext";
import { colors } from "../../../lib/design-tokens";
import { DetailSkeleton } from "../../../components/Skeleton";
import { HistoryEmptyState } from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";

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
  phone: string | null;
  resumeUrl: string | null;
  currentStage: string;
  notes: string;
  createdAt: string;
  job: { title: string };
  stageHistory: StageHistoryEntry[];
}

const STAGE_TOKEN_KEY: Record<string, keyof typeof colors.stage> = {
  Applied: "applied", Screening: "screening", Interview: "interview",
  Offer: "offer", Hired: "hired", Rejected: "rejected",
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCandidate = () => {
    setLoading(true);
    setError(null);
    api.get<{ candidate: Candidate }>(`/candidates/${id}`)
      .then((data) => {
        setCandidate(data.candidate);
        setNotes(data.candidate.notes);
      })
      .catch((err) => setError(err.message || "Failed to load candidate"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await api.put(`/candidates/${id}`, { notes });
      toast("success", "Notes saved");
    } catch (err: any) {
      toast("error", err.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const handleMoveStage = async (toStage: string) => {
    try {
      await api.patch(`/candidates/${id}/stage`, { toStage });
      setCandidate((prev) => prev ? { ...prev, currentStage: toStage } : prev);
      toast("success", `Moved to ${toStage}`);
    } catch (err: any) {
      toast("error", err.message || "Failed to move candidate");
    }
  };

  if (loading) return <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8"><DetailSkeleton /></div>;

  if (error) return <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8"><ErrorState message={error} onRetry={fetchCandidate} /></div>;

  if (!candidate) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8">
        <ErrorState title="Candidate not found" message="This candidate doesn't exist or has been removed." onRetry={() => router.push("/dashboard/candidates")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 py-8 md:px-8">
        <button
          onClick={() => router.back()}
          className="block mb-4 text-sm text-text-muted-token hover:text-text-heading transition-colors bg-transparent border-none cursor-pointer"
        >
          &larr; Back
        </button>

        {/* ── Profile card ── */}
        <div className="rounded-2xl border border-divider bg-background shadow-sm p-4 md:p-6 mb-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: colors.stage[STAGE_TOKEN_KEY[candidate.currentStage]]?.dot || "#6b7280" }}
            >
              {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold text-text-heading m-0 break-words">{candidate.name}</h1>
                  <p className="text-sm text-text-muted-token mt-0.5 break-words">{candidate.email}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: colors.stage[STAGE_TOKEN_KEY[candidate.currentStage]]?.bg,
                    color: colors.stage[STAGE_TOKEN_KEY[candidate.currentStage]]?.text,
                  }}
                >
                  {candidate.currentStage}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted-token">
                <span className="rounded-full bg-surface px-2.5 py-0.5">{candidate.job.title}</span>
                <span className="text-text-faint">&middot;</span>
                <span>Applied {new Date(candidate.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-sm">
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-text-muted-token">
                    <Phone className="h-3.5 w-3.5 text-text-muted-token shrink-0" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.resumeUrl && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-text-muted-token shrink-0" />
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors break-all"
                    >
                      {candidate.resumeUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stage change ── */}
        {VALID_TRANSITIONS[candidate.currentStage]?.length > 0 && (
          <div className="rounded-2xl border border-divider bg-background shadow-sm p-4 md:p-6 mb-4">
            <h2 className="text-sm font-semibold text-text-muted-token m-0 mb-3 uppercase tracking-wider">Move to</h2>
            <div className="flex flex-wrap gap-2">
              {VALID_TRANSITIONS[candidate.currentStage].map((stage) => {
                const key = STAGE_TOKEN_KEY[stage];
                const isReject = stage === "Rejected";
                return (
                  <button
                    key={stage}
                    onClick={() => handleMoveStage(stage)}
                    className="rounded-full px-4 py-2 text-sm font-medium transition-all shadow-sm hover:shadow"
                    style={{
                      backgroundColor: isReject ? "rgba(239,68,68,0.10)" : colors.stage[key]?.bg,
                      color: isReject ? colors.errorMuted : colors.stage[key]?.text,
                      border: `1px solid ${isReject ? "rgba(239,68,68,0.20)" : colors.stage[key]?.bg}`,
                    }}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Notes ── */}
        <div className="rounded-2xl border border-divider bg-background shadow-sm p-4 md:p-6 mb-4">
          <h2 className="text-sm font-semibold text-text-muted-token m-0 mb-3 uppercase tracking-wider">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Add notes about this candidate..."
            className="w-full rounded-xl border border-divider bg-surface p-3 text-sm text-text-heading placeholder-text-faint resize-y font-[inherit] box-border focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition-all shadow-sm hover:shadow"
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>

        {/* ── Stage History ── */}
        <div className="rounded-2xl border border-divider bg-background shadow-sm p-4 md:p-6">
          <h2 className="text-sm font-semibold text-text-muted-token m-0 mb-4 uppercase tracking-wider">Stage History</h2>
          {candidate.stageHistory.length === 0 ? (
            <HistoryEmptyState />
          ) : (
            <div className="flex flex-col">
              {candidate.stageHistory.map((entry, i) => {
                const isLast = i === candidate.stageHistory.length - 1;
                const toKey = STAGE_TOKEN_KEY[entry.toStage];
                return (
                  <div key={entry.id} className="flex gap-4 relative">
                    <div className="flex flex-col items-center w-5">
                      <div
                        className="h-2.5 w-2.5 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: toKey ? colors.stage[toKey].dot : "#6b7280" }}
                      />
                      {!isLast &&                       <div className="w-0.5 flex-1 bg-divider min-h-6" />}
                    </div>
                    <div className={`flex-1 ${isLast ? "" : "pb-4"}`}>
                      <div className="text-sm text-text-heading">
                        <span className="font-medium">{entry.fromStage}</span>
                        {" → "}
                        <span className="font-semibold" style={{ color: toKey ? colors.stage[toKey].text : "#9ca3af" }}>
                          {entry.toStage}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted-token mt-0.5">
                        by {entry.changedBy.name} &middot;{" "}
                        {new Date(entry.changedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
