'use client'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Bookmark, BookmarkCheck, AlertCircle, ChevronRight, RotateCcw } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'
import type { Question } from '@/types'

type PracticeMode = 'setup' | 'answering' | 'review'
type SourceFilter =
  | 'all'           // 綜合
  | 'general_all'   // 通論全部
  | 'advanced_all'  // 進階全部
  | `general_${number}` // 通論某年
  | `advanced_${number}` // 進階某年
  | 'random'
  | 'wrong'
  | 'bookmarked'

const YEARS = [109, 110, 111, 112, 113, 114]

export default function PracticePage() {
  const router = useRouter()
  const { questions, wrongNotes, bookmarks, toggleBookmark, addWrongNote, recordAnswer, user } = useAppStore()
  const [mode, setMode] = useState<PracticeMode>('setup')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [practiceType, setPracticeType] = useState<'category' | 'random' | 'wrong' | 'bookmarked'>('category')
  const [questionPool, setQuestionPool] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => { if (!user) router.replace('/') }, [user, router])

  const buildPool = useCallback((): Question[] => {
    if (practiceType === 'wrong') return wrongNotes.map(w => w.question)
    if (practiceType === 'bookmarked') return questions.filter(q => bookmarks.includes(q.id))
    if (practiceType === 'random') return [...questions].sort(() => Math.random() - 0.5).slice(0, 20)

    // category mode — filter by sourceFilter
    let pool = [...questions]
    if (sourceFilter === 'all') { /* all */ }
    else if (sourceFilter === 'general_all') pool = pool.filter(q => q.examType === '通論')
    else if (sourceFilter === 'advanced_all') pool = pool.filter(q => q.examType === '進階')
    else if (sourceFilter.startsWith('general_')) {
      const yr = parseInt(sourceFilter.replace('general_', ''))
      pool = pool.filter(q => q.examType === '通論' && q.examYear === yr)
    } else if (sourceFilter.startsWith('advanced_')) {
      const yr = parseInt(sourceFilter.replace('advanced_', ''))
      pool = pool.filter(q => q.examType === '進階' && q.examYear === yr)
    }
    return pool.sort(() => Math.random() - 0.5).slice(0, 20)
  }, [questions, wrongNotes, bookmarks, practiceType, sourceFilter])

  const startPractice = () => {
    const pool = buildPool()
    if (!pool.length) return
    setQuestionPool(pool)
    setCurrentIdx(0)
    setSelectedAnswer('')
    setShowAnswer(false)
    setMode('answering')
  }

  const handleAnswer = (key: string) => {
    if (showAnswer) return
    setSelectedAnswer(key)
    setShowAnswer(true)
    const q = questionPool[currentIdx]
    const isCorrect = key === q.correctAnswer
    recordAnswer(q.id, isCorrect, q.category)
    if (!isCorrect) addWrongNote(q, key)
  }

  const handleNext = () => {
    if (currentIdx + 1 >= questionPool.length) setMode('review')
    else { setCurrentIdx(i => i + 1); setSelectedAnswer(''); setShowAnswer(false) }
  }

  if (!user) return null
  const q = questionPool[currentIdx]

  // ---- SETUP ----
  if (mode === 'setup') return (
    <AppShell>
      <div className="animate-slide-in-up max-w-2xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">題庫練習</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>選擇練習模式開始作答</p>
        </div>

        {/* Practice type */}
        <div className="glass-card-static p-5">
          <p className="text-sm font-medium text-white mb-3">練習模式</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'random', label: '🎲 隨機出題' },
              { id: 'wrong', label: '❌ 錯題重練' },
              { id: 'bookmarked', label: '⭐ 收藏題目' },
            ] as const).map(({ id, label }) => (
              <button key={id} onClick={() => setPracticeType(id)}
                className={`option-btn text-center py-3 text-sm ${practiceType === id ? 'option-selected' : ''}`}>
                {label}
              </button>
            ))}
          </div>
          {/* Category mode toggle */}
          <button onClick={() => setPracticeType('category')}
            className={`mt-2 w-full option-btn text-center py-2.5 text-sm ${practiceType === 'category' ? 'option-selected' : ''}`}>
            📚 依題庫類型選題
          </button>
        </div>

        {/* Category / source selector */}
        {practiceType === 'category' && (
          <div className="glass-card-static p-5 space-y-4">

            {/* 綜合類別 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>綜合類別</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: '📚 全部題目' },
                  { id: 'general_all', label: '📘 通論題庫' },
                  { id: 'advanced_all', label: '📗 進階題庫' },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setSourceFilter(id as SourceFilter)}
                    className={`option-btn text-xs py-2.5 text-center ${sourceFilter === id ? 'option-selected' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 通論依年份 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                📘 通論（依年份）
              </p>
              <div className="grid grid-cols-3 gap-2">
                {YEARS.map(yr => (
                  <button key={`g${yr}`} onClick={() => setSourceFilter(`general_${yr}` as SourceFilter)}
                    className={`option-btn text-xs py-2 text-center ${sourceFilter === `general_${yr}` ? 'option-selected' : ''}`}>
                    {yr} 年
                  </button>
                ))}
              </div>
            </div>

            {/* 進階依年份 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                📗 進階（依年份）
              </p>
              <div className="grid grid-cols-3 gap-2">
                {YEARS.map(yr => (
                  <button key={`a${yr}`} onClick={() => setSourceFilter(`advanced_${yr}` as SourceFilter)}
                    className={`option-btn text-xs py-2 text-center ${sourceFilter === `advanced_${yr}` ? 'option-selected' : ''}`}>
                    {yr} 年
                  </button>
                ))}
              </div>
            </div>

            {/* Count preview */}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              目前篩選：共 {buildPool().length} 題可練習
            </p>
          </div>
        )}

        <button onClick={startPractice} disabled={buildPool().length === 0}
          className="btn-primary w-full justify-center disabled:opacity-40">
          開始練習 <ChevronRight size={16} />
        </button>
      </div>
    </AppShell>
  )

  // ---- REVIEW ----
  if (mode === 'review') return (
    <AppShell>
      <div className="animate-slide-in-up max-w-2xl mx-auto text-center space-y-6">
        <div className="glass-card-static p-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">練習完成！</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>已完成 {questionPool.length} 題練習</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setMode('setup')} className="btn-glass flex-1 justify-center">
            <RotateCcw size={16} /> 再次練習
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-primary flex-1 justify-center">
            回儀表板
          </button>
        </div>
      </div>
    </AppShell>
  )

  if (!q) return null

  // ---- ANSWERING ----
  const optionState = (key: string) => {
    if (!showAnswer) return selectedAnswer === key ? 'option-selected' : ''
    if (key === q.correctAnswer) return 'option-correct option-disabled'
    if (key === selectedAnswer && key !== q.correctAnswer) return 'option-wrong option-disabled'
    return 'option-disabled'
  }

  return (
    <AppShell>
      <div className="animate-slide-in-up max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge badge-cyan">{q.category}</span>
            {q.examYear && (
              <span className="badge" style={{
                background: q.examType === '通論' ? 'rgba(0,180,255,0.1)' : 'rgba(0,232,120,0.1)',
                borderColor: q.examType === '通論' ? 'rgba(0,180,255,0.3)' : 'rgba(0,232,120,0.3)',
                color: q.examType === '通論' ? '#00d4ff' : '#00e878'
              }}>
                {q.examYear}年 {q.examType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {currentIdx + 1} / {questionPool.length}
            </span>
            <button onClick={() => toggleBookmark(q.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              {bookmarks.includes(q.id)
                ? <BookmarkCheck size={16} style={{ color: '#ffb800' }} />
                : <Bookmark size={16} style={{ color: 'var(--text-muted)' }} />}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIdx + 1) / questionPool.length) * 100}%` }} />
        </div>

        {/* Question */}
        <div className="glass-card-static p-5">
          <p className="text-white leading-relaxed">{q.stem}</p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map(opt => (
            <button key={opt.key} id={`option-${opt.key}`}
              className={`option-btn ${optionState(opt.key)}`}
              onClick={() => handleAnswer(opt.key)}>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                  {opt.key}
                </span>
                <span className="text-sm flex-1">{opt.text}</span>
                {showAnswer && opt.key === q.correctAnswer && <CheckCircle size={16} style={{ color: '#00e878' }} className="flex-shrink-0 mt-0.5" />}
                {showAnswer && opt.key === selectedAnswer && opt.key !== q.correctAnswer && <XCircle size={16} style={{ color: '#ff4466' }} className="flex-shrink-0 mt-0.5" />}
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="glass-card-static p-5 animate-slide-in-up space-y-3">
            <div className="flex items-center gap-2">
              {selectedAnswer === q.correctAnswer
                ? <><CheckCircle size={16} style={{ color: '#00e878' }} /><span className="text-sm font-medium" style={{ color: '#00e878' }}>答對了！</span></>
                : <><XCircle size={16} style={{ color: '#ff4466' }} /><span className="text-sm font-medium" style={{ color: '#ff4466' }}>答錯了，正確答案是 {q.correctAnswer}</span></>
              }
            </div>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.explanation}</div>
            {q.keyPoint && (
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <AlertCircle size={14} style={{ color: '#00d4ff' }} className="mt-0.5 flex-shrink-0" />
                <span className="text-xs" style={{ color: '#00d4ff' }}><strong>核心考點：</strong>{q.keyPoint}</span>
              </div>
            )}
            <button onClick={handleNext} className="btn-primary w-full justify-center">
              {currentIdx + 1 >= questionPool.length ? '完成練習' : '下一題'} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
