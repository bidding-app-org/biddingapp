import { useEffect, useMemo, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reduced = useMemo(() => (typeof window !== 'undefined' ? prefersReducedMotion() : true), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (reduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let last = performance.now()
    let particles: Particle[] = []

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const targetCount = Math.floor((w * h) / 22000)
      const count = Math.max(28, Math.min(90, targetCount))
      particles = Array.from({ length: count }, () => {
        const speed = 0.12 + Math.random() * 0.35
        const angle = Math.random() * Math.PI * 2
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.2 + Math.random() * 2.4,
          a: 0.18 + Math.random() * 0.35,
        }
      })
    }

    const step = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now

      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      // Soft gradient wash
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, 'rgba(99,102,241,0.16)')
      g.addColorStop(0.5, 'rgba(16,185,129,0.08)')
      g.addColorStop(1, 'rgba(236,72,153,0.10)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // Move + draw
      for (const p of particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt

        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist2 = dx * dx + dy * dy
          const max = 140
          if (dist2 < max * max) {
            const alpha = 0.09 * (1 - Math.sqrt(dist2) / max)
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(step)
    }

    resize()
    raf = requestAnimationFrame(step)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1,
      }}
    />
  )
}
