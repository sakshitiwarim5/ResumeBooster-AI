export default function LoadingSpinner({ size = 40, className = '' }) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 50 50"
        width={size}
        height={size}
        className="animate-spin"
        style={{ animationDuration: '0.8s' }}
      >
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          cx="25" cy="25" r="20"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 120"
          strokeDashoffset="0"
        />
      </svg>
    </div>
  )
}
