'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import LandingPage from './landing/page'

export default function HomePage() {
  const { user } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  if (user) return null
  return <LandingPage />
}
