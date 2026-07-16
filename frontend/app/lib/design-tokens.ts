// ─── HireTrack Design Tokens ────────────────────────────────────────
// Single source of truth. Import from any component/page.
// Tailwind utility integration lives in globals.css (@theme inline).

export const colors = {
  // ── Backgrounds ──
  base: "#0a0a0a",        // page background (near-black)
  surface: "#1a1a1a",     // cards, sidebar, elevated panels
  surfaceHover: "#222222", // card hover state
  surfaceAlt: "#2a2a2a",  // alternating card / inner container

  // ── Primary accent (orange) ──
  primary: "#f97316",     // orange-500
  primaryHover: "#ea580c", // orange-600
  primaryMuted: "#fb923c", // orange-400
  primaryBg: "rgba(249, 115, 22, 0.10)",  // subtle orange fill
  primaryBorder: "rgba(249, 115, 22, 0.20)",

  // ── Secondary accent (blue) ──
  secondary: "#60a5fa",   // blue-400
  secondaryHover: "#3b82f6", // blue-500
  secondaryMuted: "#93c5fd", // blue-300
  secondaryBg: "rgba(96, 165, 250, 0.10)",
  secondaryBorder: "rgba(96, 165, 250, 0.20)",

  // ── Semantic: Success (green) ──
  success: "#22c55e",     // green-500
  successHover: "#16a34a", // green-600
  successMuted: "#4ade80", // green-400
  successBg: "rgba(34, 197, 94, 0.10)",

  // ── Semantic: Error (red) ──
  error: "#ef4444",       // red-500
  errorHover: "#dc2626",  // red-600
  errorMuted: "#f87171",  // red-400
  errorBg: "rgba(239, 68, 68, 0.10)",

  // ── Semantic: Warning (amber) ──
  warning: "#f59e0b",     // amber-500
  warningBg: "rgba(245, 158, 11, 0.10)",

  // ── Text ──
  textPrimary: "#ffffff",   // headings, primary text (dark mode)
  textSecondary: "#9ca3af", // muted body text (gray-400)
  textMuted: "#6b7280",     // faint labels, timestamps (gray-500)
  textDisabled: "#4b5563",  // gray-600

  // ── Borders ──
  border: "rgba(255, 255, 255, 0.06)",     // subtle divider
  borderStrong: "rgba(255, 255, 255, 0.12)", // stronger divider
  borderFocus: "#f97316",                    // focus ring (orange)

  // ── Kanban stage colors ──
  stage: {
    applied:    { dot: "#3b82f6", text: "#60a5fa", bg: "rgba(59, 130, 246, 0.10)" },  // blue
    screening:  { dot: "#f59e0b", text: "#fbbf24", bg: "rgba(245, 158, 11, 0.10)" },  // amber
    interview:  { dot: "#8b5cf6", text: "#a78bfa", bg: "rgba(139, 92, 246, 0.10)" },  // violet
    offer:      { dot: "#06b6d4", text: "#22d3ee", bg: "rgba(6, 182, 212, 0.10)" },   // cyan
    hired:      { dot: "#22c55e", text: "#4ade80", bg: "rgba(34, 197, 94, 0.10)" },    // green
    rejected:   { dot: "#ef4444", text: "#f87171", bg: "rgba(239, 68, 68, 0.10)" },    // red
  },
} as const;

export const radius = {
  none: "0px",
  sm: "6px",
  md: "8px",    // inputs, small buttons
  lg: "12px",   // cards, modals
  xl: "16px",   // large cards
  "2xl": "20px", // feature cards, hero sections
  full: "9999px", // pills, badges, avatar circles
} as const;

export const spacing = {
  // 4px grid — use these for consistent gap/padding values
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  fontSize: {
    xs:   "12px",
    sm:   "14px",
    base: "16px",
    lg:   "18px",
    xl:   "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },
  fontWeight: {
    normal:    "400",
    medium:    "500",
    semibold:  "600",
    bold:      "700",
    extrabold: "800",
    black:     "900",
  },
} as const;

export const shadows = {
  sm:   "0 1px 2px rgba(0, 0, 0, 0.3)",
  md:   "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
  lg:   "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
  glow: "0 0 20px rgba(249, 115, 22, 0.15)",
} as const;
