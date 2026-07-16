# HireTrack — Landing Page Plan

## Context

HireTrack is a lightweight ATS for small-to-mid recruiting teams. The landing page is the reviewer's first impression — it must instantly explain what the product does. Tone: professional, clean, confident. Inspired by Linear/Stripe/Vercel restraint. No lorem ipsum, no filler — every word earns its place.

The landing page has been **componentized and largely built**. This plan documents the current structure, finalized copy, and remaining work.

---

## Tech Constraints

| Constraint | Detail |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 — utility classes only |
| Fonts | Geist Sans + Geist Mono (configured in `layout.tsx`) |
| Dark Mode | Full — driven by `ThemeContext` class toggle on `<html>` |
| Auth | `useAuth()` — page renders different CTAs for logged-in vs. anonymous users |
| Animation | Scroll-triggered fade-in via IntersectionObserver + `prefers-reduced-motion` respect |

---

## 1. Section Structure

```
┌─────────────────────────────────────────────────┐
│  Header (sticky, inline in page.tsx)            │
│  Logo · Nav links · ThemeToggle · Auth CTAs      │
├─────────────────────────────────────────────────┤
│  Hero (Hero.tsx)                                │
│  Pill badge · H1 · Subtitle · CTA buttons       │
│  Static pipeline diagram (5 stages + avatars)   │
├─────────────────────────────────────────────────┤
│  Features (Features.tsx)                        │
│  Section heading · 4-card grid                  │
│  Pipeline · Jobs · Search · Role-Based Access    │
├─────────────────────────────────────────────────┤
│  How It Works (HowItWorks.tsx)                  │
│  Section heading · 3-step flow with icons       │
│  Post → Move → Track                            │
├─────────────────────────────────────────────────┤
│  CTA Banner (inline in page.tsx)                │
│  Gradient card · final conversion push           │
├─────────────────────────────────────────────────┤
│  Footer (Footer.tsx)                            │
│  Branding · Tech badges · GitHub link · Copyright│
└─────────────────────────────────────────────────┘
```

---

## 2. Finalized Copy

### Header
- **Logo:** HireTrack (icon + text)
- **Nav links:** Features · How It Works · GitHub
- **CTAs (logged out):** Sign In (ghost) · Try Demo (indigo filled)
- **CTA (logged in):** Go to Dashboard (filled)

### Hero
- **Pill:** `● Recruiter Sandbox Ready`
- **H1:** Track every candidate, from applied to hired — in **one clean pipeline**
- **Subtitle:** A lightweight ATS for small-to-mid recruiting teams — manage jobs, move candidates through stages, and track performance in one place.
- **Primary CTA:** Try Demo → `/login`
- **Secondary CTA:** View on GitHub (with octocat icon)
- **Logged-in variant:** CTA → "Enter Dashboard", no GitHub button
- **Pipeline diagram:** 5 stages (Applied → Screening → Interview → Offer → Hired) with mock avatar circles

### Features
- **Section heading:** Recruiting software designed for focus
- **Section subtitle:** Stop juggling spreadsheets. HireTrack gives recruiters a centralized database to source, filter, and advance high-quality talent.

| # | Title | Description | Icon |
|---|---|---|---|
| 1 | Candidate Pipeline | Kanban-style stage tracking to move candidates from applied to hired. | LayoutGrid (rows) |
| 2 | Job Postings | Create, manage, and close job openings organized by department. | Briefcase |
| 3 | Search & Filter | Fast candidate lookup by name, email, job, stage, or keywords. | Search |
| 4 | Role-Based Access | Admin and Recruiter permissions with full stage-history audit logs. | Shield |

### How It Works
- **Section heading:** Three steps to a better hiring experience
- **Section subtitle:** Get up and running with HireTrack in under five minutes.

| Step | Title | Description | Icon |
|---|---|---|---|
| 1 | Post a Job | Define the role, set requirements, and publish openings to start sourcing candidates. | FilePlus |
| 2 | Move Candidates Through Stages | Advance applicants through screening, interview, and offer stages on a visual Kanban board. | Columns3 |
| 3 | Track Hiring Metrics | Monitor applicant volumes, stage conversions, and recent activity from a single dashboard. | BarChart3 |

### CTA Banner
- **Heading:** Ready to optimize your recruiting flow?
- **Body:** Log into our sandbox environment with fully pre-populated jobs, candidates, and histories. No signup required.
- **Button (logged out):** Try Demo Now → `/login?email=recruiter@hiretrack.com&password=password123`
- **Button (logged in):** Go to Dashboard → `/dashboard`

### Footer
- **Left:** HireTrack · Built for Digital Heroes Full Stack Developer Trial.
- **Center:** Tech badges: Next.js · TypeScript · Prisma · Tailwind CSS
- **Right:** GitHub Repository (link)
- **Bottom:** © 2026 HireTrack. All rights reserved.

---

## 3. Component Breakdown

All landing components in `frontend/app/components/landing/`.

