'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, ChevronRight, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'
import type { Question, ExamResult } from '@/types'

type ExamMode = 'setup' | 'running' | 'result'
type ExamSource = '通論' | '進階'

function buildAiSuggestion(result: Omit<ExamResult, 'aiSuggestion' | 'completedAt'>): string {
  const weak = Object.entries(result.categoryBreakdown)
    .filter(([, v]) => v.correct / v.total < 0.6)
    .map(([k]) => k)
  if (weak.length === 0) return `🎉 表現優異！正確率 ${result.score}%，建議持續保持，可嘗試高難度題目或模擬口試。`
  return `本次考試得分 ${result.score}%。建議優先複習：${weak.join('、')}。這些類別答對率低於60%，是主要弱點，請針對性加強。`
}

export default function ExamPage() {
  const router = useRouter()
  const { questions, user, addWrongNote, recordAnswer } = useAppStore()
  const [mode, setMode] = useState<ExamMode>('setup')
  const [examSource, setExamSource] = useState<ExamSource>('通論')
  const [totalQ, setTotalQ] = useState(10)
  const [timeLimitMin, setTimeLimitMin] = useState(60)
  const [pool, setPool] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [result, setResult] = useState<ExamResult | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { if (!user) router.replace('/') }, [user, router])

  const startExam = () => {
    const sourcePool = questions.filter(q => q.examType === examSource)
    const shuffled = [...sourcePool].sort(() => Math.random() - 0.5).slice(0, totalQ)
    setPool(shuffled)
    setUserAnswers({})
    setCurrentIdx(0)
    setTimeLeft(timeLimitMin * 60)
    setMode('running')
  }

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const catBreak: Record<string, { correct: number; total: number }> = {}
    let correct = 0
    const wrong: { question: Question; userAnswer: string }[] = []
    pool.forEach(q => {
      const ans = userAnswers[q.id] ?? ''
      const isCorrect = ans === q.correctAnswer
      if (isCorrect) correct++
      else { wrong.push({ question: q, userAnswer: ans }); if (ans) addWrongNote(q, ans) }
      recordAnswer(q.id, isCorrect, q.category)
      if (!catBreak[q.category]) catBreak[q.category] = { correct: 0, total: 0 }
      catBreak[q.category].total++
      if (isCorrect) catBreak[q.category].correct++
    })
    const score = Math.round((correct / pool.length) * 100)
    const partial = { examId: Date.now().toString(), totalQuestions: pool.length, correctCount: correct, wrongCount: pool.length - correct, score, categoryBreakdown: catBreak, wrongQuestions: wrong }
    setResult({ ...partial, aiSuggestion: buildAiSuggestion(partial), completedAt: new Date().toISOString() })
    setMode('result')
  }, [pool, userAnswers, addWrongNote, recordAnswer])

  useEffect(() => {
    if (mode !== 'running') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { submitExam(); return 0 } return t - 1 })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [mode, submitExam])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const isWarning = timeLeft < 300 && timeLeft > 0
  const availableCount = questions.filter(q => q.examType === examSource).length

  if (!user) return null

  // ---- SETUP ----
  if (mode === 'setup') return (
    <AppShell>
      <div className="animate-slide-in-up max-w-xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">模擬考試</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>設定考試參數後開始</p>
        </div>

        <div className="glass-card-static p-6 space-y-5">

          {/* 題庫出處 */}
          <div>
            <p className="text-sm font-medium text-white mb-2">題庫出處</p>
            <div className="grid grid-cols-2 gap-2">
              {(['通論', '進階'] as ExamSource[]).map(src => (
                <button key={src} onClick={() => setExamSource(src)}
                  className={`option-btn py-4 text-center ${examSource === src ? 'option-selected' : ''}`}>
                  <div className="text-lg mb-1">{src === '通論' ? '📘' : '📗'}</div>
                  <div className="text-sm font-semibold text-white">{src}題庫</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    麻醉專科護理{src === '通論' ? '通論' : '進階'}考題
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              目前 {examSource} 題庫共 {availableCount} 題可用
            </p>
          </div>

          {/* 題數 */}
          <div>
            <p className="text-sm font-medium text-white mb-2">題數</p>
            <div className="flex gap-2">
              {[10, 50, 80].map(n => (
                <button key={n} onClick={() => setTotalQ(n)}
                  className={`flex-1 option-btn text-sm py-3 text-center ${totalQ === n ? 'option-selected' : ''}`}
                  disabled={n > availableCount}>
                  <span className="font-bold">{n}</span>
                  <span className="ml-1 text-xs" style={{ color: 'var(--text-muted)' }}>題</span>
                </button>
              ))}
            </div>
            {totalQ > availableCount && (
              <p className="text-xs mt-1.5" style={{ color: '#ffb800' }}>
                ⚠️ 題數超過現有題庫（{availableCount}題），將使用全部題目
              </p>
            )}
          </div>

          {/* 時間限制 */}
          <div>
            <p className="text-sm font-medium text-white mb-2">時間限制</p>
            <div className="flex gap-2">
              {[60, 80].map(t => (
                <button key={t} onClick={() => setTimeLimitMin(t)}
                  className={`flex-1 option-btn text-sm py-3 text-center ${timeLimitMin === t ? 'option-selected' : ''}`}>
                  <span className="font-bold">{t}</span>
                  <span className="ml-1 text-xs" style={{ color: 'var(--text-muted)' }}>分鐘</span>
                </button>
              ))}
            </div>
          </div>

          {/* 提醒 */}
          <div className="p-3 rounded-xl text-xs flex items-start gap-2"
            style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--text-secondary)' }}>
            <span className="flex-shrink-0 mt-0.5">📌</span>
            <span>考試進行中不顯示答案，交卷後一次性顯示完整評分與解析</span>
          </div>
        </div>

        <button onClick={startExam} className="btn-primary w-full justify-center text-base py-4">
          開始 {examSource} 模擬考試（{Math.min(totalQ, availableCount)} 題 / {timeLimitMin} 分鐘）
          <ChevronRight size={18} />
        </button>
      </div>
    </AppShell>
  )

  // ---- RUNNING ----
  if (mode === 'running' && pool.length > 0) {
    const q = pool[currentIdx]
    const answered = Object.keys(userAnswers).length
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">{currentIdx + 1} / {pool.length}</span>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-bold ${isWarning ? 'timer-warning' : ''}`}
              style={{ background: isWarning ? 'rgba(255,68,102,0.1)' : 'rgba(255,255,255,0.06)', color: isWarning ? '#ff4466' : '#00d4ff', border: `1px solid ${isWarning ? 'rgba(255,68,102,0.3)' : 'rgba(0,212,255,0.2)'}` }}>
              <Clock size={14} /> {formatTime(timeLeft)}
            </div>
            <button onClick={submitExam} className="btn-glass text-xs py-1.5 px-3">交卷</button>
          </div>

          {/* Progress */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(answered / pool.length) * 100}%` }} />
          </div>

          {/* Question */}
          <div className="glass-card-static p-5">
            <div className="flex gap-2 mb-3">
              <span className="badge badge-cyan">{q.category}</span>
            </div>
            <p className="text-white leading-relaxed">{q.stem}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map(opt => (
              <button key={opt.key} id={`exam-option-${opt.key}`}
                className={`option-btn ${userAnswers[q.id] === opt.key ? 'option-selected' : ''}`}
                onClick={() => setUserAnswers(a => ({ ...a, [q.id]: opt.key }))}>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                    {opt.key}
                  </span>
                  <span className="text-sm">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Nav */}
          <div className="flex gap-2">
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}
              className="btn-glass flex-1 justify-center disabled:opacity-40">上一題</button>
            {currentIdx < pool.length - 1
              ? <button onClick={() => setCurrentIdx(i => i + 1)} className="btn-primary flex-1 justify-center">下一題 <ChevronRight size={16} /></button>
              : <button onClick={submitExam} className="btn-primary flex-1 justify-center" style={{ background: 'linear-gradient(135deg,#00e878,#00b8e6)' }}>交卷 ✓</button>
            }
          </div>
        </div>
      </AppShell>
    )
  }

  // ---- RESULT ----
  if (mode === 'result' && result) return (
    <AppShell>
      <div className="animate-slide-in-up max-w-2xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-white">考試結果</h1>

        {/* Score */}
        <div className="glass-card-static p-6 text-center">
          <div className="text-6xl font-bold mb-2"
            style={{ color: result.score >= 70 ? '#00e878' : result.score >= 60 ? '#ffb800' : '#ff4466' }}>
            {result.score}%
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            共 {result.totalQuestions} 題 · 答對 {result.correctCount} 題 · 答錯 {result.wrongCount} 題
          </p>
        </div>

        {/* Category breakdown */}
        <div className="glass-card-static p-5">
          <h2 className="text-sm font-semibold text-white mb-4">各類別成績</h2>
          <div className="space-y-3">
            {Object.entries(result.categoryBreakdown).map(([cat, { correct, total }]) => {
              const pct = Math.round((correct / total) * 100)
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                    <span style={{ color: pct >= 70 ? '#00e878' : pct >= 60 ? '#ffb800' : '#ff4466' }}>{correct}/{total} ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 70 ? '#00e878' : pct >= 60 ? '#ffb800' : '#ff4466' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI suggestion */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} style={{ color: '#818cf8' }} />
            <span className="text-sm font-medium" style={{ color: '#818cf8' }}>AI 學習建議</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.aiSuggestion}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setMode('setup'); setResult(null) }} className="btn-glass flex-1 justify-center">
            <RotateCcw size={16} /> 再考一次
          </button>
          <button onClick={() => router.push('/wrong-notes')} className="btn-primary flex-1 justify-center">
            查看錯題本
          </button>
        </div>
      </div>
    </AppShell>
  )

  return null
}
