"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

interface JobFormProps {
  initialData?: { title: string; description: string; department: string; status: string };
  jobId?: string;
}

export default function JobForm({ initialData, jobId }: JobFormProps) {
  const router = useRouter();
  const isEdit = !!jobId;

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [status, setStatus] = useState(initialData?.status || "open");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !department.trim()) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const body: any = { title: title.trim(), description: description.trim(), department: department.trim() };
      if (isEdit) body.status = status;

      if (isEdit) {
        await api.put(`/jobs/${jobId}`, body);
      } else {
        await api.post("/jobs", body);
      }

      router.push("/dashboard/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-zinc-700">
          Department
        </label>
        <input
          id="department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      {isEdit && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Update Job" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
