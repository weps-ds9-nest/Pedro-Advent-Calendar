import { kv } from '@vercel/kv'

const TOTAL_LESSONS = 24

/**
 * Returns the list of completed lesson IDs for a given role.
 * Admin bypasses KV and is always considered to have completed everything.
 */
export async function getProgress(role: string): Promise<number[]> {
  if (role === 'admin') {
    // Admin sees all lessons as accessible
    return Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1)
  }
  const progress = await kv.get<number[]>(`progress:${role}`)
  return progress ?? []
}

/**
 * Marks a lesson as complete for a given role.
 * Admin progress is not tracked.
 */
export async function markComplete(role: string, id: number): Promise<void> {
  if (role === 'admin') return

  const key = `progress:${role}`
  const current = await kv.get<number[]>(key) ?? []

  if (!current.includes(id)) {
    await kv.set(key, [...current, id])
  }
}
