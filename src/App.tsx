import { useEffect, useRef, useCallback, useState } from 'react'
import MacBookScene from './components/MacBookScene'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const navbarRef = useRef<HTMLElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [stats, setStats] = useState({ repos: 0, stars: 0, followers: 0, languages: 6 })

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY

    if (navbarRef.current) {
      navbarRef.current.classList.toggle('scrolled', scrollTop > 50)
    }

    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.classList.toggle('hidden', scrollTop > 100)
    }

    setShowTopBtn(scrollTop > 600)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

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
          const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count ?? 0), 0)
          setStats((s) => ({ ...s, stars: totalStars }))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[scrub-text]').forEach((el) => {
      const words = el.textContent!.split(' ')
      el.textContent = ''
      words.forEach((word) => {
        const wordSpan = document.createElement('span')
        word.split('').forEach((ch) => {
          const letterSpan = document.createElement('span')
          letterSpan.textContent = ch
          letterSpan.style.opacity = '0'
          wordSpan.appendChild(letterSpan)
        })
        wordSpan.innerHTML += ' '
        el.appendChild(wordSpan)
      })
      gsap.fromTo(
        el.querySelectorAll('span span'),
        { opacity: 0.1, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: 'Power0.easeNone',
          duration: 1,
          stagger: 0.4,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 60%', scrub: 1.5 },
        }
      )
    })

    document.querySelectorAll<HTMLElement>('[scrub-each-word]').forEach((el) => {
      const words = el.textContent!.split(' ')
      el.textContent = ''
      words.forEach((word) => {
        const wordSpan = document.createElement('span')
        word.split('').forEach((ch) => {
          const letterSpan = document.createElement('span')
          letterSpan.textContent = ch
          letterSpan.style.opacity = '0'
          wordSpan.appendChild(letterSpan)
        })
        wordSpan.innerHTML += ' '
        el.appendChild(wordSpan)
      })
      gsap.fromTo(
        el.querySelectorAll('span span'),
        { opacity: 0.1, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: 'Power0.easeNone',
          duration: 1,
          stagger: 0.4,
          scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 60%', scrub: 1.5 },
        }
      )
    })

    const heroTitle = document.querySelector<HTMLElement>('[data-scrub-hero]')
    if (heroTitle) {
      const text = heroTitle.textContent!
      heroTitle.textContent = ''
      text.split('').forEach((ch) => {
        const s = document.createElement('span')
        s.textContent = ch === ' ' ? '\u00A0' : ch
        s.style.display = 'inline-block'
        heroTitle.appendChild(s)
      })
      gsap.fromTo(
        heroTitle.querySelectorAll('span'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.07,
          ease: 'back.out(1.4)',
          delay: 0.3,
        }
      )
    }

    const heroSub = document.querySelector<HTMLElement>('[data-scrub-hero-sub]')
    if (heroSub) {
      gsap.fromTo(heroSub, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.2,
        ease: 'power3.out',
      })
    }

    document.querySelectorAll<HTMLElement>('.reveal-el').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    document.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count')!)
      gsap.fromTo(counter, { textContent: '0' }, {
        textContent: target.toString(),
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: { trigger: counter, start: 'top 85%' },
      })
    })

    const showcaseCode = document.querySelector<HTMLElement>('.showcase-code')
    if (showcaseCode) {
      gsap.fromTo(showcaseCode, { opacity: 0, scale: 0.95 }, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: showcaseCode, start: 'top 80%' },
      })
    }

    document.querySelectorAll<HTMLElement>('.hero-orb').forEach((orb) => {
      gsap.to(orb, {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll<HTMLElement>('.nav-link')

    const updateNav = () => {
      let current = ''
      sections.forEach((s) => {
        if (scrollY >= (s as HTMLElement).offsetTop - 200) {
          current = s.getAttribute('id')!
        }
      })
      navLinks.forEach((link) => {
        link.style.color = ''
        if (link.getAttribute('href') === '#' + current) {
          link.style.color = '#fff'
        }
      })
    }

    window.addEventListener('scroll', updateNav)
    return () => window.removeEventListener('scroll', updateNav)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <div className="loading-spinner" />
        </div>
      )}

      <MacBookScene />

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
            <a href="#contact" className="nav-contact">поддержка</a>
          </div>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-glow" />
        <div className="hero-code-bg">{`from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Trade(BaseModel):
    symbol: str
    amount: float
    side: str

@app.post("/trade")
async def execute_trade(trade: Trade):
    result = await matching_engine.process(trade)
    return {"status": "executed", "id": result.id}

# qwwozzz @ VTB dev`}</div>
        <div className="hero-image-wrap">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title" data-scrub-hero>QQWOZZ</h1>
          <p className="hero-subtitle" data-scrub-hero-sub>back-end developer</p>
        </div>
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="container">
          <p className="scrub-each-word" scrub-each-word="">всё начинается с</p>
          <p className="scrub-text" scrub-text="">одной строки кода</p>
        </div>
      </section>

      <section className="showcase">
        <div className="container">
          <div className="showcase-inner">
            <div className="showcase-image reveal-el">
              <div className="showcase-code">
                <span className="comment">// qqwozz @ {currentYear}</span><br />
                <span className="keyword">const</span> developer = {'{'}<br />
                &nbsp;&nbsp;name: <span className="string">"Dima Kiselev"</span>,<br />
                &nbsp;&nbsp;role: <span className="string">"back-end developer"</span>,<br />
                &nbsp;&nbsp;stack: [<span className="string">"python"</span>, <span className="string">"go"</span>, <span className="string">"C++"</span>],<br />
                &nbsp;&nbsp;company: <span className="string">"VTB"</span>,<br />
                &nbsp;&nbsp;passion: <span className="keyword">Infinity</span><br />
                {'}'};
              </div>
            </div>
            <span className="showcase-label">как я пишу код</span>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="about">
        <div className="container">
          <div className="section-number">001</div>
          <div className="about-grid">
            <div className="reveal-el">
              <div className="about-label">обо мне</div>
              <p className="about-text">
                я <strong>Dima Kiselev</strong> (qqwozz) — backend-разработчик в <strong>VTB</strong>, работаю с <strong>Python</strong>, <strong>Go</strong> и <strong>C++</strong>.
                <br /><br />
                создаю микросервисы, API и high-load системы. мой подход — <strong>чистая архитектура</strong>, производительность и надёжность.
                <br /><br />
                MTUCI — Moscow Technical University of Communications and Informatics. Москва.
              </p>
            </div>
            <div className="about-stats reveal-el">
              <div className="stat-cell">
                <div className="stat-number" data-count={stats.repos}>0</div>
                <div className="stat-label">репозиториев</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-count={stats.stars}>0</div>
                <div className="stat-label">звёзд</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-count={stats.followers}>0</div>
                <div className="stat-label">фолловеров</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-count={stats.languages}>0</div>
                <div className="stat-label">языков</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* EXPERIENCE */}
      <section className="section" id="experience">
        <div className="container">
          <div className="section-number">002</div>
          <p className="scrub-each-word" scrub-each-word="">опыт работы</p>
          <div className="experience-list reveal-el">
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

      <section className="section" id="features">
        <div className="container">
          <div className="section-number">003</div>
          <p className="scrub-each-word" scrub-each-word="">что я умею</p>
          <div className="features-grid reveal-el">
            <div className="feature-cell">
              <div className="feature-num">001</div>
              <div className="feature-name">бэкенд</div>
              <div className="feature-value">Python, Go, C++,<br />FastAPI, Django</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">002</div>
              <div className="feature-name">базы данных</div>
              <div className="feature-value">PostgreSQL, MySQL,<br />Redis, SQLite</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">003</div>
              <div className="feature-name">инструменты</div>
              <div className="feature-value">Docker, Linux, Git,<br />GitHub, gRPC</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">004</div>
              <div className="feature-name">специализация</div>
              <div className="feature-value">микросервисы,<br />high-load, API</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="container">
          <p className="scrub-text" scrub-text="">точность без<br />усилий</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="detail-cards">
            <div className="detail-card reveal-el">
              <div className="detail-card-num">01</div>
              <div className="detail-card-title">чистый код</div>
              <div className="detail-card-text">
                каждый проект — это возможность написать код лучше, чем в прошлый раз.
                я слежу за архитектурой, тестами и документацией.
                результат говорит сам за себя.
              </div>
            </div>
            <div className="detail-card reveal-el">
              <div className="detail-card-num">02</div>
              <div className="detail-card-title">красивый интерфейс</div>
              <div className="detail-card-text">
                дизайн — это не просто внешний вид. это ощущение,
                которое получает пользователь. я уделяю внимание каждой детали,
                от анимаций до типографики.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="container">
          <p className="scrub-each-word" scrub-each-word="">всё в</p>
          <p className="scrub-text" scrub-text="">твоих руках</p>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="container">
          <div className="section-number">004</div>
          <p className="scrub-each-word" scrub-each-word="">избранные проекты</p>
          <div className="projects-list reveal-el">
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

      <section className="section" id="skills">
        <div className="container">
          <div className="section-number">005</div>
          <p className="scrub-each-word" scrub-each-word="">технологии</p>
          <div className="skills-row reveal-el">
            <div className="skill-cell">
              <div className="skill-icon">PY</div>
              <div className="skill-name">python</div>
              <div className="skill-level">эксперт</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">GO</div>
              <div className="skill-name">go</div>
              <div className="skill-level">продвинутый</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">C+</div>
              <div className="skill-name">c++</div>
              <div className="skill-level">средний</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">PG</div>
              <div className="skill-name">postgresql</div>
              <div className="skill-level">продвинутый</div>
            </div>
          </div>
          <div className="skills-row-2 reveal-el">
            <div className="skill-cell">
              <div className="skill-icon">DK</div>
              <div className="skill-name">docker</div>
              <div className="skill-level">продвинутый</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">GT</div>
              <div className="skill-name">git</div>
              <div className="skill-level">эксперт</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">LX</div>
              <div className="skill-name">linux</div>
              <div className="skill-level">продвинутый</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">GR</div>
              <div className="skill-name">gRPC</div>
              <div className="skill-level">средний</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="stack">
        <div className="container">
          <div className="section-number">006</div>
          <p className="scrub-each-word" scrub-each-word="">полный стек</p>
          <div className="stack-table reveal-el">
            <div className="stack-row">
              <div className="stack-label">бэкенд</div>
              <div className="stack-value">Python, Go, C++, FastAPI, Django, gRPC</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">базы данных</div>
              <div className="stack-value">PostgreSQL, MySQL, Redis, SQLite</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">инфраструктура</div>
              <div className="stack-value">Docker, Linux, Nginx, Gunicorn</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">инструменты</div>
              <div className="stack-value">Git, GitHub, GitHub Actions, Postman, VS Code</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">специализация</div>
              <div className="stack-value">микросервисы, платежные системы, high-load, trading</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section" id="contact">
        <div className="contact-block">
          <p className="scrub-text" scrub-text="">связаться<br />со мной</p>
          <div style={{ marginTop: 56 }}>
            <div className="contact-links reveal-el">
              <a href="https://t.me/qwwozzz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                telegram
              </a>
              <a href="https://github.com/qqwozz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                github
              </a>
              <a href="mailto:qqwozz@proton.me" className="contact-link">
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
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
              <a href="https://t.me/qwwozzz" target="_blank" rel="noreferrer">telegram</a>
              <a href="#contact">связаться</a>
            </div>
          </div>
        </div>
      </footer>

      <button
        className={`back-to-top${showTopBtn ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Наверх"
      >
        <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
    </>
  )
}

export default App
