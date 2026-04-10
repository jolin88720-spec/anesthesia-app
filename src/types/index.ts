// =============================================
// TYPES - 系統全域型別定義
// =============================================

export type Difficulty = 'easy' | 'medium' | 'hard'
export type ExamType = '通論' | '進階'
export type QuestionType = 'single' | 'multiple' | 'truefalse'

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E'
  text: string
}

export interface Question {
  id: string
  category: string
  subcategory: string
  examType: ExamType
  examYear?: number
  difficulty: Difficulty
  type: QuestionType
  stem: string
  options: QuestionOption[]
  correctAnswer: string // e.g., 'A' or 'AB' for multiple
  explanation: string
  keyPoint: string
  commonTrap?: string
  source?: string
  tags: string[]
  isActive: boolean
}

export interface OralQuestion {
  id: string
  category: string
  topic: string
  scenario: string
  mainQuestion: string
  followUp1?: string
  followUp2?: string
  scoringPoints: string[]
  modelAnswer: string
  keywords: string[]
  source: string
}

export interface UserAnswer {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timeSpentSec: number
  answeredAt: string
}

export interface ExamConfig {
  totalQuestions: number
  timeLimitMinutes: number
  examType?: ExamType | 'mixed'
  categories?: string[]
  difficulty?: Difficulty | 'mixed'
  years?: number[]
}

export interface ExamSession {
  id: string
  config: ExamConfig
  questions: Question[]
  userAnswers: Record<string, string>
  startedAt: string
  submittedAt?: string
  status: 'in_progress' | 'submitted'
}

export interface ExamResult {
  examId: string
  totalQuestions: number
  correctCount: number
  wrongCount: number
  score: number // 0-100
  categoryBreakdown: Record<string, { correct: number; total: number }>
  wrongQuestions: { question: Question; userAnswer: string }[]
  aiSuggestion: string
  completedAt: string
}

export interface OralSession {
  id: string
  topic: string
  mode: 'basic' | 'scenario' | 'pressure'
  messages: OralMessage[]
  status: 'in_progress' | 'completed'
  startedAt: string
  endedAt?: string
  score?: OralScore
}

export interface OralMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  createdAt: string
}

export interface OralScore {
  professionalism: number // 0-10
  clinicalLogic: number
  completeness: number
  clarity: number
  patientSafety: number
  overall: number
  strengths: string[]
  weaknesses: string[]
  modelAnswer: string
  reviewTopics: string[]
}

export interface WrongNote {
  questionId: string
  question: Question
  wrongCount: number
  lastWrongAt: string
  isUnderstood: boolean
  userAnswer: string
}

export interface StudyStats {
  totalAnswered: number
  totalCorrect: number
  accuracy: number // 0-100
  streakDays: number
  weeklyCount: number[]  // 7 days
  categoryAccuracy: Record<string, number>
  weakCategories: string[]
  recentExamScore?: number
  wrongNotesCount: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  targetMode: 'review' | 'sprint' | 'oral'
  createdAt: string
}
