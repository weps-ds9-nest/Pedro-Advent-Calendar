'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ViewMode = 'admin' | 'student-real' | 'student-simulated'

interface Props {
  currentViewMode: string
  initialCompletedCount: number
}

function modeToViewMode(m: string): ViewMode {
  if (m === 'student-real') return 'student-real'
  if (m === 'student-simulated') return 'student-simulated'
  return 'admin'
}

export default function AdminToolbar({ currentViewMode, initialCompletedCount }: Props) {
  const [mode, setMode] = useState<ViewMode>(modeToViewMode(currentViewMode))
  const [completedCount, setCompletedCount] = useState<number>(initialCompletedCount)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleApply() {
    setSaving(true)
    try {
      const apiRole =
        mode === 'student-real'       ? 'student-real' :
        mode === 'student-simulated'  ? 'student'      :
        'admin'

      const res = await fetch('/api/dev/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: apiRole,
          completedCount: mode === 'student-simulated' ? completedCount : undefined,
        }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const btnClass = (active: boolean) =>
    `px-2.5 py-0.5 rounded-md font-medium transition-all ${
      active ? '' : 'toolbar-btn-inactive border border-transparent'
    }`

  const btnActiveStyle = {
    background: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)',
    color: 'var(--theme-primary)',
    border: '1px solid color-mix(in srgb, var(--theme-primary) 30%, transparent)',
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-10 bg-slate-950/85 backdrop-blur-md z-[9999] flex items-center justify-between px-4 text-xs select-none"
      style={{
        borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="font-bold tracking-widest uppercase text-[10px]"
          style={{ color: 'var(--theme-primary)' }}
        >
          🛠 Admin Toolbar
        </span>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => setMode('admin')}
            className={btnClass(mode === 'admin')}
            style={mode === 'admin' ? btnActiveStyle : undefined}
          >
            Admin View
          </button>
          <button
            onClick={() => setMode('student-real')}
            className={btnClass(mode === 'student-real')}
            style={mode === 'student-real' ? btnActiveStyle : undefined}
          >
            Pedro&apos;s View
          </button>
          <button
            onClick={() => setMode('student-simulated')}
            className={btnClass(mode === 'student-simulated')}
            style={mode === 'student-simulated' ? btnActiveStyle : undefined}
          >
            Simulate
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {mode === 'student-simulated' && (
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--theme-text-muted)' }}>Simulate completed:</span>
            <div className="flex items-center gap-1">
              <button
                disabled={completedCount <= 0}
                onClick={() => setCompletedCount((prev) => Math.max(0, prev - 1))}
                className="w-5 h-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: 'var(--theme-text-body)' }}
              >
                -
              </button>
              <span className="w-14 text-center font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                {completedCount} {completedCount === 1 ? 'wk' : 'wks'}
              </span>
              <button
                disabled={completedCount >= 24}
                onClick={() => setCompletedCount((prev) => Math.min(24, prev + 1))}
                className="w-5 h-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: 'var(--theme-text-body)' }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {mode === 'student-real' && (
          <span className="italic" style={{ color: 'var(--theme-text-faint)' }}>Showing Pedro&apos;s real progress</span>
        )}

        <button
          onClick={handleApply}
          disabled={saving}
          className="px-3 py-1 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
          style={{
            background: 'var(--theme-primary)',
            color: 'var(--theme-canvas)',
          }}
        >
          {saving ? 'Applying...' : 'Apply'}
        </button>
      </div>
    </div>
  )
}
