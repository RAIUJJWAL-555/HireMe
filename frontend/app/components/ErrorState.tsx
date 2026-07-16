"use client";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-[15px] font-semibold text-text-heading m-0">
        {title}
      </h3>
      <p className="text-[13px] text-text-muted-token mt-1.5 max-w-[360px]">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full bg-orange-500 px-5 py-2 text-[13px] font-medium text-white hover:bg-orange-600 transition-all shadow-sm hover:shadow border-none cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}
