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
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set())
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
    setCheckedTasks(new Set())
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
        className="max-w-4xl w-full p-0 overflow-hidden flex flex-col gap-0"
        style={{
          background: 'color-mix(in srgb, var(--theme-canvas) 97%, transparent)',
          border: '1px solid color-mix(in srgb, var(--theme-primary) 18%, transparent)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px color-mix(in srgb, var(--theme-primary) 8%, transparent)',
          maxHeight: '90vh',
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <DialogHeader className="shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            {lesson && (
              <PedroIcon
                day={lesson.day}
                customIcon={lesson.icon}
                className="w-9 h-9 rounded-full"
                style={{ border: '1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)' }}
              />
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {lesson && (
                  <span className="chip chip-primary">
                    🎄 Week {lesson.day}
                  </span>
                )}
                {role === 'admin' && (
                  <span className="chip chip-danger">
                    🔑 Admin
                  </span>
                )}
                {isCompleted && (
                  <span className="chip chip-success">
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
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{
                  borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                  borderTopColor: 'var(--theme-primary)',
                }}
              />
            </div>
          )}

          {!loading && lesson && (
            <>
              {lesson.description && (
                <p className="text-slate-300 text-base leading-relaxed">{lesson.description}</p>
              )}

              <div
                className="w-12 h-px rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--theme-primary), transparent)' }}
              />

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
                  style={{
                    background: 'color-mix(in srgb, var(--theme-primary) 7%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)',
                  }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-1">💡 Pro Tip</p>
                  <p className="text-sm text-slate-300">{lesson.tip}</p>
                </div>
              )}

              {lesson.tasks && lesson.tasks.length > 0 && (
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-success) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--theme-success) 20%, transparent)',
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: 'var(--theme-success-bright)' }}
                  >
                    ✅ Your Tasks
                  </p>
                  <ul className="space-y-2">
                    {lesson.tasks.map((task, i) => {
                      const done = checkedTasks.has(i)
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <button
                            onClick={() =>
                              setCheckedTasks((prev) => {
                                const next = new Set(prev)
                                done ? next.delete(i) : next.add(i)
                                return next
                              })
                            }
                            className="mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150"
                            style={{
                              background: done ? 'var(--theme-success)' : 'transparent',
                              borderColor: done
                                ? 'var(--theme-success)'
                                : 'color-mix(in srgb, var(--theme-success) 50%, transparent)',
                            }}
                            aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {done && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                          <span
                            className="text-sm leading-relaxed transition-all duration-150"
                            style={{ color: done ? '#475569' : '#cbd5e1', textDecoration: done ? 'line-through' : 'none' }}
                          >
                            {task}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  {checkedTasks.size === lesson.tasks.length && (
                    <p className="text-xs mt-3 font-bold" style={{ color: 'var(--theme-success-bright)' }}>
                      🎉 All tasks complete!
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer Nav ──────────────────────────────────────── */}
        <DialogFooter
          className="shrink-0 px-6 py-4 flex-row items-center justify-between gap-3"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
          }}
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
            {/* Mark complete — admin only */}
            {role === 'admin' && (
              isCompleted ? (
                <button
                  disabled
                  className="px-4 py-2 rounded-xl font-semibold text-sm tracking-wide"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-success) 15%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--theme-success) 35%, transparent)',
                    color: 'color-mix(in srgb, var(--theme-success-bright) 50%, transparent)',
                    cursor: 'not-allowed',
                  }}
                >
                  ✅ Completed
                </button>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  disabled={marking}
                  className="px-4 py-2 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, var(--theme-success-bright), var(--theme-success))',
                    color: '#fff',
                    boxShadow: '0 4px 16px color-mix(in srgb, var(--theme-success) 30%, transparent)',
                  }}
                >
                  {marking ? '…' : '✅ Mark Complete'}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => lessonId && canGoNext && onNavigate(lessonId + 1)}
            disabled={!canGoNext}
            title={nextLocked ? 'Complete this lesson to unlock the next one' : undefined}
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: canGoNext
                ? 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'
                : 'rgba(255,255,255,0.04)',
              border: `1px solid ${canGoNext
                ? 'color-mix(in srgb, var(--theme-primary) 30%, transparent)'
                : 'rgba(255,255,255,0.07)'}`,
              color: canGoNext ? 'var(--theme-primary)' : '#475569',
            }}
          >
            Week {lessonId && lessonId < totalLessons ? lessonId + 1 : ''} {nextLocked ? '🔒' : '→'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
