import { Ref, useRef, useEffect } from 'react'

interface HeroProps {
  heroTitleRef: Ref<HTMLHeadingElement>
  heroSubRef: Ref<HTMLParagraphElement>
  scrollIndicatorRef: Ref<HTMLDivElement>
}

interface Drop {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

export function HeroSection({ heroTitleRef, heroSubRef, scrollIndicatorRef }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let w = 0
    let h = 0
    let drops: Drop[] = []
    let rafId = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    const createDrop = (): Drop => ({
      x: Math.random() * w * 1.5 - w * 0.25,
      y: -20 - Math.random() * h,
      speed: 0.3 + Math.random() * 0.5,
      length: 8 + Math.random() * 12,
      opacity: 0.1 + Math.random() * 0.2,
    })

    const init = () => {
      resize()
      drops = Array.from({ length: 25 }, createDrop)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const drop of drops) {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x + drop.length * 0.3, drop.y + drop.length)
        ctx.strokeStyle = `rgba(255, 255, 255, ${drop.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()

        drop.x += drop.speed * 0.5
        drop.y += drop.speed * 2

        if (drop.y > h + 20) {
          Object.assign(drop, createDrop())
          drop.y = -20
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero-rain" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-particles" aria-hidden="true">
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
        <div className="hero-particle" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title" ref={heroTitleRef}>Дима Киселев</h1>
        <p className="hero-subtitle" ref={heroSubRef}></p>
      </div>
      <div className="scroll-indicator" ref={scrollIndicatorRef}>
        <div className="scroll-line" aria-hidden="true" />
      </div>
    </section>
  )
}
