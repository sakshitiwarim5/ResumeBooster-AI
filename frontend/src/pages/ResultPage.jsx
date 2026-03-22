import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  AlertCircle, Lightbulb, Tag, MessageSquare,
  RotateCcw, ArrowLeft, Trophy, Target,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScoreRing from '../components/ScoreRing'
import ScoreBar from '../components/ScoreBar'
import AnalysisCard from '../components/AnalysisCard'
import PremiumBanner from '../components/PremiumBanner'
import LoadingSpinner from '../components/LoadingSpinner'

function ScoreBadge({ score }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work'
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  )
}

export default function ResultPage() {
  const { analysisId }         = useParams()
  const { state }              = useLocation()
  const navigate               = useNavigate()
  const [result,   setResult]  = useState(state?.result || null)
  const [isPremium, setIsPremium] = useState(result?.is_premium_unlocked || false)
  const [error,    setError]   = useState('')

  useEffect(() => {
    // If someone navigates directly to a result URL, we have no state.
    // For now, show an error — in a real app you'd fetch by ID.
    if (!result) {
      setError('Result not found. Please upload and analyze your resume again.')
    }
  }, [result])

  const handleUnlock = (updatedData) => {
    setResult(updatedData)
    setIsPremium(true)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-app">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-28 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="font-display text-2xl font-700 mb-2" style={{ color: 'var(--text-primary)' }}>
            Result Not Found
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <RotateCcw size={15} />
            Analyze Again
          </Link>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    )
  }

  const { score, ats_score, missing_keywords, suggestions, interview_questions, filename } = result

  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Nav back */}
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={15} />
          Analyze another resume
        </button>

        {/* Header */}
        <div className="mb-8 animate-fade-up opacity-0-init">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--brand)' }}>
                Analysis Complete
              </p>
              <h1 className="font-display text-3xl font-800" style={{ color: 'var(--text-primary)' }}>
                Your Resume Report
              </h1>
              {filename && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {filename}
                </p>
              )}
            </div>
            <Link
              to="/upload"
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-colors hover:opacity-80"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <RotateCcw size={14} />
              New Analysis
            </Link>
          </div>
        </div>

        {/* Score Cards */}
        <div
          className="rounded-3xl p-8 mb-6 animate-fade-up opacity-0-init anim-delay-100"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
            {/* Resume score */}
            <div className="flex flex-col items-center gap-3">
              <ScoreRing score={score} size={150} label="Resume Score" />
              <ScoreBadge score={score} />
            </div>

            {/* Divider */}
            <div
              className="hidden sm:block w-px self-stretch"
              style={{ background: 'var(--border)' }}
            />
            <div className="block sm:hidden w-full h-px" style={{ background: 'var(--border)' }} />

            {/* ATS score */}
            <div className="flex flex-col items-center gap-3">
              <ScoreRing score={ats_score} size={150} label="ATS Score" />
              <ScoreBadge score={ats_score} />
            </div>
          </div>

          {/* Score explanation */}
          <div
            className="mt-6 pt-5 border-t grid sm:grid-cols-2 gap-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <ScoreExplainer
              icon={Trophy}
              iconColor="#6366f1"
              label="Resume Score"
              desc="Overall quality: formatting, impact statements, quantified achievements and structure."
            />
            <ScoreExplainer
              icon={Target}
              iconColor="#10b981"
              label="ATS Score"
              desc="How well applicant-tracking systems can parse and keyword-match your document."
            />
          </div>

          {/* Score bar breakdown */}
          <div
            className="mt-5 pt-5 border-t space-y-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Score Breakdown
            </p>
            <ScoreBar label="Resume Score"    score={score}     delay={0}   />
            <ScoreBar label="ATS Readability" score={ats_score} delay={150} />
            <ScoreBar
              label="Keyword Coverage"
              score={Math.max(0, ats_score - (missing_keywords?.length || 0) * 3)}
              delay={300}
            />
          </div>
        </div>

        {/* Premium Banner */}
        <div className="mb-6 animate-fade-up opacity-0-init anim-delay-200">
          <PremiumBanner
            analysisId={analysisId}
            isPremium={isPremium}
            onUnlock={handleUnlock}
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">

          {/* Missing Keywords */}
          {missing_keywords?.length > 0 && (
            <div className="animate-fade-up opacity-0-init anim-delay-300">
              <AnalysisCard
                title="Missing Keywords"
                icon={Tag}
                iconColor="#f59e0b"
                badge={missing_keywords.length}
                defaultOpen
              >
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Add these high-value keywords to significantly improve your ATS score:
                </p>
                <div className="flex flex-wrap gap-2">
                  {missing_keywords.map(kw => (
                    <span key={kw} className="keyword-badge">{kw}</span>
                  ))}
                </div>
              </AnalysisCard>
            </div>
          )}

          {/* Suggestions */}
          {suggestions?.length > 0 && (
            <div className="animate-fade-up opacity-0-init anim-delay-400">
              <AnalysisCard
                title="Improvement Suggestions"
                icon={Lightbulb}
                iconColor="#6366f1"
                badge={suggestions.length}
                defaultOpen
              >
                <ol className="space-y-3">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center"
                        style={{ background: '#6366f118', color: '#6366f1' }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {s}
                      </p>
                    </li>
                  ))}
                </ol>
              </AnalysisCard>
            </div>
          )}

          {/* Interview Questions */}
          {interview_questions?.length > 0 && (
            <div className="animate-fade-up opacity-0-init anim-delay-500">
              <AnalysisCard
                title="Likely Interview Questions"
                icon={MessageSquare}
                iconColor="#8b5cf6"
                badge={interview_questions.length}
                defaultOpen={false}
              >
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Based on your resume, recruiters are likely to ask:
                </p>
                <ul className="space-y-3">
                  {interview_questions.map((q, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 font-mono-jet text-xs font-600 mt-0.5 px-1.5 py-0.5 rounded"
                        style={{ background: '#8b5cf618', color: '#8b5cf6' }}
                      >
                        Q{i + 1}
                      </span>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {q}
                      </p>
                    </li>
                  ))}
                </ul>
              </AnalysisCard>
            </div>
          )}
        </div>

        {/* CTA bottom */}
        <div
          className="mt-8 p-5 rounded-2xl text-center animate-fade-up opacity-0-init anim-delay-600"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Made improvements? Come back and re-analyze to track your progress.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 mt-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: 'var(--brand)' }}
          >
            <RotateCcw size={14} />
            Analyze Updated Resume
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function ScoreExplainer({ icon: Icon, iconColor, label, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${iconColor}15` }}
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}
