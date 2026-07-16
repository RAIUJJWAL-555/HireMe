"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

interface NavigationBarProps {
  currentPath?: string;
}

export default function NavigationBar({ currentPath = "Home" }: NavigationBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(currentPath);

  // Scroll detection to update header shadow and border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Jobs", href: "#jobs" },
    { name: "Candidates", href: "#candidates" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 border-b border-[#e5e7eb]/60 shadow-sm backdrop-blur-md"
          : "bg-white/90 border-b border-transparent backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex h-20 items-center justify-between">
          
          {/* Left: Logo/Wordmark */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
              </span>
              <span className="text-xl font-black tracking-tight text-[#111827] transition-colors duration-200 group-hover:text-orange-600">
                HireTrack
              </span>
            </Link>
          </div>

          {/* Center: Horizontal Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = activeLink.toLowerCase() === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setActiveLink(link.name);
                  }}
                  className={`text-sm font-medium transition-all duration-200 relative py-1.5 ${
                    isActive
                      ? "text-[#111827] font-bold"
                      : "text-[#6b7280] hover:text-[#111827]"
                  }`}
                >
                  {link.name}
                  {/* Subtle dynamic underline dot for active link */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-600 transition-all duration-300" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Get Started Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-full bg-[#111827] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2 transition-all shadow-sm hover:shadow"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2 transition-all shadow-sm hover:shadow"
              aria-label="Get Started Arrow"
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
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-4">
            {/* Show buttons on smaller screens as well, just smaller */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                href="/login"
                className="rounded-full bg-[#111827] px-4 py-2 text-xs font-medium text-white hover:bg-[#1f2937] transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
            
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f0f0f2] hover:text-[#111827] focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Overlay */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 border-b border-[#e5e7eb] shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible pointer-events-none"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activeLink.toLowerCase() === link.name.toLowerCase();
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-base font-semibold py-1 transition-colors ${
                    isActive
                      ? "text-[#111827]"
                      : "text-[#6b7280] hover:text-[#111827]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
          
          {/* Mobile CTA button (hidden on desktop/tablet) */}
          <div className="flex sm:hidden items-center gap-3 pt-2 border-t border-[#e5e7eb]/50">
            <Link
              href="/login"
              className="w-full text-center rounded-full bg-[#111827] py-3 text-sm font-medium text-white hover:bg-[#1f2937] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
