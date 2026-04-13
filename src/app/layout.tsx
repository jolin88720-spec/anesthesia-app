import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClickSoundProvider from '@/components/ClickSoundProvider'

export const metadata: Metadata = {
  title: '麻醉護理師 AI 訓練系統',
  description: '麻醉專科護理師考試 AI 智能訓練平台 — 題庫練習、模擬考試、AI 模擬口試、RAG 知識問答',
  keywords: '麻醉護理師,考試,題庫,模擬考,口試,AI學習',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <div className="animated-bg" aria-hidden="true" />
        <ClickSoundProvider>
          {children}
        </ClickSoundProvider>
      </body>
    </html>
  )
}
