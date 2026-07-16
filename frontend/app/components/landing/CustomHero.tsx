"use client";

import { useState } from "react";

export default function CustomHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const popularTags = [
    "Product Manager",
    "React Developer",
    "UX Designer",
    "Sales Director",
    "Data Scientist",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "in category:", category);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf7] via-[#fafaff] to-white py-16 sm:py-24 lg:py-32">
      
      {/* Decorative Background Accent Sparkle (Top-Left) */}
      <div className="absolute left-[8%] top-[12%] hidden md:block text-orange-400 opacity-50 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 animate-[pulse_3s_infinite_ease-in-out] animate-[spin_16s_infinite_linear]"
        >
          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
        </svg>
      </div>

      {/* Decorative Background Accent Sparkle (Top-Right) */}
      <div className="absolute right-[8%] top-[18%] hidden md:block text-blue-400 opacity-40 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 animate-[pulse_4s_infinite_ease-in-out]"
        >
          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Tagline Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/80 px-3.5 py-1.5 text-xs font-semibold text-orange-700 transition-all duration-300">
            <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            AI-Driven Recruiting Platform
          </div>

          {/* Headline (Accent Highlight Word in Blue, Underscore in Orange) */}
          <h1 className="max-w-4xl text-[38px] font-black tracking-tight text-[#111827] sm:text-5xl lg:text-6xl leading-tight sm:leading-none">
            Find the absolute best talent
            <br className="hidden sm:inline" />
            <span className="relative inline-block mt-2 sm:mt-4 text-blue-600">
              without the complexity
              {/* Custom underline orange underscore accent */}
              <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-orange-500/80 rounded-full" />
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[#6b7280]">
            Search thousands of vetted candidate profiles, manage jobs, and automate 
            your screening pipeline. Built for high-growth engineering and product teams.
          </p>

          {/* Connected Pill Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 w-full max-w-xl rounded-full bg-white border border-[#e5e7eb]/80 p-2 shadow-lg shadow-zinc-200/30 flex items-center justify-between hover:border-[#d1d5db] focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all"
          >
            {/* Input field */}
            <div className="flex-1 flex items-center min-w-0 pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4.5 w-4.5 text-[#9ca3af] mr-2 shrink-0"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, keywords..."
                className="w-full bg-transparent text-sm text-[#111827] placeholder-[#9ca3af] focus:outline-none border-none outline-none ring-0"
              />
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-[#e5e7eb] mx-2 shrink-0 hidden sm:block" />

            {/* Dropdown Selector */}
            <div className="shrink-0 hidden sm:block">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[#6b7280] px-3 py-1 cursor-pointer focus:outline-none border-none outline-none ring-0 mr-1"
              >
                <option value="all">All Fields</option>
                <option value="engineering">Engineering</option>
                <option value="product">Product</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            {/* Circular Orange Search Button */}
            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all duration-200 shadow-sm focus:outline-none"
              aria-label="Search jobs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          {/* Popular Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-[#6b7280]">
            <span className="font-semibold text-[#9ca3af] mr-1">Popular:</span>
            {popularTags.map((tag, idx) => (
              <span key={tag} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="hover:text-[#111827] hover:underline transition-colors focus:outline-none"
                >
                  {tag}
                </button>
                {idx < popularTags.length - 1 && (
                  <span className="mx-2 text-[#d1d5db] pointer-events-none">&bull;</span>
                )}
              </span>
            ))}
          </div>

          {/* Centered Hero Visual Area with Floating Elements */}
          <div className="flex justify-center items-center relative w-full mt-16">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Radial glow backdrop in orange and blue */}
              <div
                className="absolute inset-0 z-0 pointer-events-none opacity-80"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(37, 99, 235, 0.08) 45%, transparent 70%)",
                }}
              />

              {/* Connecting Dashed SVG Line to rating badge */}
              <svg className="absolute w-[90px] h-[60px] top-[14%] left-[-4%] text-[#d1d5db] pointer-events-none z-10 hidden sm:block animate-pulse" fill="none" viewBox="0 0 90 60">
                <path d="M15,35 Q50,15 75,30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
              </svg>

              {/* Central Mascot sitting on orange bean bag */}
              <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] z-10 flex items-center justify-center overflow-hidden rounded-3xl bg-orange-500/5 border border-orange-500/10 shadow-inner">
                <img
                  src="/mascot.jpg"
                  alt="Cheering Mascot sitting on a bean bag"
                  className="w-[95%] h-[95%] object-contain rounded-2xl mix-blend-multiply"
                />
              </div>

              {/* Floating Card 1: Success Rate (Top-Right) */}
              <div className="absolute -top-4 -right-4 sm:-right-8 z-20 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] p-4 w-[165px] animate-float-slow">
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Success Rate</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-[#111827] leading-none">94%</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                      +2.4%
                    </span>
                  </div>
                  <div className="w-full bg-[#f4f4f5] h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Mini Bar Chart (Bottom-Left) */}
              <div className="absolute -bottom-4 -left-4 sm:-left-8 z-20 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] p-4 w-[160px] animate-float-delayed">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-wider">Pipelines</span>
                  <span className="text-xs font-extrabold text-[#111827] leading-none">Hires / Month</span>
                  <div className="flex items-end gap-1.5 h-10 mt-3 justify-between">
                    <div className="w-2.5 bg-orange-200 rounded-t-sm h-[30%]" />
                    <div className="w-2.5 bg-blue-300 rounded-t-sm h-[50%]" />
                    <div className="w-2.5 bg-orange-400 rounded-t-sm h-[75%]" />
                    <div className="w-2.5 bg-blue-500 rounded-t-sm h-[95%]" />
                    <div className="w-2.5 bg-orange-200 rounded-t-sm h-[40%]" />
                  </div>
                </div>
              </div>

              {/* Floating Circular Badge Icon (Top-Left) */}
              <div className="absolute top-[16%] -left-6 sm:-left-8 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-md border border-[#e5e7eb] animate-float-delayed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>

              {/* Floating Brand Logo Badge (Center-Right in blue) */}
              <div className="absolute top-[42%] -right-6 sm:-right-8 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-[#e5e7eb] hover:scale-110 transition-transform duration-200 animate-float-slow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5 text-blue-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
