/**
 * Thin animated progress bar.
 * @param {number}  value     – 0–100
 * @param {string}  color     – CSS color (default: brand)
 * @param {string}  label     – optional accessible label
 * @param {boolean} showText  – show percentage text beside bar
 */
export default function ProgressBar({
  value = 0,
  color = 'var(--brand)',
  label = 'Progress',
  showText = false,
  className = '',
}) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={clamped} aria-label={label}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
          <span className="text-xs font-semibold font-mono-jet" style={{ color }}>{clamped}%</span>
        </div>
      )}
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            background: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}
