# HireTrack — Plan

## Overview

HireTrack is a trimmed Applicant Tracking System (ATS) built with Next.js 16, Express 5, MongoDB (Mongoose), and Tailwind CSS v4. It enables recruiters and admins to manage job postings, track candidates through a Kanban pipeline, and view hiring statistics on a dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Express 5, TypeScript |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Dev Tools | ts-node, nodemon |

---

## User Roles

- **Admin** — full access: create/edit/delete jobs, manage all candidates, view dashboard
- **Recruiter** — create/edit jobs (own), manage candidates (own jobs), view dashboard

---

## User Stories & Acceptance Criteria

### US-01: User Registration

**As a** new user  
**I want to** register with name, email, and password  
**So that** I can access the HireTrack system

**Acceptance Criteria:**
- [ ] `POST /api/auth/register` accepts `{ name, email, password }`
- [ ] Password is hashed with bcrypt before storing
- [ ] Email is validated for format and uniqueness
- [ ] Default role is "recruiter"
- [ ] Response returns user (without password) + JWT token
- [ ] Frontend `/register` page has a form with validation
- [ ] On success, redirect to `/dashboard`

### US-02: User Login

**As a** registered user  
**I want to** login with email and password  
**So that** I can access my dashboard

**Acceptance Criteria:**
- [ ] `POST /api/auth/login` accepts `{ email, password }`
- [ ] Invalid credentials return 401 with error message
- [ ] Response returns user + JWT token
- [ ] Frontend `/login` page has a form with validation
- [ ] On success, store token and redirect to `/dashboard`
- [ ] JWT token expires after 7 days

### US-03: Protected Routes (Auth Middleware)

**As a** user  
**I want** certain routes to require authentication  
**So that** unauthorized users cannot access the system

**Acceptance Criteria:**
- [ ] `auth` middleware verifies JWT from `Authorization: Bearer <token>` header
- [ ] Invalid/expired token returns 401
- [ ] `req.user` is populated with user data after verification
- [ ] Frontend redirects to `/login` if no valid token found
- [ ] Frontend shows a loading state while checking auth status

### US-04: Role-Based Access Control

**As an** admin  
**I want** exclusive access to certain operations  
**So that** only admins can delete jobs and manage all records

**Acceptance Criteria:**
- [ ] `adminOnly` middleware checks `req.user.role === "admin"`
- [ ] Non-admin gets 403 Forbidden
- [ ] Admin can delete any job; recruiter sees no delete button
- [ ] Admin can view/edit all candidates across all jobs
- [ ] Frontend conditionally renders admin-only UI elements

### US-05: Job CRUD

**As a** recruiter/admin  
**I want** to create, read, update, and close job postings  
**So that** I can manage open positions

**Acceptance Criteria:**
- [ ] `GET /api/jobs` — list all jobs (with pagination), supports `?status=open` filter
- [ ] `POST /api/jobs` — create job with `{ title, description, department }`
- [ ] `GET /api/jobs/:id` — get single job with candidate count
- [ ] `PUT /api/jobs/:id` — update job fields (only owner or admin)
- [ ] `DELETE /api/jobs/:id` — delete job (admin only)
- [ ] Job status toggles between "open" and "closed"
- [ ] Frontend `/dashboard/jobs` — table listing with title, department, status, candidate count, actions
- [ ] Frontend `/dashboard/jobs/new` and `/dashboard/jobs/[id]/edit` — forms with validation
- [ ] Closing a job prevents new candidate additions

### US-06: Candidate Pipeline — Kanban Board

**As a** recruiter/admin  
**I want** to see candidates organized by stage in a Kanban board  
**So that** I can visually track the hiring pipeline

**Acceptance Criteria:**
- [ ] `GET /api/candidates` — list candidates with `?stage=` filter, supports pagination
- [ ] Candidates grouped by stage columns: Applied | Screening | Interview | Offer | Hired | Rejected
- [ ] Each column shows candidate cards with name, email, and applied date
- [ ] `PATCH /api/candidates/:id/stage` — move candidate to next/any stage
- [ ] Stage transition logs to `StageHistory` collection
- [ ] Frontend Kanban shows draggable/clickable stage movement
- [ ] Invalid transitions show error (e.g., Hired → Applied)
- [ ] Empty stage columns show "No candidates" state

### US-07: Candidate Profile

**As a** recruiter/admin  
**I want** to view a candidate's full profile with notes  
**So that** I can make informed hiring decisions

**Acceptance Criteria:**
- [ ] `GET /api/candidates/:id` — returns full candidate details + stage history
- [ ] Profile shows: name, email, current stage, applied job, timeline
- [ ] `PUT /api/candidates/:id` — update candidate info including notes field
- [ ] Notes field is a textarea (simplified scorecard)
- [ ] Stage history is displayed as a chronological timeline
- [ ] Frontend `/dashboard/candidates/[id]` page with profile + notes editor + history

### US-08: Search & Filter Candidates

**As a** recruiter/admin  
**I want** to search and filter candidates  
**So that** I can quickly find relevant candidates

**Acceptance Criteria:**
- [ ] `GET /api/candidates?search=keyword` — searches name and email (case-insensitive)
- [ ] `GET /api/candidates?stage=Interview` — filter by current stage
- [ ] `GET /api/candidates?jobId=xxx` — filter by job
- [ ] `GET /api/candidates?page=1&limit=10` — pagination with total count
- [ ] All filter parameters can be combined
- [ ] Frontend search bar with debounced input
- [ ] Frontend filter dropdowns for stage and job
- [ ] Pagination controls at the bottom

