import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getStats(req: AuthRequest, res: Response) {
  const [openJobs, totalCandidates, stageCounts] = await Promise.all([
    prisma.job.count({ where: { status: "open" } }),
    prisma.candidate.count(),
    prisma.candidate.groupBy({
      by: ["currentStage"],
      _count: true,
    }),
  ]);

  const stages: Record<string, number> = {};
  for (const s of stageCounts) {
    stages[s.currentStage] = s._count;
  }

  res.json({
    openJobs,
    totalCandidates,
    hired: stages.Hired || 0,
    rejected: stages.Rejected || 0,
    screening: stages.Screening || 0,
    interview: stages.Interview || 0,
    offer: stages.Offer || 0,
    applied: stages.Applied || 0,
  });
}
