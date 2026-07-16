"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

const EXPERIENCE_OPTIONS = [
  { value: "Fresher", label: "Fresher" },
  { value: "ZeroToOne", label: "0-1 Years" },
  { value: "OneToThree", label: "1-3 Years" },
  { value: "ThreeToFive", label: "3-5 Years" },
  { value: "FivePlus", label: "5+ Years" },
];

interface JobFormProps {
  initialData?: { title: string; description: string; qualification: string; experience: string; status: string };
  jobId?: string;
}

export default function JobForm({ initialData, jobId }: JobFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!jobId;

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [qualification, setQualification] = useState(initialData?.qualification || "");
  const [experience, setExperience] = useState(initialData?.experience || "Fresher");
  const [status, setStatus] = useState(initialData?.status || "open");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !qualification.trim()) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const body: any = {
        title: title.trim(),
        description: description.trim(),
        qualification: qualification.trim(),
        experience,
      };
      if (isEdit) body.status = status;

      if (isEdit) {
        await api.put(`/jobs/${jobId}`, body);
      } else {
        await api.post("/jobs", body);
      }

      toast("success", isEdit ? "Job updated" : "Job created");
      router.push("/dashboard/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors resize-y"
        />
      </div>

      <div>
        <label htmlFor="qualification" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Qualification
        </label>
        <input
          id="qualification"
          required
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          placeholder="e.g. B.Tech, MBA, B.Sc"
          className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Experience
        </label>
        <select
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
        >
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isEdit && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 focus:outline-none transition-colors"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-medium text-zinc-900 dark:text-white hover:bg-orange-600 disabled:opacity-50 transition-all shadow-sm hover:shadow"
        >
          {submitting ? "Saving..." : isEdit ? "Update Job" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-300 dark:border-zinc-700/50 bg-zinc-100 dark:bg-zinc-800/80 px-6 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
