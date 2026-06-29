'use client'

import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const CONFETTI_COLORS = ['#f5c842', '#27ae60', '#c0392b', '#ffffff', '#3498db', '#e0b020', '#2ecc71', '#e74c3c']

function Confetti() {
  const particles = useMemo(() => {
    return Array.from({ length: 38 }, (_, i) => {
      // Deterministic pseudo-random via sine to avoid hydration mismatches
      const r1 = Math.abs(Math.sin(i * 2.7183))
      const r2 = Math.abs(Math.sin(i * 1.4142 + 0.5))
      const r3 = Math.abs(Math.sin(i * 3.1415 + 1.2))
      const r4 = Math.abs(Math.sin(i * 0.9001 + 2.1))

      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
      const isRect = i % 3 !== 0
      const left = `${(r1 * 94 + 3).toFixed(1)}%`
      const fallDuration = `${(2.8 + r2 * 2.4).toFixed(2)}s`
      const swayDuration = `${(2.2 + r3 * 2.8).toFixed(2)}s`
      const fallDelay  = `${-(r4 * 4.5).toFixed(2)}s`
      const swayDelay  = `${-(r1 * 2.5).toFixed(2)}s`

      return {
        id: i,
        style: {
          position: 'fixed' as const,
          top: '-20px',
          left,
          width: isRect ? '6px' : '8px',
          height: isRect ? '12px' : '8px',
          background: color,
          borderRadius: isRect ? '1px' : '50%',
          pointerEvents: 'none' as const,
          userSelect: 'none' as const,
          zIndex: 200,
          animation: `confetti-fall ${fallDuration} ${fallDelay} linear infinite, confetti-sway ${swayDuration} ${swayDelay} ease-in-out infinite`,
        } as React.CSSProperties,
      }
    })
  }, [])

  return (
    <>
      {particles.map((p) => (
        <div key={p.id} className="confetti-particle" style={p.style} />
      ))}
    </>
  )
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function CourseCompletionModal({ open, onClose }: Props) {
  return (
    <>
      {open && <Confetti />}

      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          className="max-w-lg w-full p-0 overflow-hidden flex flex-col gap-0"
          style={{
            background: 'rgba(10,13,26,0.98)',
            border: '1px solid rgba(245,200,66,0.4)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(245,200,66,0.1), 0 0 80px rgba(245,200,66,0.06)',
            zIndex: 300,
          }}
        >
          {/* Header */}
          <DialogHeader
            className="shrink-0 px-8 pt-8 pb-6 text-center"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-5xl mb-5 select-none" aria-hidden>🏆</div>
            <DialogTitle
              className="gold-shimmer text-center"
              style={{
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
                fontSize: '0.85rem',
                lineHeight: '1.8',
              }}
            >
              San Pedro Bestows<br />Your Blessing
            </DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div
            className="px-8 py-7 space-y-5"
            style={{ fontFamily: 'Inter, ui-sans-serif, system-ui', maxWidth: '70ch' }}
          >
            <p className="text-slate-200 text-base leading-relaxed">
              You have walked the full path — all 24 weeks of the Claude Code curriculum. San Pedro, eternal guardian of the digital threshold, recognises your dedication and grants you his blessing.
            </p>

            <div
              className="w-14 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, #f5c842, transparent)' }}
            />

            <p className="text-slate-300 text-sm leading-relaxed">
              You may now walk the Claude Code way for research: your queries precise, your prompts clear, your context well-managed. The path ahead is open — use these tools with wisdom, patience, and curiosity.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Go forth, and may every token serve you well. 🎄
            </p>
          </div>

          {/* Footer */}
          <div
            className="shrink-0 px-8 py-5 flex justify-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(17,21,39,0.6)' }}
          >
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #e0b020, #f5c842)',
                color: '#060914',
                boxShadow: '0 4px 16px rgba(224,176,32,0.35)',
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
                fontSize: '9px',
                letterSpacing: '0.05em',
              }}
            >
              ✨ Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
