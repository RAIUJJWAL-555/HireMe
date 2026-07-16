"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { colors } from "../lib/design-tokens";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/dashboard/jobs" },
  { name: "Candidates", href: "/dashboard/candidates" },
  { name: "Blog", href: "#" },
  { name: "Contact", href: "#" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const ctaHref = user ? "/dashboard" : "/login";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-zinc-50/95 border-b border-zinc-200/60 shadow-sm backdrop-blur-md dark:bg-zinc-950/95 dark:border-zinc-800/60"
          : "bg-zinc-50/90 border-b border-transparent backdrop-blur-sm dark:bg-zinc-950/90"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex h-20 items-center justify-between">

          {/* ── Left: Logo / Wordmark ── */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 dark:bg-orange-500" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600 dark:bg-orange-400" />
              </span>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors duration-200 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                HireTrack
              </span>
            </Link>
          </div>

          {/* ── Center: Nav Links (desktop) ── */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 relative py-1.5 ${
                    active
                      ? "text-zinc-950 font-bold dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: Theme + CTA (desktop) ── */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href={ctaHref}
              className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-300 dark:focus:ring-offset-zinc-950 transition-all shadow-sm hover:shadow"
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>

            <Link
              href={ctaHref}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300 dark:focus:ring-offset-zinc-950 transition-all shadow-sm hover:shadow"
              aria-label="Get Started"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
          </div>

          {/* ── Mobile: CTA + Theme + Hamburger ── */}
          <div className="flex md:hidden items-center gap-4">
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href={ctaHref}
                className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-sm dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {user ? "Dashboard" : "Get Started"}
              </Link>
            </div>

            <ThemeToggle />

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-zinc-50/95 border-b border-zinc-200 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out dark:bg-zinc-950/95 dark:border-zinc-800 ${
          mobileOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-semibold py-1 transition-colors ${
                    active
                      ? "text-zinc-950 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex sm:hidden items-center gap-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Link
              href={ctaHref}
              className="w-full text-center rounded-full bg-zinc-950 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {user ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
