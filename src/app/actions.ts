'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSession } from '@/lib/session'
import { markComplete } from '@/lib/kv'

// ── Login ──────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const password = formData.get('password') as string

  const userPassword = process.env.USER_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD

  let role: 'user' | 'admin' | null = null

  if (userPassword && password === userPassword) {
    role = 'user'
  } else if (adminPassword && password === adminPassword) {
    role = 'admin'
  }

  if (!role) {
    return { error: 'Incorrect password. Please try again.' }
  }

  // Generate an opaque random token — the raw password never goes near the cookie.
  const token = await createSession(role)

  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  redirect('/')
}

// ── Mark lesson complete ───────────────────────────────────────────────────

/**
 * Marks a lesson as complete.
 * Role is always derived server-side — never trusted from the client.
 */
export async function markCompleteAction(id: number) {
  // Resolve role from the middleware-injected header (set from the opaque cookie token)
  const headerStore = await headers()
  const role = headerStore.get('x-user-role') ?? 'user'
  const actualRole = headerStore.get('x-actual-role')

  const targetRole = (actualRole === 'admin' && role === 'user') ? 'simulated' : role
  await markComplete(targetRole, id)

  const nextId = id + 1
  redirect(nextId <= 24 ? `/lesson/${nextId}` : '/')
}

/**
 * Marks a lesson as complete without redirecting (for modal UI).
 */
export async function markCompleteNoRedirect(id: number) {
  const headerStore = await headers()
  const role = headerStore.get('x-user-role') ?? 'user'
  const actualRole = headerStore.get('x-actual-role')

  const targetRole = (actualRole === 'admin' && role === 'user') ? 'simulated' : role
  await markComplete(targetRole, id)
}
