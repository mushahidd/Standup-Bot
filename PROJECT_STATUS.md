# StandupBot - Project Status Analysis

## Executive Summary

Your project has a **solid backend foundation** but is **missing all the core application UI pages**. You currently have:
- ✅ Complete backend API (FastAPI with all routes)
- ✅ Database schema (SQLite with all tables)
- ✅ Google OAuth authentication
- ✅ AI integration (OpenRouter)
- ✅ Landing page (marketing site)
- ❌ **No application pages** (dashboard, project pages, standup forms, brief viewer)

## What's Complete

### Backend (100% Complete)
- ✅ FastAPI server setup with CORS
- ✅ SQLite database with all 5 tables (users, projects, project_members, standups, briefs)
- ✅ Google OAuth 2.0 flow (login, callback, logout)
- ✅ Session management with signed cookies
- ✅ All API routes implemented:
  - Projects: create, list, get details
  - Members: add by email, invite links, accept/decline, remove
  - Standups: submit, edit, get today's standup, status tracker
  - Briefs: generate with streaming, get today's brief
- ✅ AI prompt engineering with OpenRouter
- ✅ Streaming brief generation
- ✅ Environment variables configured

### Frontend (Only Landing Page)
- ✅ Landing page with all sections:
  - Nav, Hero, Trust Strip, Problem/Solution, Features, How It Works, CTA, Footer
- ✅ TanStack Router setup
- ✅ Tailwind CSS + shadcn/ui components
- ✅ React 19 + TypeScript

## What's Missing (Critical for MVP)

### 1. Dashboard Page (`/dashboard`)
**Priority: CRITICAL**

Missing features:
- List all user's projects with status badges
- Show role (Leader/Member) for each project
- Display today's status: "Standup due", "Submitted", "Brief ready"
- Show deadline with days remaining
- "New Project" button
- Pending invites section

**Estimated time: 2-3 hours**

### 2. Create Project Page (`/projects/new`)
**Priority: CRITICAL**

Missing features:
- Form with 4 fields: name, description, deadline, standup_closes_at
- Date picker for deadline
- Time picker for standup close time
- Submit creates project and redirects to members page

**Estimated time: 1 hour**

### 3. Project Home Page (`/projects/{id}`)
**Priority: CRITICAL**

Missing features:
- Project details display
- Member list with submission status
- Submission tracker (green checks / gray clocks)
- "Generate Brief" button (leader only)
- Navigation to standup form and brief
- Time remaining until standup closes

**Estimated time: 2-3 hours**

### 4. Members Management (`/projects/{id}/members`)
**Priority: HIGH**

Missing features:
- Add member by email form
- List current members
- Remove member button (leader only)
- Member status indicators

**Estimated time: 1-2 hours**

### 5. Invite Links Page (`/projects/{id}/invite-links`)
**Priority: HIGH**

Missing features:
- Create invite link with role
- List existing invite links
- Copy link to clipboard
- Show used/unused status

**Estimated time: 1 hour**

### 6. Join Invite Page (`/join/{token}`)
**Priority: HIGH**

Missing features:
- Preview invite (project name, role)
- Accept/Decline buttons
- Handle already-used tokens
- Redirect to Google OAuth if not logged in

**Estimated time: 1 hour**

### 7. Standup Form (`/projects/{id}/standup`)
**Priority: CRITICAL**

Missing features:
- Three text areas: "What did you do?", "What will you do?", "Any blockers?"
- Pre-fill if editing existing submission
- Show submission count after submit
- Lock form if brief already generated
- Show "X of Y submitted" status

**Estimated time: 1-2 hours**

### 8. Brief Viewer (`/projects/{id}/brief`)
**Priority: CRITICAL**

