"use client";

import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import NavigationBar from "./components/landing/NavigationBar";
import CustomHero from "./components/landing/CustomHero";
import TrustedCompanies from "./components/landing/TrustedCompanies";
import Features from "./components/landing/Features";
import HowItWorks from "./components/landing/HowItWorks";
import Footer from "./components/landing/Footer";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111827] font-sans antialiased transition-colors duration-200">
      {/* Navigation Header */}
      <NavigationBar />

      <main>
        <CustomHero />

        <TrustedCompanies />

        <Features />

        <HowItWorks />

        {/* CTA Banner */}
        <section className="bg-[#f0f0f2] py-16 border-t border-[#e5e7eb]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl bg-gradient-to-r from-orange-100/60 via-white to-sky-100/60 p-8 md:p-12 border border-orange-200/50">
              <div>
                <h2 className="text-xl font-bold text-[#111827] sm:text-2xl">
                  Ready to optimize your recruiting flow?
                </h2>
                <p className="mt-2 text-sm text-[#6b7280] max-w-xl">
                  Log into our sandbox environment with fully pre-populated
                  jobs, candidates, and histories. No signup required.
                </p>
              </div>
              <div className="flex shrink-0 gap-4">
                {!loading && (
                  <Link
                    href={
                      user
                        ? "/dashboard"
                        : "/login?email=recruiter@hiretrack.com&password=password123"
                    }
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#111827] hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-offset-2 transition-colors shadow-sm border border-[#e5e7eb]"
                  >
                    {user ? "Go to Dashboard" : "Try Demo Now"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
