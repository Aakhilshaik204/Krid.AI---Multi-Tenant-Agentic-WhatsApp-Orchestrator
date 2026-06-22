/**
 * App.jsx — Root component with Analytics tab + enhanced dashboard layout.
 */
import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import TenantSwitcher from './components/TenantSwitcher'
import ChatMonitor from './components/ChatMonitor'
import ChatThread from './components/ChatThread'
import BroadcastDrawer from './components/BroadcastDrawer'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import { getStats } from './api'

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
)
const BroadcastIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
  </svg>
)
const RefreshIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
)
const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
)
const AnalyticsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, highlight }) {
  return (
    <div className={`card px-4 py-3 flex items-center gap-3 min-w-[130px]
                     ${highlight === 'danger'  ? 'border-danger-border bg-danger-light' : ''}
                     ${highlight === 'info'    ? 'border-info-border bg-info-light' : ''}
                     ${highlight === 'warning' ? 'border-warning-border bg-warning-light' : ''}
                   `}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                       ${highlight === 'danger'  ? 'bg-danger-mid' : ''}
                       ${highlight === 'info'    ? 'bg-info-mid'   : ''}
                       ${highlight === 'warning' ? 'bg-warning-mid': ''}
                       ${!highlight ? 'bg-slate-100' : ''}
                     `}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 leading-tight">{label}</p>
        <p className={`text-xl font-bold tabular-nums leading-tight
                       ${highlight === 'danger'  ? 'text-danger-text'  : ''}
                       ${highlight === 'info'    ? 'text-info-text'    : ''}
                       ${highlight === 'warning' ? 'text-warning-text' : ''}
                       ${!highlight ? 'text-slate-900' : ''}
                     `}>
          {value ?? '—'}
        </p>
      </div>
    </div>
  )
}

/* ─── Tab Button ─────────────────────────────────────────────────────────── */
function TabBtn({ id, active, onClick, icon, label, badge }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150
        ${active
          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
    >
      {icon}
      {label}
      {badge != null && badge > 0 && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none
          ${active ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

/* ─── Dashboard Layout ───────────────────────────────────────────────────── */
function Dashboard({ onBackToLanding }) {
  const [activeTenant, setActiveTenant]     = useState(null)
  const [activeSession, setActiveSession]   = useState(null)
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
  const [stats, setStats]                   = useState(null)
  const [activeTab, setActiveTab]           = useState('monitor') // 'monitor' | 'analytics'

  useEffect(() => {
    if (!activeTenant) return
    setActiveSession(null)
    const doFetch = () => {
      getStats(activeTenant.tenant_id)
        .then(res => setStats(res.data))
        .catch(() => {})
    }
    doFetch()
    const iv = setInterval(doFetch, 10000)
    return () => clearInterval(iv)
  }, [activeTenant?.tenant_id])

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden page-enter">

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">

          {/* Back */}
          <button id="back-to-landing-btn" onClick={onBackToLanding}
            className="btn-ghost btn-sm flex items-center gap-1.5 text-slate-500 hover:text-slate-700">
            <ChevronLeftIcon /> Home
          </button>

          <div className="w-px h-5 bg-slate-200" />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Orchestrator</span>
            <span className="badge badge-neutral text-xs">Dashboard</span>
          </div>

          <div className="flex-1" />

          {/* Tab switcher */}
          {activeTenant && (
            <div className="flex items-center gap-1.5">
              <TabBtn
                id="tab-monitor"
                active={activeTab === 'monitor'}
                onClick={() => setActiveTab('monitor')}
                icon={<ChatIcon />}
                label="Live Monitor"
                badge={stats?.needs_human}
              />
              <TabBtn
                id="tab-analytics"
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
                icon={<AnalyticsIcon />}
                label="Analytics"
              />
            </div>
          )}

          {/* Tenant Switcher */}
          <TenantSwitcher
            activeTenant={activeTenant}
            onTenantChange={t => { setActiveTenant(t); setStats(null) }}
          />

          {/* Broadcast */}
          <button id="open-broadcast-btn" onClick={() => setIsBroadcastOpen(true)}
            className="btn-primary btn-sm">
            <BroadcastIcon /> Broadcast
          </button>
        </div>

        {/* Stats Row */}
        {activeTenant && (
          <div className="mt-3 flex items-center gap-3 flex-wrap animate-fade-up"
            style={{ animationDelay: '0.1s' }}>
            <StatCard label="Total Sessions" value={stats?.total_sessions}
              icon={<svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>}
            />
            <StatCard label="Processing" value={stats?.active_sessions} highlight="warning"
              icon={<svg className="w-4 h-4 text-warning-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
            />
            <StatCard label="Needs Human" value={stats?.needs_human} highlight="danger"
              icon={<svg className="w-4 h-4 text-danger-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
            />
            <StatCard label="Total Messages" value={stats?.total_messages} highlight="info"
              icon={<svg className="w-4 h-4 text-info-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
            />
            <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
              <RefreshIcon /> Auto-refresh 10s
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden p-4 gap-3">

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-card flex flex-col overflow-hidden">
            <AnalyticsDashboard tenant={activeTenant} />
          </div>
        )}

        {/* ── Monitor Tab ── */}
        {activeTab === 'monitor' && (
          <>
            {/* Left — Session List */}
            <aside className="w-72 flex-shrink-0 bg-white border border-slate-200 rounded-xl
                              flex flex-col overflow-hidden shadow-card">
              <ChatMonitor
                tenant={activeTenant}
                activeSession={activeSession}
                onSessionSelect={setActiveSession}
              />
            </aside>

            {/* Right — Chat Thread */}
            <section className="flex-1 bg-white border border-slate-200 rounded-xl
                                flex flex-col overflow-hidden shadow-card">
              <ChatThread session={activeSession} />
            </section>
          </>
        )}

        {/* No tenant selected */}
        {!activeTenant && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Select a tenant to get started</p>
              <p className="text-xs text-slate-400 mt-1">Use the tenant switcher in the top bar</p>
            </div>
          </div>
        )}
      </main>

      {/* Broadcast Drawer */}
      <BroadcastDrawer
        tenant={activeTenant}
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
      />
    </div>
  )
}

/* ─── Root ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState('landing')
  return view === 'landing'
    ? <LandingPage onEnterDashboard={() => setView('dashboard')} />
    : <Dashboard onBackToLanding={() => setView('landing')} />
}
