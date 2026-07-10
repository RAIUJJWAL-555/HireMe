"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/jobs", label: "Jobs" },
  { href: "/dashboard/candidates", label: "Candidates" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r border-zinc-200 bg-white p-4">
        <div className="mb-8 px-3 text-lg font-semibold text-zinc-900">HireTrack</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">
              {user.name} <span className="text-xs text-zinc-400">({user.role})</span>
            </span>
            <button
              onClick={logout}
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
