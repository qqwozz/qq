import { useEffect, useRef, useCallback, useState } from 'react'
import Lenis from 'lenis'
import MacBookScene from './components/MacBookScene'

function App() {
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
  const [stats, setStats] = useState({ repos: 0, leetcode: 0, followers: 0, languages: 6 })
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
      link.style.color = link.getAttribute('href') === '#' + current ? '#fff' : ''
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
    const t1 = setTimeout(() => setLoadingFade(true), 600)
    const t2 = setTimeout(() => { setLoading(false); setReady(true) }, 1000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.0, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  // Text scramble on hero title
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

  // Typing effect on subtitle
  useEffect(() => {
    if (!ready || !heroSubRef.current) return
    const el = heroSubRef.current
    const target = 'back-end developer'
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
  }, [ready])

  // IntersectionObserver for reveals
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

  // Counter spring animation
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

  // Hover glow on cards
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

  // Magnetic cards — 3D tilt toward cursor
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

  // Magnetic contact links — attract toward cursor
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

  // Laptop parallax
  useEffect(() => {
    if (!ready) return
    const el = document.querySelector<HTMLElement>('.macbook-scene')
    if (!el) return

    let current = { ty: -30, scale: 1, opacity: 1, rotX: 0, rotY: 0, blur: 0 }
    let target = { ty: -30, scale: 1, opacity: 1, rotX: 0, rotY: 0, blur: 0 }
    let scrollVel = 0
    let lastScroll = 0
    let lastTime = performance.now()
    let raf = 0

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      const t = 0.035
      current.ty = lerp(current.ty, target.ty, t)
      current.scale = lerp(current.scale, target.scale, t)
      current.opacity = lerp(current.opacity, target.opacity, t)
      current.rotX = lerp(current.rotX, target.rotX, t)
      current.rotY = lerp(current.rotY, target.rotY, t)
      current.blur = lerp(current.blur, target.blur, t)

      el.style.transform = `translate(-50%, ${current.ty}%) scale(${current.scale}) perspective(800px) rotateX(${current.rotX}deg) rotateY(${current.rotY}deg)`
      el.style.opacity = String(current.opacity)
      el.style.filter = current.blur > 0.1 ? `blur(${current.blur}px)` : ''

      raf = requestAnimationFrame(animate)
    }

    const onScroll = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const now = performance.now()
      const dt = Math.max(now - lastTime, 1)
      lastTime = now

      const rawVel = Math.abs(scrollY - lastScroll) / dt
      scrollVel = lerp(scrollVel, Math.min(rawVel * 10, 1), 0.12)
      lastScroll = scrollY

      const p = Math.min(scrollY / (vh * 0.85), 1)
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

      const velBoost = 1 + scrollVel * 0.2

      target.ty = -30 + ease * 90 * velBoost
      target.scale = 1 - ease * 0.3 * velBoost
      target.opacity = 1 - ease * 0.55
      target.blur = ease * 2.5
      target.rotX = ease * 8 + scrollVel * 4
    }

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      target.rotY = ((e.clientX - cx) / cx) * 3
    }

    raf = requestAnimationFrame(animate)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [ready])

  // GitHub stats
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

    fetch('https://api.github.com/users/qqwozz/repos?per_page=100')
      .then((r) => r.json())
      .then((repos) => {
        if (Array.isArray(repos)) {
          setStats((s) => ({ ...s, repos: repos.length }))
        }
      })
      .catch(() => {})

    fetch('https://api.github.com/users/qqwozz')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setStats((s) => ({
            ...s,
            followers: data.followers ?? s.followers,
          }))
        }
      })
      .catch(() => {})

    const tryLeetCodeAPIs = [
      'https://leetcode-stats-api.herokuapp.com/oonixxxxx',
      'https://alfa-leetcode-api.onrender.com/oonixxxxx/solved',
      'https://leetcode-api-faisalshohag.vercel.app/oonixxxxx',
    ]

    const tryLeetCode = async () => {
      for (const url of tryLeetCodeAPIs) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
          const data = await res.json()
          if (data && (data.totalSolved || data.solved || data.totalQuestions)) {
            setStats((s) => ({ ...s, leetcode: data.totalSolved || data.solved || 0 }))
            return
          }
        } catch { continue }
      }
    }
    tryLeetCode()
  }, [])

  const currentYear = new Date().getFullYear()
  const closeMobileMenu = () => setMobileMenuOpen(false)

  const techs = ['Python', 'Go', 'C++', 'FastAPI', 'Django', 'gRPC', 'PostgreSQL', 'Redis', 'Docker', 'Linux', 'Git', 'Nginx']

  return (
    <>
      {loading && (
        <div className={`loading-screen${loadingFade ? ' fade-out' : ''}`}>
          <div className="loading-spinner" />
        </div>
      )}

      <div className="noise-overlay" />
      <div className="progress-bar" ref={progressRef} />

      <nav className="navbar" ref={navbarRef}>
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">qqwozz</a>
            <div className="nav-links">
              <a href="#about" className="nav-link">обо мне</a>
              <a href="#experience" className="nav-link">опыт</a>
              <a href="#projects" className="nav-link">проекты</a>
              <a href="#stack" className="nav-link">стек</a>
              <a href="#contact" className="nav-link">связаться</a>
            </div>
            <a href="#contact" className="nav-contact">связаться</a>
            <button
              className={`nav-burger${mobileMenuOpen ? ' active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`} ref={mobileMenuRef}>
          <a href="#about" className="mobile-link" onClick={closeMobileMenu}>обо мне</a>
          <a href="#experience" className="mobile-link" onClick={closeMobileMenu}>опыт</a>
          <a href="#projects" className="mobile-link" onClick={closeMobileMenu}>проекты</a>
          <a href="#stack" className="mobile-link" onClick={closeMobileMenu}>стек</a>
          <a href="#contact" className="mobile-link" onClick={closeMobileMenu}>связаться</a>
        </div>
      </nav>

      <section className="hero" id="hero">
        <MacBookScene />
        <div className="hero-glow" />
        <div className="hero-content">
          <h1 className="hero-title" ref={heroTitleRef}>Дима Киселев</h1>
          <p className="hero-subtitle" ref={heroSubRef}></p>
        </div>
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="about">
        <div className="container">
          <div className="section-number">001</div>
          <div className="about-grid">
            <div className="anim">
              <div className="about-label">обо мне</div>
              <p className="about-text">
                я <strong>Дима Киселев</strong> (qqwozz) — backend-разработчик, работаю с <strong>Python</strong>, <strong>Go</strong> и <strong>C++</strong>.
                <br /><br />
                создаю микросервисы, API и high-load системы. мой подход — <strong>чистая архитектура</strong>, производительность и надёжность.
                <br /><br />
                MTUCI — Moscow Technical University of Communications and Informatics. Москва.
              </p>
            </div>
            <div className="about-stats anim">
              <div className="stat-cell">
                <div className="stat-number" data-target={stats.repos}>{stats.repos || <span className="skeleton" />}</div>
                <div className="stat-label">репозиториев</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-target={stats.leetcode}>{stats.leetcode || <span className="skeleton" />}</div>
                <div className="stat-label">leetcode решено</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-target={stats.followers}>{stats.followers || <span className="skeleton" />}</div>
                <div className="stat-label">фолловеров</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-target={stats.languages}>{stats.languages}</div>
                <div className="stat-label">языков</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-wrapper anim">
        <div className="marquee">
          <div className="marquee-track">
            {techs.concat(techs).map((t, i) => (
              <span key={i} className="marquee-item">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="section" id="experience">
        <div className="container">
          <div className="section-number">002</div>
          <h2 className="section-title anim">опыт работы</h2>
          <div className="experience-list anim">
            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-role">backend-разработчик (стажёр)</div>
                <div className="experience-company">Яндекс</div>
              </div>
              <div className="experience-desc">
                разработка и поддержка backend-сервисов в рамках поисковой инфраструктуры.
                участие в проектировании API, написание модульных и интеграционных тестов.
                оптимизация производительности серверных компонентов, работа с распределёнными системами
                и очередями сообщений. code review, документирование, взаимодействие с командой.
              </div>
              <div className="experience-tags">
                <span className="experience-tag">Python</span>
                <span className="experience-tag">C++</span>
                <span className="experience-tag">microservices</span>
                <span className="experience-tag">gRPC</span>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-header">
                <div className="experience-role">backend-разработчик (стажёр)</div>
                <div className="experience-company">VTB</div>
              </div>
              <div className="experience-desc">
                разработка микросервисов для внутренних банковских систем.
                проектирование и реализация REST API для обработки платёжных операций.
                интеграция с существующей инфраструктурой, работа с реляционными базами данных,
                написание высоконагруженных компонентов с учётом требований безопасности и отказоустойчивости.
              </div>
              <div className="experience-tags">
                <span className="experience-tag">Python</span>
                <span className="experience-tag">Go</span>
                <span className="experience-tag">PostgreSQL</span>
                <span className="experience-tag">Docker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="projects">
        <div className="container">
          <div className="section-number">003</div>
          <h2 className="section-title anim">избранные проекты</h2>
          <div className="projects-list anim">
            <a className="project-row" href="https://github.com/qqwozz/QW_Trading_Platform" target="_blank" rel="noreferrer">
              <span className="project-idx">01</span>
              <span className="project-name">qw trading platform</span>
              <span className="project-desc">крипто-биржа с C++ matching engine</span>
              <span className="project-status">C++, Go, gRPC</span>
            </a>
            <a className="project-row" href="https://github.com/qqwozz/qw_pay" target="_blank" rel="noreferrer">
              <span className="project-idx">02</span>
              <span className="project-name">qw_pay</span>
              <span className="project-desc">микросервис платежей</span>
              <span className="project-status">Go, JWT, OTP</span>
            </a>
            <a className="project-row" href="https://github.com/qqwozz/enf-shop" target="_blank" rel="noreferrer">
              <span className="project-idx">03</span>
              <span className="project-name">enf-shop</span>
              <span className="project-desc">интернет-магазин одежды</span>
              <span className="project-status">Django, HTMX, Docker</span>
            </a>
            <a className="project-row" href="https://github.com/qqwozz/AI-chat-bot" target="_blank" rel="noreferrer">
              <span className="project-idx">04</span>
              <span className="project-name">ai-chat-bot</span>
              <span className="project-desc">NLP чат-бот на ИИ</span>
              <span className="project-status">Python, NLP</span>
            </a>
            <a className="project-row" href="https://github.com/qqwozz/autoadmin" target="_blank" rel="noreferrer">
              <span className="project-idx">05</span>
              <span className="project-name">autoadmin</span>
              <span className="project-desc">API + Telegram-бот для записей</span>
              <span className="project-status">Go, SQLite, JWT</span>
            </a>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="stack">
        <div className="container">
          <div className="section-number">004</div>
          <h2 className="section-title anim">стек технологий</h2>
          <div className="features-grid anim">
            <div className="feature-cell">
              <div className="feature-num">01</div>
              <div className="feature-name">бэкенд</div>
              <div className="feature-value">Python, Go, C++,<br />FastAPI, Django, gRPC</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">02</div>
              <div className="feature-name">базы данных</div>
              <div className="feature-value">PostgreSQL, MySQL,<br />Redis, SQLite</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">03</div>
              <div className="feature-name">инфраструктура</div>
              <div className="feature-value">Docker, Linux,<br />Nginx, Gunicorn</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">04</div>
              <div className="feature-name">инструменты</div>
              <div className="feature-value">Git, GitHub Actions,<br />Postman, VS Code</div>
            </div>
          </div>

          <div className="skills-row anim">
            {[
              { icon: 'PY', name: 'python', level: 'эксперт' },
              { icon: 'GO', name: 'go', level: 'продвинутый' },
              { icon: 'C+', name: 'c++', level: 'средний' },
              { icon: 'PG', name: 'postgresql', level: 'продвинутый' },
            ].map((s) => (
              <div className="skill-cell" key={s.name}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-level">{s.level}</div>
              </div>
            ))}
          </div>
          <div className="skills-row-2 anim">
            {[
              { icon: 'DK', name: 'docker', level: 'продвинутый' },
              { icon: 'GT', name: 'git', level: 'эксперт' },
              { icon: 'LX', name: 'linux', level: 'продвинутый' },
              { icon: 'GR', name: 'gRPC', level: 'средний' },
            ].map((s) => (
              <div className="skill-cell" key={s.name}>
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
                <div className="skill-level">{s.level}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="contact">
        <div className="contact-block">
          <h2 className="section-title-lg anim">связаться<br />со мной</h2>
          <div className="contact-links-wrapper anim">
            <div className="contact-links">
              <a href="https://t.me/qqqwozz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                telegram
              </a>
              <a href="https://github.com/qqwozz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                github
              </a>
              <a href="https://instagram.com/qqqwozz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                instagram
              </a>
              <a href="https://leetcode.com/u/oonixxxxx/" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.544 2.544 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.53-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg>
                leetcode
              </a>
              <a href="mailto:offconix@gmail.com" className="contact-link">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                email
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-copy">&copy; {currentYear} qqwozz</span>
            <div className="footer-links">
              <a href="https://github.com/qqwozz" target="_blank" rel="noreferrer">github</a>
              <a href="https://t.me/qqqwozz" target="_blank" rel="noreferrer">telegram</a>
              <a href="https://instagram.com/qqqwozz" target="_blank" rel="noreferrer">instagram</a>
              <a href="https://leetcode.com/u/oonixxxxx/" target="_blank" rel="noreferrer">leetcode</a>
              <a href="#contact">связаться</a>
            </div>
          </div>
        </div>
      </footer>

      <button
        className="back-to-top"
        ref={backToTopRef}
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Наверх"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
    </>
  )
}

export default App
