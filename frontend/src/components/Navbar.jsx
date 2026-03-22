import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Zap } from 'lucide-react'
import { useTheme } from '../App'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16">
      <div
        className="h-full mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between"
        style={{
          background: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="ResumeBooster Logo" className="w-12 h-12 object-contain" />
          <span className="font-display text-[17px] font-700" style={{ color: 'var(--text-primary)' }}>
            Resume<span className="text-indigo-500 dark:text-indigo-400">Booster</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLanding && (
            <Link
              to="/upload"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap size={14} />
              Analyze Resume
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            {isDark
              ? <Sun  size={16} style={{ color: 'var(--text-secondary)' }} />
              : <Moon size={16} style={{ color: 'var(--text-secondary)' }} />
            }
          </button>
        </div>
      </div>
    </nav>
  )
}
