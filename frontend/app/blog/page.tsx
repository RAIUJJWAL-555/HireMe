"use client";

import Link from "next/link";
import NavigationBar from "../components/landing/NavigationBar";
import Footer from "../components/landing/Footer";

const POSTS = [
  {
    slug: "how-to streamline-hiring",
    title: "How to Streamline Your Hiring Pipeline in 2026",
    excerpt:
      "Discover practical strategies to reduce time-to-hire and improve candidate quality with a structured pipeline.",
    date: "Jul 10, 2026",
    tag: "Recruiting",
  },
  {
    slug: "structured-interviews",
    title: "Structured Interviews: A Guide for Growing Teams",
    excerpt:
      "Learn how structured interview frameworks reduce bias and help you compare candidates objectively.",
    date: "Jul 3, 2026",
    tag: "Best Practices",
  },
  {
    slug: "candidate-experience",
    title: "Candidate Experience: Small Changes, Big Impact",
    excerpt:
      "From timely updates to clear job descriptions — simple tweaks that dramatically improve how candidates perceive your brand.",
    date: "Jun 25, 2026",
    tag: "Candidate Experience",
  },
  {
    slug: "data-driven-recruiting",
    title: "Data-Driven Recruiting: Metrics That Actually Matter",
    excerpt:
      "Move beyond vanity metrics. Focus on the KPIs that directly influence hiring outcomes and team growth.",
    date: "Jun 18, 2026",
    tag: "Analytics",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-text-heading font-sans antialiased transition-colors duration-200">
      <NavigationBar />

      <main className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-16 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 text-text-muted-token max-w-xl">
            Insights on recruiting, hiring best practices, and getting the most
            out of HireTrack.
          </p>
        </div>

        {/* Post grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-border-theme bg-background p-6 transition-all duration-200 hover:shadow-md hover:border-orange-200/50 dark:hover:border-orange-800/40"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-text-muted-token">
                  {post.tag}
                </span>
                <span className="text-xs text-text-faint">{post.date}</span>
              </div>
              <h2 className="text-lg font-bold leading-snug group-hover:text-orange-600 transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-text-muted-token leading-relaxed">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-orange-600 group-hover:underline">
                Read more →
              </span>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
