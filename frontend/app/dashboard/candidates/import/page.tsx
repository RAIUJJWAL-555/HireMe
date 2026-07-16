"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CsvImporter from "../../components/CsvImporter";
import { useRouter } from "next/navigation";

export default function ImportCandidatesPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard/candidates/list"
          className="inline-flex items-center gap-2 text-sm text-text-muted-token hover:text-text-heading transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to candidates
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-text-heading m-0">Import candidates</h1>
        <p className="mt-1 text-sm text-text-muted-token m-0">
          Upload a CSV file to add multiple candidates at once.
        </p>
      </div>

      <CsvImporter
        onImportComplete={() => {
          router.refresh();
        }}
      />

      <div className="mt-8 max-w-xl rounded-2xl border border-divider bg-background shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-heading m-0 mb-3">CSV format</h3>
        <p className="text-xs text-text-muted-token m-0 mb-3">
          Your CSV should include the following columns. Columns marked with * are required.
        </p>
        <div className="rounded-xl border border-divider bg-surface p-4 font-mono text-xs text-text-muted-token leading-relaxed">
          <span className="text-text-heading">NAME</span>,<span className="text-orange-500 dark:text-orange-400">EMAIL*</span>,<span className="text-text-heading">PHONE</span>,<span className="text-text-heading">JOB TITLE</span>,<span className="text-text-heading">NOTES</span>,<span className="text-text-heading">RESUME URL</span>
        </div>
        <ul className="mt-3 space-y-1.5 text-xs text-text-muted-token list-none pl-0">
          <li>
            <span className="text-orange-500 dark:text-orange-400 font-medium">EMAIL</span> — used to detect duplicates; candidates with an existing email for the same job are skipped.
          </li>
          <li>
            <span className="text-text-heading font-medium">JOB TITLE</span> — matched against existing job titles. If no match is found the row is skipped.
          </li>
        </ul>
      </div>
    </div>
  );
}
