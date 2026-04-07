'use client'

import { useState, useRef } from 'react'
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
  const abortRef = useRef<AbortController | null>(null)

  async function analyze(inputUrl: string) {
    if (!inputUrl.trim()) return

    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setCertificate(null)

    try {
      const res = await fetch(`/api/repo?url=${encodeURIComponent(inputUrl.trim())}`, { signal: controller.signal })
      const data = await res.json()
      if (!res.ok) {
        setError({ message: data.error, retryAfter: data.retryAfter })
      } else {
        setCertificate(data)
        // Keep current certificate restorable after refresh/navigation.
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search)
          params.set('repo', data.repoData.fullName)
          const next = `${window.location.pathname}?${params.toString()}`
          window.history.replaceState(null, '', next)
        }
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
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setError({ message: 'Network error. Check your connection.' })
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  function reset() {
    setCertificate(null)
    setError(null)
    setUrl('')
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      params.delete('repo')
      const next = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
      window.history.replaceState(null, '', next)
    }
  }

  return { url, setUrl, certificate, error, loading, analyze, reset }
}
