import { useEffect, useRef, useState, useCallback } from 'react'
import MacBookScene from './components/MacBookScene'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const navbarRef = useRef<HTMLElement>(null)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? scrollTop / docHeight : 0
    setScrollProgress(progress)

    if (navbarRef.current) {
      navbarRef.current.classList.toggle('scrolled', scrollTop > 50)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    // scrub-text animation
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

    // scrub-each-word animation
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

    // Hero title
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

    // Hero subtitle
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

    // Reveal elements
    document.querySelectorAll<HTMLElement>('.reveal-el').forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 60 }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    // Counter
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

    // Showcase code block animation
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

    // Parallax for hero orbs
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

  // Active nav
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

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar" ref={navbarRef}>
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">qqwozz</a>
            <div className="nav-links">
              <a href="#about" className="nav-link">обо мне</a>
              <a href="#projects" className="nav-link">проекты</a>
              <a href="#stack" className="nav-link">стек</a>
              <a href="#contact" className="nav-link">связаться</a>
            </div>
            <a href="#contact" className="nav-contact">поддержка</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-glow" />
        <div className="hero-code-bg">{`import React from 'react';
import { motion } from 'framer-motion';

const App = () => {
  return (
    <div className="app">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        qqwozz
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        fullstack developer
      </motion.p>
    </div>
  );
};

export default App;`}</div>
        <div className="hero-image-wrap">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <MacBookScene scrollProgress={scrollProgress} />

        <div className="hero-content">
          <h1 className="hero-title" data-scrub-hero>QQWOZZ</h1>
          <p className="hero-subtitle" data-scrub-hero-sub>разработчик</p>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      <div className="divider" />

      {/* SCRUB SECTION 1 */}
      <section className="section">
        <div className="container">
          <p className="scrub-each-word" scrub-each-word="">всё начинается с</p>
          <p className="scrub-text" scrub-text="">одной строки кода</p>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="showcase">
        <div className="container">
          <div className="showcase-inner">
            <div className="showcase-image reveal-el">
              <div className="showcase-code">
                <span className="comment">// qqwozz @ 2024</span><br />
                <span className="keyword">const</span> developer = {'{'}<br />
                &nbsp;&nbsp;name: <span className="string">"qqwozz"</span>,<br />
                &nbsp;&nbsp;stack: [<span className="string">"react"</span>, <span className="string">"node"</span>, <span className="string">"typescript"</span>],<br />
                &nbsp;&nbsp;motto: <span className="string">"чистый код без компромиссов"</span>,<br />
                &nbsp;&nbsp;passion: <span className="keyword">Infinity</span><br />
                {'}'};
              </div>
            </div>
            <span className="showcase-label">как я пишу код</span>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-number">001</div>
          <div className="about-grid">
            <div className="reveal-el">
              <div className="about-label">обо мне</div>
              <p className="about-text">
                я <strong>qqwozz</strong> — веб-разработчик, который создаёт современные, быстрые и красивые интерфейсы.
                <br /><br />
                мой подход — <strong>чистый код</strong>, внимание к деталям и стремление к совершенству в каждом проекте.
                <br /><br />
                если тебе нужен разработчик, который горит своим делом — ты по адресу.
              </p>
            </div>
            <div className="about-stats reveal-el">
              <div className="stat-cell">
                <div className="stat-number" data-count="50">0</div>
                <div className="stat-label">проектов</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-count="3">0</div>
                <div className="stat-label">года опыта</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-count="100">0</div>
                <div className="stat-label">клиентов</div>
              </div>
              <div className="stat-cell">
                <div className="stat-number" data-count="99">0</div>
                <div className="stat-label">% довольных</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-number">002</div>
          <p className="scrub-each-word" scrub-each-word="">что я умею</p>
          <div className="features-grid reveal-el">
            <div className="feature-cell">
              <div className="feature-num">001</div>
              <div className="feature-name">фронтенд</div>
              <div className="feature-value">react, vue, next.js,<br />typescript, tailwind</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">002</div>
              <div className="feature-name">бэкенд</div>
              <div className="feature-value">node.js, python,<br />postgreSQL, redis</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">003</div>
              <div className="feature-name">инструменты</div>
              <div className="feature-value">git, docker, ci/cd,<br />linux, figma</div>
            </div>
            <div className="feature-cell">
              <div className="feature-num">004</div>
              <div className="feature-name">подход</div>
              <div className="feature-value">честный код,<br />без компромиссов</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* SCRUB SECTION 2 */}
      <section className="section">
        <div className="container">
          <p className="scrub-text" scrub-text="">точность без<br />усилий</p>
        </div>
      </section>

      {/* DETAIL CARDS */}
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

      {/* SCRUB SECTION 3 */}
      <section className="section">
        <div className="container">
          <p className="scrub-each-word" scrub-each-word="">всё в</p>
          <p className="scrub-text" scrub-text="">твоих руках</p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-number">003</div>
          <p className="scrub-each-word" scrub-each-word="">избранные проекты</p>
          <div className="projects-list reveal-el">
            <a className="project-row" href="#">
              <span className="project-idx">01</span>
              <span className="project-name">игровой портал</span>
              <span className="project-desc">платформа для геймеров</span>
              <span className="project-status">react, node.js</span>
            </a>
            <a className="project-row" href="#">
              <span className="project-idx">02</span>
              <span className="project-name">фитнес-трекер</span>
              <span className="project-desc">мобильное приложение</span>
              <span className="project-status">react native</span>
            </a>
            <a className="project-row" href="#">
              <span className="project-idx">03</span>
              <span className="project-name">интернет-магазин</span>
              <span className="project-desc">e-commerce платформа</span>
              <span className="project-status">next.js, stripe</span>
            </a>
            <a className="project-row" href="#">
              <span className="project-idx">04</span>
              <span className="project-name">аналитика продаж</span>
              <span className="project-desc">дашборд с графиками</span>
              <span className="project-status">vue.js, d3.js</span>
            </a>
            <a className="project-row" href="#">
              <span className="project-idx">05</span>
              <span className="project-name">чат-приложение</span>
              <span className="project-desc">мессенджер реалтайм</span>
              <span className="project-status">socket.io, react</span>
            </a>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="container">
          <div className="section-number">004</div>
          <p className="scrub-each-word" scrub-each-word="">технологии</p>
          <div className="skills-row reveal-el">
            <div className="skill-cell">
              <div className="skill-icon">JS</div>
              <div className="skill-name">javascript</div>
              <div className="skill-level">эксперт</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">TS</div>
              <div className="skill-name">typescript</div>
              <div className="skill-level">продвинутый</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">RN</div>
              <div className="skill-name">react</div>
              <div className="skill-level">эксперт</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">NJ</div>
              <div className="skill-name">node.js</div>
              <div className="skill-level">продвинутый</div>
            </div>
          </div>
          <div className="skills-row-2 reveal-el">
            <div className="skill-cell">
              <div className="skill-icon">PY</div>
              <div className="skill-name">python</div>
              <div className="skill-level">продвинутый</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">PG</div>
              <div className="skill-name">postgresql</div>
              <div className="skill-level">средний</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">DK</div>
              <div className="skill-name">docker</div>
              <div className="skill-level">средний</div>
            </div>
            <div className="skill-cell">
              <div className="skill-icon">GT</div>
              <div className="skill-name">git</div>
              <div className="skill-level">эксперт</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* STACK TABLE */}
      <section className="section" id="stack">
        <div className="container">
          <div className="section-number">005</div>
          <p className="scrub-each-word" scrub-each-word="">полный стек</p>
          <div className="stack-table reveal-el">
            <div className="stack-row">
              <div className="stack-label">фронтенд</div>
              <div className="stack-value">React, Vue, Next.js, TypeScript, Tailwind CSS, GSAP, Framer Motion</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">бэкенд</div>
              <div className="stack-value">Node.js, Express, Fastify, Python, Django, FastAPI</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">базы данных</div>
              <div className="stack-value">PostgreSQL, MongoDB, Redis, Firebase</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">инструменты</div>
              <div className="stack-value">Git, Docker, GitHub Actions, Linux, Nginx, Vercel</div>
            </div>
            <div className="stack-row">
              <div className="stack-label">дизайн</div>
              <div className="stack-value">Figma, Adobe XD, Photoshop</div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="contact-block">
          <p className="scrub-text" scrub-text="">связаться<br />со мной</p>
          <div style={{ marginTop: 56 }}>
            <div className="contact-links reveal-el">
              <a href="mailto:qqwozz@example.com" className="contact-link">
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                email
              </a>
              <a href="https://github.com/qqwozz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                github
              </a>
              <a href="https://t.me/qqwozz" target="_blank" rel="noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-copy">все права защищены</span>
            <div className="footer-links">
              <a href="https://github.com/qqwozz" target="_blank" rel="noreferrer">github</a>
              <a href="https://t.me/qqwozz" target="_blank" rel="noreferrer">telegram</a>
              <a href="#contact">связаться</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
