import JobForm from "../../components/JobForm";

export default function NewJobPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">Create Job</h1>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 p-6 md:p-8">
          <JobForm />
        </div>
      </div>
  );
}
