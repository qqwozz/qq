import { TranslationKey } from '../i18n'

interface ExperienceProps {
  t: (key: TranslationKey) => string
}

export function ExperienceSection({ t }: ExperienceProps) {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-number">
          002
          <div className="section-number-progress" />
        </div>
        <h2 className="section-title anim">{t('experience.title')}</h2>
        <div className="experience-list anim">

          <div className="experience-card-new">
            <div className="experience-card-content">
              <div className="experience-card-header">
                <span className="experience-type">{t('experience.yandex.type')}</span>
              </div>
              <h3 className="experience-card-title">Яндекс</h3>
              <div className="experience-card-role">{t('experience.role')}</div>
              <ul className="experience-card-list">
                <li>{t('experience.yandex.task1')}</li>
                <li>{t('experience.yandex.task2')}</li>
                <li>{t('experience.yandex.task3')}</li>
                <li>{t('experience.yandex.task4')}</li>
              </ul>
              <div className="experience-card-tags">
                <span className="experience-tag">Python</span>
                <span className="experience-tag">C++</span>
                <span className="experience-tag">gRPC</span>
                <span className="experience-tag">Microservices</span>
                <span className="experience-tag">Linux</span>
              </div>
            </div>
            <div className="experience-card-logo">
              <img src={`${import.meta.env.BASE_URL}logos/yandex.svg`} alt="Яндекс" />
            </div>
          </div>

          <div className="experience-card-new">
            <div className="experience-card-content">
              <div className="experience-card-header">
                <span className="experience-type">{t('experience.vtb.type')}</span>
              </div>
              <h3 className="experience-card-title">ВТБ</h3>
              <div className="experience-card-role">{t('experience.role')}</div>
              <ul className="experience-card-list">
                <li>{t('experience.vtb.task1')}</li>
                <li>{t('experience.vtb.task2')}</li>
                <li>{t('experience.vtb.task3')}</li>
                <li>{t('experience.vtb.task4')}</li>
              </ul>
              <div className="experience-card-tags">
                <span className="experience-tag">Python</span>
                <span className="experience-tag">Go</span>
                <span className="experience-tag">PostgreSQL</span>
                <span className="experience-tag">Docker</span>
                <span className="experience-tag">REST API</span>
              </div>
            </div>
            <div className="experience-card-logo">
              <img src={`${import.meta.env.BASE_URL}logos/vtb.svg`} alt="ВТБ" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
