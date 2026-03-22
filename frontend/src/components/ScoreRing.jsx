import { useEffect, useRef, useState } from 'react'

const RADIUS = 52
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getColor(score) {
  if (score >= 75) return '#10b981'  // green
  if (score >= 50) return '#f59e0b'  // amber
  return '#ef4444'                    // red
}

export default function ScoreRing({ score = 0, size = 140, label = 'Score' }) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const duration = 1200
    const start    = performance.now()

    const tick = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * score))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const color  = getColor(score)
  const offset = CIRCUMFERENCE - (displayed / 100) * CIRCUMFERENCE
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="score-ring"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
            transition: 'stroke-dashoffset 0.05s linear',
          }}
        />
        {/* Number */}
        <text
          x={cx} y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontWeight="800"
          fontFamily="Syne, sans-serif"
          fill={color}
        >
          {displayed}
        </text>
        <text
          x={cx} y={cy + size * 0.16}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.08}
          fontWeight="500"
          fontFamily="DM Sans, sans-serif"
          fill="var(--text-muted)"
          letterSpacing="0.08em"
        >
          / 100
        </text>
      </svg>
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </span>
    </div>
  )
}
