import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  department: z.string().min(1, "Department is required").max(100),
});

export const updateJobSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  department: z.string().min(1).max(100).optional(),
  status: z.enum(["open", "closed"]).optional(),
});
