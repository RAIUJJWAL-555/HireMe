"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../../lib/api";
import JobForm from "../../../components/JobForm";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ job: any }>(`/jobs/${id}`)
      .then((data) => setJob(data.job))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px", color: "#a1a1aa" }}>Loading...</div>;
  }

  if (!job) {
    return <div style={{ padding: "40px", color: "#dc2626" }}>Job not found</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#18181b", marginBottom: "24px" }}>
        Edit Job
      </h1>
      <JobForm
        jobId={id}
        initialData={{
          title: job.title,
          description: job.description,
          department: job.department,
          status: job.status,
        }}
      />
    </div>
  );
}
