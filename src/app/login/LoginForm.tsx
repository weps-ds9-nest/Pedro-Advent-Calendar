'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/actions'

const SNOWFLAKES = ['❄', '❅', '❆', '✦', '✧']

function Snow() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="snowflake text-xs"
          style={{
            left: `${(i * 7 + 3) % 100}%`,
            animationDuration: `${8 + (i * 1.3) % 7}s`,
            animationDelay: `${(i * 0.9) % 5}s`,
            fontSize: `${10 + (i * 3) % 12}px`,
            opacity: 0.5 + (i % 3) * 0.15,
          }}
        >
          {SNOWFLAKES[i % SNOWFLAKES.length]}
        </span>
      ))}
    </div>
  )
}

interface LoginFormProps {
  devMode: boolean
}

export default function LoginForm({ devMode }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (devMode) {
      router.replace('/')
    } else {
      inputRef.current?.focus()
    }
  }, [devMode, router])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060914]">
      <Snow />

      {/* Glow orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f5c842, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #27ae60, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">

        {/* ── DEV MODE banner ────────────────────────────────────────────── */}
        {devMode && (
          <div
            role="status"
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
            style={{
              background: 'rgba(245,200,66,0.12)',
              border: '1px solid rgba(245,200,66,0.45)',
              color: '#f5c842',
            }}
          >
            <span>🚧</span>
            <span>
              <strong>Dev Mode active</strong> — authentication is bypassed.
              The form below does nothing; you will be redirected automatically.
            </span>
          </div>
        )}
        {/* ── End DEV MODE banner ─────────────────────────────────────────── */}

        {/* Card */}
        <div
          className="rounded-2xl border p-8 shadow-2xl"
          style={{
            background: 'rgba(17, 21, 39, 0.85)',
            backdropFilter: 'blur(20px)',
            borderColor: devMode ? 'rgba(245,200,66,0.45)' : 'rgba(245, 200, 66, 0.25)',
            boxShadow: '0 0 60px rgba(245, 200, 66, 0.08), 0 25px 50px rgba(0,0,0,0.6)',
          }}
        >
          {/* Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(245,200,66,0.2), rgba(245,200,66,0.05))',
                border: '1px solid rgba(245,200,66,0.3)',
              }}
            >
              <span className="text-3xl">🎄</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Advent Calendar
            </h1>
            <p className="text-sm text-slate-400 mt-1">Enter your access password</p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest">
                Password
              </label>
              <input
                ref={inputRef}
                id="password"
                name="password"
                type="password"
                required={!devMode}
                disabled={devMode}
                autoComplete="current-password"
                placeholder={devMode ? 'Auth bypassed in dev mode' : '••••••••'}
                className="w-full rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  // @ts-expect-error: CSS custom property
                  '--tw-ring-color': 'rgba(245,200,66,0.5)',
                }}
              />
            </div>

            {/* Error */}
            {state?.error && (
              <p
                id="login-error"
                role="alert"
                className="text-sm text-red-400 flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)' }}
              >
                <span>⚠️</span> {state.error}
              </p>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={isPending || devMode}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isPending || devMode
                  ? 'rgba(245,200,66,0.4)'
                  : 'linear-gradient(135deg, #f5c842, #e0b020)',
                color: '#060914',
              }}
            >
              {isPending ? 'Verifying…' : devMode ? 'Dev Mode — bypassed' : 'Enter the Calendar →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          🔒 Internal use only
        </p>
      </div>
    </main>
  )
}
