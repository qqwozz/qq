import { TranslationKey } from '../i18n'

interface ProjectsProps {
  t: (key: TranslationKey) => string
}

export function ProjectsSection({ t }: ProjectsProps) {
  const projects = [
    { idx: '01', name: 'qw trading platform', desc: t('projects.p1.desc'), status: 'C++, Go, gRPC', href: 'https://github.com/qqwozz/QW_Trading_Platform' },
    { idx: '02', name: 'qw_pay', desc: t('projects.p2.desc'), status: 'Go, JWT, OTP', href: 'https://github.com/qqwozz/qw_pay' },
    { idx: '03', name: 'enf-shop', desc: t('projects.p3.desc'), status: 'Django, HTMX, Docker', href: 'https://github.com/qqwozz/enf-shop' },
    { idx: '04', name: 'ai-chat-bot', desc: t('projects.p4.desc'), status: 'Python, NLP', href: 'https://github.com/qqwozz/AI-chat-bot' },
    { idx: '05', name: 'autoadmin', desc: t('projects.p5.desc'), status: 'Go, SQLite, JWT', href: 'https://github.com/qqwozz/autoadmin' },
  ]

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-number">
          003
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">{t('projects.title')}</h2>
        <div className="projects-list anim">
          {projects.map((p) => (
            <a key={p.idx} className="project-row" href={p.href} target="_blank" rel="noreferrer">
              <span className="project-idx">{p.idx}</span>
              <span className="project-name">{p.name}</span>
              <span className="project-desc">{p.desc}</span>
              <span className="project-status">{p.status}</span>
              <span className="project-tooltip">{p.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
