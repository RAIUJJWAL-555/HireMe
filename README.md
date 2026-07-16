# HireTrack

A lightweight Applicant Tracking System (ATS) for small-to-mid recruiting teams — manage jobs, move candidates through stages, and track hiring metrics from a single dashboard.

![HireTrack Dashboard](./screenshots/dashboard.png)

## Features

- **Candidate Pipeline** — Kanban-style board (Applied → Screening → Interview → Offer → Hired / Rejected)
- **Job Postings** — Create, manage, and close openings organized by department
- **Search & Filter** — Fast lookup by name, email, job, stage, or keywords with pagination
- **Role-Based Access** — Admin and Recruiter permissions with full stage-history audit logs
- **Dashboard Metrics** — Hiring stats, stage conversions, and recent activity at a glance
- **Candidate Profiles** — Detailed view with notes and stage history timeline

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Express 5, TypeScript, Prisma ORM |
| Database | MongoDB |
| Auth | JWT (bcrypt + jsonwebtoken) |

## Quickstart

### Prerequisites

- **Node.js** 20+
- **MongoDB** running locally or a MongoDB Atlas URI

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/HireMe.git
cd HireMe

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` with your MongoDB URI and a secure JWT secret.

### 3. Push schema & seed database

```bash
cd backend
npx prisma db push
npm run seed
```

### 4. Start dev servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Open **http://localhost:3000** in your browser.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/hiretrack` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `PORT` | Express server port | `5000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Demo Login

After running `npm run seed`, the database is pre-populated with two demo accounts and sample data (3 job postings, 12 candidates across pipeline stages):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hiretrack.com` | `password123` |
| Recruiter | `recruiter@hiretrack.com` | `password123` |

> **Note:** The seeded password is `password123` — change it before any production deployment.

## Project Structure

```
HireMe/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Seed script (demo data)
│   ├── src/
│   │   ├── config/              # DB connection
│   │   ├── controllers/         # Route handlers (auth, jobs, candidates)
│   │   ├── middleware/           # Auth + RBAC
│   │   ├── routes/              # Express routes
│   │   └── index.ts             # Entry point
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── (auth)/              # Login & register pages
│   │   ├── dashboard/           # Dashboard, jobs, candidates
│   │   ├── components/
│   │   │   ├── landing/         # Hero, Features, HowItWorks, Footer
│   │   │   ├── Navbar.tsx
│   │   │   └── KanbanBoard.tsx
│   │   ├── context/             # AuthContext
│   │   └── lib/                 # API client, utils
│   └── .env.local.example
├── screenshots/
│   └── dashboard.png            # App screenshot
├── LICENSE                      # MIT
└── README.md
```

## API Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login (returns JWT) | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/jobs` | List all jobs | Yes |
| POST | `/api/jobs` | Create job | Yes (Admin) |
| GET | `/api/candidates` | List candidates (filterable) | Yes |
| POST | `/api/candidates` | Add candidate | Yes |
| PATCH | `/api/candidates/:id/stage` | Move candidate stage | Yes |

## License

[MIT](./LICENSE)
