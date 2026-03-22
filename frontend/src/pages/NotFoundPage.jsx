import { Link } from 'react-router-dom'
import { Home, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p
          className="font-mono-jet text-8xl font-600 mb-4 animate-fade-up opacity-0-init"
          style={{ color: 'color-mix(in srgb, var(--brand) 30%, transparent)' }}
        >
          404
        </p>
        <h1 className="font-display text-3xl font-800 mb-3 animate-fade-up opacity-0-init anim-delay-100" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p className="mb-8 animate-fade-up opacity-0-init anim-delay-200" style={{ color: 'var(--text-secondary)' }}>
          The page you're looking for doesn't exist or was moved.
        </p>
        <div className="flex items-center gap-3 animate-fade-up opacity-0-init anim-delay-300">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <Home size={15} />
            Home
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <Zap size={15} />
            Analyze Resume
          </Link>
        </div>
      </div>
    </div>
  )
}
