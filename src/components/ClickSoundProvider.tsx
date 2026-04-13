'use client'
import { useEffect, useRef } from 'react'

/**
 * ClickSoundProvider
 * 在 document 層掛一個全域 mousedown 監聽器：
 * 任何 <button> 或 <a> 被按下就播放回饋音，
 * 除非元素（或其祖先）帶有 data-no-sound 屬性。
 */
export default function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const getAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio('/button-click.mp3')
        audioRef.current.volume = 0.6
      }
      return audioRef.current
    }

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // 往上找最近的可互動元素
      const interactive = target.closest('button, a, [role="button"]') as HTMLElement | null
      if (!interactive) return
      // 若元素或任何祖先帶有 data-no-sound，則靜音
      if (interactive.closest('[data-no-sound]')) return

      const audio = getAudio()
      audio.currentTime = 0
      audio.play().catch(() => {})
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return <>{children}</>
}
