import JobForm from "../../components/JobForm";

export default function NewJobPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-8">
        <h1 className="text-xl font-semibold text-text-heading mb-6">Create Job</h1>
        <div className="rounded-2xl border border-divider bg-background p-6 md:p-8">
          <JobForm />
        </div>
      </div>
  );
}
