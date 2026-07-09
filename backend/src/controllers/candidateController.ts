import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth";

type Stage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

const validTransitions: Record<Stage, Stage[]> = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],
  Hired: [],
  Rejected: [],
};

export async function listCandidates(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { search, stage, jobId, page = "1", limit = "10" } = req.query as Record<string, string>;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const take = Math.min(Math.max(1, parseInt(limit)), 100);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (stage) {
      where.currentStage = stage;
    }

    if (jobId) {
      where.jobId = jobId;
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take,
        include: {
          job: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.candidate.count({ where }),
    ]);

    res.json({
      candidates,
      pagination: {
        page: Math.max(1, parseInt(page)),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getCandidate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        job: { select: { id: true, title: true, department: true } },
        stageHistory: {
          orderBy: { changedAt: "desc" },
          include: { changedBy: { select: { id: true, name: true } } },
        },
      },
    });

    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    res.json({ candidate });
  } catch (err) {
    next(err);
  }
}

export async function createCandidate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, jobId, notes } = req.body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    if (job.status === "closed") {
      res.status(400).json({ error: "Cannot add candidates to a closed job" });
      return;
    }

    const candidate = await prisma.candidate.create({
      data: { name, email, jobId, notes: notes || "" },
      include: { job: { select: { id: true, title: true } } },
    });

    res.status(201).json({ candidate });
  } catch (err) {
    next(err);
  }
}

export async function updateCandidate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;

    const existing = await prisma.candidate.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: req.body,
    });

    res.json({ candidate });
  } catch (err) {
    next(err);
  }
}

export async function deleteCandidate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;

    const existing = await prisma.candidate.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    await prisma.stageHistory.deleteMany({ where: { candidateId: id } });
    await prisma.candidate.delete({ where: { id } });

    res.json({ message: "Candidate deleted" });
  } catch (err) {
    next(err);
  }
}

export async function updateStage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { toStage } = req.body as { toStage: Stage };

    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const fromStage = candidate.currentStage as Stage;
    const allowed = validTransitions[fromStage];

    if (!allowed.includes(toStage)) {
      res.status(400).json({
        error: `Cannot move from "${fromStage}" to "${toStage}". Allowed transitions: ${allowed.join(", ") || "none (terminal stage)"}`,
      });
      return;
    }

    const [updated] = await Promise.all([
      prisma.candidate.update({
        where: { id },
        data: { currentStage: toStage },
      }),
      prisma.stageHistory.create({
        data: {
          candidateId: id,
          fromStage,
          toStage,
          changedById: req.user!.id,
        },
      }),
    ]);

    res.json({ candidate: updated });
  } catch (err) {
    next(err);
  }
}
