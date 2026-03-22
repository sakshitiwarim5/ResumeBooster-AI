import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function AnalysisCard({
  title,
  icon: Icon,
  iconColor = '#6366f1',
  children,
  defaultOpen = true,
  badge,
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-up opacity-0-init"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 gap-3 text-left transition-colors hover:opacity-80"
        style={{ borderBottom: open ? '1px solid var(--border)' : 'none' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${iconColor}18` }}
          >
            {Icon && <Icon size={16} style={{ color: iconColor }} />}
          </div>
          <span
            className="font-display text-[15px] font-700"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </span>
          {badge !== undefined && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${iconColor}15`,
                color: iconColor,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.25s ease',
          }}
        />
      </button>

      {/* Body */}
      <div
        style={{
          maxHeight: open ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
