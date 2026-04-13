'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, AlertCircle, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import AppShell from '@/components/AppShell'
import type { ChatMessage } from '@/types'

// Simple mock RAG: keyword-based answer from question explanations
function mockRagAnswer(query: string, questions: { stem: string; explanation: string; keyPoint: string; category: string; tags: string[] }[]): { answer: string; sources: string[] } {
  const q = query.toLowerCase()
  const relevant = questions.filter(item =>
    item.tags.some(t => q.includes(t.toLowerCase())) ||
    item.category.toLowerCase().includes(q) ||
    item.stem.toLowerCase().includes(q.slice(0, 8))
  ).slice(0, 2)

  if (relevant.length > 0) {
    const r = relevant[0]
    return {
      answer: `【答案】\n根據知識庫資料，針對您的問題「${query}」：\n\n${r.explanation}\n\n【核心考點】\n${r.keyPoint}\n\n【臨床提醒】\n本回答基於題庫解析資料。如為高風險臨床決策，請以正式教材、考試範圍及機構規範為準。`,
      sources: relevant.map(r => `${r.category} - 知識庫解析`)
    }
  }

  const generalAnswers: Record<string, string> = {
    'propofol': '【Propofol（異丙酚）重點】\n\n**機轉：** GABA-A受體促進劑\n**特點：** 起效快、恢復快、止吐效果\n**副作用：** 注射疼痛、低血壓、無鎮痛效果\n**臨床提醒：** 不可單獨止痛，需合併阿片類藥物',
    '困難插管': '【困難插管評估 LEMON法則】\n\nL - Look（外觀評估）\nE - Evaluate（3-3-2法則）\nM - Mallampati分級\nO - Obstruction（阻塞評估）\nN - Neck mobility（頸部活動度）\n\nMallampati III-IV、甲頦距離<6cm為高風險指標',
    '惡性高熱': '【惡性高熱（MH）】\n\n**觸發：** Succinylcholine、揮發性吸入藥\n**症狀：** ETCO₂↑、體溫↑↑、肌肉僵硬\n**治療：** Dantrolene 2.5 mg/kg IV（首選）\n**注意：** 立即停止所有觸發藥物，換純氧',
    '低血壓': '【術中低血壓處理原則】\n\n1. 評估原因（麻醉過深？出血？過敏？）\n2. 體位調整（頭低腳高）\n3. 輸液補充（視原因）\n4. 升壓藥選擇：\n   - Phenylephrine（純α，不增心率）\n   - Ephedrine（α+β，心率慢時）\n   - Epinephrine（嚴重過敏）',
  }

  for (const [key, answer] of Object.entries(generalAnswers)) {
    if (q.includes(key.toLowerCase())) {
      return { answer, sources: ['麻醉藥理學知識庫', '臨床處置流程卡'] }
    }
  }

  return {
    answer: `感謝您的提問。針對「${query}」，目前知識庫中的相關資料有限。\n\n建議：\n• 查閱麻醉藥理學或生理學教材\n• 參考相關考試講義\n• 向指導老師或資深護理師請教\n\n❗ 如有臨床疑問，請以正式教材及機構規範為準。`,
    sources: []
  }
}

export default function ChatPage() {
  const router = useRouter()
  const { user, chatHistory, addChatMessage, clearChat, questions } = useAppStore()
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!user) router.replace('/') }, [user, router])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory, isThinking])
  if (!user) return null

  const handleSend = async () => {
    if (!input.trim() || isThinking) return
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim(), createdAt: new Date().toISOString() }
    addChatMessage(userMsg)
    setInput('')
    setIsThinking(true)

    await new Promise(r => setTimeout(r, 1500))
    const qData = questions.map(q => ({ stem: q.stem, explanation: q.explanation, keyPoint: q.keyPoint, category: q.category, tags: q.tags }))
    const { answer, sources } = mockRagAnswer(userMsg.content, qData)
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: answer, sources, createdAt: new Date().toISOString() }
    addChatMessage(aiMsg)
    setIsThinking(false)
  }

  const QUICK_QUESTIONS = ['Propofol有哪些副作用？', '惡性高熱如何處理？', '術中低血壓的處置原則？', '困難插管的評估方法？']

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)' }}>
                🧠
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI 教學問答</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>基於麻醉知識庫的精準回答</p>
              </div>
            </div>
            {chatHistory.length > 0 && (
              <button onClick={clearChat} className="btn-glass text-xs py-1.5 px-3 gap-1.5">
                <Trash2 size={12} /> 清除對話
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {chatHistory.length === 0 && (
              <div className="space-y-4">
                <div className="chat-bubble-ai max-w-lg">
                  👋 你好！我是你的麻醉護理師 AI 教學助手。<br /><br />
                  你可以問我任何麻醉相關問題，例如：藥物機轉、考試概念、口試重點、臨床處置流程等。<br /><br />
                  我的回答會優先依據知識庫內容，若依據不足會如實說明。
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>快速提問：</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map(q => (
                      <button key={q} onClick={() => setInput(q)} className="badge cursor-pointer hover:opacity-80 transition-opacity">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {chatHistory.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-sm"
                    style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)' }}>🧠</div>
                )}
                <div className="flex-1 max-w-[85%]">
                  <div className={msg.role === 'assistant' ? 'chat-bubble-ai' : 'chat-bubble-user'}
                    style={{ whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <AlertCircle size={11} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>知識依據：</span>
                      {msg.sources.map(s => <span key={s} className="badge text-xs">{s}</span>)}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)', color: 'white' }}>
                    {user.name[0]}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#00d4ff,#6366f1)' }}>🧠</div>
                <div className="chat-bubble-ai flex items-center gap-1.5">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>正在搜尋知識庫</span>
                  {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#00d4ff', animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 pt-4 border-t flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <input id="chat-input" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="glass-input flex-1" placeholder="輸入麻醉相關問題..." />
            <button onClick={handleSend} disabled={!input.trim() || isThinking} className="btn-primary px-4 disabled:opacity-40">
              <Send size={16} />
            </button>
          </div>
        </div>
    </AppShell>
  )
}
