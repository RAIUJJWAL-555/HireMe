"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, FileSpreadsheet, X, ChevronDown, ChevronUp, Check, AlertTriangle, SkipForward } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!RAW_API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in the environment variables.");
}

const API_BASE = RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

interface ImportResult {
  totalRows: number;
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

type State = "idle" | "file-selected" | "uploading" | "results";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CsvImporter({ onImportComplete }: { onImportComplete?: (r: ImportResult) => void }) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<State>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [results, setResults] = useState<ImportResult | null>(null);
  const [errorsExpanded, setErrorsExpanded] = useState(false);

  const acceptFile = useCallback((f: File) => {
    if (!f.name.endsWith(".csv") && f.type !== "text/csv") {
      toast("error", "Only .csv files are allowed");
      return;
    }
    setFile(f);
    setState("file-selected");
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  }, [acceptFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
    e.target.value = "";
  }, [acceptFile]);

  const reset = useCallback(() => {
    setFile(null);
    setResults(null);
    setErrorsExpanded(false);
    setState("idle");
  }, []);

  const upload = useCallback(async () => {
    if (!file) return;
    setState("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/candidates/import`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }

      setResults(data);
      setState("results");
      onImportComplete?.(data);

      if (data.imported > 0 && data.errors.length === 0) {
        toast("success", `Successfully imported ${data.imported} candidate${data.imported !== 1 ? "s" : ""}`);
      } else if (data.imported > 0) {
        toast("success", `Imported ${data.imported} candidate${data.imported !== 1 ? "s" : ""} (${data.errors.length} skipped)`);
      } else {
        toast("info", "No candidates were imported");
      }
    } catch (err: any) {
      toast("error", err.message || "Failed to import candidates");
      setState("idle");
    }
  }, [file, onImportComplete, toast]);

  return (
    <div className="w-full max-w-xl">
      {/* ── Drop Zone ── */}
      {(state === "idle" || state === "file-selected") && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => state === "idle" && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
            dragging
              ? "border-orange-500 bg-orange-50 cursor-copy"
              : state === "idle"
                ? "border-zinc-300 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/50 hover:border-orange-500/50 hover:bg-orange-50 cursor-pointer"
                : "border-zinc-300 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleInputChange}
          />

          {state === "idle" ? (
            <>
              <UploadCloud className={`mb-3 h-10 w-10 transition-colors duration-200 ${dragging ? "text-orange-400" : "text-zinc-400 dark:text-zinc-600"}`} strokeWidth={1.5} />
              <p className="text-sm font-medium text-zinc-900 dark:text-white m-0">
                {dragging ? "Drop your CSV here" : "Drop your CSV here"}
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 m-0">
                Accepts .csv files only
              </p>
              <div className="my-4 flex items-center gap-3 w-full max-w-[200px]">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-400 dark:text-zinc-600">or</span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
              >
                Browse file
              </button>
            </>
          ) : (
            <>
              <FileSpreadsheet className="mb-3 h-10 w-10 text-orange-400" strokeWidth={1.5} />
              <p className="text-sm font-medium text-zinc-900 dark:text-white m-0">{file!.name}</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 m-0">{formatFileSize(file!.size)}</p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); upload(); }}
                  className="rounded-full bg-orange-500 px-6 py-2 text-xs font-medium text-white hover:bg-orange-600 transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  Import candidates
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Uploading ── */}
      {state === "uploading" && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700/60 bg-white dark:bg-zinc-900/50 px-6 py-16 text-center">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-300 dark:border-zinc-700 border-t-orange-500" />
          <p className="text-sm font-medium text-zinc-900 dark:text-white m-0">Importing candidates...</p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 m-0">This may take a moment for large files</p>
        </div>
      )}

      {/* ── Results ── */}
      {state === "results" && results && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white m-0 mb-4">Import Summary</h3>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">{results.imported} imported</span>
            </div>
            {results.skipped > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1.5">
                <SkipForward className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">{results.skipped} skipped</span>
              </div>
            )}
            {results.errors.length > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3.5 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs font-medium text-red-400">{results.errors.length} error{results.errors.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          {results.errors.length > 0 && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/50 overflow-hidden">
              <button
                onClick={() => setErrorsExpanded(!errorsExpanded)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 transition-colors cursor-pointer bg-transparent border-none"
              >
                <span>Error details ({results.errors.length})</span>
                {errorsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {errorsExpanded && (
                <div className="max-h-48 overflow-y-auto border-t border-zinc-200 dark:border-zinc-800/60">
                  {results.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800/40 last:border-b-0">
                      <span className="shrink-0 mt-0.5 flex h-5 min-w-[20px] items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800 px-1.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                        {err.row}
                      </span>
                      <span className="text-xs text-red-400 leading-relaxed">{err.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            {results.imported > 0 && (
              <a
                href="/dashboard/candidates/list"
                className="rounded-full bg-orange-500 px-5 py-2 text-xs font-medium text-white hover:bg-orange-600 transition-all shadow-sm hover:shadow"
              >
                View Candidates
              </a>
            )}
            <button
              onClick={reset}
              className="rounded-full border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            >
              Import another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
