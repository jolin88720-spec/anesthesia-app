'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question, WrongNote, ExamSession, OralSession, ChatMessage, StudyStats, User } from '@/types'
import { SAMPLE_QUESTIONS } from '@/data/questions'

interface AppState {
  // Auth
  user: User | null
  setUser: (u: User | null) => void

  // Questions
  questions: Question[]

  // Wrong notes
  wrongNotes: WrongNote[]
  addWrongNote: (q: Question, userAnswer: string) => void
  markUnderstood: (questionId: string) => void
  removeWrongNote: (questionId: string) => void

  // Bookmarks
  bookmarks: string[]
  toggleBookmark: (questionId: string) => void

  // Stats
  stats: StudyStats
  recordAnswer: (questionId: string, isCorrect: boolean, category: string) => void

  // Current exam
  currentExam: ExamSession | null
  setCurrentExam: (exam: ExamSession | null) => void

  // Current oral session
  currentOral: OralSession | null
  setCurrentOral: (session: OralSession | null) => void

  // Chat history
  chatHistory: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void
}

const defaultStats: StudyStats = {
  totalAnswered: 0, totalCorrect: 0, accuracy: 0,
  streakDays: 1, weeklyCount: [0, 0, 0, 0, 0, 0, 0],
  categoryAccuracy: {}, weakCategories: [],
  wrongNotesCount: 0,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      questions: SAMPLE_QUESTIONS,
      wrongNotes: [],
      addWrongNote: (question, userAnswer) => {
        const existing = get().wrongNotes.find(w => w.questionId === question.id)
        if (existing) {
          set(s => ({
            wrongNotes: s.wrongNotes.map(w =>
              w.questionId === question.id
                ? { ...w, wrongCount: w.wrongCount + 1, lastWrongAt: new Date().toISOString(), userAnswer, isUnderstood: false }
                : w
            )
          }))
        } else {
          set(s => ({
            wrongNotes: [...s.wrongNotes, {
              questionId: question.id, question, wrongCount: 1,
              lastWrongAt: new Date().toISOString(), isUnderstood: false, userAnswer
            }],
            stats: { ...s.stats, wrongNotesCount: s.stats.wrongNotesCount + 1 }
          }))
        }
      },
      markUnderstood: (questionId) => set(s => ({
        wrongNotes: s.wrongNotes.map(w => w.questionId === questionId ? { ...w, isUnderstood: true } : w)
      })),
      removeWrongNote: (questionId) => set(s => ({
        wrongNotes: s.wrongNotes.filter(w => w.questionId !== questionId),
        stats: { ...s.stats, wrongNotesCount: Math.max(0, s.stats.wrongNotesCount - 1) }
      })),
      bookmarks: [],
      toggleBookmark: (questionId) => set(s => ({
        bookmarks: s.bookmarks.includes(questionId)
          ? s.bookmarks.filter(id => id !== questionId)
          : [...s.bookmarks, questionId]
      })),
      stats: defaultStats,
      recordAnswer: (questionId, isCorrect, category) => set(s => {
        const stats = { ...s.stats }
        stats.totalAnswered += 1
        if (isCorrect) stats.totalCorrect += 1
        stats.accuracy = Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
        const catAcc = { ...stats.categoryAccuracy }
        if (!catAcc[category]) catAcc[category] = isCorrect ? 100 : 0
        else catAcc[category] = Math.round((catAcc[category] + (isCorrect ? 100 : 0)) / 2)
        stats.categoryAccuracy = catAcc
        const weak = Object.entries(catAcc).filter(([, v]) => v < 60).map(([k]) => k)
        stats.weakCategories = weak
        const weekly = [...stats.weeklyCount]
        weekly[6] = (weekly[6] || 0) + 1
        stats.weeklyCount = weekly
        return { stats }
      }),
      currentExam: null,
      setCurrentExam: (exam) => set({ currentExam: exam }),
      currentOral: null,
      setCurrentOral: (session) => set({ currentOral: session }),
      chatHistory: [],
      addChatMessage: (msg) => set(s => ({ chatHistory: [...s.chatHistory, msg] })),
      clearChat: () => set({ chatHistory: [] }),
    }),
    { name: 'anesthesia-app-store' }
  )
)
