# Architectural Decision Records (ADR)

This log traces the core architectural decisions made in the Pedro Advent Calendar project.

## ADR 1: Persistent KV-backed Sessions

### Status
Accepted (June 2026)

### Context
Originally, the application stored opaque session tokens mapped to user roles in an in-memory `Map` inside the `src/lib/session.ts` process space. While functional for local testing, this caused users to be logged out on server restarts or Vercel serverless function recycles (cold starts).

### Decision
We moved session storage to Vercel KV (production) and a local JSON store file (`.dev-kv-store.json`) (development). The middleware (`middleware.ts`) and session library are updated to query this persistent KV store asynchronously.

### Consequences
- Sessions survive server restarts and cold starts.
- Active logins persist for up to 30 days.
- Dev experience preserves active logins across local code saves and restarts.

---

## ADR 2: Roadmap to Multi-User Support

### Status
Proposed & Logged (June 2026)

### Context
Currently, the app relies on a single-user role-based authentication model. Progression is saved under the key `progress:user`, meaning all individuals logging in with the student password share a single progression profile. 

### Decision
For the initial release, we maintain the single-user model as requested. However, we plan to transition to a multi-user architecture in a subsequent release.

### Migration Roadmap
1. **Database Schema Shift**:
   - Change progression keys in KV from `progress:user` to `progress:user:<userId>`.
2. **Credential System**:
   - Replace the static `.env` single-password setup with a user registration database or pre-generated account table in KV.
3. **Session Payload**:
   - Store both user ID and role in the session payload (`session:${token}` -> `{ userId, role }`).
4. **Middleware Adjustments**:
   - Retrieve `userId` along with `role` and inject both into downstream request headers (`x-user-id`, `x-user-role`).
