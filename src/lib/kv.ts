/**
 * Vercel KV wrapper with a DEV_MODE fallback.
 *
 * When DEV_MODE=true (set in .env.local), an in-memory Map is used instead
 * of Vercel KV so you don't need KV_REST_API_URL / KV_REST_API_TOKEN locally.
 *
 * In production, ensure KV_REST_API_URL and KV_REST_API_TOKEN are set and
 * DEV_MODE is absent (or anything other than "true").
 */

const DEV_MODE = process.env.DEV_MODE === 'true'

const TOTAL_LESSONS = 24

// ── Dev-mode in-memory store ─────────────────────────────────────────────────

const memStore = new Map<string, number[]>()

async function memGet(key: string): Promise<number[] | null> {
  return memStore.get(key) ?? null
}

async function memSet(key: string, value: number[]): Promise<void> {
  memStore.set(key, value)
}

// ── KV client (production only) ──────────────────────────────────────────────

// Dynamic import so the module doesn't crash at build-time in dev mode when
// KV env vars are absent.
async function getKvClient() {
  const { default: kv } = await import('@vercel/kv')
  return kv
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the list of completed lesson IDs for a given role.
 * Admin bypasses KV and is always considered to have completed everything.
 */
export async function getProgress(role: string): Promise<number[]> {
  if (role === 'admin') {
    return Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1)
  }

  const key = `progress:${role}`

  if (DEV_MODE) {
    return (await memGet(key)) ?? []
  }

  const kv = await getKvClient()
  return (await kv.get<number[]>(key)) ?? []
}

/**
 * Marks a lesson as complete for a given role.
 * Admin progress is not tracked.
 */
export async function markComplete(role: string, id: number): Promise<void> {
  if (role === 'admin') return

  const key = `progress:${role}`

  if (DEV_MODE) {
    const current = (await memGet(key)) ?? []
    if (!current.includes(id)) {
      await memSet(key, [...current, id])
    }
    return
  }

  const kv = await getKvClient()
  const current = (await kv.get<number[]>(key)) ?? []
  if (!current.includes(id)) {
    await kv.set(key, [...current, id])
  }
}
