# GALE Skycrane — The Playground for Curiosity

An internal launcher and project library for GALE Partners sandbox platforms. Skycrane lets teams
discover sandbox projects, understand each project's stack and analytics setup, find team-specific
access instructions, and launch PROD / QA / DEV (and custom) environments — all behind role-based
access.

## Features

- **Login with role-based access** — `admin`, `edit`, and `read` roles
- **Project library** — launcher grid with custom project icons, tool/stack logos, and per-environment quick launch
- **Project page (PDP)** — readable description view with launch CTAs at the top
- **Project Settings** — editable details, team access playbooks, and environments (editors/admins)
- **Team & Users** — admin-only user management
- **Lightweight & local** — React + Vite front end with IndexedDB (Dexie) persistence; no heavy backend

## Tech stack

- React + TypeScript + Vite
- React Router
- Dexie (IndexedDB) for local persistence
- lucide-react + react-icons for iconography

## Getting started

```bash
cd dashboard
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173/`).

### Demo accounts

| Role  | Email             | Password    |
| ----- | ----------------- | ----------- |
| Admin | admin@gale.dev    | Admin@123   |
| Edit  | editor@gale.dev   | Editor@123  |
| Read  | reader@gale.dev   | Reader@123  |

## Project structure

```
.
├── assests/           # Brand assets (GALE logo)
├── context.md         # Full project context & architecture notes
└── dashboard/         # Vite React application
    └── src/
        ├── components/  # Layout, ProtectedRoute, ProjectIcon
        ├── pages/       # Login, Dashboard, Project, ProjectSettings, Users
        ├── lib/         # icon + project helpers
        ├── auth/        # auth context
        └── db.ts        # Dexie database + seed data
```

See [`context.md`](./context.md) for detailed architecture and how to extend the project.

---

© GALE Partners LLP
