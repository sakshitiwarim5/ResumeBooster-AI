import { Zap, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-24 py-8 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ResumeBooster Logo" className="w-6 h-6 object-contain" />
          <span className="font-display text-sm font-600" style={{ color: 'var(--text-secondary)' }}>
            ResumeBooster AI
          </span>
        </div>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} ResumeBooster. All rights reserved. Built with <Heart size={12} className="inline text-red-500 mx-1" /> for job seekers.
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <a href="#" className="hover:opacity-80 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Terms</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Contact</a>
        </div>
      </div>
    </footer>
  )
}
