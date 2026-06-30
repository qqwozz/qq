import { Ref } from 'react'
import { TranslationKey } from '../i18n'

interface NavbarProps {
  t: (key: TranslationKey) => string
  navbarRef: Ref<HTMLElement>
  mobileMenuRef: Ref<HTMLDivElement>
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function Navbar({ t, navbarRef, mobileMenuRef, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
  const close = () => setMobileMenuOpen(false)

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="container">
        <div className="nav-inner">
          <a href="#" className="nav-logo">qqwozz</a>
          <div className="nav-links">
            <a href="#about" className="nav-link">{t('nav.about')}</a>
            <a href="#experience" className="nav-link">{t('nav.experience')}</a>
            <a href="#projects" className="nav-link">{t('nav.projects')}</a>
            <a href="#stack" className="nav-link">{t('nav.stack')}</a>
            <a href="#contact" className="nav-link">{t('nav.contact')}</a>
          </div>
          <a href="#contact" className="nav-contact">{t('nav.contact')}</a>
          <button
            className={`nav-burger${mobileMenuOpen ? ' active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('aria.menu')}
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`} ref={mobileMenuRef}>
        <a href="#about" className="mobile-link" onClick={close}>{t('nav.about')}</a>
        <a href="#experience" className="mobile-link" onClick={close}>{t('nav.experience')}</a>
        <a href="#projects" className="mobile-link" onClick={close}>{t('nav.projects')}</a>
        <a href="#stack" className="mobile-link" onClick={close}>{t('nav.stack')}</a>
        <a href="#contact" className="mobile-link" onClick={close}>{t('nav.contact')}</a>
      </div>
    </nav>
  )
}
