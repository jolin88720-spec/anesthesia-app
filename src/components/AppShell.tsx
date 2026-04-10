'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, BookOpen, ClipboardList, AlertCircle,
  Mic2, MessageSquare, Menu, X, ChevronRight, Lock
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: '儀表板' },
  { href: '/practice', icon: BookOpen, label: '題庫練習' },
  { href: '/exam', icon: ClipboardList, label: '模擬考試' },
  { href: '/wrong-notes', icon: AlertCircle, label: '錯題本' },
  { href: '/oral', icon: Mic2, label: 'AI 模擬口試' },
  { href: '/chat', icon: MessageSquare, label: 'AI 教學問答' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, setUser, stats } = useAppStore()

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} style={{ background: 'rgba(7,7,15,0.95)', borderRight: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
        {/* Logo */}
        <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)' }}>
              🩺
            </div>
            <div>
              <div className="text-sm font-bold text-white">麻醉護理師</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>AI 訓練系統</div>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)', color: 'white' }}>
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>正確率 {stats.accuracy}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            const isLocked = href === '/oral' || href === '/chat'
            return (
              <div key={href} className="relative group">
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-[1px] border border-white/5 cursor-not-allowed">
                    <span className="text-[10px] font-bold text-white flex items-center gap-1">
                      <Lock size={10}/> 付費解鎖功能
                    </span>
                  </div>
                )}
                <Link href={isLocked ? '#' : href} className={`nav-link ${active ? 'active' : ''} ${isLocked ? 'opacity-40 pointer-events-none' : ''}`}
                  onClick={() => setMobileOpen(false)}>
                  <Icon size={18} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="opacity-60" />}
                </Link>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(7,7,15,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="text-sm font-semibold text-white">麻醉護理師 AI</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)' }}>
            {user?.name[0] ?? '?'}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
