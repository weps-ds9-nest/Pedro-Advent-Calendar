'use client'

import type { Lesson } from '@/types/lesson'
import PedroIcon from '@/components/PedroIcon'

interface Props {
  lessons: Lesson[]
  completedDays: number[]
  role: string
  errorDay?: number | null
  onLessonClick?: (id: number) => void
}

function LockIcon() {
  return (
    <svg
      className="w-5 h-5 text-slate-700"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="1" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeWidth="2" />
    </svg>
  )
}

function DoorCard({ lesson, isUnlocked, isCompleted, onClick }: {
  lesson: Lesson
  isUnlocked: boolean
  isCompleted: boolean
  onClick?: () => void
}) {
  const cardContent = (
    <div
      className="advent-door-inner relative flex flex-col items-center justify-center p-4 h-28 select-none"
      style={{
        // Flat tonal layering — no gradients, no box-shadows per DESIGN.md "Flat Layering Rule"
        background: isCompleted
          ? 'rgba(39,174,96,0.12)'
          : isUnlocked
          ? 'rgba(245,200,66,0.08)'
          : '#111527',
        border: isCompleted
          ? '2px solid rgba(39,174,96,0.55)'
          : isUnlocked
          ? '2px solid rgba(245,200,66,0.5)'
          : '2px solid rgba(255,255,255,0.06)',
        borderRadius: '4px',
        opacity: !isUnlocked ? 0.5 : 1,
      }}
    >
      {/* Week label — short monospace label per DESIGN.md Typography rules */}
      <span
        className="text-[9px] font-bold uppercase tracking-wider mb-1"
        style={{
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          color: isCompleted ? '#2ecc71' : isUnlocked ? '#f5c842' : '#3a4060',
        }}
      >
        W{String(lesson.day).padStart(2, '0')}
      </span>

      {/* Icon area — flat square container per retro spec */}
      <div
        className="relative flex items-center justify-center w-10 h-10 my-1"
        style={{
          background: isCompleted
            ? 'rgba(39,174,96,0.15)'
            : isUnlocked
            ? 'rgba(245,200,66,0.12)'
            : 'rgba(255,255,255,0.03)',
          borderRadius: '2px',
        }}
      >
        {isUnlocked ? (
          <>
            <PedroIcon
              day={lesson.day}
              customIcon={lesson.icon}
              className="w-9 h-9 object-cover"
              style={{ borderRadius: '2px' }}
            />
            {isCompleted && (
              <span
                className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 text-white border border-[#111527]"
                style={{ background: '#27ae60', borderRadius: '2px' }}
                aria-hidden="true"
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

      {/* Title — sans-serif body per Typography rules, visible on unlocked only */}
      {isUnlocked && lesson.title && (
        <p
          className="text-[10px] text-center leading-tight mt-1 line-clamp-2"
          style={{ color: isCompleted ? 'rgba(46,204,113,0.8)' : 'rgba(245,200,66,0.75)' }}
        >
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
    <button
      type="button"
      onClick={onClick}
      className="advent-door block w-full text-left bg-transparent border-0 p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c842] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d1a]"
      aria-label={`Week ${lesson.day}${lesson.title ? ` — ${lesson.title}` : ''}${isCompleted ? ' (completed)' : ''}`}
    >
      {cardContent}
    </button>
  )
}

export default function CalendarGrid({ lessons, completedDays, role, errorDay, onLessonClick }: Props) {
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
      {errorDay && (
        <div
          role="alert"
          className="mb-6 px-4 py-3 text-sm flex items-center gap-2"
          style={{
            background: 'rgba(192,57,43,0.12)',
            border: '2px solid rgba(192,57,43,0.4)',
            borderRadius: '4px',
            color: '#e74c3c',
          }}
        >
          <span aria-hidden="true">🔒</span>
          <span>
            Complete <strong>Week {errorDay - 1}</strong> before accessing Week {errorDay}.
          </span>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {days.map((lesson) => {
          const isCompleted = completedDays.includes(lesson.day)
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
              onClick={onLessonClick ? () => onLessonClick(lesson.id) : undefined}
            />
          )
        })}
      </div>

      {/* Legend — square swatches, monospace labels per retro spec */}
      <div className="flex items-center gap-6 mt-6 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3"
            style={{ background: 'rgba(245,200,66,0.5)', border: '2px solid #f5c842', borderRadius: '2px' }}
            aria-hidden="true"
          />
          Unlocked
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3"
            style={{ background: 'rgba(39,174,96,0.4)', border: '2px solid #2ecc71', borderRadius: '2px' }}
            aria-hidden="true"
          />
          Completed
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.06)', borderRadius: '2px' }}
            aria-hidden="true"
          />
          Locked
        </span>
      </div>
    </div>
  )
}
