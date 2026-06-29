'use client'

import type { Lesson } from '@/types/lesson'
import PedroIcon from '@/components/PedroIcon'

interface Props {
  lessons: Lesson[]
  completedDays: number[]
  role: string
  errorDay?: number | null
  viewAsStudent?: boolean
  onLessonClick?: (id: number) => void
}

function LockIcon() {
  return (
    <svg
      className="w-2.5 h-2.5 text-slate-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="1" strokeWidth="2.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeWidth="2.5" />
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
          ? 'color-mix(in srgb, var(--theme-success) 12%, transparent)'
          : isUnlocked
          ? 'color-mix(in srgb, var(--theme-primary) 8%, transparent)'
          : 'var(--theme-surface)',
        border: isCompleted
          ? '2px solid color-mix(in srgb, var(--theme-success) 55%, transparent)'
          : isUnlocked
          ? '2px solid color-mix(in srgb, var(--theme-primary) 50%, transparent)'
          : '2px solid rgba(255,255,255,0.06)',
        borderRadius: '4px',
        opacity: !isUnlocked ? 0.65 : 1,
      }}
    >
      {/* Week label — short monospace label per DESIGN.md Typography rules */}
      <span
        className="text-[9px] font-bold uppercase tracking-wider mb-1"
        style={{
          fontFamily: "'Press Start 2P', 'Courier New', monospace",
          color: isCompleted
            ? 'var(--theme-success-bright)'
            : isUnlocked
            ? 'var(--theme-primary)'
            : 'var(--theme-border)',
        }}
      >
        W{String(lesson.day).padStart(2, '0')}
      </span>

      {/* Icon area — flat square container per retro spec */}
      <div
        className="relative flex items-center justify-center w-10 h-10 my-1"
        style={{
          background: isCompleted
            ? 'color-mix(in srgb, var(--theme-success) 15%, transparent)'
            : isUnlocked
            ? 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'
            : 'rgba(255,255,255,0.03)',
          borderRadius: '2px',
        }}
      >
        <PedroIcon
          day={lesson.day}
          customIcon={lesson.icon}
          className="w-9 h-9 object-cover"
          style={{ borderRadius: '2px' }}
        />
        {isCompleted && (
          <span
            className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 text-white"
            style={{
              background: 'var(--theme-success)',
              border: '1px solid var(--theme-surface)',
              borderRadius: '2px',
            }}
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
        {!isUnlocked && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4"
            style={{
              background: 'var(--theme-surface)',
              borderRadius: '2px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            aria-hidden="true"
          >
            <LockIcon />
          </span>
        )}
      </div>

      {/* Title — always visible, color reflects lock/complete state */}
      {lesson.title && (
        <p
          className="text-[10px] text-center leading-tight mt-1 line-clamp-2"
          style={{
            color: isCompleted
              ? 'color-mix(in srgb, var(--theme-success-bright) 80%, transparent)'
              : isUnlocked
              ? 'color-mix(in srgb, var(--theme-primary) 75%, transparent)'
              : 'rgba(255,255,255,0.25)',
          }}
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
      className="advent-door block w-full text-left bg-transparent border-0 p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]"
      aria-label={`Week ${lesson.day}${lesson.title ? ` — ${lesson.title}` : ''}${isCompleted ? ' (completed)' : ''}`}
    >
      {cardContent}
    </button>
  )
}

export default function CalendarGrid({ lessons, completedDays, role, errorDay, viewAsStudent, onLessonClick }: Props) {
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
            background: 'color-mix(in srgb, var(--theme-danger) 12%, transparent)',
            border: '2px solid color-mix(in srgb, var(--theme-danger) 40%, transparent)',
            borderRadius: '4px',
            color: 'var(--theme-danger-bright)',
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
            (role === 'admin' && !viewAsStudent) ||
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
            style={{
              background: 'color-mix(in srgb, var(--theme-primary) 50%, transparent)',
              border: '2px solid var(--theme-primary)',
              borderRadius: '2px',
            }}
            aria-hidden="true"
          />
          Unlocked
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3"
            style={{
              background: 'color-mix(in srgb, var(--theme-success) 40%, transparent)',
              border: '2px solid var(--theme-success-bright)',
              borderRadius: '2px',
            }}
            aria-hidden="true"
          />
          Completed
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '2px solid rgba(255,255,255,0.06)',
              borderRadius: '2px',
            }}
            aria-hidden="true"
          />
          Locked
        </span>
      </div>
    </div>
  )
}
