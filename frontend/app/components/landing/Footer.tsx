export default function Footer() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Left — brand + credit */}
          <div className="text-center sm:text-left">
            <span className="text-sm font-bold text-[#111827]">
              HireTrack
            </span>
            <p className="mt-1 text-xs text-[#6b7280]">
              Built for Digital Heroes Full Stack Developer Trial.
            </p>
          </div>

          {/* Center — tech badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="rounded-md bg-[#f4f4f5] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">
              Next.js
            </span>
            <span className="rounded-md bg-[#f4f4f5] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">
              TypeScript
            </span>
            <span className="rounded-md bg-[#f4f4f5] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">
              Prisma
            </span>
            <span className="rounded-md bg-[#f4f4f5] px-2 py-0.5 text-[11px] font-medium text-[#6b7280]">
              Tailwind CSS
            </span>
          </div>

          {/* Right — links */}
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#6b7280] hover:text-[#111827] transition-colors underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-[#f4f4f5] pt-6 text-center">
          <p className="text-[11px] text-[#9ca3af]">
            &copy; {new Date().getFullYear()} HireTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
