import { TranslationKey } from '../i18n'

interface StackProps {
  t: (key: TranslationKey) => string
}

export function StackSection({ t }: StackProps) {
  const skillsRow1 = [
    { icon: 'PY', name: 'python', level: t('skill.expert') },
    { icon: 'GO', name: 'go', level: t('skill.advanced') },
    { icon: 'C+', name: 'c++', level: t('skill.intermediate') },
    { icon: 'PG', name: 'postgresql', level: t('skill.advanced') },
  ]

  const skillsRow2 = [
    { icon: 'DK', name: 'docker', level: t('skill.advanced') },
    { icon: 'GT', name: 'git', level: t('skill.expert') },
    { icon: 'LX', name: 'linux', level: t('skill.advanced') },
    { icon: 'GR', name: 'gRPC', level: t('skill.intermediate') },
  ]

  return (
    <section className="section" id="stack">
      <div className="container">
        <div className="section-number">
          003
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">{t('stack.title')}</h2>
        <div className="features-grid anim">
          <div className="feature-cell">
            <div className="feature-num">01</div>
            <div className="feature-name">{t('stack.backend')}</div>
            <div className="feature-value">Python, Go, C++,<br />FastAPI, Django, gRPC</div>
          </div>
          <div className="feature-cell">
            <div className="feature-num">02</div>
            <div className="feature-name">{t('stack.databases')}</div>
            <div className="feature-value">PostgreSQL, MySQL,<br />Redis, SQLite</div>
          </div>
          <div className="feature-cell">
            <div className="feature-num">03</div>
            <div className="feature-name">{t('stack.infra')}</div>
            <div className="feature-value">Docker, Linux,<br />Nginx, Gunicorn</div>
          </div>
          <div className="feature-cell">
            <div className="feature-num">04</div>
            <div className="feature-name">{t('stack.tools')}</div>
            <div className="feature-value">Git, GitHub Actions,<br />Postman, VS Code</div>
          </div>
        </div>

        <div className="skills-row anim">
          {skillsRow1.map((s) => (
            <div className="skill-cell" key={s.name}>
              <div className="skill-icon">{s.icon}</div>
              <div className="skill-name">{s.name}</div>
              <div className="skill-level">{s.level}</div>
            </div>
          ))}
        </div>
        <div className="skills-row-2 anim">
          {skillsRow2.map((s) => (
            <div className="skill-cell" key={s.name}>
              <div className="skill-icon">{s.icon}</div>
              <div className="skill-name">{s.name}</div>
              <div className="skill-level">{s.level}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
