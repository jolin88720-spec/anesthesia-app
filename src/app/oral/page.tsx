'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, User, Mic2, RotateCcw, Star } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'
import { ORAL_QUESTIONS, ORAL_TOPICS } from '@/data/questions'
import type { OralSession, OralMessage, OralScore } from '@/types'

// Mock AI responses for oral exam
function mockAiOralResponse(userMsg: string, questionTopic: string, turnCount: number): string {
  if (turnCount === 1) return `好的，你提到了幾個重點。讓我追問一下——如果在這個情境中，病人的生命徵象突然惡化，你的處置優先順序會是什麼？`
  if (turnCount === 2) return `我了解你的思路。那麼從病人安全角度來看，在你做出決策之前，最重要的評估步驟是哪一個？為什麼？`
  if (turnCount >= 3) return `謝謝你的回答。我們已經討論了這個主題的核心要點。[ORAL_COMPLETE]`
  return `請繼續說明你的處置計畫。`
}

function mockGenerateScore(topic: string): OralScore {
  return {
    professionalism: 8, clinicalLogic: 7, completeness: 7,
    clarity: 8, patientSafety: 9, overall: 78,
    strengths: ['具備基本臨床判斷邏輯', '病人安全意識良好', '回答條理清楚'],
    weaknesses: ['部分藥物劑量細節不夠精確', '處置優先順序需再加強', '建議補充更多臨床依據'],
    modelAnswer: ORAL_QUESTIONS.find(q => q.topic === topic)?.modelAnswer ?? '請參考相關教材與口試準備資料。',
    reviewTopics: [topic, '病人安全評估', '臨床判斷優先順序'],
  }
}

