/**
 * LandingPage — Premium enterprise SaaS landing page.
 * Animations: typewriter terminal, count-up stats, staggered feature cards,
 * floating gradient orbs, animated pipeline connector, scroll reveals.
 */
import { useEffect, useRef, useState } from 'react'

/* ─── Data ──────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Features',     href: '#features'      },
  { label: 'Architecture', href: '#architecture'  },
  { label: 'API Docs',     href: '/docs'           },
]

const STATS = [
  { value: '< 200ms', label: 'Median response latency',  numeric: false },
  { value: '99.9%',   label: 'Uptime SLA',               numeric: false },
  { value: '4',       label: 'LangGraph pipeline nodes',  numeric: true  },
  { value: '3s',      label: 'Meta webhook deadline',     numeric: false },
]

const TERMINAL_LINES = [
  { color: 'text-green-400',  text: 'INFO      Application startup complete.' },
  { color: 'text-blue-400',   text: 'INFO      Connected to MongoDB: whatsapp_saas' },
  { color: 'text-slate-500',  text: 'INFO      Seeded 2 tenants — Tenant A, Tenant B' },
  { color: 'text-slate-400',  text: 'INFO      POST /api/webhooks/whatsapp — 200 OK' },
  { color: 'text-green-400',  text: 'AGENT     Started for +919440639183 (tenant: tenant_a)' },
  { color: 'text-slate-400',  text: 'NODE      [1/4] Acknowledge — read receipt + typing on' },
  { color: 'text-slate-400',  text: 'NODE      [2/4] Context — loaded 5 history messages' },
  { color: 'text-blue-400',   text: 'NODE      [3/4] LLM — POST generativelanguage.googleapis.com 200' },
  { color: 'text-green-400',  text: 'NODE      [4/4] Dispatcher — text response dispatched' },
  { color: 'text-slate-500',  text: 'AGENT     Completed in 1.84s — session updated' },
]

const FEATURES = [
  {
    title: 'Multi-Tenant Architecture',
    description: 'Each business operates in full isolation — custom system prompts, unique media libraries, and separate conversation histories.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
  },
  {
    title: 'Gemini 3.1 Flash Lite',
    description: 'Multimodal AI reasoning drives every conversation — understands text and images, selects the right response type, and stays within your brand voice.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />,
  },
  {
    title: 'LangGraph Pipeline',
    description: 'A four-node directed graph — Acknowledge, Context, LLM, Dispatcher — each node independently observable, testable, and replaceable.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />,
  },
  {
    title: 'WhatsApp Cloud API',
    description: 'Native integration with Meta\'s WhatsApp Cloud API. Sends text, images, and documents with read receipts and typing indicators.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />,
  },
  {
    title: 'Real-Time Dashboard',
    description: 'Monitor every conversation across all tenants — live session list, full chat thread, broadcast campaigns, and escalation alerts.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-9.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V3.375zm-9.75 9a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />,
  },
  {
    title: 'Webhook Security',
    description: 'Every inbound request is validated with X-Hub-Signature-256 HMAC. Invalid payloads are rejected before any business logic executes.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
  },
]

const PIPELINE = [
  { n: '01', title: 'Acknowledge', desc: 'Marks message as read. Activates typing indicator.' },
  { n: '02', title: 'Context',     desc: 'Loads tenant config and last 5 messages from MongoDB.' },
  { n: '03', title: 'LLM',         desc: 'Gemini generates reply and selects response type.' },
  { n: '04', title: 'Dispatcher',  desc: 'Routes text, image, or document to WhatsApp API.' },
]

/* ─── Hooks ─────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useTypewriter(lines, startDelay = 600, lineDelay = 700) {
  const [shown, setShown] = useState([])
  useEffect(() => {
    let t
    const showNext = (i) => {
      if (i >= lines.length) return
      t = setTimeout(() => { setShown(p => [...p, lines[i]]); showNext(i + 1) }, i === 0 ? startDelay : lineDelay)
    }
    showNext(0)
    return () => clearTimeout(t)
  }, [])
  return shown
}

/* ─── Logo ───────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
      </div>
      <span className="text-sm font-semibold text-slate-900 tracking-tight">Krid.AI Orchestrator</span>
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ onEnterDashboard }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                        ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-card border-b border-slate-200/80'
                                   : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}
               className="px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900
                          hover:bg-slate-100 rounded-lg transition-all duration-150 font-medium">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button id="nav-dashboard-btn" onClick={onEnterDashboard} className="btn-secondary btn-sm">
            Dashboard
          </button>
          <button id="nav-get-started-btn" onClick={onEnterDashboard} className="btn-primary btn-sm">
            Get Started
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function TypewriterTerminal() {
  const lines = useTypewriter(TERMINAL_LINES, 800, 550)
  return (
    <div className="card-lg overflow-hidden text-left max-w-3xl mx-auto"
         style={{ boxShadow: '0 24px 64px -12px rgba(15,23,42,0.18), 0 0 0 1px rgba(15,23,42,0.06)' }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/90" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/90" />
          <div className="w-3 h-3 rounded-full bg-green-400/90" />
        </div>
        <span className="ml-2 text-xs text-slate-400 font-mono">uvicorn app.main:app — port 8000</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-500">running</span>
        </div>
      </div>
      {/* Log lines */}
      <div className="code-block rounded-none p-5 min-h-[220px] space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="text-slate-600 select-none flex-shrink-0">$</span>
            <span className={line.color}>{line.text}</span>
          </div>
        ))}
        {lines.length < TERMINAL_LINES.length && (
          <div className="flex gap-3">
            <span className="text-slate-600">$</span>
            <span className="w-2 h-4 bg-brand-400/70 animate-typing-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}

function Hero({ onEnterDashboard }) {
  return (
    <section className="relative pt-36 pb-24 px-6 overflow-hidden">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]
                        bg-brand-400 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.05]
                        bg-brand-600 blur-3xl animate-float-slow" />
        <div className="bg-dot-grid absolute inset-0" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200
                        rounded-full text-xs font-medium text-slate-600 mb-10 shadow-card
                        animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          FastAPI · LangGraph · Gemini 2.0 Flash · MongoDB Atlas
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-[64px] font-bold text-slate-900 leading-[1.1]
                       tracking-tight mb-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Intelligent WhatsApp
          <span className="block gradient-text mt-1">Orchestration at Scale</span>
        </h1>

        {/* Sub */}
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-10
                      animate-fade-up" style={{ animationDelay: '0.35s' }}>
          A production-grade SaaS platform enabling multiple businesses to deploy
          AI-powered WhatsApp agents with full tenant isolation, agentic pipelines,
          and real-time operator dashboards.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16
                        animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <button id="hero-dashboard-btn" onClick={onEnterDashboard}
                  className="btn-primary btn-lg w-full sm:w-auto"
                  style={{ boxShadow: '0 0 0 0 transparent, 0 4px 20px rgba(69,80,232,0.35)' }}>
            Open Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <a href="#architecture" className="btn-secondary btn-lg w-full sm:w-auto justify-center">
            View Architecture
          </a>
        </div>

        {/* Terminal */}
        <div className="animate-fade-up" style={{ animationDelay: '0.65s' }}>
          <TypewriterTerminal />
        </div>
      </div>
    </section>
  )
}

