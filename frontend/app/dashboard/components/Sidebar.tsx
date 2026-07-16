"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, FileUp, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/candidates/import", label: "Import", icon: FileUp },
];

const adminItems: NavItem[] = [
  { href: "/dashboard/users", label: "Users", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside className="hidden md:flex w-60 flex-col bg-[#f4f4f5] p-5 border-r border-[#e5e7eb]">
      {/* ── Logo / Wordmark ── */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
        </span>
        <span className="text-xl font-black tracking-tight text-[#111827]">
          HireTrack
        </span>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#f0f0f2] text-[#111827] border-l-2 border-orange-500"
                  : "text-[#6b7280] hover:bg-[#f0f0f2] hover:text-[#111827] border-l-2 border-transparent"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  active ? "text-orange-400" : "text-[#9ca3af] group-hover:text-[#6b7280]"
                }`}
                strokeWidth={1.75}
              />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <>
            <div className="my-2 border-t border-[#e5e7eb]" />
            <span className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6b7280]">Admin</span>
            {adminItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-[#f0f0f2] text-[#111827] border-l-2 border-orange-500"
                      : "text-[#6b7280] hover:bg-[#f0f0f2] hover:text-[#111827] border-l-2 border-transparent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      active ? "text-orange-400" : "text-[#9ca3af] group-hover:text-[#6b7280]"
                    }`}
                    strokeWidth={1.75}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* ── Bottom: User + Actions ── */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl px-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[#111827] truncate">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-[#6b7280] truncate">
                {user?.email || ""}
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#6b7280] transition-all duration-150 hover:bg-[#f0f0f2] hover:text-[#111827]"
        >
          <LogOut className="h-5 w-5 shrink-0 text-[#6b7280]" strokeWidth={1.75} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
