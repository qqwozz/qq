import { useState } from 'react'
import { TranslationKey } from '../i18n'

interface ProjectsProps {
  t: (key: TranslationKey) => string
}

export function ProjectsSection({ t }: ProjectsProps) {
  const [active, setActive] = useState<number | null>(null)

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
    },
  ]

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-number">
          002
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">{t('projects.title')}</h2>
        <div className="projects-list anim">
          {projects.map((p, i) => (
            <div key={p.idx} className={`project-item${active === i ? ' open' : ''}`}>
              <div
                className="project-row"
                onClick={() => setActive(active === i ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActive(active === i ? null : i) }}
              >
                <span className="project-idx">{p.idx}</span>
                <span className="project-name">{p.name}</span>
                <span className="project-desc">{p.desc}</span>
                <span className="project-status">{p.status}</span>
                <span className="project-chevron">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
              {active === i && (
                <div className="project-detail">
                  <p className="project-detail-about">{p.about}</p>
                  <div className="project-detail-section">
                    <div className="project-detail-label">ключевые особенности</div>
                    <ul className="project-detail-features">
                      {p.features.map((f, fi) => <li key={fi}>{f}</li>)}
                    </ul>
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
