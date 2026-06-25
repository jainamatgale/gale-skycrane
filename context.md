# GALE Skycrane - Project Context

## Project Name
GALE Skycrane - The playground for Curiosity

## Organization Context
GALE Partners (legal name: GALE Partners LLP) supports enterprise clients across analytics and technology implementation. Teams often need fast, controlled sandboxes to experiment with new ideas, integrations, and delivery workflows before production work.

## Why This Exists
This dashboard is an internal launcher and governance layer for future sandbox platforms. It solves discoverability and handoff challenges by centralizing:
- Sandbox project directory
- Project purpose, implementation status, and connected tools
- Cross-team access instructions for Engineering, Design, Analytics, and Media
- Environment launch details (PROD / QA / DEV and custom tiers)
- Role-based permissions for viewing and editing platform metadata

## MVP Scope Implemented
- Login page with role-based access (`admin`, `edit`, `read`) and one-click demo accounts
- App shell with persistent left navigation sidebar (Projects, Team & Users) and mobile off-canvas drawer
- Projects page with a launcher grid; each card has quick-launch CTA, tool icons, and short description; project creation via modal
- Project page split into two distinct experiences:
  - Read view (PDP / description page) at `/projects/:id`: readable hero, top quick-launch CTAs per environment, prose sections, tool pills, environments, and team access summary
  - Editable `Project Settings` at `/projects/:id/settings` (gear button, editors/admins only) with tabs: `Overview`, `Team Access`, `Environments`
- Dedicated admin-only `Team & Users` page (add/remove users, role assignment)
- Seeded fake project for testing
- IndexedDB persistence via Dexie (lightweight local data store)
- Fully responsive (desktop sidebar collapses to a hamburger drawer on mobile)

## Current Architecture
- Front-end framework: React + TypeScript + Vite
- Routing: `react-router-dom` (protected routes wrap a shared `Layout` with sidebar)
- Data persistence: IndexedDB using `dexie`
- UI icons: `lucide-react` (UI) + `react-icons` (brand/tool logos via `src/lib/icons.tsx`)
- Auth model: local role-based login using persisted seeded users

## Design System
- Premium typography: `Plus Jakarta Sans` (display/headings) + `Inter` (body), loaded via Google Fonts in `index.html`
- Color direction: black-grey theme (near-black canvas, translucent glass surfaces, light/white primary CTA)
- Glass/blur effects via `backdrop-filter` on cards, modals, and mobile top bar; NO drop shadows anywhere
- Tier color coding for environments (PROD emerald, QA amber, DEV blue, custom violet) used sparingly for meaning
- No emojis anywhere; all glyphs are vector icons
- Persistent GALE branding: desktop sidebar + sticky mobile top bar
- Tokens and component styles centralized in `dashboard/src/index.css`

## Key Files
- `src/components/Layout.tsx`: sidebar nav, sticky mobile top bar, drawer, user/footer, logout
- `src/lib/icons.tsx`: maps tool/stack names to brand icons + colors
- `src/lib/project.ts`: helper to resolve the primary launch environment
- `src/pages/DashboardPage.tsx`: project launcher grid + quick launch + create modal
- `src/pages/ProjectPage.tsx`: readable PDP view with top launch CTAs
- `src/pages/ProjectSettingsPage.tsx`: editable tabbed project settings
- `src/pages/UsersPage.tsx`: admin user management
- `src/pages/LoginPage.tsx`: split hero + sign-in

## Data Model (High Level)
- `User`:
  - `fullName`, `email`, `password`, `role`
- `Project`:
  - core metadata (`name`, `client`, `summary`, `purpose`)
  - `stack`, `analytics`, `implementationStatus`
  - team access structures (`teamAccess`, `designAccess`, `analyticsAccess`)
  - `environments[]` with tier + launch URL + credentials

## Roles and Permissions
- `admin`: full project edits + user management
- `edit`: edit project details and environments
- `read`: view-only (launch and read content)

## Fake Seed Data
- Seed users:
  - `admin@gale.dev / Admin@123`
  - `editor@gale.dev / Editor@123`
  - `reader@gale.dev / Reader@123`
- Seed project:
  - `Skycrane Commerce Experience` with sample stack, analytics, access workflows, and environments

## Branding and Design Notes
- Company logo used from `assests/gale-logo.png` (copied into app assets for bundling)
- Visual direction: modern, professional, clear hierarchy, large launcher cards, icon-led stack visibility

## How to Run
1. `cd dashboard`
2. `npm install`
3. `npm run dev`
4. Open the local Vite URL in browser

## How to Make Future Changes
- Update or expand types in `dashboard/src/types.ts`
- Update database schema and seed data in `dashboard/src/db.ts`
- Add new tool/stack brand icons in `dashboard/src/lib/icons.tsx`
- Update navigation items in `dashboard/src/components/Layout.tsx`
- Update role rules in:
  - `dashboard/src/auth/AuthContext.tsx`
  - `dashboard/src/pages/DashboardPage.tsx`
  - `dashboard/src/pages/ProjectPage.tsx`
  - `dashboard/src/pages/UsersPage.tsx`
- Update app routes in `dashboard/src/App.tsx`
- Update global UI styles / design tokens in `dashboard/src/index.css`
- Update fonts in `dashboard/index.html`

## Planned Evolution (Next Suggested Steps)
- Add encrypted passwords and invite-based authentication
- Add backend sync (optional lightweight API + SQLite/Postgres)
- Add audit logs for project/user changes
- Add project tags and filters by client/team/stack
- Add environment health status checks
