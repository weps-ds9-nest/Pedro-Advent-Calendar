# Pedro Advent Calendar Guidelines & Rules

Welcome! This is the master guidelines document for the Pedro Advent Calendar project.

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (using `@import "tailwindcss"` and `@theme` block in `src/app/globals.css`)
- **Database/Persistence**: Vercel KV (with a local JSON fallback `.dev-kv-store.json` during development)
- **UI Components**: shadcn/ui (using `@base-ui/react` primitives)

## Key Project Rules (Strictly Enforced)
1. **Week Terminology**:
   - Always refer to lesson intervals as **"Weeks"** (e.g., Week 1, Week 2).
   - Never use "Day X" or "Days" in UI text, badges, or error messages.
2. **Progressive Unlocking**:
   - Students must complete lessons in sequential order (Week 1 unlocks Week 2, etc.).
   - Locked weeks display a lock icon and must not be clickable.
3. **Admin Controls & Simulation**:
   - Admin view unlocks all 24 slots automatically.
   - Admins can toggle between "Admin" and "Student" views using the sticky **Admin Toolbar**.
   - Admins can simulate student progress by setting simulated completed weeks. Simulated progress writes to a separate, non-conflicting progress scope (`progress:simulated`) to avoid corrupting production user data.
4. **No Direct Page Navigation for Lessons**:
   - Unlocked cards trigger a Client-Side overlay dialog/modal (`LessonModal`) using shadcn Dialog primitives.
   - Do not navigate to the full-page lesson route except for deep links/fallbacks.

## Workspace File Map
- `src/app/page.tsx`: Dashboard server page. Passes lessons/progress/role to Dashboard.
- `src/components/Dashboard.tsx`: client wrapper owning modal state, rendering the grid and modal.
- `src/components/CalendarGrid.tsx`: renders the 24 advent doors.
- `src/components/LessonModal.tsx`: overlay modal that asynchronously fetches lesson contents from the API.
- `src/app/api/lesson/[id]/route.ts`: JSON endpoint for fetching lesson contents.
- `src/app/api/dev/set-role/route.ts`: endpoint to set role override cookie and simulated completions.
- `src/components/AdminToolbar.tsx`: sticky administration control bar.
- `src/app/actions.ts`: server actions for authentication and lesson completions.
- `lessons.md`: central curriculum file. Edited to add/modify lessons.

## Build & Command Cheat Sheet
- **Start Dev Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Lint Code**: `npm run lint`
- **Run Agent (Compile Markdown to JSON)**: `npm run agent`
- **Sync Instructions**: `npm run agent:sync`
