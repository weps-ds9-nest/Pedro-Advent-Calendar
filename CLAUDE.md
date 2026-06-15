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

## Design Context

> Full spec lives in [`PRODUCT.md`](./PRODUCT.md) and [`DESIGN.md`](./DESIGN.md). Read those files before making UI changes.

- **Register**: `brand` — design IS the product; delight and visual identity are first-class concerns.
- **Personality**: Retro · Playful · Interactive (8-bit holiday aesthetic, pixelated icons, springy transitions).
- **Creative North Star**: "Pixelized Holiday Workshop"

### Color roles
| Token | Hex | Role |
|---|---|---|
| `--color-gold-500` | `#e0b020` | Primary action, progress, highlights |
| `--color-gold-400` | `#f5c842` | Hover/accent state, shimmer |
| `--color-navy-950` | `#060914` | Deep background canvas |
| `--color-navy-900` | `#0a0d1a` | Page backgrounds |
| `--color-navy-800` | `#111527` | Surface panels, card backgrounds |
| `--color-navy-700` | `#1a1f38` | Default borders, dividers |
| `--color-jade-500` | `#27ae60` | Completed state |
| `--color-crimson-500` | `#c0392b` | Admin / error state |

### Typography rules
- **Display / headings / badges**: `Press Start 2P, Courier New, monospace` — short labels only.
- **Body / lesson copy**: `Inter, ui-sans-serif, system-ui` — max line length 70ch.

### Hard rules (never break)
1. **No soft shadows or glassmorphism.** Depth via tonal layering and solid colour-tinted borders only.
2. **No gradient text** (`background-clip: text`). Gold shimmer on the hero logo is the only exception and it already exists.
3. **Monospace only for labels.** Never use `Press Start 2P` on multi-line reading content.
4. **Springy transitions must honour `prefers-reduced-motion`** — wrap all `cubic-bezier(0.34, 1.56, 0.64, 1)` eases in a `@media (prefers-reduced-motion: reduce)` override.
5. **Impeccable live mode** is pre-configured — run `/impeccable live` to iterate UI directly in the browser.
