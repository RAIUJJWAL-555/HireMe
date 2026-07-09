# HireTrack

A trimmed Applicant Tracking System (ATS) built with Next.js 16, Express 5, MongoDB (Prisma), and Tailwind CSS v4.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Express 5, TypeScript, Prisma ORM
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- npm

### Setup

```bash
# Clone the repo
git clone <repo-url> && cd HireTrack

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Push schema & seed
cd backend
npx prisma db push
npm run seed
cd ..

# Start dev servers
cd backend && npm run dev &
cd frontend && npm run dev &
```

## Features

- Job Posting CRUD
- Candidate Pipeline (Kanban: Applied → Screening → Interview → Offer → Hired/Rejected)
- Candidate Profiles with Notes
- Search, Filter & Pagination
- Auth with JWT (Recruiter / Admin roles)
- Dashboard with Hiring Stats
- Stage History Audit Log

## Project Structure

```
HireTrack/
├── backend/
│   ├── prisma/          # Schema + migrations
│   ├── src/
│   │   ├── config/      # DB connection
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/   # Auth, RBAC
│   │   ├── models/      # (deprecated — using Prisma)
│   │   ├── routes/      # Express routes
│   │   └── index.ts     # Entry point
│   └── package.json
├── frontend/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Shared components
│   ├── lib/             # API client, utils
│   └── package.json
└── plan.md              # Feature plan & user stories
```

## License

MIT
