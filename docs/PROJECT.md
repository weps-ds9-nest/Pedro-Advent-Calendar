# Project Architecture: Pedro Pascal Advent Calendar

This document details the system structure, directory layout, routing flows, authentication pipelines, and state storage mechanism.

## Technology Stack
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styles**: Tailwind CSS v4
- **Database/Session**: Vercel KV (production) & JSON Store (local development)
- **Runner**: Node.js & tsx runner

## Directory Structure
```
├── .agent/                  # Local Backstage AI Assistant
│   ├── agent.ts             # Entrypoint CLI runner
│   └── skills/              # Installed skills
│       ├── md-to-json/      # Markdown compiler
│       ├── impeccable/      # Stub (future quality review)
│       └── front-end-design/# Stub (future design audit)
├── content/                 # (Optional) Source content directories
├── docs/                    # System & architecture documentation
├── public/                  # Static assets
│   └── icons/               # Pedro Pascal image files (webp/png)
├── src/
│   ├── app/                 # Next.js Route handlers
│   │   ├── lesson/[id]/     # Dynamic lesson pages
│   │   ├── login/           # Authentication view
│   │   └── page.tsx         # Dashboard / Calendar grid
│   ├── components/          # Reusable react widgets
│   ├── data/                # Generated lessons databases
│   ├── lib/                 # Core server libraries (auth, KV clients)
│   └── types/               # TypeScript models & schemas
├── lessons.md               # Englobing lesson file (Markdown)
└── package.json             # Workspace manifest & dependencies
```

## Data and Compilation Flow
```
[ lessons.md (markdown) ]
           │
           ▼ (npm run agent)
┌────────────────────────┐
│     .agent runner      │
│  (md-to-json compiler)  │
└────────────────────────┘
           │
           ▼
[ src/data/lessons.json ]
           │
           ▼ (Next.js server-side read)
┌────────────────────────┐
│   Dashboard & Page     │
│  (Server Component)    │
└────────────────────────┘
```

## Authentication & Authorization Pipeline
1. **Cookie Session**: The client presents an `auth_token` cookie (an opaque UUID token).
2. **Middleware Interceptor**: The middleware (`middleware.ts`) resolves this token asynchronously against Vercel KV (production) or the local JSON store (development).
3. **Downstream Injection**: Upon resolving the user role (`user` or `admin`), the middleware injects the role into the request headers (`x-user-role`) before letting the page handler run.
4. **gating**: The page handler reads the header and applies corresponding gates (e.g. blocking Day X if Day X-1 is incomplete for role `user`).