Missing features:
- Display AI-generated brief with markdown rendering
- Color-coded sections:
  - Red: Blockers (#DC2626 / #FEE2E2)
  - Green: Completed work (#16A34A / #DCFCE7)
  - Blue: New member welcome (#2563EB / #DBEAFE)
  - Amber: Missing members (#D97706 / #FEF3C7)
- Show submission stats (e.g., "3 of 4 submitted")
- Streaming display during generation
- Read-only view

**Estimated time: 2-3 hours**

### 9. Authentication Flow Integration
**Priority: CRITICAL**

Missing features:
- Redirect unauthenticated users to `/auth/google`
- Handle OAuth callback and redirect to dashboard
- Store session cookie
- Logout functionality
- Protected route wrapper

**Estimated time: 1 hour**

## Additional Missing Features (Nice-to-Have)

### 10. Error Handling & Edge Cases
- Toast notifications for success/error
- Empty states for all pages
- Loading states during API calls
- Form validation with error messages
- 403/404 error pages

**Estimated time: 2 hours**

### 11. Demo Data Seeding
**Priority: HIGH for Demo**

Need to create:
- Seed script to populate database with demo data
- 1 project with 4 members
- 3 submitted standups (one with blocker, one first-time)
- 1 missing member
- Pre-generated brief

**Estimated time: 1 hour**

## Total Remaining Work

### Critical Path (Must-Have for Demo)
1. Dashboard page - 2-3 hours
2. Project home page - 2-3 hours
3. Standup form - 1-2 hours
4. Brief viewer with streaming - 2-3 hours
5. Auth flow integration - 1 hour
6. Create project page - 1 hour
7. Demo data seeding - 1 hour

**Total Critical: 10-14 hours**

### High Priority (Needed for Full Flow)
8. Members management - 1-2 hours
9. Invite links page - 1 hour
10. Join invite page - 1 hour
11. Error handling - 2 hours

**Total High Priority: 5-6 hours**

## Recommended Build Order

### Phase 1: Core User Flow (6-8 hours)
1. **Auth integration** (1 hour) - Get login working first
2. **Dashboard** (2-3 hours) - User's home base
3. **Create project** (1 hour) - Leader can create projects
4. **Project home** (2-3 hours) - View project and members

### Phase 2: Standup Flow (4-5 hours)
5. **Standup form** (1-2 hours) - Members submit updates
6. **Brief viewer** (2-3 hours) - Display AI-generated brief with streaming

### Phase 3: Member Management (3-4 hours)
7. **Members page** (1-2 hours) - Add/remove members
8. **Invite links** (1 hour) - Generate invite links
9. **Join page** (1 hour) - Accept invites

### Phase 4: Polish & Demo (3 hours)
10. **Error handling** (2 hours) - Toast, empty states, loading
11. **Demo data** (1 hour) - Seed database for demo

**Total: 16-20 hours of focused work**

## Technical Debt & Issues

### Current Issues
1. **Frontend/Backend disconnect**: Landing page is React/TanStack, but no app pages exist
2. **No API client**: Need to create fetch wrapper for backend API calls
3. **No auth state management**: Need to track logged-in user in frontend
4. **No markdown renderer**: Brief viewer needs markdown-to-HTML library
5. **No SSE client**: Brief streaming needs EventSource or fetch streaming

### Recommended Additions
- Install `marked` or `react-markdown` for brief rendering
- Create `src/lib/api.ts` for API calls
- Create `src/hooks/use-auth.ts` for auth state
- Add toast library (already have `sonner` installed)
- Add form validation with `react-hook-form` + `zod` (already installed)

## Files That Need to Be Created

### Routes (TanStack Router)
```
src/routes/
  dashboard.tsx          ← List all projects
  projects/
    new.tsx              ← Create project form
    $projectId/
      index.tsx          ← Project home
      standup.tsx        ← Standup form
      brief.tsx          ← Brief viewer
      members.tsx        ← Members management
      invite-links.tsx   ← Invite links
  join/
    $token.tsx           ← Accept invite
  login.tsx              ← Login page (redirect to OAuth)
```

### Utilities
```
src/lib/
  api.ts                 ← API client with fetch wrapper
  markdown.ts            ← Markdown rendering utilities
  
src/hooks/
  use-auth.ts            ← Auth state management
  use-project.ts         ← Project data fetching
  use-standup.ts         ← Standup submission
```

### Components
```
src/components/app/
  ProjectCard.tsx        ← Dashboard project card
  MemberList.tsx         ← Member list with status
  StandupForm.tsx        ← Three-question form
  BriefDisplay.tsx       ← Color-coded brief renderer
  SubmissionTracker.tsx  ← Green checks / gray clocks
  InviteLink.tsx         ← Invite link with copy button
```

## Demo Readiness Checklist

- [ ] User can sign in with Google
- [ ] User sees dashboard with projects
- [ ] Leader can create a project
- [ ] Leader can add members (email or link)
- [ ] Member can accept invite
- [ ] Member can submit standup (3 questions)
- [ ] Leader sees submission tracker
- [ ] Leader can generate brief
- [ ] Brief streams to screen in real-time
- [ ] Brief shows color-coded sections
- [ ] Brief welcomes new member
- [ ] Brief flags missing member
- [ ] Brief identifies cross-person blocker
- [ ] Demo data is seeded and ready

## Next Steps

1. **Immediate**: Create the 8 missing route pages
2. **Then**: Build API client and auth hooks
3. **Then**: Implement forms and data fetching
4. **Finally**: Add polish, error handling, and demo data

## Questions to Resolve

1. Do you want to keep the TanStack Router approach or switch to simpler routing?
2. Should we use the existing shadcn/ui components or build custom ones?
3. Do you have design mockups for the app pages, or should we follow the PRD descriptions?
4. What's your target demo date? (This affects how much we can polish)

---

**Bottom Line**: You have a complete backend but need to build the entire frontend application. The landing page is done, but none of the actual app functionality is accessible to users yet. Estimated 16-20 hours of focused work to reach MVP demo-ready state.
