import { useEffect, useRef, useState } from 'react'

/**
 * Animated horizontal score bar with label and colour-coded value.
 */
export default function ScoreBar({ label, score, maxScore = 100, delay = 0 }) {
  const [width, setWidth]   = useState(0)
  const timerRef            = useRef(null)

  const pct   = Math.round((score / maxScore) * 100)
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'

  useEffect(() => {
    timerRef.current = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(timerRef.current)
  }, [pct, delay])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span
          className="text-sm font-display font-700"
          style={{ color }}
        >
          {score}<span className="text-xs opacity-60">/{maxScore}</span>
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 6px ${color}50`,
          }}
        />
      </div>
    </div>
  )
}
