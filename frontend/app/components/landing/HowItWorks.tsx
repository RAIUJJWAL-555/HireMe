"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

const STEPS = [
  {
    title: "Post a Job",
    description:
      "Define the role, set requirements, and publish openings to start sourcing candidates.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    title: "Move Candidates Through Stages",
    description:
      "Advance applicants through screening, interview, and offer stages on a visual Kanban board.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <circle cx="5" cy="6" r="2" />
        <circle cx="12" cy="6" r="2" />
        <circle cx="19" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="12" cy="18" r="2" />
        <circle cx="19" cy="18" r="2" />
        <line x1="5" y1="8" x2="5" y2="16" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="19" y1="8" x2="19" y2="16" />
      </svg>
    ),
  },
  {
    title: "Track Hiring Metrics",
    description:
      "Monitor applicant volumes, stage conversions, and recent activity from a single dashboard.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function HowItWorks() {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Workflow"
          title="Three steps to a better hiring experience"
          description="Get up and running with HireTrack in under five minutes."
        />

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={`relative flex flex-col items-center text-center transition-all ease-out ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDuration: reducedMotion
                    ? "0ms"
                    : `${150 + i * 40}ms`,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-white border-4 border-[#e5e7eb]">
                  {step.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#111827]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#6b7280] leading-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
