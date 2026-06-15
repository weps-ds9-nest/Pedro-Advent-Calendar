'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { markComplete } from '@/lib/kv'

// ── Login ──────────────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const password = formData.get('password') as string

  const userPassword = process.env.USER_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD

  let matched = false

  if (userPassword && password === userPassword) {
    matched = true
  } else if (adminPassword && password === adminPassword) {
    matched = true
  }

  if (!matched) {
    return { error: 'Incorrect password. Please try again.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('auth_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  redirect('/')
}

// ── Mark lesson complete ───────────────────────────────────────────────────

export async function markCompleteAction(id: number, role: string) {
  await markComplete(role, id)

  const nextId = id + 1
  // Try to go to next lesson; if there isn't one, return to dashboard
  redirect(nextId <= 24 ? `/lesson/${nextId}` : '/')
}
