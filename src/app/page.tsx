import { headers, cookies } from 'next/headers'
import Dashboard from '@/components/Dashboard'
import { getProgress } from '@/lib/kv'
import lessonsData from '@/data/lessons.json'
import type { Lesson } from '@/types/lesson'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // Get role from middleware-injected header
  const headerStore = await headers()
  const role = headerStore.get('x-user-role') ?? 'user'
  const actualRole = headerStore.get('x-actual-role')
  const viewMode = headerStore.get('x-view-mode') ?? 'admin'

  // Validate cookie is still present (double-check, middleware handles redirects)
  const cookieStore = await cookies()
  if (process.env.DEV_MODE !== 'true' && !cookieStore.get('auth_token')) {
    redirect('/login')
  }

  // Determine target role for progress tracking
  const targetRole =
    actualRole === 'admin' && role === 'user' ? 'simulated' :
    viewMode === 'student-real'               ? 'user'      :
    role
  const completedIds = await getProgress(targetRole)
  const viewAsStudent = viewMode === 'student-real'
  const params = await searchParams

  // Parse error day from a richer error param like "locked-3"
  let errorDayNum: number | null = null
  if (params.error?.startsWith('locked-')) {
    errorDayNum = parseInt(params.error.replace('locked-', ''), 10)
  }

  const lessons = lessonsData as Lesson[]

  return (
    <main className="min-h-screen px-4 py-12 max-w-5xl mx-auto relative z-10">
      {/* Header */}
      <header className="text-center mb-12">
        <div className={`chip mb-6 ${role === 'admin' ? 'chip-danger' : 'chip-primary'}`}>
          {viewAsStudent ? '👁 Pedro\'s View' : role === 'admin' ? '🔑 Admin View' : '🎓 Student'}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          <span className="gold-shimmer">Claude Code</span>
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-slate-200">
          Advent Calendar 🎄
        </p>
        <p className="text-slate-400 mt-3 text-sm">
          Complete each week sequentially to unlock the next lesson.
        </p>

      </header>

      {/* Dashboard container with Grid + Modal */}
      <Dashboard
        lessons={lessons}
        completedDays={completedIds}
        role={role}
        errorDay={errorDayNum}
        viewAsStudent={viewAsStudent}
      />

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-600">
        <p>Internal use only · Claude Code Advent Calendar</p>
      </footer>
    </main>
  )
}
