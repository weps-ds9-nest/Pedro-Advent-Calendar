'use client'

import Link from 'next/link'
import type { Lesson } from '@/types/lesson'
import PedroIcon from '@/components/PedroIcon'

interface Props {
  lessons: Lesson[]
  completedDays: number[]
  role: string
  errorDay?: number | null
}

function LockIcon() {
  return (
    <svg
      className="lock-pulse w-6 h-6 text-slate-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  )
}

function DoorCard({ lesson, isUnlocked, isCompleted }: {
  lesson: Lesson
  isUnlocked: boolean
  isCompleted: boolean
}) {
  const cardContent = (
    <div
      className="advent-door-inner relative flex flex-col items-center justify-center rounded-2xl p-4 h-28 cursor-pointer select-none"
      style={{
        background: isCompleted
          ? 'linear-gradient(135deg, rgba(39,174,96,0.25), rgba(39,174,96,0.08))'
          : isUnlocked
          ? 'linear-gradient(135deg, rgba(245,200,66,0.18), rgba(245,200,66,0.04))'
          : 'rgba(17,21,39,0.7)',
        border: isCompleted
          ? '1px solid rgba(39,174,96,0.45)'
          : isUnlocked
          ? '1px solid rgba(245,200,66,0.4)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isCompleted
          ? '0 4px 24px rgba(39,174,96,0.12)'
          : isUnlocked
          ? '0 4px 24px rgba(245,200,66,0.1)'
          : 'none',
        opacity: !isUnlocked ? 0.55 : 1,
      }}
    >
      {/* Week number */}
      <span
        className="text-xs font-bold uppercase tracking-widest mb-1"
        style={{ color: isCompleted ? '#2ecc71' : isUnlocked ? '#f5c842' : '#475569' }}
      >
        Week {lesson.day}
      </span>

      {/* Status icon or number */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full my-1"
        style={{
          background: isCompleted
            ? 'rgba(39,174,96,0.2)'
            : isUnlocked
            ? 'rgba(245,200,66,0.15)'
            : 'rgba(255,255,255,0.04)',
        }}
      >
        {isUnlocked ? (
          <>
            <PedroIcon
              day={lesson.day}
              customIcon={lesson.icon}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isCompleted && (
              <span
                className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-white shadow-lg border border-[#111527]"
                style={{ background: '#2ecc71' }}
              >
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </>
        ) : (
          <LockIcon />
        )}
      </div>

      {/* Title (only if unlocked and has content) */}
      {isUnlocked && lesson.title && (
        <p className="text-[10px] text-center leading-tight mt-1 line-clamp-2"
          style={{ color: isCompleted ? 'rgba(46,204,113,0.8)' : 'rgba(245,200,66,0.8)' }}>
          {lesson.title}
        </p>
      )}
    </div>
  )

  if (!isUnlocked) {
    return (
      <div className="advent-door" aria-label={`Week ${lesson.day} — locked`}>
        {cardContent}
      </div>
    )
  }

  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className="advent-door block"
      aria-label={`Week ${lesson.day}${lesson.title ? ` — ${lesson.title}` : ''}${isCompleted ? ' (completed)' : ''}`}
    >
      {cardContent}
    </Link>
  )
}

export default function CalendarGrid({ lessons, completedDays, role, errorDay }: Props) {
  // Pad to 24 slots if fewer lessons exist
  const days = Array.from({ length: 24 }, (_, i) => {
    const dayNum = i + 1
    return lessons.find((l) => l.day === dayNum) ?? {
      id: dayNum,
      day: dayNum,
      title: '',
    }
  })

  return (
    <div className="w-full">
      {/* Error banner */}
      {errorDay && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          style={{
            background: 'rgba(192,57,43,0.15)',
            border: '1px solid rgba(192,57,43,0.35)',
            color: '#e74c3c',
          }}
        >
          <span>🔒</span>
          <span>
            You need to complete <strong>Week {errorDay - 1}</strong> before accessing Week {errorDay}.
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {days.map((lesson) => {
          const isCompleted = completedDays.includes(lesson.day)
          // Day 1 always unlocked; others unlock when previous is done
          const isUnlocked =
            role === 'admin' ||
            lesson.day === 1 ||
            completedDays.includes(lesson.day - 1)
          return (
            <DoorCard
              key={lesson.day}
              lesson={lesson}
              isUnlocked={isUnlocked}
              isCompleted={isCompleted}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#f5c842' }} />
          Unlocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#2ecc71' }} />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.1)' }} />
          Locked
        </span>
      </div>
    </div>
  )
}
