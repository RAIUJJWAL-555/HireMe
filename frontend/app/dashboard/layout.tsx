"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, Briefcase, Users, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "./components/Sidebar";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
];

function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <div className="mb-8 flex items-center justify-between px-2">
        <span className="text-lg font-bold text-text-heading">HireTrack</span>
        <button
          onClick={onClose}
          className="p-2 text-text-muted-token hover:text-text-heading"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-text-muted-token hover:bg-surface-hover hover:text-text-heading"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-text-muted-token"}`}
                strokeWidth={1.75}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {user?.role === "admin" && (
          <>
            <div className="my-2 border-t border-border-theme" />
            <span className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-faint">Admin</span>
            <Link
              href="/dashboard/users"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                pathname.startsWith("/dashboard/users")
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "text-text-muted-token hover:bg-surface-hover hover:text-text-heading"
              }`}
            >
              <Shield className={`h-5 w-5 shrink-0 ${pathname.startsWith("/dashboard/users") ? "text-white" : "text-text-muted-token"}`} strokeWidth={1.75} />
              <span>Users</span>
            </Link>
          </>
        )}
      </nav>
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-text-muted-token hover:bg-surface-hover hover:text-text-heading"
      >
        <LogOut className="h-5 w-5 shrink-0 text-text-muted-token" strokeWidth={1.75} />
        <span>Logout</span>
      </button>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-zinc-100" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar (desktop) ── */}
      <Sidebar />

      {/* ── Sidebar (mobile overlay) ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-background p-5 transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MobileNav onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-divider px-4 py-3 bg-background md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted-token hover:text-text-heading"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-bold text-text-heading">HireTrack</span>
        </header>

        {children}
      </div>
    </div>
  );
}
