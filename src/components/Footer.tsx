import { TranslationKey } from '../i18n'
interface FooterProps {
  t: (key: TranslationKey) => string
}

export function Footer({ t }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-copy">&copy; {currentYear} qqwozz</span>
          <div className="footer-links">
            <a href="https://github.com/qqwozz" target="_blank" rel="noreferrer">github</a>
            <a href="https://t.me/qqqwozz" target="_blank" rel="noreferrer">telegram</a>
            <a href="https://instagram.com/qqqwozz" target="_blank" rel="noreferrer">instagram</a>
            <a href="https://leetcode.com/u/oonixxxxx/" target="_blank" rel="noreferrer">leetcode</a>
            <a href="#contact">{t('footer.contact')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
