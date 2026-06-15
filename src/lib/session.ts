/**
 * Lightweight in-process session store.
 *
 * The auth cookie holds an opaque random token (UUID), never the raw password.
 * This module maps token → role so the middleware / server actions can resolve
 * who the caller is without exposing credentials to the browser.
 *
 * Acceptable for a small internal app with a single server process.
 * Tokens are lost on server restart (users must log in again), which is fine.
 */

type Role = 'user' | 'admin'

// Module-level singleton — survives across requests within the same process.
const sessions = new Map<string, Role>()

/**
 * Creates a new session for the given role.
 * Returns the opaque token that should be stored in the auth cookie.
 */
export function createSession(role: Role): string {
  const token = crypto.randomUUID()
  sessions.set(token, role)
  return token
}

/**
 * Resolves an opaque token back to a role.
 * Returns null if the token is unknown or expired (server restarted).
 */
export function resolveRole(token: string): Role | null {
  return sessions.get(token) ?? null
}

/**
 * Invalidates a session token (logout).
 */
export function deleteSession(token: string): void {
  sessions.delete(token)
}