export default function OralPage() {
  const router = useRouter()
  const { user } = useAppStore()
  const [phase, setPhase] = useState<'setup' | 'chatting' | 'scored'>('setup')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedMode, setSelectedMode] = useState<'basic' | 'scenario' | 'pressure'>('basic')
  const [messages, setMessages] = useState<OralMessage[]>([])
  const [input, setInput] = useState('')
  const [turnCount, setTurnCount] = useState(0)
  const [score, setScore] = useState<OralScore | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!user) router.replace('/') }, [user, router])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  if (!user) return null

  const startOral = () => {
    const oralQ = ORAL_QUESTIONS.find(q => q.topic.includes(selectedTopic.split('口試')[0])) ?? ORAL_QUESTIONS[0]
    const firstMsg: OralMessage = {
      id: '1', role: 'ai',
      content: `好，我們開始${['基礎', '情境', '高壓'][['basic', 'scenario', 'pressure'].indexOf(selectedMode)]}模式的口試訓練。\n\n**${oralQ.scenario}**\n\n${oralQ.mainQuestion}`,
      createdAt: new Date().toISOString()
    }
    setMessages([firstMsg])
    setTurnCount(0)
    setPhase('chatting')
  }

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return
    const userMsg: OralMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), createdAt: new Date().toISOString() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 1200))
    const newTurn = turnCount + 1
    setTurnCount(newTurn)
    const aiReply = mockAiOralResponse(input, selectedTopic, newTurn)
    const isComplete = aiReply.includes('[ORAL_COMPLETE]')
    const cleanReply = aiReply.replace('[ORAL_COMPLETE]', '').trim()

    const aiMsg: OralMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: cleanReply + (isComplete ? '\n\n---\n✅ **口試訓練結束，正在生成評分報告...**' : ''), createdAt: new Date().toISOString() }
    setMessages(m => [...m, aiMsg])
    setIsTyping(false)

    if (isComplete) {
      await new Promise(r => setTimeout(r, 1500))
      setScore(mockGenerateScore(selectedTopic))
      setPhase('scored')
    }
  }

  // ---- SETUP ----
  if (phase === 'setup') return (
    <AppShell>
      <div className="animate-slide-in-up max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI 模擬口試</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>AI 扮演資深麻醉護理師考官，訓練臨床思考與應答</p>
        </div>

        <div className="glass-card-static p-5 space-y-4">
          <div>
            <p className="text-sm font-medium text-white mb-3">選擇口試主題</p>
            <div className="grid grid-cols-2 gap-2">
              {ORAL_TOPICS.map(t => (
                <button key={t.id} onClick={() => setSelectedTopic(t.name)}
                  className={`option-btn text-left p-3 ${selectedTopic === t.name ? 'option-selected' : ''}`}>
                  <div className="text-lg mb-1">{t.icon}</div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-2">口試模式</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'basic', label: '基礎', desc: '引導充分', color: '#00e878' },
                { id: 'scenario', label: '情境', desc: '病例式', color: '#00d4ff' },
                { id: 'pressure', label: '高壓', desc: '嚴格追問', color: '#ff4466' },
              ].map(({ id, label, desc, color }) => (
                <button key={id} onClick={() => setSelectedMode(id as typeof selectedMode)}
                  className={`option-btn text-center py-3 ${selectedMode === id ? 'option-selected' : ''}`}>
                  <div className="text-sm font-medium" style={selectedMode === id ? { color } : {}}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={startOral} disabled={!selectedTopic} className="btn-primary w-full justify-center disabled:opacity-40 text-base py-4">
          <Mic2 size={18} /> 開始口試訓練
        </button>
      </div>
    </AppShell>
  )

  // ---- SCORED ----
  if (phase === 'scored' && score) return (
    <AppShell>
      <div className="animate-slide-in-up max-w-2xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-white">口試評分報告</h1>

        <div className="glass-card-static p-6 text-center">
          <div className="text-5xl font-bold mb-2" style={{ color: score.overall >= 80 ? '#00e878' : score.overall >= 65 ? '#ffb800' : '#ff4466' }}>
            {score.overall}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>整體評分（滿分100）</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '專業正確性', val: score.professionalism },
            { label: '臨床邏輯', val: score.clinicalLogic },
            { label: '回答完整度', val: score.completeness },
            { label: '表達清晰度', val: score.clarity },
            { label: '病人安全意識', val: score.patientSafety },
          ].map(({ label, val }) => (
            <div key={label} className="glass-card-static p-3 text-center">
              <div className="text-xl font-bold" style={{ color: val >= 8 ? '#00e878' : val >= 6 ? '#ffb800' : '#ff4466' }}>{val}/10</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card-static p-5 space-y-3">
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#00e878' }}>✅ 表現優點</h3>
            <ul className="space-y-1">
              {score.strengths.map(s => <li key={s} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}><span>•</span>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#ffb800' }}>⚠️ 需要加強</h3>
            <ul className="space-y-1">
              {score.weaknesses.map(w => <li key={w} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}><span>•</span>{w}</li>)}
            </ul>
          </div>
        </div>

        <div className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} style={{ color: '#ffb800' }} />
            <h3 className="text-sm font-semibold text-white">示範高分答案</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{score.modelAnswer}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('setup'); setMessages([]); setScore(null) }} className="btn-glass flex-1 justify-center">
            <RotateCcw size={16} /> 再練一次
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-primary flex-1 justify-center">回儀表板</button>
        </div>
      </div>
    </AppShell>
  )

  // ---- CHAT ----
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ffb800,#ff7796)' }}>
            <Mic2 size={16} style={{ color: 'white' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">資深麻醉護理師考官</p>
            <p className="text-xs" style={{ color: '#00e878' }}>● 口試進行中 · {selectedTopic}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-xs"
                  style={{ background: 'linear-gradient(135deg,#ffb800,#ff7796)' }}>🩺</div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}
                style={{ whiteSpace: 'pre-line' }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)', color: 'white' }}>
                  {user.name[0]}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg,#ffb800,#ff7796)' }}>🩺</div>
              <div className="chat-bubble-ai flex items-center gap-1.5">
                {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#00d4ff', animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <input id="oral-input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="glass-input flex-1" placeholder="輸入你的回答..." />
          <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="btn-primary px-4 disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
      </div>
    </AppShell>
  )
}
