'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CalendarGrid from './CalendarGrid'
import LessonModal from './LessonModal'
import type { Lesson } from '@/types/lesson'
import { markCompleteNoRedirect } from '@/app/actions'

interface Props {
  lessons: Lesson[]
  completedDays: number[]
  role: string
  errorDay: number | null
}

export default function Dashboard({ lessons, completedDays, role, errorDay }: Props) {
  const [openLessonId, setOpenLessonId] = useState<number | null>(null)
  const router = useRouter()

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
      <CalendarGrid
        lessons={lessons}
        completedDays={completedDays}
        role={role}
        errorDay={errorDay}
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
    </>
  )
}
