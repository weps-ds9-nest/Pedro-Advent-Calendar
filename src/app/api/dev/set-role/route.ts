import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { setProgress } from '@/lib/kv'

export async function POST(request: NextRequest) {
  // Security check: only allow if DEV_MODE=true or x-actual-role=admin
  const actualRole = request.headers.get('x-actual-role')
  const isDevMode = process.env.DEV_MODE === 'true'

  if (!isDevMode && actualRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { role, completedCount } = body

    if (!role || !['admin', 'student', 'user', 'student-real'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Set dev_role cookie
    cookieStore.set('dev_role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // If role is student/user and completedCount is provided, write simulated progress
    if ((role === 'student' || role === 'user') && typeof completedCount === 'number') {
      const clampedCount = Math.max(0, Math.min(24, completedCount))
      const simulatedIds = Array.from({ length: clampedCount }, (_, i) => i + 1)
      await setProgress('simulated', simulatedIds)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
