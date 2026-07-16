"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-zinc-900/50 border border-zinc-800/60 p-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to home
          </Link>
          <h1 className="mb-6 text-2xl font-semibold text-white">Sign in to HireTrack</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-full border border-zinc-700/50 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all shadow-sm hover:shadow"
            >
              {submitting ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
              Sign up
            </Link>
          </p>


        </div>
      </div>
    </>
  );
}
