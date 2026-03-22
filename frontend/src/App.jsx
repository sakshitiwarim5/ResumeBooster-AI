import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import LandingPage    from './pages/LandingPage'
import UploadPage     from './pages/UploadPage'
import ResultPage     from './pages/ResultPage'
import NotFoundPage   from './pages/NotFoundPage'
import ErrorBoundary  from './components/ErrorBoundary'

// ── Theme Context ─────────────────────────────────────────────
export const ThemeContext = createContext(null)

export function useTheme() {
  return useContext(ThemeContext)
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('hb-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('hb-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ErrorBoundary>
        <Routes>
          <Route path="/"                    element={<LandingPage />} />
          <Route path="/upload"              element={<UploadPage />} />
          <Route path="/result/:analysisId"  element={<ResultPage />} />
          <Route path="*"                    element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </ThemeContext.Provider>
  )
}
