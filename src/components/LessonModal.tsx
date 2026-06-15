'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import PedroIcon from '@/components/PedroIcon'
import type { Lesson } from '@/types/lesson'

interface Props {
  lessonId: number | null
  role: string
  completedDays: number[]
  totalLessons?: number
  onClose: () => void
  onNavigate: (id: number) => void
  onMarkComplete: (id: number) => Promise<void>
}

export default function LessonModal({
  lessonId,
  role,
  completedDays,
  totalLessons = 24,
  onClose,
  onNavigate,
  onMarkComplete,
}: Props) {
  const [lesson, setLesson] = useState<(Lesson & { published: boolean }) | null>(null)
  const [loading, setLoading] = useState(false)
  const [marking, setMarking] = useState(false)
  const [localCompleted, setLocalCompleted] = useState<number[]>(completedDays)
  const contentRef = useRef<HTMLDivElement>(null)

  // Sync prop changes (e.g. after router.refresh)
  useEffect(() => {
    setLocalCompleted(completedDays)
  }, [completedDays])

  // Fetch lesson data whenever the open lesson changes
  useEffect(() => {
    if (!lessonId) return
    setLoading(true)
    setLesson(null)
    fetch(`/api/lesson/${lessonId}`)
      .then((r) => r.json())
      .then((data) => {
        setLesson(data)
        setLoading(false)
        // Scroll content back to top on navigation
        contentRef.current?.scrollTo({ top: 0 })
      })
      .catch(() => setLoading(false))
  }, [lessonId])

  const isCompleted = lessonId ? localCompleted.includes(lessonId) : false
  const canGoNext =
    lessonId !== null &&
    lessonId < totalLessons &&
    (role === 'admin' || localCompleted.includes(lessonId))
  const canGoPrev = lessonId !== null && lessonId > 1
  // Next lesson is locked for students until current is complete
  const nextLocked = !canGoNext && lessonId !== null && lessonId < totalLessons

  async function handleMarkComplete() {
    if (!lessonId || marking) return
    setMarking(true)
    try {
      await onMarkComplete(lessonId)
      setLocalCompleted((prev) => [...new Set([...prev, lessonId])])
    } finally {
      setMarking(false)
    }
  }

  return (
    <Dialog open={!!lessonId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl w-full p-0 overflow-hidden flex flex-col gap-0"
        style={{
          background: 'rgba(10,13,26,0.97)',
          border: '1px solid rgba(245,200,66,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,200,66,0.08)',
          maxHeight: '88vh',
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <DialogHeader className="shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            {lesson && (
              <PedroIcon
                day={lesson.day}
                customIcon={lesson.icon}
                className="w-9 h-9 rounded-full border border-[rgba(245,200,66,0.3)]"
              />
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {lesson && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(245,200,66,0.12)',
                      border: '1px solid rgba(245,200,66,0.35)',
                      color: '#f5c842',
                    }}
                  >
                    🎄 Week {lesson.day}
                  </span>
                )}
                {role === 'admin' && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(192,57,43,0.12)',
                      border: '1px solid rgba(192,57,43,0.35)',
                      color: '#e74c3c',
                    }}
                  >
                    🔑 Admin
                  </span>
                )}
                {isCompleted && (
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(39,174,96,0.12)',
                      border: '1px solid rgba(39,174,96,0.35)',
                      color: '#2ecc71',
                    }}
                  >
                    ✅ Completed
                  </span>
                )}
              </div>
              <DialogTitle className="text-base font-bold text-slate-100 leading-snug truncate">
                {loading ? (
                  <span className="text-slate-500">Loading…</span>
                ) : (
                  lesson?.title || `Week ${lessonId}`
                )}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* ── Scrollable Body ─────────────────────────────────── */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          style={{ minHeight: 0 }}
        >
          {loading && (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 rounded-full border-2 border-[rgba(245,200,66,0.3)] border-t-[#f5c842] animate-spin" />
            </div>
          )}

          {!loading && lesson && !lesson.published && (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
              <span className="text-5xl">🚧</span>
              <p className="text-slate-400">Content for Week {lessonId} hasn&apos;t been published yet.</p>
            </div>
          )}

          {!loading && lesson && lesson.published && (
            <>
              {lesson.description && (
                <p className="text-slate-300 text-base leading-relaxed">{lesson.description}</p>
              )}

              <div className="w-12 h-px rounded-full" style={{ background: 'linear-gradient(90deg, #f5c842, transparent)' }} />

              {lesson.content ? (
                <div
                  className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed space-y-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              ) : (
                <p className="text-slate-500 italic text-sm">Lesson content coming soon…</p>
              )}

              {lesson.tip && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(245,200,66,0.07)', border: '1px solid rgba(245,200,66,0.2)' }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-1">💡 Pro Tip</p>
                  <p className="text-sm text-slate-300">{lesson.tip}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer Nav ──────────────────────────────────────── */}
        <DialogFooter
          className="shrink-0 px-6 py-4 flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(17,21,39,0.6)' }}
        >
          {/* Prev */}
          <button
            onClick={() => lessonId && canGoPrev && onNavigate(lessonId - 1)}
            disabled={!canGoPrev}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
          >
            ← Week {lessonId && lessonId > 1 ? lessonId - 1 : ''}
          </button>

          <div className="flex items-center gap-2">
            {/* Mark complete (students only, not already done) */}
            {role !== 'admin' && !isCompleted && (
              <button
                onClick={handleMarkComplete}
                disabled={marking}
                className="px-4 py-2 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(39,174,96,0.3)',
                }}
              >
                {marking ? '…' : '✅ Mark Complete'}
              </button>
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => lessonId && canGoNext && onNavigate(lessonId + 1)}
            disabled={!canGoNext}
            title={nextLocked ? 'Complete this lesson to unlock the next one' : undefined}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: canGoNext ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${canGoNext ? 'rgba(245,200,66,0.3)' : 'rgba(255,255,255,0.07)'}`,
              color: canGoNext ? '#f5c842' : '#475569',
            }}
          >
            Week {lessonId && lessonId < totalLessons ? lessonId + 1 : ''} {nextLocked ? '🔒' : '→'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