### US-09: Dashboard Stats

**As a** user  
**I want** to see hiring statistics on the dashboard  
**So that** I can track overall progress at a glance

**Acceptance Criteria:**
- [ ] `GET /api/dashboard` returns:
  - Total number of open jobs
  - Total candidates
  - Candidate count per stage
  - Recent stage changes (last 5)
- [ ] Dashboard page (`/dashboard`) displays:
  - Stat cards: Open Jobs, Total Candidates, Hired, Rejected
  - Stage distribution (bar or pie visual)
  - Recent activity feed
- [ ] Stats update in real-time when data changes (on page load)

### US-10: Stage History (Audit Log)

**As an** admin  
**I want** to see a history of stage transitions for each candidate  
**So that** I can audit the hiring process

**Acceptance Criteria:**
- [ ] `StageHistory` document created on every stage change: `{ candidateId, fromStage, toStage, changedBy, changedAt }`
- [ ] `GET /api/candidates/:id/history` — returns all stage changes for a candidate
- [ ] History is shown in candidate profile as a timeline
- [ ] Each entry shows: from → to, who changed it, and timestamp

---

## Database Schema

```
User {
  _id: ObjectId
  name: String (required)
  email: String (required, unique, lowercase)
  password: String (required, hashed)
  role: Enum ["admin", "recruiter"] (default: "recruiter")
  createdAt: Date
}

Job {
  _id: ObjectId
  title: String (required)
  description: String (required)
  department: String (required)
  status: Enum ["open", "closed"] (default: "open")
  createdBy: ObjectId (ref: User)
  createdAt: Date
}

Candidate {
  _id: ObjectId
  name: String (required)
  email: String (required)
  jobId: ObjectId (ref: Job, required)
  currentStage: Enum ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"] (default: "Applied")
  notes: String
  createdAt: Date
  updatedAt: Date
}

StageHistory {
  _id: ObjectId
  candidateId: ObjectId (ref: Candidate)
  fromStage: String
  toStage: String
  changedBy: ObjectId (ref: User)
  changedAt: Date
}
```

---

## API Routes

### Auth
| Method | Route | Auth | Role |
|---|---|---|---|
| POST | `/api/auth/register` | — | — |
| POST | `/api/auth/login` | — | — |
| GET | `/api/auth/me` | auth | any |

### Jobs
| Method | Route | Auth | Role |
|---|---|---|---|
| GET | `/api/jobs` | auth | any |
| POST | `/api/jobs` | auth | any |
| GET | `/api/jobs/:id` | auth | any |
| PUT | `/api/jobs/:id` | auth | owner/admin |
| DELETE | `/api/jobs/:id` | adminOnly | admin |

### Candidates
| Method | Route | Auth | Role |
|---|---|---|---|
| GET | `/api/candidates` | auth | any |
| POST | `/api/candidates` | auth | any |
| GET | `/api/candidates/:id` | auth | any |
| PUT | `/api/candidates/:id` | auth | any |
| PATCH | `/api/candidates/:id/stage` | auth | any |
| GET | `/api/candidates/:id/history` | auth | any |

### Dashboard
| Method | Route | Auth | Role |
|---|---|---|---|
| GET | `/api/dashboard` | auth | any |

---

## Frontend Routes

| Path | Page | Auth |
|---|---|---|
| `/login` | Login form | No |
| `/register` | Registration form | No |
| `/dashboard` | Stats dashboard | Yes |
| `/dashboard/jobs` | Jobs list | Yes |
| `/dashboard/jobs/new` | Create job | Yes |
| `/dashboard/jobs/[id]/edit` | Edit job | Yes |
| `/dashboard/candidates` | Kanban board | Yes |
| `/dashboard/candidates/[id]` | Candidate profile | Yes |

---

## Stage Transition Rules

```
Applied → Screening ✓
Applied → Rejected  ✓
Screening → Interview ✓
Screening → Rejected ✓
Interview → Offer ✓
Interview → Rejected ✓
Offer → Hired ✓
Offer → Rejected ✓
Hired → * ✗ (terminal)
Rejected → * ✗ (terminal)
```

---

## Day-wise Breakdown

### Day 1 — Backend Foundation
- MongoDB connection config
- All 4 Mongoose models
- Auth system (register, login, me)
- JWT middleware + adminOnly middleware

### Day 2 — Backend APIs
- Job CRUD routes + controller
- Candidate CRUD + stage transitions + history
- Search/filter/pagination on candidates
- Dashboard stats endpoint
- Global error handler

### Day 3 — Frontend Foundation
- Auth pages (login, register)
- Auth context + protected routes
- Dashboard layout (sidebar + topbar)
- Jobs list, create, edit pages

### Day 4 — Frontend Core Features
- Kanban board with stage columns
- Candidate profile with notes + history
- Search/filter/pagination UI
- Dashboard stats page
- Loading/empty/error states

### Day 5 — Polish & Ship
- Form validations everywhere
- Toast notifications for errors
- Stage transition guards
- Admin vs Recruiter UX
- Backend seed script
- README with setup instructions
- Final walkthrough
