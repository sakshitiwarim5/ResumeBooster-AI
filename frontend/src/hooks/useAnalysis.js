import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { analyzeResume } from '../services/api'

const STEPS = [
  'Extracting resume text…',
  'Running ATS compatibility check…',
  'Scoring your experience & impact…',
  'Identifying missing keywords…',
  'Generating improvement suggestions…',
  'Preparing interview questions…',
]

/**
 * Encapsulates the entire upload → analyse → navigate flow.
 *
 * Returns:
 *   { loading, progress, stepIndex, stepMessage, error, run }
 */
export function useAnalysis() {
  const navigate = useNavigate()

  const [loading,   setLoading]   = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [error,     setError]     = useState('')

  const run = useCallback(async (file) => {
    if (!file) return
    setError('')
    setLoading(true)
    setProgress(0)
    setStepIndex(0)

    // Advance the fake step counter every ~1.8 s for good UX
    const stepTimer = setInterval(() => {
      setStepIndex(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 1800)

    try {
      const data = await analyzeResume(file, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded / evt.total) * 100))
        }
      })
      clearInterval(stepTimer)
      toast.success('Analysis complete! 🎉')
      navigate(`/result/${data.id}`, { state: { result: data } })
    } catch (err) {
      clearInterval(stepTimer)
      const msg = err.message || 'Analysis failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [navigate])

  return {
    loading,
    progress,
    stepIndex,
    stepMessage: STEPS[stepIndex],
    error,
    run,
  }
}
