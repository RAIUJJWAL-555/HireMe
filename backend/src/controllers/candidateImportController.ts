import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import Papa from "papaparse";
import prisma from "../config/db";

const rowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().default(""),
  resumeUrl: z.string().optional().default(""),
  jobAppliedFor: z.string().min(1, "Job Applied For is required"),
  notes: z.string().optional().default(""),
});

type ParsedRow = Record<string, string>;

const COLUMN_MAP: Record<string, keyof typeof rowSchema.shape> = {
  name: "name",
  email: "email",
  phone: "phone",
  "resume url": "resumeUrl",
  "resumé url": "resumeUrl",
  resumeurl: "resumeUrl",
  "job applied for": "jobAppliedFor",
  jobappliedfor: "jobAppliedFor",
  job: "jobAppliedFor",
  "job title": "jobAppliedFor",
  jobtitle: "jobAppliedFor",
  job_title: "jobAppliedFor",
  notes: "notes",
};

function normalizeHeaders(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const h of headers) {
    const key = h.trim().toLowerCase().replace(/[\s_-]+/g, " ");
    map[key] = h.trim();
  }
  return map;
}

function mapRow(raw: ParsedRow, headerMap: Record<string, string>) {
  const mapped: Record<string, string> = {
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
    jobAppliedFor: "",
    notes: "",
  };
  for (const [normalizedKey, field] of Object.entries(COLUMN_MAP)) {
    const originalHeader = Object.entries(headerMap).find(
      ([k]) => k === normalizedKey
    );
    if (originalHeader) {
      mapped[field] = (raw[originalHeader[1]] ?? "").trim();
    }
  }
  return mapped;
}

interface ImportError {
  row: number;
  reason: string;
}

export async function importCandidates(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded. Send a CSV as 'file'." });
      return;
    }

    const csv = file.buffer.toString("utf-8");
    const parsed = Papa.parse<ParsedRow>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
    });

    if (parsed.data.length === 0) {
      res.status(400).json({ error: "CSV file is empty or has no data rows." });
      return;
    }

    const headers = parsed.meta.fields ?? [];
    const headerMap = normalizeHeaders(headers);

    const errors: ImportError[] = [];
    const validRows: {
      name: string;
      email: string;
      phone: string;
      resumeUrl: string;
      jobId: string;
      notes: string;
    }[] = [];

    const allJobs = await prisma.job.findMany({
      select: { id: true, title: true },
    });
    const jobLookup = new Map<string, string>();
    for (const job of allJobs) {
      jobLookup.set(job.title.trim().toLowerCase(), job.id);
    }

    for (let i = 0; i < parsed.data.length; i++) {
      const rowNum = i + 2;
      const raw = parsed.data[i];
      const mapped = mapRow(raw, headerMap);

      const result = rowSchema.safeParse(mapped);
      if (!result.success) {
        const msg = result.error.issues.map((e) => e.message).join("; ");
        errors.push({ row: rowNum, reason: msg });
        continue;
      }

      const { name, email, phone, resumeUrl, jobAppliedFor, notes } = result.data;

      const jobId = jobLookup.get(jobAppliedFor.trim().toLowerCase());
      if (!jobId) {
        errors.push({
          row: rowNum,
          reason: `No matching job found for "${jobAppliedFor}"`,
        });
        continue;
      }

      const existing = await prisma.candidate.findFirst({
        where: { email, jobId },
        select: { id: true },
      });
      if (existing) {
        errors.push({
          row: rowNum,
          reason: `Duplicate candidate (email "${email}" already exists for this job)`,
        });
        continue;
      }

      validRows.push({ name, email, phone, resumeUrl, jobId, notes });
    }

    let imported = 0;
    if (validRows.length > 0) {
      await prisma.$transaction(
        validRows.map((row) =>
          prisma.candidate.create({
            data: {
              name: row.name,
              email: row.email,
              phone: row.phone || null,
              resumeUrl: row.resumeUrl || null,
              jobId: row.jobId,
              currentStage: "Applied",
              notes: row.notes || "",
            },
          })
        )
      );
      imported = validRows.length;
    }

    res.status(201).json({
      totalRows: parsed.data.length,
      imported,
      skipped: errors.length,
      errors,
    });
  } catch (err) {
    next(err);
  }
}
