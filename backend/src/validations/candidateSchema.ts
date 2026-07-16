import { z } from "zod";
import { Stage } from "@prisma/client";

const stageValues = Object.values(Stage) as [string, ...string[]];

export const createCandidateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  jobId: z.string().min(1, "Job ID is required"),
  notes: z.string().optional(),
  phone: z.string().optional(),
  resumeUrl: z.string().url("Invalid URL").optional(),
});

export const updateCandidateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email("Invalid email").optional(),
  notes: z.string().optional(),
  phone: z.string().optional(),
  resumeUrl: z.string().url("Invalid URL").optional(),
});

export const stageTransitionSchema = z.object({
  toStage: z.enum(stageValues as [string, ...string[]]),
});
