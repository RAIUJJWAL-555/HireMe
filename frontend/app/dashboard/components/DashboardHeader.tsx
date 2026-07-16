"use client";

import { Search, ChevronRight, Bell, SlidersHorizontal } from "lucide-react";

interface DashboardHeaderProps {
  breadcrumbs?: string[];
  title: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  stageFilter: string;
  onStageFilterChange: (value: string) => void;
}

export default function DashboardHeader({
  breadcrumbs = [],
  title,
  searchPlaceholder = "Search candidates",
  searchValue,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      {/* Left — breadcrumb + heading + toolbar */}
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-600" />
                )}
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-zinc-700 dark:text-zinc-300"
                      : "hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-colors"
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}

        {/* Heading */}
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h1>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full rounded-full bg-zinc-100 dark:bg-zinc-800/80 pl-10 pr-4 text-sm text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none border border-zinc-200 dark:border-zinc-700/50 transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
            />
          </div>

          {/* Filter dropdowns */}
          <select
            value={stageFilter}
            onChange={(e) => onStageFilterChange(e.target.value)}
            className="inline-flex h-10 items-center justify-between gap-2 rounded-full border border-zinc-200 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:text-zinc-700 dark:hover:text-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none cursor-pointer appearance-none min-w-[120px] text-left pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2371717a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[position:calc(100%-14px)_50%] bg-no-repeat"
          >
            <option value="" className="bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">All Stages</option>
            <option value="Applied" className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">Applied</option>
            <option value="Screening" className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">Screening</option>
            <option value="Interview" className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">Interview</option>
            <option value="Offer" className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">Offer</option>
            <option value="Hired" className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">Hired</option>
            <option value="Rejected" className="bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200">Rejected</option>
          </select>
        </div>
      </div>

      {/* Right — action buttons */}
      <div className="flex items-center gap-2.5 self-start">
        <button
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 ring-2 ring-white dark:ring-zinc-900" />
        </button>
      </div>
    </div>
  );
}
