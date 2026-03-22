'use client'

import { useState } from 'react'
import { DeathCertificate } from '@/lib/types'

export interface AnalysisError {
  message: string
  retryAfter?: number
}

export function useRepoAnalysis() {
  const [url, setUrl] = useState('')
  const [certificate, setCertificate] = useState<DeathCertificate | null>(null)
  const [error, setError] = useState<AnalysisError | null>(null)
  const [loading, setLoading] = useState(false)

  async function analyze(inputUrl: string) {
    if (!inputUrl.trim()) return
    setLoading(true)
    setError(null)
    setCertificate(null)

    try {
      const res = await fetch(`/api/repo?url=${encodeURIComponent(inputUrl.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setError({ message: data.error, retryAfter: data.retryAfter })
      } else {
        setCertificate(data)
        fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ counter: 'buried' }) }).catch(() => {})
        // Save to localStorage for "Recently Buried"
        try {
          const entry = {
            fullName: data.repoData.fullName,
            cause: data.causeOfDeath,
            score: data.deathIndex,
            analyzedAt: new Date().toISOString(),
          }
          const stored = JSON.parse(localStorage.getItem('ci_recent') ?? '[]')
          const filtered = stored.filter((e: { fullName: string }) => e.fullName !== entry.fullName)
          filtered.unshift(entry)
          localStorage.setItem('ci_recent', JSON.stringify(filtered.slice(0, 20)))
        } catch { /* localStorage unavailable */ }
      }
    } catch {
      setError({ message: 'Network error. Check your connection.' })
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setCertificate(null)
    setError(null)
    setUrl('')
  }

  return { url, setUrl, certificate, error, loading, analyze, reset }
}
