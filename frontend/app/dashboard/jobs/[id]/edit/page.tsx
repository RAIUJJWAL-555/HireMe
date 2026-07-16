"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../lib/api";
import JobForm from "../../../components/JobForm";
import { FormSkeleton } from "../../../../components/Skeleton";
import ErrorState from "../../../../components/ErrorState";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = () => {
    setLoading(true);
    setError(null);
    api.get<{ job: any }>(`/jobs/${id}`)
      .then((data) => setJob(data.job))
      .catch((err) => setError(err.message || "Failed to load job"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-8">
        <FormSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-8">
        <ErrorState message={error} onRetry={fetchJob} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-8">
        <ErrorState
          title="Job not found"
          message="The job you're looking for doesn't exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8 md:px-8">
        <h1 className="text-xl font-semibold text-text-heading mb-6">Edit Job</h1>
        <div className="rounded-2xl border border-divider bg-background p-6 md:p-8">
          <JobForm
            jobId={id}
            initialData={{
              title: job.title,
              description: job.description,
              qualification: job.qualification,
              experience: job.experience,
              status: job.status,
            }}
          />
        </div>
      </div>
  );
}
