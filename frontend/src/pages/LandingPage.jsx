import { Link } from 'react-router-dom'
import {
  Zap, Star, ArrowRight, CheckCircle, BarChart2,
  FileText, Brain, Shield, TrendingUp, Users, Award,
  CheckCircle2, XCircle, Lock, Download, Sparkles, Check, Target, AlertTriangle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const FEATURES = [
  {
    icon: Brain,
    color: '#6366f1',
    title: 'AI-Powered Analysis',
    desc: 'GPT-4 reads your resume the way a recruiter does and gives you an honest score.',
  },
  {
    icon: BarChart2,
    color: '#10b981',
    title: 'ATS Compatibility',
    desc: 'Know exactly how Applicant Tracking Systems score your document before you apply.',
  },
  {
    icon: FileText,
    color: '#f59e0b',
    title: 'Missing Keywords',
    desc: "Discover the high-value skills and buzzwords you're missing for your target roles.",
  },
  {
    icon: Shield,
    color: '#8b5cf6',
    title: 'Interview Prep',
    desc: 'Get a custom list of likely interview questions generated from your own experience.',
  },
  {
    icon: TrendingUp,
    color: '#ec4899',
    title: 'Actionable Suggestions',
    desc: 'Concrete, prioritized changes — not vague advice — to maximise your chances.',
  },
  {
    icon: Award,
    color: '#06b6d4',
    title: 'PDF Report',
    desc: 'Download a polished report to share with mentors or track your progress over time.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Swiggy',
    avatar: 'PS',
    text: 'ResumeBooster spotted I was missing cloud keywords — after adding them I got 3 interview calls in a week!',
    score: 91,
  },
  {
    name: 'Rohan Mehta',
    role: 'Product Manager at Meesho',
    avatar: 'RM',
    text: 'The ATS score was eye-opening. My resume was only hitting 48%. After the suggestions it jumped to 84%.',
    score: 84,
  },
  {
    name: 'Ananya Gupta',
    role: 'Data Analyst at Flipkart',
    avatar: 'AG',
    text: 'The interview questions section is pure gold. I went into every round prepared for exactly what they asked.',
    score: 88,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle glows optimized for cleanliness */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(-50%, -30%)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(50%, 30%)' }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-up opacity-0-init" style={{ background: 'color-mix(in srgb, var(--brand) 12%, transparent)', color: 'var(--brand)', border: '1px solid color-mix(in srgb, var(--brand) 25%, transparent)' }}>
            <Zap size={11} fill="currentColor" />
            Built for students & developers
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-[1.05] mb-6 animate-fade-up opacity-0-init anim-delay-100" style={{ color: 'var(--text-primary)' }}>
            Get Your Resume{' '}
            <span className="relative inline-block" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Score Instantly
            </span>
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up opacity-0-init anim-delay-200" style={{ color: 'var(--text-secondary)' }}>
            Upload your PDF resume and get an AI-powered score, ATS analysis, missing keywords, and actionable suggestions — in under 30 seconds.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 animate-fade-up opacity-0-init anim-delay-300">
            <Link
              to="/upload"
              className="group flex items-center justify-center gap-2.5 px-8 py-4 w-full sm:w-auto rounded-2xl font-display font-700 text-lg text-white transition-all hover:scale-[1.02] hover:shadow-2xl hover:brightness-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 12px 32px -8px rgba(99,102,241,0.5)' }}
            >
              Analyze My Resume – Free (Get Score in 10s)
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm font-medium mt-3" style={{ color: 'var(--text-muted)' }}>
              Used by job seekers to improve resumes and land interviews faster
            </p>
          </div>
        </div>
      </section>

      {/* ── TRUST BANNER ──────────────────────────────────────── */}
      <section className="py-8 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Brain size={20} className="text-indigo-500" />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>AI-powered resume analysis</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Users size={20} className="text-emerald-500" />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Designed for real job seekers</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Zap size={20} className="text-amber-500" />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Instant results under 30 seconds</span>
          </div>
        </div>
      </section>

      {/* ── RESULT PREVIEW ────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-800" style={{ color: 'var(--text-primary)' }}>See Exactly How You Stack Up</h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>We break down your resume like a recruiter would.</p>
          </div>

          <div className="rounded-3xl p-6 sm:p-10 shadow-xl transition-all hover:shadow-2xl hover:shadow-indigo-500/10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-8 md:pb-0 md:pr-10" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-8 w-full justify-around">
                  <div className="text-center">
                    <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 border-indigo-100 dark:border-indigo-900/30 mb-4 mx-auto">
                      <div className="absolute inset-0 rounded-full border-8 border-indigo-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)', transform: 'rotate(-45deg)' }}></div>
                      <span className="font-display text-3xl sm:text-4xl font-800 text-indigo-500">78</span>
                      <span className="absolute bottom-5 sm:bottom-6 text-[10px] sm:text-xs text-indigo-500 font-semibold uppercase">/ 100</span>
                    </div>
                    <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>Resume Score</p>
                  </div>
                  <div className="text-center">
                    <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border-8 border-emerald-100 dark:border-emerald-900/30 mb-4 mx-auto">
                      <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 65%, 0 0)' }}></div>
                      <span className="font-display text-3xl sm:text-4xl font-800 text-emerald-500">65%</span>
                    </div>
                    <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>ATS Score</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 font-display font-700 text-lg mb-3" style={{ color: 'var(--text-primary)' }}>
                    <Target size={18} className="text-amber-500" /> Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="keyword-badge">React</span>
                    <span className="keyword-badge">AWS</span>
                    <span className="keyword-badge">Typescript</span>
                    <span className="keyword-badge">REST APIs</span>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-display font-700 text-lg mb-3" style={{ color: 'var(--text-primary)' }}>
                    <AlertTriangle size={18} className="text-red-400" /> Suggestions
                  </h4>
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-0.5 text-indigo-500 flex-shrink-0" /> Add quantifiable metrics (e.g., "increased sales by 20%").</li>
                    <li className="flex items-start gap-2"><ArrowRight size={14} className="mt-0.5 text-indigo-500 flex-shrink-0" /> Improve professional summary to be more role-specific.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-app">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand)' }}>
              Features
            </p>
            <h2 className="font-display text-4xl font-800" style={{ color: 'var(--text-primary)' }}>
              Everything You Need to Land the Job
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl group cursor-default"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.05)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-display font-700 text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-800" style={{ color: 'var(--text-primary)' }}>Transform Your Resume</h2>
            <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>Small changes make the difference between a rejection and an interview.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="rounded-3xl p-8 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-500/20">
                  <XCircle size={20} className="text-red-500" />
                </div>
                <h3 className="font-display text-2xl font-700" style={{ color: 'var(--text-primary)' }}>Before</h3>
              </div>
              <p className="text-sm font-semibold text-red-500 mb-2">Weak Resume (No Keywords)</p>
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-500/5 mb-6 text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                "Built a web application for checking items. Handled frontend and backend."
              </div>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-center gap-3"><XCircle size={16} className="text-red-400 shrink-0" /> Fails ATS parsers</li>
                <li className="flex items-center gap-3"><XCircle size={16} className="text-red-400 shrink-0" /> Vague responsibilities</li>
                <li className="flex items-center gap-3"><XCircle size={16} className="text-red-400 shrink-0" /> Zero metrics</li>
              </ul>
            </div>

            {/* After */}
            <div className="rounded-3xl p-8 relative overflow-hidden shadow-xl" style={{ background: 'var(--bg-card)', border: '2px solid #10b981' }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', filter: 'blur(10px)' }} />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                </div>
                <h3 className="font-display text-2xl font-700" style={{ color: 'var(--text-primary)' }}>After</h3>
              </div>
              <p className="text-sm font-semibold text-emerald-500 mb-2">Strong Resume (ATS Optimized)</p>
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-500/5 mb-6 text-sm italic" style={{ color: 'var(--text-primary)' }}>
                "Engineered a scalable inventory management app using React and AWS, reducing tracking anomalies by 25%."
              </div>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Passes ATS filters instantly</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Prominent technical skills highlighted</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> Quantifiable business impact</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-app">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand)' }}>
              How It Works
            </p>
            <h2 className="font-display text-4xl font-800" style={{ color: 'var(--text-primary)' }}>
              3 Steps to a Better Resume
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Upload Your PDF', desc: 'Drag & drop or click to upload your resume. Supports up to 5 MB.', color: '#6366f1' },
              { num: '02', title: 'AI Analyses It', desc: 'Our GPT-4 model reads your resume like a senior recruiter would.', color: '#8b5cf6' },
              { num: '03', title: 'Get Your Report', desc: 'See your score, gaps, and suggestions. Unlock PDF for full detail.', color: '#ec4899' },
            ].map(({ num, title, desc, color }) => (
              <div key={num} className="p-8 rounded-3xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: 'blur(10px)' }} />
                <p className="font-mono-jet text-5xl font-600 mb-5" style={{ color: `${color}40` }}>{num}</p>
                <h3 className="font-display font-700 text-lg mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand)' }}>
              Testimonials
            </p>
            <h2 className="font-display text-4xl font-800" style={{ color: 'var(--text-primary)' }}>
              Real Results, Real People
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, text, score }) => (
              <div key={name} className="p-6 rounded-3xl flex flex-col gap-4 shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      {avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
                    </div>
                  </div>
                  <div className="text-sm font-display font-700 px-2.5 py-1 rounded-lg" style={{ background: score >= 75 ? '#10b98118' : '#f59e0b18', color: score >= 75 ? '#10b981' : '#f59e0b' }}>
                    {score}
                  </div>
                </div>
                <p className="text-sm leading-relaxed flex-1 italic" style={{ color: 'var(--text-secondary)' }}>"{text}"</p>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM LOCK ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl font-800 mb-4" style={{ color: 'var(--text-primary)' }}>Unlock Full Resume Report</h2>
          <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>Get the premium analysis needed to rewrite your resume flawlessly.</p>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-shadow hover:shadow-indigo-500/20" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            
            {/* Blurred Background Fake Content */}
            <div className="p-8 pb-32 filter blur-md opacity-40 select-none pointer-events-none text-left" aria-hidden="true">
              <div className="h-6 w-1/3 bg-indigo-500 rounded mb-6"></div>
              <div className="space-y-4 mb-10">
                <div className="h-4 w-full bg-gray-500 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-500 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-500 rounded"></div>
              </div>
              <div className="h-6 w-1/4 bg-amber-500 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-500 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-500 rounded"></div>
              </div>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-md p-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.4)] border border-indigo-400 mb-6">
                <Lock size={32} className="text-white" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-left max-w-2xl w-full mb-10 mt-2 px-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-base">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/> 
                    <span className="font-semibold" style={{color: 'var(--text-primary)'}}>Full keyword analysis map</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/> 
                    <span className="font-semibold" style={{color: 'var(--text-primary)'}}>Resume rewrite suggestions</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-base">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/> 
                    <span className="font-semibold" style={{color: 'var(--text-primary)'}}>ATS tracking optimization tips</span>
                  </div>
                  <div className="flex items-center gap-3 text-base">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/> 
                    <span className="font-semibold" style={{color: 'var(--text-primary)'}}>Download polished PDF report</span>
                  </div>
                </div>
              </div>

              <Link
                to="/upload"
                className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-display font-700 text-lg text-white transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-[0_8px_32px_rgba(99,102,241,0.5)] bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500/50"
              >
                <Sparkles size={18} />
                Unlock Full Report – ₹149
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-app">
        <div
          className="max-w-4xl mx-auto rounded-[2.5rem] p-12 sm:p-16 text-center relative overflow-hidden transition-all hover:shadow-[0_24px_64px_-16px_rgba(99,102,241,0.3)]"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          <h2 className="font-display text-4xl sm:text-5xl font-800 text-white mb-6 relative">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-indigo-100/90 text-lg mb-10 relative max-w-xl mx-auto">
            Built for students & developers to bypass the ATS, get interviews faster, and land higher paying jobs.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2.5 px-10 py-5 w-full sm:w-auto rounded-xl font-display font-800 text-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-all hover:scale-[1.03] active:scale-95 shadow-xl relative"
          >
            <Zap size={20} fill="currentColor" />
            Analyze My Resume — Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
