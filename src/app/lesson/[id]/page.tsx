import { headers, cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getProgress } from '@/lib/kv'
import { markCompleteAction } from '@/app/actions'
import lessonsData from '@/data/lessons.json'
import type { Lesson } from '@/types/lesson'
import Link from 'next/link'
import PedroIcon from '@/components/PedroIcon'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LessonPage({ params }: PageProps) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)

  if (isNaN(id) || id < 1 || id > 24) {
    notFound()
  }

  // ── Role from middleware ────────────────────────────────────────────
  const headerStore = await headers()
  const role = headerStore.get('x-user-role') ?? 'user'

  // Double-check auth cookie
  const cookieStore = await cookies()
  if (!cookieStore.get('auth_token')) {
    redirect('/login')
  }

  // ── Sequential gating (users only) ─────────────────────────────────
  if (role !== 'admin') {
    const completedIds = await getProgress(role)
    if (id > 1 && !completedIds.includes(id - 1)) {
      redirect(`/?error=locked-${id}`)
    }
  }

  // ── Find lesson ─────────────────────────────────────────────────────
  const lessons = lessonsData as Lesson[]
  const lesson = lessons.find((l) => l.id === id)

  if (!lesson) {
    // Lesson slot exists (day 1-24) but no content yet
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚧</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-3">Coming Soon</h1>
          <p className="text-slate-400 mb-6">Week {id} content hasn&apos;t been published yet. Check back soon!</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'rgba(245,200,66,0.15)', color: '#f5c842', border: '1px solid rgba(245,200,66,0.3)' }}>
            ← Back to Calendar
          </Link>
        </div>
      </main>
    )
  }

  // ── Render lesson ────────────────────────────────────────────────────
  const markCompleteWithId = markCompleteAction.bind(null, id)

  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto relative z-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-8"
      >
        ← Back to Calendar
      </Link>

      {/* Day badge & Pedro Icon */}
      <div className="flex items-center gap-4 mb-6">
        <PedroIcon
          day={lesson.day}
          customIcon={lesson.icon}
          className="w-12 h-12 rounded-full object-cover border border-[rgba(245,200,66,0.3)] shadow-lg shadow-gold-400/10"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: 'rgba(245,200,66,0.12)',
                border: '1px solid rgba(245,200,66,0.35)',
                color: '#f5c842',
              }}
            >
              🎄 Week {lesson.day}
            </span>
            {role === 'admin' && (
              <span
                className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(192,57,43,0.12)',
                  border: '1px solid rgba(192,57,43,0.35)',
                  color: '#e74c3c',
                }}
              >
                🔑 Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4 leading-tight">
        {lesson.title}
      </h1>

      {/* Description */}
      {lesson.description && (
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          {lesson.description}
        </p>
      )}

      {/* Divider */}
      <div className="w-16 h-0.5 mb-8 rounded-full" style={{ background: 'linear-gradient(90deg, #f5c842, transparent)' }} />

      {/* Content */}
      {lesson.content ? (
        <div
          className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      ) : (
        <p className="text-slate-400 italic">Lesson content coming soon…</p>
      )}

      {/* Tip box */}
      {lesson.tip && (
        <div
          className="mt-8 p-4 rounded-xl"
          style={{
            background: 'rgba(245,200,66,0.07)',
            border: '1px solid rgba(245,200,66,0.2)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-1">💡 Pro Tip</p>
          <p className="text-sm text-slate-300">{lesson.tip}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        {/* Mark complete (users only) */}
        {role !== 'admin' && (
          <form action={markCompleteWithId}>
            <button
              id={`mark-complete-week-${id}`}
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(39,174,96,0.35)',
              }}
            >
              ✅ Mark Complete & Continue →
            </button>
          </form>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {id > 1 && (
            <Link
              href={`/lesson/${id - 1}`}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
              }}
            >
              ← Week {id - 1}
            </Link>
          )}
          {id < 24 && role === 'admin' && (
            <Link
              href={`/lesson/${id + 1}`}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: 'rgba(245,200,66,0.08)',
                border: '1px solid rgba(245,200,66,0.25)',
                color: '#f5c842',
              }}
            >
              Week {id + 1} →
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
