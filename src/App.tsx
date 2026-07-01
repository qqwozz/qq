import { useEffect, useRef, useCallback, useState } from 'react'
import { useLanguage } from './i18n'
import { Stats } from './types'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { MarqueeSection } from './components/MarqueeSection'

import { ProjectsSection } from './components/ProjectsSection'
import { ExperienceSection } from './components/ExperienceSection'
import { StackSection } from './components/StackSection'
import { TerminalSection } from './components/TerminalSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  const { t } = useLanguage()
  const navbarRef = useRef<HTMLElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const backToTopRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const [loading, setLoading] = useState(true)
  const [loadingFade, setLoadingFade] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState<Stats>({ repos: 0, leetcode: 0, followers: 0, languages: 6 })
  const [ready, setReady] = useState(false)

  const sectionsRef = useRef<HTMLElement[]>([])
  const navLinksRef = useRef<HTMLElement[]>([])
  const heroGlowRef = useRef<HTMLElement | null>(null)
  const heroParticlesRef = useRef<HTMLElement | null>(null)
  const progressBarsRef = useRef<HTMLElement[]>([])

  const rafId = useRef(0)
  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? scrollTop / docHeight : 0

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress})`
    }

    if (navbarRef.current) {
      navbarRef.current.classList.toggle('scrolled', scrollTop > 50)
    }

    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.classList.toggle('hidden', scrollTop > 100)
    }

    if (backToTopRef.current) {
      backToTopRef.current.classList.toggle('visible', scrollTop > 600)
    }

    if (!sectionsRef.current.length) {
      sectionsRef.current = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
      navLinksRef.current = Array.from(document.querySelectorAll<HTMLElement>('.nav-link'))
      progressBarsRef.current = Array.from(document.querySelectorAll<HTMLElement>('.section-number-progress'))
    }

    let current = ''
    const heroHeight = window.innerHeight
    for (const s of sectionsRef.current) {
      if (scrollTop >= s.offsetTop - 200) {
        current = s.id
      }
    }
    navLinksRef.current.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current)
    })

    for (let i = 0; i < sectionsRef.current.length; i++) {
      const rect = sectionsRef.current[i].getBoundingClientRect()
      const p = Math.max(0, Math.min(1, (heroHeight - rect.top) / (heroHeight + rect.height)))
      if (progressBarsRef.current[i]) {
        progressBarsRef.current[i].style.width = `${p * 100}%`
      }
    }

    if (heroGlowRef.current && scrollTop <= heroHeight) {
      const p = scrollTop / heroHeight
      heroGlowRef.current.style.transform = `translate(-50%, calc(-50% + ${p * 100}px))`
    }
    if (heroParticlesRef.current && scrollTop <= heroHeight) {
      const p = scrollTop / heroHeight
      heroParticlesRef.current.style.transform = `translateY(${p * 50}px)`
      heroParticlesRef.current.style.opacity = String(1 - p * 0.8)
    }
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    if (!mobileMenuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const t1 = setTimeout(() => setLoadingFade(true), 1200)
    const t2 = setTimeout(() => { setLoading(false); setReady(true) }, 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let lenis: import('lenis').default | null = null
    let rafId: number

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      })
      const raf = (time: number) => {
        lenis!.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }).catch(() => {})

    return () => {
      cancelAnimationFrame(rafId)
      lenis?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!ready || !heroTitleRef.current) return
    const el = heroTitleRef.current
    const target = 'Дима Киселев'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
    let iteration = 0
    const totalIterations = target.length * 3

    const interval = setInterval(() => {
      el.textContent = target
        .split('')
        .map((ch, i) => {
          if (i < iteration / 3) return ch
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      iteration++
      if (iteration >= totalIterations) {
        el.textContent = target
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (!ready || !heroSubRef.current) return
    const el = heroSubRef.current
    const target = t('hero.subtitle')
    let i = 0
    el.textContent = ''

    const timeout = setTimeout(() => {
      const type = () => {
        if (i <= target.length) {
          el.textContent = target.slice(0, i) + (i < target.length ? '|' : '')
          i++
          setTimeout(type, 70)
        }
      }
      type()
    }, 1200)

    return () => clearTimeout(timeout)
  }, [ready, t])

  useEffect(() => {
    if (!ready) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll<HTMLElement>('.anim').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ready])

  useEffect(() => {
    if (!ready || (stats.repos === 0 && stats.leetcode === 0 && stats.followers === 0)) return
    document.querySelectorAll<HTMLElement>('[data-target]').forEach((el) => {
      if (el.dataset.animated) return
      const target = parseInt(el.dataset.target || '0')
      if (isNaN(target) || target === 0) return
      el.dataset.animated = '1'

      let current = 0
      let velocity = 0
      const stiffness = 0.08
      const damping = 0.7

      const tick = () => {
        const force = (target - current) * stiffness
        velocity = (velocity + force) * damping
        current += velocity
        el.textContent = String(Math.round(current))
        if (Math.abs(target - current) > 0.5 || Math.abs(velocity) > 0.1) {
          requestAnimationFrame(tick)
        } else {
          el.textContent = String(target)
        }
      }
      requestAnimationFrame(tick)
    })
  }, [ready, stats])

  useEffect(() => {
    if (!ready) return
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const selectors = '.stat-cell, .feature-cell, .skill-cell, .experience-card-new'
    const cleanup: (() => void)[] = []

    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(selectors)
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--gx', `${x}px`)
      card.style.setProperty('--gy', `${y}px`)
      const rx = (x / rect.width - 0.5) * 8
      const ry = (y / rect.height - 0.5) * -8
      card.style.transform = `perspective(600px) rotateY(${rx}deg) rotateX(${ry}deg) translateY(-2px)`
    }

    const onLeave = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(selectors)
      if (card) card.style.transform = ''
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave, true)
    cleanup.push(
      () => document.removeEventListener('mousemove', onMove),
      () => document.removeEventListener('mouseleave', onLeave, true)
    )

    return () => cleanup.forEach((fn) => fn())
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const cleanup: (() => void)[] = []

    const onMove = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLElement>('.contact-link')
      if (!link) return
      const rect = link.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 200
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 12
        link.style.transform = `translate(${dx * force / maxDist}px, ${dy * force / maxDist}px)`
      }
    }
    const onLeave = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLElement>('.contact-link')
      if (link) link.style.transform = ''
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave, true)
    cleanup.push(
      () => document.removeEventListener('mousemove', onMove),
      () => document.removeEventListener('mouseleave', onLeave, true)
    )

    return () => cleanup.forEach((fn) => fn())
  }, [ready])

  useEffect(() => {
    if (!ready) return
    heroGlowRef.current = document.querySelector('.hero-glow')
    heroParticlesRef.current = document.querySelector('.hero-particles')
  }, [ready])

  useEffect(() => {
    if (!ready) return
    progressBarsRef.current = Array.from(document.querySelectorAll<HTMLElement>('.section-number-progress'))
  }, [ready])

  useEffect(() => {
    fetch('https://api.github.com/users/qqwozz')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setStats((s) => ({
            ...s,
            repos: data.public_repos ?? s.repos,
            followers: data.followers ?? s.followers,
          }))
        }
      })
      .catch(() => {})

    fetch(`${import.meta.env.BASE_URL}leetcode.json`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.solved) {
          setStats((s) => ({ ...s, leetcode: data.solved }))
        }
      })
      .catch(() => {})

    const tryLiveAPIs = async () => {
      const apis = [
        'https://leetcode-stats-api.herokuapp.com/oonixxxxx',
        'https://alfa-leetcode-api.onrender.com/oonixxxxx/solved',
        'https://leetcode-api-faisalshohag.vercel.app/oonixxxxx',
      ]
      for (const url of apis) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
          const data = await res.json()
          const solved = data.totalSolved || data.solved || 0
          if (solved > 0) {
            setStats((s) => ({ ...s, leetcode: solved }))
            return
          }
        } catch { continue }
      }
    }
    tryLiveAPIs()
  }, [])

  return (
    <>
      {loading && (
        <div className={`loading-screen${loadingFade ? ' fade-out' : ''}`}>
          <div className="loading-brand">
            <div className="loading-logo">qqwozz</div>
            <div className="loading-bar" aria-hidden="true">
              <div className="loading-bar-fill" />
            </div>
          </div>
        </div>
      )}

      <div className="noise-overlay" aria-hidden="true" />
      <div className="progress-bar" ref={progressRef} aria-hidden="true" />

      <Navbar
        t={t}
        navbarRef={navbarRef}
        mobileMenuRef={mobileMenuRef}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <ThemeToggle />

      <HeroSection
        heroTitleRef={heroTitleRef}
        heroSubRef={heroSubRef}
        scrollIndicatorRef={scrollIndicatorRef}
      />

      <div className="divider" aria-hidden="true" />

      <AboutSection t={t} stats={stats} />

      <MarqueeSection />

      <ExperienceSection t={t} />

      <div className="divider" aria-hidden="true" />

      <ProjectsSection t={t} />

      <div className="divider" aria-hidden="true" />

      <StackSection t={t} />

      <div className="divider" aria-hidden="true" />

      <TerminalSection t={t} />

      <div className="divider" aria-hidden="true" />

      <ContactSection t={t} />

      <Footer t={t} />

      <button
        className="back-to-top"
        ref={backToTopRef}
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label={t('aria.top')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
    </>
  )
}

export default App
