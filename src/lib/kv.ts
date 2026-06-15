/**
 * Vercel KV wrapper with a DEV_MODE fallback.
 *
 * When DEV_MODE=true (set in .env.local), a local JSON file (.dev-kv-store.json)
 * is used instead of Vercel KV so you don't need KV_REST_API_URL / KV_REST_API_TOKEN locally.
 *
 * In production, ensure KV_REST_API_URL and KV_REST_API_TOKEN are set and
 * DEV_MODE is absent (or anything other than "true").
 */

const DEV_MODE = process.env.DEV_MODE === 'true'

const TOTAL_LESSONS = 24

// ── Dev-mode local file store ────────────────────────────────────────────────
// Dynamically import fs/path on server side Node runtime to avoid Edge Runtime bundling errors.
let fs: any = null
let path: any = null
if (typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
  try {
    fs = require('fs')
    path = require('path')
  } catch (e) {
    // Ignore
  }
}

function loadDevStore(): Record<string, any> {
  if (!fs || !path) return {}
  try {
    const filePath = path.join(process.cwd(), '.dev-kv-store.json')
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
  } catch (e) {
    // Ignore
  }
  return {}
}

function saveDevStore(store: Record<string, any>): void {
  if (!fs || !path) return
  try {
    const filePath = path.join(process.cwd(), '.dev-kv-store.json')
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8')
  } catch (e) {
    // Ignore
  }
}

async function memGet(key: string): Promise<any> {
  const store = loadDevStore()
  return store[key] ?? null
}

async function memSet(key: string, value: any): Promise<void> {
  const store = loadDevStore()
  store[key] = value
  saveDevStore(store)
}

async function memDelete(key: string): Promise<void> {
  const store = loadDevStore()
  delete store[key]
  saveDevStore(store)
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

/**
 * Resets the progress for a given role.
 */
export async function resetProgress(role: string): Promise<void> {
  if (role === 'admin') return

  const key = `progress:${role}`

  if (DEV_MODE) {
    await memDelete(key)
    return
  }

  const kv = await getKvClient()
  await kv.del(key)
}

/**
 * Resolves a session token to a role.
 */
export async function getSession(token: string): Promise<string | null> {
  const key = `session:${token}`

  if (DEV_MODE) {
    return (await memGet(key)) ?? null
  }

  const kv = await getKvClient()
  return (await kv.get<string>(key)) ?? null
}

/**
 * Sets a session token to a role.
 */
export async function setSession(token: string, role: string): Promise<void> {
  const key = `session:${token}`

  if (DEV_MODE) {
    await memSet(key, role)
    return
  }

  const kv = await getKvClient()
  // Store session in Vercel KV with 30 days expiration (in seconds)
  await kv.set(key, role, { ex: 60 * 60 * 24 * 30 })
}

/**
 * Deletes a session token (logout/invalidation).
 */
export async function deleteSession(token: string): Promise<void> {
  const key = `session:${token}`

  if (DEV_MODE) {
    await memDelete(key)
    return
  }

  const kv = await getKvClient()
  await kv.del(key)
}

