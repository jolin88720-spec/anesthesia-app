'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ClipboardList, Mic2, MessageSquare, TrendingUp, Shield, ArrowRight, Star } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const FEATURES = [
  { icon: BookOpen, title: '歷屆題庫練習', desc: '109–114年通論 & 進階試題，含詳細解析', color: '#00d4ff' },
  { icon: ClipboardList, title: '模擬考試', desc: '限時作答，完整評分報告與AI補強建議', color: '#6366f1' },
  { icon: TrendingUp, title: '錯題追蹤', desc: '自動建立錯題本，分析弱點類別與進步趨勢', color: '#00e878' },
  { icon: Mic2, title: 'AI 模擬口試', desc: 'AI扮演考官，訓練臨床思考與口試表達', color: '#ffb800' },
  { icon: MessageSquare, title: 'AI 教學問答', desc: '基於知識庫的精準回答，附知識來源', color: '#ff7796' },
  { icon: Shield, title: '個人化學習', desc: 'AI根據弱點自動推薦今日復習重點', color: '#a78bfa' },
]

export default function LandingPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useAppStore()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (tab === 'register' && !name.trim()) {
      setError('請輸入姓名'); return
    }
    if (!email.includes('@')) {
      setError('請輸入有效的電子郵件'); return
    }
    if (password.length < 6) {
      setError('密碼至少需要6個字元'); return
    }
    setUser({
      id: Date.now().toString(),
      name: tab === 'register' ? name : email.split('@')[0],
      email,
      targetMode: 'review',
      createdAt: new Date().toISOString(),
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
            <Star size={12} /> MVP 版本 — 持續更新中
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="gradient-text">麻醉護理師</span>
            <br />
            <span className="text-white">AI 智能訓練系統</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            由方嘉苓、王旻琦、楊昊
            <br className="hidden md:block" />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>（亞洲大學護理研究生）</span>
            <br />
            攜手打造 考題模擬器。
          </p>

          {/* Auth Card */}
          <div className="glass-card-static max-w-sm mx-auto p-6 text-left">
            {/* Tab */}
            <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {(['login', 'register'] as const).map(t => (
                <button key={t} onClick={() => { setTab(t); setError('') }}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={tab === t ? { background: 'linear-gradient(135deg,#00d4ff,#6366f1)', color: 'white' }
                    : { color: 'var(--text-secondary)' }}>
                  {t === 'login' ? '登入' : '註冊'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {tab === 'register' && (
                <input className="glass-input" placeholder="姓名" value={name}
                  onChange={e => setName(e.target.value)} />
              )}
              <input className="glass-input" type="email" placeholder="電子郵件" value={email}
                onChange={e => setEmail(e.target.value)} />
              <input className="glass-input" type="password" placeholder="密碼（至少6碼）" value={password}
                onChange={e => setPassword(e.target.value)} />
              {error && <p className="text-xs text-red-accent">{error}</p>}
              <button type="submit" className="btn-primary w-full justify-center">
                {tab === 'login' ? '登入' : '建立帳號'} <ArrowRight size={16} />
              </button>
            </form>

            <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              MVP 版本：資料儲存於本機瀏覽器
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center text-white mb-10">六大訓練模組</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="glass-card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
