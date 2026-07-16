import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  qualification: z.string().min(1, "Qualification is required").max(100),
  experience: z.enum(["Fresher", "ZeroToOne", "OneToThree", "ThreeToFive", "FivePlus"], {
    message: "Experience is required",
  }),
});

export const updateJobSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  qualification: z.string().min(1).max(100).optional(),
  experience: z.enum(["Fresher", "ZeroToOne", "OneToThree", "ThreeToFive", "FivePlus"]).optional(),
  status: z.enum(["open", "closed"]).optional(),
});
