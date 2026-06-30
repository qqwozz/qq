import { useEffect, useRef, useCallback, useState } from 'react'
import { useLanguage } from './i18n'
import { Stats } from './types'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { MarqueeSection } from './components/MarqueeSection'
import { ExperienceSection } from './components/ExperienceSection'
import { ProjectsSection } from './components/ProjectsSection'
import { StackSection } from './components/StackSection'
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

  const handleScroll = useCallback(() => {
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
    }

    let current = ''
    for (const s of sectionsRef.current) {
      if (scrollTop >= s.offsetTop - 200) {
        current = s.id
      }
    }
    navLinksRef.current.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current)
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
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
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      })
      const raf = (time: number) => {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }).catch(() => {})
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
    const cards = document.querySelectorAll<HTMLElement>('.stat-cell, .feature-cell, .skill-cell, .experience-card, .project-row')
    const cleanup: (() => void)[] = []

    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--gx', `${x}px`)
        card.style.setProperty('--gy', `${y}px`)
      }
      card.addEventListener('mousemove', onMove)
      cleanup.push(() => card.removeEventListener('mousemove', onMove))
    })

    return () => cleanup.forEach((fn) => fn())
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const cards = document.querySelectorAll<HTMLElement>('.stat-cell, .feature-cell, .skill-cell, .experience-card')
    const cleanup: (() => void)[] = []

    cards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-2px)`
      }
      const onLeave = () => { card.style.transform = '' }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      cleanup.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) })
    })

    return () => cleanup.forEach((fn) => fn())
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const links = document.querySelectorAll<HTMLElement>('.contact-link')
    const cleanup: (() => void)[] = []

    links.forEach((link) => {
      const onMove = (e: MouseEvent) => {
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
      const onLeave = () => { link.style.transform = '' }
      link.addEventListener('mousemove', onMove)
      link.addEventListener('mouseleave', onLeave)
      cleanup.push(() => { link.removeEventListener('mousemove', onMove); link.removeEventListener('mouseleave', onLeave) })
    })

    return () => cleanup.forEach((fn) => fn())
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const heroGlow = document.querySelector('.hero-glow') as HTMLElement
    const heroParticles = document.querySelector('.hero-particles') as HTMLElement
    if (!heroGlow || !heroParticles) return

    const onScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight
      if (scrollY > heroHeight) return

      const progress = scrollY / heroHeight
      heroGlow.style.transform = `translate(-50%, calc(-50% + ${progress * 100}px))`
      heroParticles.style.transform = `translateY(${progress * 50}px)`
      heroParticles.style.opacity = String(1 - progress * 0.8)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const progressBars = document.querySelectorAll<HTMLElement>('.section-number-progress')

    const onScroll = () => {
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)))
        if (progressBars[i]) {
          (progressBars[i] as HTMLElement).style.width = `${progress * 100}%`
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
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
            <div className="loading-bar">
              <div className="loading-bar-fill" />
            </div>
          </div>
        </div>
      )}

      <div className="noise-overlay" />
      <div className="progress-bar" ref={progressRef} />

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

      <div className="divider" />

      <AboutSection t={t} stats={stats} />

      <MarqueeSection />

      <ExperienceSection t={t} />

      <div className="divider" />

      <ProjectsSection t={t} />

      <div className="divider" />

      <StackSection t={t} />

      <div className="divider" />

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
