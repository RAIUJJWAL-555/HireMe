import { PrismaClient, Role, Stage, Experience } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.stageHistory.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@hiretrack.com",
      password: hashedPassword,
      role: Role.admin,
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      name: "Recruiter User",
      email: "recruiter@hiretrack.com",
      password: hashedPassword,
      role: Role.recruiter,
    },
  });

  console.log(`  ✓ ${admin.name} (admin) — admin@hiretrack.com / password123`);
  console.log(`  ✓ ${recruiter.name} (recruiter) — recruiter@hiretrack.com / password123`);

  // ── Jobs ──
  const feJob = await prisma.job.create({
    data: {
      title: "Frontend Developer",
      description: "Build and maintain React/Next.js applications. Experience with TypeScript required.",
      qualification: "B.Tech / B.Sc Computer Science",
      experience: Experience.ThreeToFive,
      status: "open",
      createdById: recruiter.id,
    },
  });

  const beJob = await prisma.job.create({
    data: {
      title: "Backend Developer",
      description: "Design and implement RESTful APIs using Node.js and Express. Experience with MongoDB preferred.",
      qualification: "B.Tech / MCA",
      experience: Experience.OneToThree,
      status: "open",
      createdById: recruiter.id,
    },
  });

  const pmJob = await prisma.job.create({
    data: {
      title: "Product Manager",
      description: "Own product roadmap, gather requirements, and work with engineering teams to deliver features.",
      qualification: "MBA / B.Tech",
      experience: Experience.FivePlus,
      status: "open",
      createdById: admin.id,
    },
  });

  console.log(`  ✓ ${feJob.title}`);
  console.log(`  ✓ ${beJob.title}`);
  console.log(`  ✓ ${pmJob.title}`);

  // ── Candidates ──
  const candidates = [
    // Frontend Developer
    { name: "Alice Johnson",  email: "alice@example.com",  jobId: feJob.id, currentStage: Stage.Applied },
    { name: "Bob Smith",      email: "bob@example.com",    jobId: feJob.id, currentStage: Stage.Screening, notes: "Phone screen scheduled for next week" },
    { name: "Carol Davis",    email: "carol@example.com",  jobId: feJob.id, currentStage: Stage.Interview, notes: "Strong React portfolio. Technical round pending." },
    { name: "David Wilson",   email: "david@example.com",  jobId: feJob.id, currentStage: Stage.Hired,    notes: "Accepted offer. Start date: Aug 1." },

    // Backend Developer
    { name: "Eva Brown",      email: "eva@example.com",    jobId: beJob.id, currentStage: Stage.Applied },
    { name: "Frank Miller",   email: "frank@example.com",  jobId: beJob.id, currentStage: Stage.Screening, notes: "Good SQL experience. Need to verify system design skills." },
    { name: "Grace Lee",      email: "grace@example.com",  jobId: beJob.id, currentStage: Stage.Interview, notes: "Excellent Node.js knowledge. Final round this Friday." },
    { name: "Henry Taylor",   email: "henry@example.com",  jobId: beJob.id, currentStage: Stage.Offer,    notes: "Offer extended. Awaiting response." },

    // Product Manager
    { name: "Irene Martinez", email: "irene@example.com",  jobId: pmJob.id, currentStage: Stage.Applied },
    { name: "Jack Anderson",  email: "jack@example.com",   jobId: pmJob.id, currentStage: Stage.Screening, notes: "Background in SaaS product management." },
    { name: "Karen Thomas",   email: "karen@example.com",  jobId: pmJob.id, currentStage: Stage.Interview, notes: "Strong candidate. Panel interview completed." },
    { name: "Larry White",    email: "larry@example.com",  jobId: pmJob.id, currentStage: Stage.Rejected,  notes: "Lacked domain expertise in hiring space." },
  ];

  for (const c of candidates) {
    const candidate = await prisma.candidate.create({ data: c });

    // Create stage history for candidates beyond Applied
    if (c.currentStage !== Stage.Applied && c.currentStage !== Stage.Rejected) {
      // Simulate: Applied → current stage
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Applied,
          toStage: c.currentStage,
          changedById: recruiter.id,
          changedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 7 + 1)),
        },
      });
    }

    if (c.currentStage === Stage.Hired) {
      // Simulate: Applied → Interview → Hired
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Applied,
          toStage: Stage.Interview,
          changedById: recruiter.id,
          changedAt: new Date(Date.now() - 86400000 * 14),
        },
      });
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Interview,
          toStage: Stage.Offer,
          changedById: recruiter.id,
          changedAt: new Date(Date.now() - 86400000 * 7),
        },
      });
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Offer,
          toStage: Stage.Hired,
          changedById: admin.id,
          changedAt: new Date(Date.now() - 86400000 * 2),
        },
      });
    }

    if (c.currentStage === Stage.Offer) {
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Applied,
          toStage: Stage.Interview,
          changedById: recruiter.id,
          changedAt: new Date(Date.now() - 86400000 * 10),
        },
      });
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Interview,
          toStage: Stage.Offer,
          changedById: recruiter.id,
          changedAt: new Date(Date.now() - 86400000 * 3),
        },
      });
    }

    if (c.currentStage === Stage.Rejected) {
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Applied,
          toStage: Stage.Screening,
          changedById: recruiter.id,
          changedAt: new Date(Date.now() - 86400000 * 5),
        },
      });
      await prisma.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: Stage.Screening,
          toStage: Stage.Rejected,
          changedById: admin.id,
          changedAt: new Date(Date.now() - 86400000 * 2),
        },
      });
    }
  }

  console.log(`  ✓ ${candidates.length} candidates created`);
  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
