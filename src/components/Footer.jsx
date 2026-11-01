import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import SocialLinks from './SocialLinks.jsx';
import { SITE, telUrl, mailUrl, whatsappUrl } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';

const EXPLORE = [
  ['/about', 'nav.about'], ['/services', 'nav.services'], ['/treatment-programs', 'nav.programs'],
  ['/rehabilitation-journey', 'nav.journey'], ['/facilities', 'nav.facilities'], ['/team', 'nav.team'], ['/gallery', 'nav.gallery'],
];
const FAMILIES = [
  ['/family-support', 'nav.family'], ['/aftercare', 'nav.aftercare'], ['/testimonials', 'nav.testimonials'],
  ['/faq', 'nav.faq'], [CONFIDENTIAL_PATH, 'nav.confidential'], ['/privacy', 'nav.privacy'],
];

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand brand--light" aria-label={t('brand.homeAria')}>
            <img src="/logo-160.webp" width="93" height="96" alt="" loading="lazy" decoding="async" />
            <span className="brand__text"><span className="brand__name">New Life Care</span><span className="brand__tag">De-addiction &amp; Rehabilitation Centre</span></span>
          </Link>
          <p className="footer-tagline">{t('brand.tagline')}</p>
          <p>{t('footer.about')}</p>
          <SocialLinks className="social-links--light" />
        </div>

        <nav aria-label={t('footer.explore')}>
          <h2 className="footer-title">{t('footer.explore')}</h2>
          <ul>{EXPLORE.map(([to, key]) => <li key={to}><Link to={to}>{t(key)}</Link></li>)}</ul>
        </nav>

        <nav aria-label={t('footer.families')}>
          <h2 className="footer-title">{t('footer.families')}</h2>
          <ul>{FAMILIES.map(([to, key]) => <li key={to}><Link to={to}>{t(key)}</Link></li>)}</ul>
        </nav>

        <div>
          <h2 className="footer-title">{t('footer.contact')}</h2>
          <ul className="footer-contact">
            {SITE.phones.map((p) => (
              <li key={p.tel}><Icon name="phone" size={16} /><a href={telUrl(p.tel)}>{p.display}</a></li>
            ))}
            <li><Icon name="whatsapp" size={16} /><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{t('common.whatsappQuick')}</a></li>
            <li><Icon name="mail" size={16} /><a href={mailUrl()}>{SITE.email}</a></li>
            <li><Icon name="pin" size={16} /><address>{SITE.address.join(', ')}</address></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
          <span>{t('footer.disclaimer', { number: SITE.emergencyNumber })}</span>
        </div>
      </div>
    </footer>
  );
}
