import { useState } from 'react'
import { Lock, Download, Sparkles, CheckCircle2 } from 'lucide-react'
import { initiatePayment } from '../services/razorpay'
import { downloadReport } from '../services/api'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'

export default function PremiumBanner({ analysisId, isPremium, onUnlock }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadReport(analysisId)
      toast.success('Report downloaded!')
    } catch (err) {
      toast.error(err.message || 'Download failed.')
    } finally {
      setDownloading(false)
    }
  }

  if (isPremium) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, #10b98115, #059669 0%, #10b98115)',
          border: '1px solid #10b98140',
        }}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={22} />
          <div>
            <p className="font-display font-700 text-emerald-600 dark:text-emerald-400">
              Premium Unlocked
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Download your full analysis report as PDF
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
        >
          {downloading ? (
            <LoadingSpinner size={16} />
          ) : (
            <Download size={16} />
          )}
          {downloading ? 'Downloading…' : 'Download PDF Report'}
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden relative animate-fade-up"
      style={{ border: '1px solid var(--border)' }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: 'linear-gradient(135deg, #6366f120 0%, #8b5cf620 50%, #ec489920 100%)',
        }}
      />

      <div className="relative px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-600">
            <Lock size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
              Unlock Full Report
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Get a downloadable PDF with deep insights, detailed feedback & more interview questions
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['PDF Report', 'Deep Analysis', 'Keyword Map', 'ATS Tips'].map(f => (
                <span key={f} className="keyword-badge text-xs">{f}</span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => initiatePayment(analysisId, onUnlock)}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-display font-700 text-base text-white whitespace-nowrap transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 24px -6px #6366f155',
          }}
        >
          <Sparkles size={16} />
          Unlock Full Report – ₹149
        </button>
      </div>
    </div>
  )
}
