'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Upload, Search, ChevronDown, ChevronUp, Save, X, Lock } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'
import { CATEGORIES } from '@/data/questions'
import type { Question } from '@/types'

const ADMIN_EMAIL = 'jolin88720@gmail.com'

export default function AdminPage() {
  const router = useRouter()
  const { user, questions } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [importMsg, setImportMsg] = useState('')

  useEffect(() => { if (!user) router.replace('/') }, [user, router])
  if (!user) return null

  // 非管理員：顯示拒絕存取
  if (user.email !== ADMIN_EMAIL) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.3)' }}>
            <Lock size={28} style={{ color: '#ff4466' }} />
          </div>
          <h2 className="text-xl font-bold text-white">無存取權限</h2>
          <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
            此頁面僅限系統管理員使用。<br />請聯絡 jolin88720@gmail.com 取得授權。
          </p>
          <button onClick={() => router.push('/dashboard')} className="btn-glass mt-2">
            返回儀表板
          </button>
        </div>
      </AppShell>
    )
  }

  const filtered = questions.filter(q => {
    const matchSearch = !search || q.stem.includes(search) || q.tags.some(t => t.includes(search))
    const matchCat = !filterCat || q.category === filterCat
    return matchSearch && matchCat
  })

  const handleCsvImport = () => {
    if (!csvText.trim()) return
    const lines = csvText.trim().split('\n')
    const count = lines.length - 1 // minus header
    setImportMsg(`✅ 已解析 ${count} 題（實際匯入功能需連接資料庫，目前為 Demo 模式）`)
    setTimeout(() => setImportMsg(''), 4000)
  }

  return (
    <AppShell>
      <div className="animate-slide-in-up space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">管理後台</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              題庫管理 · 共 {questions.length} 題
            </p>
          </div>
          <button onClick={() => setShowAddForm(v => !v)} className="btn-primary gap-2">
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? '取消' : '新增題目'}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && <AddQuestionForm onClose={() => setShowAddForm(false)} />}

        {/* CSV Import */}
        <div className="glass-card-static p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Upload size={16} style={{ color: '#00d4ff' }} />
            <h2 className="text-sm font-semibold text-white">批次匯入（CSV 格式）</h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            欄位順序：question_id, category, subcategory, difficulty, stem, option_a, option_b, option_c, option_d, correct_answer, explanation, key_point, tags
          </p>
          <textarea
            className="glass-input resize-none font-mono text-xs"
            rows={4}
            placeholder="category,difficulty,stem,option_a,option_b,option_c,option_d,correct_answer,explanation,key_point,tags&#10;麻醉藥理學,medium,Propofol的主要副作用？,低血壓,心律不整,注射疼痛,支氣管痙攣,C,注射疼痛因大豆油乳劑...,propofol注射疼痛,propofol 靜脈麻醉"
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
          />
          {importMsg && <p className="text-xs" style={{ color: '#00e878' }}>{importMsg}</p>}
          <button onClick={handleCsvImport} className="btn-primary gap-2 text-sm">
            <Upload size={14} /> 解析並匯入
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input className="glass-input pl-9 text-sm" placeholder="搜尋題目..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="glass-input text-sm w-auto pr-8" value={filterCat} onChange={e => setFilterCat(e.target.value)}
            style={{ backgroundImage: 'none' }}>
            <option value="">全部類別</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Question List */}
        <div className="space-y-2">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>顯示 {filtered.length} 題</p>
          {filtered.map(q => (
            <AdminQuestionCard key={q.id} question={q}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)} />
          ))}
          {filtered.length === 0 && (
            <div className="glass-card-static p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              找不到符合條件的題目
            </div>
          )}
        </div>

        {/* Knowledge Base Section */}
        <div className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📚</span>
            <h2 className="text-sm font-semibold text-white">知識庫管理（RAG）</h2>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            上傳 PDF 或文字檔案，系統將自動切塊並建立向量索引（需連接 OpenAI API）
          </p>
          <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text-muted)' }}>
            <div className="text-center text-sm">
              <Upload size={20} className="mx-auto mb-1 opacity-40" />
              <p>拖曳或點擊上傳 PDF / TXT</p>
              <p className="text-xs mt-1 opacity-50">連接 Supabase + OpenAI 後啟用</p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: '題庫總題數', value: questions.length, color: '#00d4ff' },
            { label: '通論題數', value: questions.filter(q => q.examType === '通論').length, color: '#6366f1' },
            { label: '進階題數', value: questions.filter(q => q.examType === '進階').length, color: '#00e878' },
            { label: '類別數', value: CATEGORIES.length, color: '#ffb800' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card-static p-4 text-center">
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function AdminQuestionCard({ question: q, expanded, onToggle }: { question: Question; expanded: boolean; onToggle: () => void }) {
  const diffColor = q.difficulty === 'easy' ? '#00e878' : q.difficulty === 'medium' ? '#ffb800' : '#ff4466'
  const diffLabel = q.difficulty === 'easy' ? '初階' : q.difficulty === 'medium' ? '中階' : '高階'
  return (
    <div className="glass-card-static overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 text-left flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="badge badge-cyan text-xs">{q.category}</span>
            <span className="badge text-xs" style={{ color: diffColor, background: `${diffColor}15`, borderColor: `${diffColor}40` }}>{diffLabel}</span>
            <span className="badge text-xs">{q.examYear ? `${q.examYear}年` : ''} {q.examType}</span>
          </div>
          <p className="text-sm text-white line-clamp-2">{q.stem}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" onClick={e => { e.stopPropagation() }}>
            <Edit2 size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
          {expanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="pt-3 space-y-1">
            {q.options.map(opt => (
              <div key={opt.key} className="flex gap-2 text-sm p-2 rounded-lg"
                style={opt.key === q.correctAnswer ? { background: 'rgba(0,232,120,0.08)', color: '#00e878' } : { color: 'var(--text-secondary)' }}>
                <span className="font-bold w-5 flex-shrink-0">{opt.key}.</span>
                <span>{opt.text}</span>
                {opt.key === q.correctAnswer && <span className="ml-auto text-xs">✓ 正確</span>}
              </div>
            ))}
          </div>
          <div className="text-xs p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
            <strong className="text-white">解析：</strong>{q.explanation}
          </div>
          <div className="flex gap-2 flex-wrap">
            {q.tags.map(t => <span key={t} className="badge text-xs">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}

function AddQuestionForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ stem: '', category: CATEGORIES[0], difficulty: 'medium', optA: '', optB: '', optC: '', optD: '', answer: 'A', explanation: '', keyPoint: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="glass-card-static p-5 space-y-4 animate-slide-in-up">
      <h2 className="text-sm font-semibold text-white">➕ 新增題目</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white block mb-1">類別</label>
          <select className="glass-input text-sm" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-white block mb-1">難度</label>
          <select className="glass-input text-sm" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
            <option value="easy">初階</option>
            <option value="medium">中階</option>
            <option value="hard">高階</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-white block mb-1">題幹</label>
        <textarea className="glass-input resize-none text-sm" rows={2} value={form.stem} onChange={e => set('stem', e.target.value)} placeholder="輸入題目..." />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(['optA', 'optB', 'optC', 'optD'] as const).map((k, i) => (
          <div key={k}>
            <label className="text-xs text-white block mb-1">選項 {String.fromCharCode(65 + i)}</label>
            <input className="glass-input text-sm" value={form[k]} onChange={e => set(k, e.target.value)} />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs text-white block mb-1">正確答案</label>
        <div className="flex gap-2">
          {['A', 'B', 'C', 'D'].map(k => (
            <button key={k} onClick={() => set('answer', k)}
              className={`flex-1 option-btn text-sm py-2 text-center ${form.answer === k ? 'option-selected' : ''}`}>{k}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-white block mb-1">詳細解析</label>
        <textarea className="glass-input resize-none text-sm" rows={2} value={form.explanation} onChange={e => set('explanation', e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-white block mb-1">核心考點</label>
        <input className="glass-input text-sm" value={form.keyPoint} onChange={e => set('keyPoint', e.target.value)} />
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-glass flex-1 justify-center">取消</button>
        <button className="btn-primary flex-1 justify-center gap-2">
          <Save size={14} /> 儲存題目
        </button>
      </div>
      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>MVP 版本：儲存至本機（連接 Supabase 後可永久保存）</p>
    </div>
  )
}
