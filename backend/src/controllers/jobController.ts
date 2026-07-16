import { Response, NextFunction } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function listJobs(req: AuthRequest, res: Response) {
  const { status } = req.query;

  const where: any = {};
  if (status === "open" || status === "closed") {
    where.status = status;
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { _count: { select: { candidates: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ jobs });
}

export async function getJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({
      where: { id },
      include: { _count: { select: { candidates: true } } },
    });

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, description, qualification, experience } = req.body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        qualification,
        experience,
        createdById: req.user!.id,
      },
    });

    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.job.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const isOwner = existing.createdById === req.user!.id;
    const isAdmin = req.user!.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: "Only the owner or an admin can update this job" });
      return;
    }

    const job = await prisma.job.update({
      where: { id },
      data: req.body,
    });

    res.json({ job });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.job.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    await prisma.job.delete({ where: { id } });

    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
}
