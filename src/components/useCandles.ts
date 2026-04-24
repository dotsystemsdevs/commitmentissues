'use client'

import { useEffect, useState } from 'react'

const LS_KEY = 'ci:lit-candles'

function readLocal(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown
    if (Array.isArray(arr)) return new Set(arr.filter((v): v is string => typeof v === 'string'))
  } catch { /* ignore */ }
  return new Set()
}

function writeLocal(set: Set<string>) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(LS_KEY, JSON.stringify([...set])) } catch { /* ignore */ }
}

const subscribers = new Set<() => void>()
const state: { totals: Record<string, number>; local: Set<string>; hydrated: boolean } = {
  totals: {}, local: new Set(), hydrated: false,
}
function notify() { subscribers.forEach(fn => fn()) }

async function hydrate() {
  if (state.hydrated) return
  state.hydrated = true
  state.local = readLocal()
  try {
    const res = await fetch('/api/candle')
    if (res.ok) {
      const data = await res.json() as { totals?: Record<string, number> }
      state.totals = data.totals ?? {}
      notify()
    }
  } catch { /* ignore */ }
}

// Returns the new "isPlaced" state for the user on this grave.
export async function toggleFlower(fullName: string): Promise<boolean> {
  const isPlaced = !state.local.has(fullName)
  if (isPlaced) {
    state.local.add(fullName)
    state.totals[fullName] = (state.totals[fullName] ?? 0) + 1
  } else {
    state.local.delete(fullName)
    state.totals[fullName] = Math.max(0, (state.totals[fullName] ?? 0) - 1)
  }
  writeLocal(state.local)
  notify()

  try {
    const res = await fetch('/api/candle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, action: isPlaced ? 'add' : 'remove' }),
    })
    if (res.ok) {
      const data = await res.json() as { count?: number }
      if (typeof data.count === 'number') {
        state.totals[fullName] = data.count
        notify()
      }
    }
  } catch { /* keep optimistic value */ }
  return isPlaced
}

export function useCandles() {
  const [, force] = useState(0)
  useEffect(() => {
    hydrate()
    const fn = () => force(n => n + 1)
    subscribers.add(fn)
    return () => { subscribers.delete(fn) }
  }, [])
  return {
    totals: state.totals,
    local: state.local,
    toggle: toggleFlower,
  }
}
