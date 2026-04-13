'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { LogIn, Sun, Moon } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

export default function HomePage() {
  const { user, setUser } = useAppStore()
  const router = useRouter()
  const [isLight, setIsLight] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 播放按鈕點擊音效
  const playClick = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/button-click.mp3')
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [])

  const handleLogin = () => {
    playClick()
    if (!user) {
      setUser({
        id: 'guest',
        name: '訓練學員',
        email: 'guest@anesthesia.pro',
        targetMode: 'review',
        createdAt: new Date().toISOString()
      })
    }
    router.push('/dashboard')
  }

  const handleThemeToggle = () => {
    playClick()
    setIsLight(prev => !prev)
  }

  // 深色主題 vs 淺色主題的變數
  const theme = isLight
    ? {
        pageBg: '#f0f4f8',
        overlayFrom: 'rgba(240,244,248,0.85)',
        overlayMid: 'rgba(240,244,248,0.55)',
        overlayTo: 'rgba(240,244,248,0.98)',
        glowColor: 'rgba(0,150,200,0.18)',
        titleColor: '#1a1a2e',
        subtitleColor: '#555577',
        footerColor: '#888899',
        bgFilter: 'grayscale(100%) contrast(1.0) brightness(1.1)',
        bgOpacity: 0.35,
      }
    : {
        pageBg: '#07070F',
        overlayFrom: 'rgba(7,7,15,0.80)',
        overlayMid: 'rgba(7,7,15,0.50)',
        overlayTo: 'rgba(7,7,15,1)',
        glowColor: 'rgba(0,212,255,0.15)',
        titleColor: '#f0f0ff',
        subtitleColor: '#8888aa',
        footerColor: '#8888aa',
        bgFilter: 'grayscale(100%) contrast(1.1) brightness(0.7)',
        bgOpacity: 0.6,
      }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.pageBg,
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/cover-bg.jpg')",
          filter: theme.bgFilter,
          opacity: theme.bgOpacity,
          transition: 'filter 0.5s ease, opacity 0.5s ease',
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${theme.overlayFrom}, ${theme.overlayMid}, ${theme.overlayTo})`,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse, ${theme.glowColor} 0%, transparent 60%)`,
          filter: 'blur(50px)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* 深/淺色模式切換按鈕 — 右上角 */}
      <button
        id="theme-toggle-btn"
        onClick={handleThemeToggle}
        aria-label={isLight ? '切換深色背景' : '切換淺色背景'}
        className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: isLight
            ? 'rgba(26,26,46,0.12)'
            : 'rgba(255,255,255,0.10)',
          border: isLight
            ? '1px solid rgba(26,26,46,0.20)'
            : '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)',
          color: isLight ? '#1a1a2e' : '#f0f0ff',
          boxShadow: isLight
            ? '0 2px 12px rgba(0,0,0,0.12)'
            : '0 2px 12px rgba(0,212,255,0.15)',
        }}
      >
        {isLight ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-lg w-full z-10 animate-slide-in-up">
        <div className="text-center mb-12">
          {/* Icon */}
          <div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,212,255,0.2)]"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #6366f1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span className="text-4xl text-white drop-shadow-md">🩺</span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
            style={{ color: theme.titleColor, transition: 'color 0.5s ease' }}
          >
            專科護理師
            <br className="my-2" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#6366f1] leading-relaxed py-2">
              考題練習機
            </span>
          </h1>

          <h2
            className="text-2xl md:text-3xl font-medium mt-2"
            style={{ color: theme.subtitleColor, transition: 'color 0.5s ease' }}
          >
            (麻醉科組)
          </h2>
        </div>

        <button
          id="login-btn"
          onClick={handleLogin}
          className="btn-primary text-xl px-12 py-5 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 w-full max-w-xs flex items-center justify-center gap-3 font-bold"
        >
          <LogIn size={24} /> 登 入 系統
        </button>
      </main>

      <footer className="w-full text-center pb-6 z-10">
        <p
          className="text-[11px] md:text-xs opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: theme.footerColor, transition: 'color 0.5s ease' }}
        >
          © 2026 方嘉苓王旻琦楊昊小型實驗室擁有版權與開發 版本 0.1（草案版）
        </p>
      </footer>
    </div>
  )
}
