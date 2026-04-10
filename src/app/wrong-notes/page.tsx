'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, RotateCcw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'
import type { WrongNote } from '@/types'

export default function WrongNotesPage() {
  const router = useRouter()
  const { user, wrongNotes, markUnderstood, removeWrongNote } = useAppStore()
  const [filter, setFilter] = useState<'all' | 'understood' | 'pending'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => { if (!user) router.replace('/') }, [user, router])
  if (!user) return null

  const filtered = wrongNotes.filter(w => {
    if (filter === 'understood') return w.isUnderstood
    if (filter === 'pending') return !w.isUnderstood
    return true
  })

  const pendingCount = wrongNotes.filter(w => !w.isUnderstood).length

  // Category stats
  const catStats: Record<string, number> = {}
  wrongNotes.forEach(w => {
    if (!w.isUnderstood) catStats[w.question.category] = (catStats[w.question.category] ?? 0) + 1
  })
  const topCats = Object.entries(catStats).sort(([, a], [, b]) => b - a).slice(0, 3)

  return (
    <AppShell>
      <div className="animate-slide-in-up space-y-5 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">錯題本</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              共 {wrongNotes.length} 題 · 尚未理解 {pendingCount} 題
            </p>
          </div>
        </div>

        {/* Weak category summary */}
        {topCats.length > 0 && (
          <div className="glass-card-static p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={14} style={{ color: '#ffb800' }} />
              <span className="text-sm font-medium text-white">弱點分類 TOP 3</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topCats.map(([cat, count]) => (
                <span key={cat} className="badge" style={{ background: 'rgba(255,184,0,0.1)', borderColor: 'rgba(255,184,0,0.3)', color: '#ffb800' }}>
                  {cat} <strong>{count}題</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: `全部 (${wrongNotes.length})` },
            { id: 'pending', label: `未理解 (${pendingCount})` },
            { id: 'understood', label: `已理解 (${wrongNotes.length - pendingCount})` },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setFilter(id as typeof filter)}
              className={`flex-1 option-btn text-xs py-2 text-center ${filter === id ? 'option-selected' : ''}`}>
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="glass-card-static p-10 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-medium">沒有錯題！</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>繼續練習累積錯題本</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((note) => (
              <WrongNoteCard key={note.questionId} note={note}
                expanded={expandedId === note.questionId}
                onToggle={() => setExpandedId(expandedId === note.questionId ? null : note.questionId)}
                onMarkUnderstood={() => markUnderstood(note.questionId)}
                onRemove={() => removeWrongNote(note.questionId)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function WrongNoteCard({ note, expanded, onToggle, onMarkUnderstood, onRemove }:
  { note: WrongNote; expanded: boolean; onToggle: () => void; onMarkUnderstood: () => void; onRemove: () => void }) {
  const q = note.question
  return (
    <div className="glass-card-static overflow-hidden">
      <div onClick={onToggle} className="w-full p-4 text-left flex items-start gap-3 cursor-pointer select-none">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="badge badge-cyan text-xs">{q.category}</span>
            {note.isUnderstood && <span className="badge badge-green text-xs">已理解</span>}
            <span className="badge text-xs" style={{ color: '#ff7796' }}>錯 {note.wrongCount} 次</span>
          </div>
          <p className="text-sm text-white leading-relaxed line-clamp-2">{q.stem}</p>
        </div>
        <div className="text-gray-400 flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="pt-3 space-y-1.5">
            {q.options.map(opt => (
              <div key={opt.key} className={`flex items-start gap-2 p-2.5 rounded-lg text-sm ${opt.key === q.correctAnswer ? 'option-correct' : opt.key === note.userAnswer && opt.key !== q.correctAnswer ? 'option-wrong' : ''}`}>
                <span className="font-bold flex-shrink-0 w-5">{opt.key}.</span>
                <span>{opt.text}</span>
                {opt.key === q.correctAnswer && <CheckCircle size={14} style={{ color: '#00e878' }} className="ml-auto flex-shrink-0 mt-0.5" />}
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
            <strong className="text-white">解析：</strong>{q.explanation}
          </div>
          {q.keyPoint && (
            <div className="flex items-start gap-2 text-xs p-2.5 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', color: '#00d4ff' }}>
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
              <span><strong>考點：</strong>{q.keyPoint}</span>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            {!note.isUnderstood && (
              <button onClick={onMarkUnderstood} className="btn-success text-xs flex-1 justify-center">
                <CheckCircle size={13} /> 標記已理解
              </button>
            )}
            <button onClick={onRemove} className="btn-danger text-xs justify-center px-3">刪除</button>
          </div>
        </div>
      )}
    </div>
  )
}
