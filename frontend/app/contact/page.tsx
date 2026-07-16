"use client";

import { useState } from "react";
import NavigationBar from "../components/landing/NavigationBar";
import Footer from "../components/landing/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-text-heading font-sans antialiased transition-colors duration-200">
      <NavigationBar />

      <main className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-text-muted-token max-w-lg">
            Have a question, feedback, or want to partner with us? We&apos;d love
            to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-emerald-300/50 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-700/40 p-8 text-center">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              Message Sent!
            </h2>
            <p className="mt-2 text-sm text-text-muted-token">
              Thanks for reaching out. We&apos;ll get back to you shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border-theme bg-background p-8 space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-heading mb-1.5"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-border-theme bg-surface px-4 py-2.5 text-sm text-text-heading placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-heading mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-border-theme bg-surface px-4 py-2.5 text-sm text-text-heading placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-heading mb-1.5"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                className="w-full rounded-lg border border-border-theme bg-surface px-4 py-2.5 text-sm text-text-heading placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-text-heading mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="w-full rounded-lg border border-border-theme bg-surface px-4 py-2.5 text-sm text-text-heading placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors resize-none"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Send Message
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
