'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CalendarGrid from './CalendarGrid'
import LessonModal from './LessonModal'
import CourseCompletionModal from './CourseCompletionModal'
import type { Lesson } from '@/types/lesson'
import { markCompleteNoRedirect } from '@/app/actions'

const TOTAL_LESSONS = 24

interface Props {
  lessons: Lesson[]
  completedDays: number[]
  role: string
  errorDay: number | null
  viewAsStudent?: boolean
}

export default function Dashboard({ lessons, completedDays, role, errorDay, viewAsStudent }: Props) {
  const [openLessonId, setOpenLessonId] = useState<number | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const router = useRouter()

  const courseComplete = completedDays.length >= TOTAL_LESSONS

  // Auto-show the blessing modal once on entry when the course is fully complete
  useEffect(() => {
    if (courseComplete) {
      setShowCompletionModal(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLessonClick = (id: number) => {
    setOpenLessonId(id)
  }

  const handleClose = () => {
    setOpenLessonId(null)
  }

  const handleNavigate = (id: number) => {
    setOpenLessonId(id)
  }

  const handleMarkComplete = async (id: number) => {
    await markCompleteNoRedirect(id)
    router.refresh()
  }

  return (
    <>
      {/* Progress bar / Course completion CTA */}
      {courseComplete ? (
        <div className="text-center mb-8 max-w-sm mx-auto space-y-3">
          <p
            className="text-display text-display-xs uppercase tracking-widest"
            style={{ color: 'var(--theme-success-bright)' }}
          >
            ✅ Course completed
          </p>
          <button
            onClick={() => setShowCompletionModal(true)}
            className="text-display text-display-sm w-full px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--theme-primary-dim), var(--theme-primary))',
              color: 'var(--theme-canvas)',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--theme-primary-dim) 30%, transparent)',
            }}
          >
            ✨ Review your blessing
          </button>
        </div>
      ) : role !== 'admin' ? (
        <div className="mb-8 max-w-sm mx-auto">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span>{completedDays.length} / {TOTAL_LESSONS} weeks</span>
          </div>
          <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${(completedDays.length / TOTAL_LESSONS) * 100}%`,
                background: 'linear-gradient(90deg, var(--theme-primary-dim), var(--theme-primary), var(--theme-success-bright))',
              }}
            />
          </div>
        </div>
      ) : null}

      <CalendarGrid
        lessons={lessons}
        completedDays={completedDays}
        role={role}
        errorDay={errorDay}
        viewAsStudent={viewAsStudent}
        onLessonClick={handleLessonClick}
      />

      <LessonModal
        lessonId={openLessonId}
        role={role}
        completedDays={completedDays}
        onClose={handleClose}
        onNavigate={handleNavigate}
        onMarkComplete={handleMarkComplete}
      />

      <CourseCompletionModal
        open={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />
    </>
  )
}
