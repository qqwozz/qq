import { TranslationKey } from '../i18n'
import { Stats } from '../types'
import { parseHtml } from '../utils'

interface AboutProps {
  t: (key: TranslationKey) => string
  stats: Stats
}

export function AboutSection({ t, stats }: AboutProps) {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-number">001</div>
        <div className="about-grid">
          <div className="anim">
            <div className="about-label">{t('about.label')}</div>
            <div className="about-text">{parseHtml(t('about.text'))}</div>
          </div>
          <div className="about-stats anim">
            <div className="stat-cell">
              <div className="stat-number" data-target={stats.repos}>{stats.repos || <span className="skeleton" />}</div>
              <div className="stat-label">{t('stats.repos')}</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number" data-target={stats.leetcode}>{stats.leetcode || <span className="skeleton" />}</div>
              <div className="stat-label">{t('stats.leetcode')}</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number" data-target={stats.followers}>{stats.followers || <span className="skeleton" />}</div>
              <div className="stat-label">{t('stats.followers')}</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number" data-target={stats.languages}>{stats.languages}</div>
              <div className="stat-label">{t('stats.languages')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
