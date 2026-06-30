import { TranslationKey } from '../i18n'
interface ProjectsProps {
  t: (key: TranslationKey) => string
}

export function ProjectsSection({ t }: ProjectsProps) {
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-number">003</div>
        <h2 className="section-title anim">{t('projects.title')}</h2>
        <div className="projects-list anim">
          <a className="project-row" href="https://github.com/qqwozz/QW_Trading_Platform" target="_blank" rel="noreferrer">
            <span className="project-idx">01</span>
            <span className="project-name">qw trading platform</span>
            <span className="project-desc">{t('projects.p1.desc')}</span>
            <span className="project-status">C++, Go, gRPC</span>
          </a>
          <a className="project-row" href="https://github.com/qqwozz/qw_pay" target="_blank" rel="noreferrer">
            <span className="project-idx">02</span>
            <span className="project-name">qw_pay</span>
            <span className="project-desc">{t('projects.p2.desc')}</span>
            <span className="project-status">Go, JWT, OTP</span>
          </a>
          <a className="project-row" href="https://github.com/qqwozz/enf-shop" target="_blank" rel="noreferrer">
            <span className="project-idx">03</span>
            <span className="project-name">enf-shop</span>
            <span className="project-desc">{t('projects.p3.desc')}</span>
            <span className="project-status">Django, HTMX, Docker</span>
          </a>
          <a className="project-row" href="https://github.com/qqwozz/AI-chat-bot" target="_blank" rel="noreferrer">
            <span className="project-idx">04</span>
            <span className="project-name">ai-chat-bot</span>
            <span className="project-desc">{t('projects.p4.desc')}</span>
            <span className="project-status">Python, NLP</span>
          </a>
          <a className="project-row" href="https://github.com/qqwozz/autoadmin" target="_blank" rel="noreferrer">
            <span className="project-idx">05</span>
            <span className="project-name">autoadmin</span>
            <span className="project-desc">{t('projects.p5.desc')}</span>
            <span className="project-status">Go, SQLite, JWT</span>
          </a>
        </div>
      </div>
    </section>
  )
}
