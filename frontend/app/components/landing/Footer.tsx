export default function Footer() {
  return (
    <footer className="border-t border-border-theme bg-background py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left — brand + credit */}
          <div className="text-center sm:text-left">
            <span className="text-sm font-bold text-text-heading">
              HireTrack
            </span>
            <p className="mt-1 text-xs text-text-muted-token">
              Built for Digital Heroes Full Stack Developer Trial.
            </p>
          </div>

          {/* Center — tech badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted-token">
              Next.js
            </span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted-token">
              TypeScript
            </span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted-token">
              Prisma
            </span>
            <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted-token">
              Tailwind CSS
            </span>
          </div>

          {/* Right — links */}
          <div className="flex gap-4">
            <a
              href="/blog"
              className="text-xs text-text-muted-token hover:text-text-heading transition-colors underline"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="text-xs text-text-muted-token hover:text-text-heading transition-colors underline"
            >
              Contact
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted-token hover:text-text-heading transition-colors underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-surface pt-6 text-center">
          <p className="text-[11px] text-text-faint">
            &copy; {new Date().getFullYear()} HireTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
