'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen, ClipboardList, Mic2, MessageSquare,
  TrendingUp, AlertCircle, Target, Award, Flame, Lock
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'

const QUICK_ACTIONS = [
  { href: '/practice', icon: BookOpen, label: '題庫練習', desc: '分類練習 / 隨機出題', color: '#00d4ff' },
  { href: '/exam', icon: ClipboardList, label: '模擬考試', desc: '限時作答 / 完整評分', color: '#6366f1' },
  { href: '/oral', icon: Mic2, label: 'AI 模擬口試', desc: '情境追問 / 評分報告', color: '#ffb800' },
  { href: '/chat', icon: MessageSquare, label: 'AI 教學問答', desc: '知識問答 / 概念解析', color: '#00e878' },
  { href: '/wrong-notes', icon: AlertCircle, label: '錯題本', desc: '弱點複習 / 標記理解', color: '#ff7796' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, stats } = useAppStore()

  useEffect(() => {
    if (!user) router.replace('/')
  }, [user, router])

  if (!user) return null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? '早安' : hour < 17 ? '午安' : '晚安'

  return (
    <AppShell>
      <div className="animate-slide-in-up space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting}，{user.name} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            嘉苓表示:考試前多看的每一題都有可能會是最關鍵的那一題!!
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Target, label: '總作答題數', value: stats.totalAnswered, color: '#00d4ff', suffix: '題' },
            { icon: Award, label: '整體正確率', value: stats.accuracy, color: '#00e878', suffix: '%' },
            { icon: Flame, label: '連續學習', value: stats.streakDays, color: '#ffb800', suffix: '天' },
            { icon: AlertCircle, label: '錯題本', value: stats.wrongNotesCount, color: '#ff7796', suffix: '題' },
          ].map(({ icon: Icon, label, value, color, suffix }) => (
            <div key={label} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <Icon size={14} style={{ color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color }}>
                {value}<span className="text-sm font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>{suffix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="section-header">快速進入</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color }) => {
              const isLocked = href === '/oral' || href === '/chat'
              return (
                <div key={href} className="relative h-full">
                  {isLocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl cursor-not-allowed"
                         style={{ background: 'rgba(7,7,15,0.6)', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="text-white text-sm font-bold flex items-center justify-center gap-1 mb-0.5">
                        <Lock size={12}/> 付費解鎖新功能
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>尚未研發完成</span>
                    </div>
                  )}
                  <Link href={isLocked ? '#' : href} className={`glass-card h-full p-5 flex flex-col items-start ${isLocked ? 'pointer-events-none opacity-40' : 'group cursor-pointer'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${!isLocked && 'group-hover:scale-110'}`}
                        style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{label}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weak Categories */}
        {stats.weakCategories.length > 0 && (
          <div className="glass-card-static p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: '#ffb800' }} />
              <h2 className="font-semibold text-white text-sm">AI 建議今日優先複習</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.weakCategories.slice(0, 5).map(cat => (
                <Link key={cat} href={`/practice?category=${encodeURIComponent(cat)}`}
                  className="badge-amber text-xs px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', color: '#ffb800' }}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Progress week */}
        <div className="glass-card-static p-5">
          <h2 className="font-semibold text-white text-sm mb-4">本週學習次數</h2>
          <div className="flex items-end justify-between gap-1 h-16">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => {
              const count = stats.weeklyCount[i] ?? 0
              const max = Math.max(...stats.weeklyCount, 1)
              const height = Math.max((count / max) * 100, 4)
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      background: i === 6
                        ? 'linear-gradient(to top, #00d4ff, #6366f1)'
                        : 'rgba(255,255,255,0.08)'
                    }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
