"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;

const PIPELINE_CANDIDATES: Record<string, { initials: string; color: string }[]> = {
  Applied: [
    { initials: "AJ", color: "bg-indigo-500" },
    { initials: "BS", color: "bg-emerald-500" },
  ],
  Screening: [{ initials: "CD", color: "bg-amber-500" }],
  Interview: [],
  Offer: [{ initials: "HT", color: "bg-rose-500" }],
  Hired: [{ initials: "DW", color: "bg-violet-500" }],
};

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 transition-all duration-700 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Recruiter Sandbox Ready
          </div>

          <h1
            className={`max-w-4xl text-[32px] font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-white transition-all duration-700 delay-100 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            Track every candidate, from applied to hired — in{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              one clean pipeline
            </span>
          </h1>

          <p
            className={`mt-6 max-w-2xl text-base sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 transition-all duration-700 delay-200 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            A lightweight ATS for small-to-mid recruiting teams — manage jobs,
            move candidates through stages, and track performance in one place.
          </p>

          <div
            className={`mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-zinc-950 transition-all shadow-sm"
            >
              Try Demo
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-base font-semibold text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:focus:ring-zinc-300 dark:focus:ring-offset-zinc-950 transition-all"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        <div
          className={`mt-16 sm:mt-20 lg:mt-24 transition-all duration-700 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          aria-hidden="true"
        >
          <div className="mx-auto max-w-4xl px-4">
            <div className="overflow-x-auto pb-2">
              <div className="flex w-min items-center justify-center gap-2 sm:gap-3">
                {STAGES.map((stage, i) => (
                  <div key={stage} className="flex items-center">
                    <div className="flex flex-col items-center rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50 sm:px-4 sm:py-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {stage}
                      </span>
                      <div className="mt-2 flex -space-x-1">
                        {PIPELINE_CANDIDATES[stage].length > 0 ? (
                          PIPELINE_CANDIDATES[stage].map((c) => (
                            <div
                              key={c.initials}
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white ring-1 ring-white dark:ring-zinc-900 ${c.color}`}
                            >
                              {c.initials}
                            </div>
                          ))
                        ) : (
                          <div className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {i < STAGES.length - 1 && (
                      <svg
                        className="mx-1 h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600 sm:mx-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
