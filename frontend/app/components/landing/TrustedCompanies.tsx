"use client";

export default function TrustedCompanies() {
  const partners = [
    {
      name: "Acme Corp",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 16.5H3L12 3z" />
        </svg>
      ),
    },
    {
      name: "Globex",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a18.85 18.85 0 00-3 18m3-18a18.85 18.85 0 013 18" />
        </svg>
      ),
    },
    {
      name: "Initech",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      name: "Umbrella",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3a9 9 0 019 9h-9M12 3a9 9 0 00-9 9h9" />
        </svg>
      ),
    },
    {
      name: "Hooli",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: "Stark Ind.",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 mb-16 sm:mb-20">
      <div className="bg-surface rounded-2xl p-6 sm:p-8 md:px-10 md:py-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-zinc-200/5 border border-border-theme">
        
        {/* Left Side: Labels */}
        <div className="shrink-0 text-center md:text-left">
          <p className="text-xs font-bold tracking-wider uppercase text-text-muted-token">
            Trusted By
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-text-heading mt-1">
            500+ global teams
          </p>
        </div>

        {/* Right Side: Horizontal Row of Brand Logos */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 opacity-70">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-text-muted-token hover:text-text-heading transition-colors duration-200 cursor-pointer select-none group"
            >
              <div className="text-text-faint group-hover:text-orange-500 transition-colors duration-200">
                {partner.icon}
              </div>
              <span className="text-sm font-semibold tracking-tight uppercase">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
