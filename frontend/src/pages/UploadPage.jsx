import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, X, AlertCircle, Zap, CheckCircle2, ArrowLeft,
} from 'lucide-react'
import Navbar        from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import ProgressBar   from '../components/ProgressBar'
import { useAnalysis } from '../hooks/useAnalysis'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default function UploadPage() {
  const navigate = useNavigate()
  const [file,       setFile]      = useState(null)
  const [dropError,  setDropError] = useState('')

  const {
    loading, progress, stepMessage, error: analysisError, run,
  } = useAnalysis()

  const error = dropError || analysisError

  const onDrop = useCallback((accepted, rejected) => {
    setDropError('')
    if (rejected.length > 0) {
      const rej = rejected[0]
      if (rej.errors?.[0]?.code === 'file-too-large') {
        setDropError('File exceeds 5 MB limit. Please compress your resume.')
      } else {
        setDropError('Only PDF files are accepted.')
      }
      return
    }
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
  })

  const handleAnalyze = () => run(file)

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setDropError('')
  }

  const formatSize = (bytes) => {
    if (bytes < 1024)        return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={15} />
          Back to home
        </button>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1
            className="font-display text-4xl font-800 mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Upload Your Resume
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            PDF format · Max 5 MB · Free analysis in under 30 seconds
          </p>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`relative rounded-3xl border-2 border-dashed cursor-pointer transition-all p-10 text-center
            ${isDragActive ? 'dropzone-active' : ''}
            ${file ? 'border-emerald-400' : ''}
          `}
          style={{
            borderColor: file
              ? '#10b981'
              : isDragActive
              ? 'var(--brand)'
              : 'var(--border)',
            background: isDragActive
              ? 'color-mix(in srgb, var(--brand) 5%, var(--bg-secondary))'
              : 'var(--bg-secondary)',
          }}
        >
          <input {...getInputProps()} />

          {file ? (
            /* File preview */
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-display font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
                  {file.name}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {formatSize(file.size)} · PDF
                </p>
              </div>
              <button
                onClick={removeFile}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: '#ef4444' }}
              >
                <X size={13} />
                Remove file
              </button>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform
                  ${isDragActive ? 'scale-110 animate-bounce-gentle' : ''}`}
                style={{ background: 'color-mix(in srgb, var(--brand) 12%, transparent)' }}
              >
                <Upload
                  size={28}
                  style={{ color: 'var(--brand)' }}
                  className={isDragActive ? 'animate-bounce-gentle' : ''}
                />
              </div>
              <div>
                <p className="font-display font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  or{' '}
                  <span style={{ color: 'var(--brand)' }} className="font-semibold underline underline-offset-2">
                    click to browse
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {['PDF only', 'Max 5 MB', 'Free'].map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-4 flex items-start gap-2.5 p-4 rounded-xl text-sm animate-scale-in"
            style={{
              background: '#ef444412',
              border: '1px solid #ef444430',
              color: '#ef4444',
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Analyze button */}
        {file && !loading && (
          <button
            onClick={handleAnalyze}
            className="w-full mt-6 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-display font-700 text-base text-white transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 animate-scale-in"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 12px 32px -8px #6366f160',
            }}
          >
            <Zap size={18} fill="white" />
            Analyze My Resume
          </button>
        )}

        {/* Loading state */}
        {loading && (
          <div
            className="mt-6 p-6 rounded-2xl text-center animate-scale-in"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <LoadingSpinner size={44} className="mx-auto mb-4" />
            <p className="font-display font-700 text-base mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Analysing your resume…
            </p>
            <p className="text-sm animate-pulse mb-4" style={{ color: 'var(--text-muted)' }}>
              {stepMessage}
            </p>

            {/* Upload progress bar */}
            {progress > 0 && progress < 100 && (
              <ProgressBar
                value={progress}
                label="Uploading"
                showText
                className="mt-2"
              />
            )}
          </div>
        )}

        {/* Tips */}
        <div
          className="mt-8 p-5 rounded-2xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Tips for best results
          </p>
          <ul className="space-y-2">
            {[
              'Use a text-based PDF (not a scanned image)',
              'Include clear section headers: Experience, Skills, Education',
              'Avoid tables, columns, and excessive graphics',
              'Keep it to 1–2 pages for better ATS scores',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <FileText size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand)' }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
