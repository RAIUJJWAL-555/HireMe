"use client";

interface SectionHeaderProps {
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  badge,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mx-auto max-w-3xl text-center py-6 px-4 flex flex-col items-center justify-center ${className}`}>
      {/* Optional Tagline/Badge */}
      {badge && (
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 shadow-sm select-none">
          {badge}
        </span>
      )}

      {/* Bold Large Heading (32-36px, dark navy/black) */}
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
        {title}
      </h2>

      {/* Muted-gray Subtext Paragraph (max-width constrained for readability) */}
      <p className="mt-4 text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