```
app/
├── page.tsx                          # Composes sections + inline header/CTA
├── components/
│   └── landing/
│       ├── Hero.tsx                  # H1, subtitle, CTAs, pipeline diagram
│       ├── Features.tsx              # 4-card feature grid with scroll animation
│       ├── HowItWorks.tsx            # 3-step flow with icons + scroll animation
│       └── Footer.tsx                # Static footer
```

### Component Responsibilities

| Component | File | Lines | State | Props | Notes |
|---|---|---|---|---|---|
| `page.tsx` | `page.tsx` | 143 | — | — | `"use client"`. Inline header (sticky, backdrop-blur) + CTA banner. Uses `useAuth()` for CTA switching. Imports all 4 landing components. |
| `Hero` | `Hero.tsx` | 157 | `mounted` | — | Self-contained animation gate. Renders pill badge, H1 with gradient text, subtitle, dual CTAs, static pipeline diagram. |
| `Features` | `Features.tsx` | 175 | `visible`, `reducedMotion` | — | IntersectionObserver-driven scroll animation. 4 cards in responsive grid. Inline SVG icons. |
| `HowItWorks` | `HowItWorks.tsx` | 169 | `visible`, `reducedMotion` | — | Same scroll animation pattern. 3 steps with circular icon badges. |
| `Footer` | `Footer.tsx` | 54 | — | — | Pure server component (no `"use client"`). Static content. |

### Animation Pattern (shared by Features + HowItWorks)

1. `usePrefersReducedMotion()` hook checks `matchMedia("(prefers-reduced-motion: reduce)")`
2. IntersectionObserver with `threshold: 0.15` triggers visibility
3. Cards use CSS transitions: `opacity-0 translate-y-4` → `opacity-100 translate-y-0`
4. Staggered delay: `150 + i * 30ms` per card
5. If reduced motion → immediately visible, no animation

---

## 4. Design Tokens

| Token | Value | Usage |
|---|---|---|
| Accent | Indigo (`bg-indigo-600`, `from-indigo-600 to-violet-500`) | CTAs, icons, gradient text |
| Backgrounds | `bg-zinc-50`, `bg-zinc-100/40`, `bg-white`, `dark:bg-zinc-950` | Page, sections, cards |
| Text | `text-zinc-900`, `text-zinc-600`, `text-zinc-500` | Primary, secondary, muted |
| Borders | `border-zinc-200`, `dark:border-zinc-800` | Cards, dividers |
| Radius | `rounded-lg` (8px), `rounded-xl` (12px) | Buttons, cards |
| Font | Geist Sans, `font-sans antialiased` | Body |
| Shadows | `shadow-sm`, `dark:shadow-none` | Cards |

---

## 5. Responsive Behavior

| Breakpoint | Header | Hero | Features | HowIt Works |
|---|---|---|---|---|
| Mobile (< 640px) | Hamburger-less, logo + CTAs only | Stack, text-left | 1 column | 1 column (stacked) |
| Tablet (640–1024px) | Nav links hidden | Center, larger text | 2 columns | 2 columns |
| Desktop (> 1024px) | Full nav visible | Center, largest text | 4 columns | 3 columns |

---

## 6. Remaining Work / Gaps

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | `Header.tsx` as standalone component | Not extracted | Header is inline in `page.tsx` (~80 lines). Could be extracted but low priority — it's tightly coupled to `useAuth()`. |
| 2 | `CtaBanner.tsx` as standalone component | Not extracted | CTA banner is inline in `page.tsx` (~30 lines). Same reasoning as Header. |
| 3 | `KanbanPreview.tsx` interactive board | Not built | Original plan called for an interactive Kanban with advance buttons. Current Hero has a simpler static pipeline diagram. The original monolith had a full interactive board — this was intentionally simplified during extraction. |
| 4 | GitHub URL placeholder | Still `https://github.com` | Should point to actual repo when available. |

---

## 7. Open Questions

| # | Question | Default if no answer |
|---|---|---|
| 1 | Should the Header and CTA Banner be extracted to separate components? | Keep inline — they're small, auth-dependent, and not reused elsewhere. |
| 2 | Should the Hero pipeline diagram be interactive (advance buttons) or stay static? | Keep static — it's a visual teaser, not the product itself. Interactive demos belong in the dashboard. |
| 3 | Should the GitHub link point to the actual repo? | Keep placeholder until repo is public. |
| 4 | Any additional sections (testimonials, pricing, social proof)? | No — keep minimal per the restraint brief. |

---

## 8. Assumptions

1. **No new dependencies.** Everything uses existing Tailwind + React + Next.js primitives + inline SVGs.
2. **No visual design changes needed.** The current implementation matches the design system.
3. **The pipeline diagram in Hero is decorative** (`aria-hidden="true"`), not interactive.
4. **Mobile responsiveness** is handled by existing Tailwind responsive classes.
5. **The "Digital Heroes Full Stack Developer Trial" attribution** in the footer is a project requirement and stays as-is.
6. **Dark mode** works automatically — all components handle `.dark` variants.
