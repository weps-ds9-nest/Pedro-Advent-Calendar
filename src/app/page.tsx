import { headers, cookies } from 'next/headers'
import CalendarGrid from '@/components/CalendarGrid'
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

  // Validate cookie is still present (double-check, middleware handles redirects)
  const cookieStore = await cookies()
  if (process.env.DEV_MODE !== 'true' && !cookieStore.get('auth_token')) {
    redirect('/login')
  }

  const completedIds = await getProgress(role)
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium uppercase tracking-widest"
          style={{
            background: role === 'admin'
              ? 'rgba(192,57,43,0.15)'
              : 'rgba(245,200,66,0.1)',
            border: `1px solid ${role === 'admin' ? 'rgba(192,57,43,0.35)' : 'rgba(245,200,66,0.3)'}`,
            color: role === 'admin' ? '#e74c3c' : '#f5c842',
          }}
        >
          {role === 'admin' ? '🔑 Admin View' : '🎓 Student'}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          <span className="gold-shimmer">Claude Code</span>
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-slate-200">
          Advent Calendar 🎄
        </p>
        <p className="text-slate-400 mt-3 text-sm">
          Complete each day sequentially to unlock the next lesson.
        </p>

        {/* Progress bar (user only) */}
        {role !== 'admin' && (
          <div className="mt-6 max-w-sm mx-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{completedIds.length} / 24 days</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${(completedIds.length / 24) * 100}%`,
                  background: 'linear-gradient(90deg, #e0b020, #f5c842, #2ecc71)',
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Calendar Grid */}
      <CalendarGrid
        lessons={lessons}
        completedDays={completedIds}
        role={role}
        errorDay={errorDayNum}
      />

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-600">
        <p>Internal use only · Claude Code Advent Calendar</p>
      </footer>
    </main>
  )
}
