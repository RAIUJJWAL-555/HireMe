"use client";

import { useState } from "react";

interface StatsRingProps {
  label?: string;
  value?: number;
  unit?: string;
  delta?: number;
  size?: number;
  strokeWidth?: number;
  loading?: boolean;
}

function useId() {
  const [id] = useState(() => Math.random().toString(36).slice(2, 9));
  return id;
}

export default function StatsRing({
  label = "Time to Hire",
  value = 78,
  unit = "%",
  delta = 23,
  size = 200,
  strokeWidth = 14,
  loading = false,
}: StatsRingProps) {
  const id = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value, 100) / 100;
  const offset = circumference * (1 - progress);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6 animate-pulse">
        {/* Heading */}
        <h2 className="text-lg font-bold text-text-heading">Statistics</h2>

        {/* Ring Placeholder */}
        <div
          className="rounded-full bg-surface border-4 border-divider"
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Heading */}
      <h2 className="text-lg font-bold text-text-heading">Statistics</h2>

      {/* Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={`ring-gradient-${id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            {/* Soft turbulence filter for organic edge feel */}
            <filter id={`organic-${id}`} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015"
                numOctaves="3"
                seed="2"
                result="turbulence"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="2.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-divider)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter={`url(#organic-${id})`}
          />

          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#ring-gradient-${id})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              transition: "stroke-dashoffset 800ms ease-out",
            }}
            filter={`url(#organic-${id})`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-text-muted-token">{label}</span>
          <span className="mt-1 text-3xl font-bold text-text-heading">
            {value}
            <span className="text-lg">{unit}</span>
          </span>
          <span
            className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              delta >= 0
                ? "bg-teal-500/10 text-teal-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {delta >= 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path
                  fillRule="evenodd"
                  d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-3 w-3"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        </div>
      </div>
    </div>
  );
}
