import { getSession, setSession, deleteSession as deleteKvSession } from './kv'

export type Role = 'user' | 'admin'

/**
 * Creates a new session for the given role.
 * Returns the opaque token that should be stored in the auth cookie.
 */
export async function createSession(role: Role): Promise<string> {
  const token = crypto.randomUUID()
  await setSession(token, role)
  return token
}

/**
 * Resolves an opaque token back to a role.
 * Returns null if the token is unknown or expired.
 */
export async function resolveRole(token: string): Promise<Role | null> {
  const role = await getSession(token)
  return (role as Role) ?? null
}

/**
 * Invalidates a session token (logout).
 */
export async function deleteSession(token: string): Promise<void> {
  await deleteKvSession(token)
}

