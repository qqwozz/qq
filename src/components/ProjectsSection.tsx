import { useState, useEffect, useRef, useCallback } from 'react'
import { TranslationKey } from '../i18n'

interface ProjectsProps {
  t: (key: TranslationKey) => string
}

export function ProjectsSection({ t }: ProjectsProps) {
  const [active, setActive] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const projects = [
    {
      idx: '01',
      name: 'qw trading platform',
      desc: t('projects.p1.desc'),
      status: 'C++, Go, gRPC',
      href: 'https://github.com/qqwozz/QW_Trading_Platform',
      about: t('projects.p1.about'),
      features: [t('projects.p1.feat1'), t('projects.p1.feat2'), t('projects.p1.feat3'), t('projects.p1.feat4')],
      tech: ['Go', 'C++17', 'PostgreSQL', 'Redis', 'gRPC', 'Docker', 'React'],
      category: 'fintech',
      categoryColor: '#1a6bff',
      metrics: ['1000+ orders/sec', '6 microservices'],
      architecture: 'Client → API Gateway → Order Service → Matching Engine (C++) → PostgreSQL',
      completed: true,
    },
    {
      idx: '02',
      name: 'qw_pay',
      desc: t('projects.p2.desc'),
      status: 'Go, C++, Python',
      href: 'https://github.com/qqwozz/qw_pay',
      about: t('projects.p2.about'),
      features: [t('projects.p2.feat1'), t('projects.p2.feat2'), t('projects.p2.feat3'), t('projects.p2.feat4')],
      tech: ['Go', 'C++', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
      category: 'fintech',
      categoryColor: '#1a6bff',
      metrics: ['200+ currencies', 'anti-fraud <1ms'],
      architecture: 'API Gateway → Transaction Service → PostgreSQL + Anti-Fraud (C++ + Python)',
      completed: true,
    },
    {
      idx: '03',
      name: 'enf-shop',
      desc: t('projects.p3.desc'),
      status: 'Django, HTMX, Docker',
      href: 'https://github.com/qqwozz/enf-shop',
      about: t('projects.p3.about'),
      features: [t('projects.p3.feat1'), t('projects.p3.feat2'), t('projects.p3.feat3'), t('projects.p3.feat4')],
      tech: ['Django', 'PostgreSQL', 'Redis', 'HTMX', 'Stripe', 'Docker'],
      category: 'e-commerce',
      categoryColor: '#e67e22',
      metrics: ['Stripe integration', 'Docker production'],
      architecture: 'Nginx → Gunicorn → Django → PostgreSQL + Redis + Stripe',
      completed: true,
    },
    {
      idx: '04',
      name: 'ai-chat-bot',
      desc: t('projects.p4.desc'),
      status: 'Python, NLP',
      href: 'https://github.com/qqwozz/AI-chat-bot',
      about: t('projects.p4.about'),
      features: [t('projects.p4.feat1'), t('projects.p4.feat2'), t('projects.p4.feat3'), t('projects.p4.feat4')],
      tech: ['Python', 'Streamlit', 'GigaChat API', 'OAuth 2.0'],
      category: 'ai',
      categoryColor: '#9b59b6',
      metrics: ['GigaChat NLP', 'Russian language'],
      architecture: 'User → Streamlit UI → GigaChat API → OAuth 2.0 → Response',
      completed: true,
    },
    {
      idx: '05',
      name: 'autoadmin',
      desc: t('projects.p5.desc'),
      status: 'Go, SQLite, JWT',
      href: 'https://github.com/qqwozz/autoadmin',
      about: t('projects.p5.about'),
      features: [t('projects.p5.feat1'), t('projects.p5.feat2'), t('projects.p5.feat3'), t('projects.p5.feat4')],
      tech: ['Go', 'SQLite', 'Telegram Bot API', 'JWT', 'Docker'],
      category: 'saas',
      categoryColor: '#27ae60',
      metrics: ['13 DB tables', 'REST + Telegram'],
      architecture: 'Telegram Bot → REST API (Go) → SQLite + JWT Auth',
      completed: true,
    },
  ]

  const toggle = useCallback((i: number) => {
    setActive(prev => prev === i ? null : i)
  }, [])

  // Scroll to expanded card
  useEffect(() => {
    if (active !== null && itemRefs.current[active]) {
      const el = itemRefs.current[active]
      const rect = el.getBoundingClientRect()
      const inView = rect.top >= 0 && rect.bottom <= window.innerHeight
      if (!inView) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 50)
      }
    }
  }, [active])

  // Close on outside click
  useEffect(() => {
    if (active === null) return
    const handler = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setActive(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [active])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement)) return
      if (e.key === 'Escape') {
        setActive(null)
        return
      }
      const focused = document.activeElement as HTMLElement
      const row = focused.closest('.project-row')
      if (!row) return
      const items = Array.from(sectionRef.current.querySelectorAll('.project-row'))
      const idx = items.indexOf(row)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = items[idx + 1] as HTMLElement | undefined
        next?.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = items[idx - 1] as HTMLElement | undefined
        prev?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <section className="section" id="projects" ref={sectionRef}>
      <div className="container">
        <div className="section-number">
          002
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">{t('projects.title')}</h2>
        <div className="projects-list anim">
          {projects.map((p, i) => (
            <div
              key={p.idx}
              ref={el => { itemRefs.current[i] = el }}
              className={`project-item${active === i ? ' open' : ''}`}
              style={{ '--project-color': p.categoryColor } as React.CSSProperties}
            >
              <div
                className="project-row"
                onClick={() => toggle(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle(i)
                  }
                }}
              >
                <span className="project-idx">{p.idx}</span>
                <span className="project-name">{p.name}</span>
                <span className="project-category" style={{ color: p.categoryColor, borderColor: p.categoryColor + '40', background: p.categoryColor + '10' }}>{p.category}</span>
                <span className="project-status-text">{p.status}</span>
                <span className={`project-status-dot${p.completed ? ' done' : ''}`} />
                <span className="project-chevron">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {active === i && (
                <div className="project-detail">
                  <p className="project-detail-about">{p.about}</p>
                  <div className="project-detail-metrics">
                    {p.metrics.map((m, mi) => (
                      <span key={mi} className="project-metric" style={{ borderColor: p.categoryColor + '30', color: p.categoryColor }}>{m}</span>
                    ))}
                  </div>
                  <div className="project-detail-section">
                    <div className="project-detail-label">ключевые особенности</div>
                    <ul className="project-detail-features">
                      {p.features.map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
                  </div>
                  <div className="project-detail-section">
                    <div className="project-detail-label">архитектура</div>
                    <div className="project-detail-architecture">{p.architecture}</div>
                  </div>
                  <div className="project-detail-section">
                    <div className="project-detail-label">стек</div>
                    <div className="project-detail-tech">
                      {p.tech.map((tech, ti) => <span key={ti} className="project-tech-tag">{tech}</span>)}
                    </div>
                  </div>
                  <a className="project-detail-link" href={p.href} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    github
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
