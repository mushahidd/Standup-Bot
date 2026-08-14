# StandupBot

AI-powered async standups for student project teams. Each teammate answers 3 questions in 90 seconds — the AI reads everyone's updates together and writes one brief that flags blockers, cross-person dependencies, new joiners, and missing members.

Built for **Iterate '26 Hackathon**.

---

## What it does

Student teams coordinate over WhatsApp with no structure. Blockers stay hidden, work gets duplicated, and nobody notices a missing member until 48 hours before the deadline.

StandupBot fixes this:

1. A leader creates a project and invites members by email or invite link
2. Each member submits 3 daily questions in under 90 seconds
3. The AI reads **all submissions together** and generates one team brief
4. The brief names who is blocked, who can unblock them, welcomes new joiners, and flags missing members

The key insight: this requires **cross-person reasoning** — something you can't do in a single ChatGPT tab because it can't independently receive private input from four different people.

---

## Demo

🚀 **[Live Demo](https://standup-bot-mushahidd.vercel.app)** — click "Try Demo" to explore without signing in

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TanStack Router, TanStack Query, Tailwind CSS v4, shadcn/ui |
| Backend | FastAPI (Python), SQLite |
| Auth | Google OAuth 2.0 (signed session cookies) |
| AI | OpenRouter API (`openai/gpt-3.5-turbo`) with streaming |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Running locally

### Prerequisites

- Node.js 18+
- Python 3.10+

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
OPENROUTER_API_KEY=your_openrouter_api_key
SESSION_SECRET=any_random_secret_string
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Key features

- **Google OAuth** — frictionless login students already have
- **Invite by email or link** — role-tagged invite links shareable over WhatsApp
- **AI brief generation** — streams in real time, completes in under 15 seconds
- **Cross-person blocker detection** — names who is blocked and who can fix it
- **New joiner welcome** — AI detects and warmly acknowledges first-time submitters
- **Missing member flag** — brief calls out anyone who didn't submit
- **Demo login** — try the full UI without a Google account

---

## Project structure

```
├── backend/
│   ├── main.py          # FastAPI app, CORS, static file serving
│   ├── auth.py          # Google OAuth + demo login endpoint
│   ├── db.py            # SQLite setup and init
│   ├── models.py        # Pydantic models
│   ├── ai.py            # OpenRouter streaming brief generation
│   └── routes/
│       ├── projects.py
│       ├── members.py
│       ├── standups.py
│       └── briefs.py
├── src/
│   ├── routes/          # TanStack Router file-based routes
│   │   ├── index.tsx    # Landing page
│   │   ├── dashboard.tsx
│   │   └── projects/
│   ├── components/
│   │   ├── landing/     # Marketing page sections
│   │   ├── app/         # App shell (AppNav)
│   │   └── ui/          # shadcn/ui primitives
│   ├── hooks/
│   │   └── use-auth.ts
│   └── lib/
│       └── api.ts       # Typed API client
└── public/
```

---

## API overview

| Method | Path | Description |
|---|---|---|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/demo` | Demo login (no credentials needed) |
| POST | `/auth/logout` | Clear session |
| GET | `/api/me` | Current user |
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/{id}` | Project detail + members |
| POST | `/api/projects/{id}/standup` | Submit standup |
| POST | `/api/projects/{id}/brief` | Generate AI brief (streaming) |
| GET | `/api/projects/{id}/brief/today` | Get today's brief |
| POST | `/api/projects/{id}/invite-links` | Create invite link |
| GET | `/api/join/{token}` | Preview invite |
| POST | `/api/join/{token}` | Accept invite |

---

## Deployment

The frontend deploys to Vercel as a static SPA. The backend deploys to Render as a Python web service.

Set `VITE_API_URL` in Vercel to point to your Render backend URL.

See `RAILWAY_DEPLOYMENT.md` for a detailed step-by-step guide.

---

## License

MIT
