'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'

export default function HomePage() {
  const { user, setUser } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setUser({
        id: 'guest',
        name: '訓練學員',
        email: 'guest@anesthesia.pro',
        targetMode: 'review',
        createdAt: new Date().toISOString()
      })
    }
    router.replace('/dashboard')
  }, [user, router, setUser])

  return null
}
