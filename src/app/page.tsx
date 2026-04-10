'use client'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { LogIn } from 'lucide-react'

export default function HomePage() {
  const { user, setUser } = useAppStore()
  const router = useRouter()

  const handleLogin = () => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#07070F]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 60%)', filter: 'blur(50px)' }} />

      <main className="flex-1 flex flex-col items-center justify-center max-w-lg w-full z-10 animate-slide-in-up">
        
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,212,255,0.2)]"
               style={{ background: 'linear-gradient(135deg, #00d4ff, #6366f1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-4xl text-white drop-shadow-md">🩺</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            專科護理師
            <br className="my-2" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#6366f1] leading-relaxed py-2">
              考題練習機
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mt-2" style={{ color: 'var(--text-secondary)' }}>
            (麻醉科組)
          </h2>
        </div>

        <button 
          onClick={handleLogin}
          className="btn-primary text-xl px-12 py-5 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 w-full max-w-xs flex items-center justify-center gap-3 font-bold"
        >
          <LogIn size={24} /> 登 入 系統
        </button>
      </main>

      <footer className="w-full text-center pb-6 z-10">
        <p className="text-[11px] md:text-xs opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
          © 2026 方嘉苓王旻琦楊昊小型實驗室擁有版權與開發 版本 0.1（草案版）
        </p>
      </footer>
    </div>
  )
}
