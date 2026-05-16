'use client'
import { useRef, useEffect, ReactNode } from 'react'

interface Props {
  children: ReactNode
  color?: string
  count?: number
}

export default function ClickSpark({ children, color, count = 10 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function spark(e: React.MouseEvent) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x = e.clientX
    const y = e.clientY
    
    // Resolve color from CSS variable if not provided
    const sparkColor = color || (typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--c-ink').trim() : '#1a1a1a')

    const sparks = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
      len: 14 + Math.random() * 14,
    }))

    const t0 = performance.now()
    const DUR = 420

    function frame(now: number) {
      const p = Math.min((now - t0) / DUR, 1)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      const ease = 1 - Math.pow(1 - p, 3)
      sparks.forEach(s => {
        const r0 = ease * 18
        const r1 = r0 + s.len * (1 - p * 0.5)
        ctx!.beginPath()
        ctx!.moveTo(x + Math.cos(s.angle) * r0, y + Math.sin(s.angle) * r0)
        ctx!.lineTo(x + Math.cos(s.angle) * r1, y + Math.sin(s.angle) * r1)
        ctx!.strokeStyle = sparkColor
        ctx!.globalAlpha = 1 - p
        ctx!.lineWidth = 1.5
        ctx!.stroke()
      })
      ctx!.globalAlpha = 1
      if (p < 1) requestAnimationFrame(frame)
      else ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
    }
    requestAnimationFrame(frame)
  }

  return (
    <div onClick={spark} style={{ display: 'contents' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}
      />
      {children}
    </div>
  )
}
