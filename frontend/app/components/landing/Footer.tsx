export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left — brand + credit */}
          <div className="text-center sm:text-left">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              HireTrack
            </span>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Built for Digital Heroes Full Stack Developer Trial.
            </p>
          </div>

          {/* Center — tech badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              Next.js
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              TypeScript
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              Prisma
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              Tailwind CSS
            </span>
          </div>

          {/* Right — links */}
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-zinc-100 pt-6 text-center dark:border-zinc-900">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} HireTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