/* ─── Stats ─────────────────────────────────────────────────────────────── */
function Stats() {
  const [ref, inView] = useInView()
  return (
    <section ref={ref} className="py-16 border-y border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center transition-all duration-500
                                           ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                 style={{ transitionDelay: `${i * 0.1}s` }}>
              <p className="text-3xl font-bold text-slate-900 mb-1 tabular-nums">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────────────────── */
function Features() {
  const [ref, inView] = useInView(0.1)
  return (
    <section id="features" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-500
                         ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">Capabilities</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need, nothing you don't</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Designed for engineers who need a reliable, observable, and production-ready WhatsApp AI platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title}
                 className={`feature-card transition-all duration-500
                              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                 style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>
              <div className="feature-icon-wrap">
                <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={1.75}>
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Architecture ───────────────────────────────────────────────────────── */
function Architecture() {
  const [ref, inView] = useInView(0.1)
  return (
    <section id="architecture" className="py-24 px-6 bg-white border-y border-slate-200" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-500
                         ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">Pipeline</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">LangGraph Agentic Pipeline</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Every inbound message traverses a four-node directed state graph.
            The pipeline returns HTTP 200 to Meta within 200ms and completes AI processing in background.
          </p>
        </div>

        {/* Pipeline steps */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 mb-14">
          {PIPELINE.map((s, i) => (
            <div key={s.n} className="flex flex-col md:flex-row items-stretch flex-1">
              {/* Card */}
              <div className={`card flex-1 p-5 hover:shadow-card-md hover:-translate-y-1
                               transition-all duration-300
                               ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                   style={{ transitionDelay: `${0.15 + i * 0.1}s` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200
                                   flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
                    {s.n}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>

              {/* Animated connector */}
              {i < PIPELINE.length - 1 && (
                <div className="flex items-center justify-center w-10 py-4 md:py-0 flex-shrink-0">
                  <div className="relative w-6 h-0.5 bg-slate-200 hidden md:block overflow-hidden">
                    <div className="pipeline-line absolute inset-0" />
                  </div>
                  <svg className="w-4 h-4 text-slate-300 block md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tech row */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'AI Engine',      value: 'Google Gemini 2.0 Flash', sub: 'Multimodal · Tool-use · Context window' },
            { label: 'Orchestration',  value: 'LangGraph + FastAPI',     sub: 'Async background tasks · Typed state' },
            { label: 'Data Layer',     value: 'MongoDB Atlas',           sub: 'Motor async · Free M0 tier · Indexed' },
          ].map((t, i) => (
            <div key={t.label}
                 className={`bg-slate-50 border border-slate-200 rounded-xl p-5
                              hover:border-brand-200 hover:bg-brand-50/40 transition-all duration-200
                              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                 style={{ transitionDelay: `${0.4 + i * 0.08}s` }}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{t.label}</p>
              <p className="text-base font-semibold text-slate-900 mb-1">{t.value}</p>
              <p className="text-xs text-slate-500">{t.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ────────────────────────────────────────────────────────────────── */
function CTASection({ onEnterDashboard }) {
  const [ref, inView] = useInView(0.2)
  return (
    <section className="py-24 px-6" ref={ref}>
      <div className={`max-w-3xl mx-auto transition-all duration-600
                       ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative rounded-2xl overflow-hidden border border-brand-200 p-12 text-center"
             style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edff 60%, #f0f4ff 100%)' }}>
          {/* Decorative blob */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48
                          rounded-full bg-brand-300/20 blur-2xl animate-float" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48
                          rounded-full bg-brand-400/15 blur-2xl animate-float-slow" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to explore?</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Open the dashboard to monitor sessions, view conversations in real time,
              and manage broadcast campaigns across all tenants.
            </p>
            <button id="cta-dashboard-btn" onClick={onEnterDashboard}
                    className="btn-primary btn-lg mx-auto"
                    style={{ boxShadow: '0 0 24px rgba(69,80,232,0.3), 0 4px 12px rgba(69,80,232,0.2)' }}>
              Open Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-xs text-slate-400">
          Built with FastAPI · LangGraph · Gemini 2.0 Flash · MongoDB · React + Vite
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
          All systems operational
        </div>
      </div>
    </footer>
  )
}

/* ─── Export ─────────────────────────────────────────────────────────────── */
export default function LandingPage({ onEnterDashboard }) {
  return (
    <div className="min-h-screen bg-slate-50 page-enter">
      <Navbar onEnterDashboard={onEnterDashboard} />
      <Hero onEnterDashboard={onEnterDashboard} />
      <Stats />
      <Features />
      <Architecture />
      <CTASection onEnterDashboard={onEnterDashboard} />
      <Footer />
    </div>
  )
}
