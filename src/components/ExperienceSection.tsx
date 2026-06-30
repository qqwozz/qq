import { TranslationKey } from '../i18n'
interface ExperienceProps {
  t: (key: TranslationKey) => string
}

export function ExperienceSection({ t }: ExperienceProps) {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-number">002</div>
        <h2 className="section-title anim">{t('experience.title')}</h2>
        <div className="experience-list anim">
          <div className="experience-card">
            <div className="experience-header">
              <div className="experience-role">{t('experience.role')}</div>
              <div className="experience-company">Яндекс</div>
            </div>
            <div className="experience-desc">
              {t('experience.yandex.desc')}
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
              <div className="experience-role">{t('experience.role')}</div>
              <div className="experience-company">VTB</div>
            </div>
            <div className="experience-desc">
              {t('experience.vtb.desc')}
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
  )
}
