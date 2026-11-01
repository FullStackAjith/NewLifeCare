import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Section from './Section.jsx';
import ContactButtons from './ContactButtons.jsx';
import { SITE } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';

/**
 * Prominent enquiry band. Shows "24/7" wording ONLY when SITE.enquiries247Confirmed is true;
 * otherwise falls back to "Contact Us for Enquiries".
 */
export default function EnquiryCTA({ title, text, waMessage }) {
  const { t } = useLang();
  const is247 = SITE.enquiries247Confirmed;
  return (
    <Section tone="navy" className="cta-band">
      <div className="cta-band__inner">
        <div className="cta-band__copy">
          <span className="eyebrow eyebrow--gold"><Icon name="clock" size={16} /> {t(is247 ? 'availability.label247' : 'availability.labelGeneral')}</span>
          <h2>{title || t(is247 ? 'cta.title247' : 'cta.titleGeneral')}</h2>
          <p>{text || t(is247 ? 'cta.body247' : 'cta.bodyGeneral')}</p>
          <p className="cta-band__numbers">
            {SITE.phones.map((p, i) => (
              <a key={p.tel} href={`tel:${p.tel}`}>{p.display}{i < SITE.phones.length - 1 ? ' · ' : ''}</a>
            ))}
          </p>
        </div>
        <div className="cta-band__actions">
          <ContactButtons waMessage={waMessage} variant="gold" />
          <Link className="btn btn-outline-light" to={CONFIDENTIAL_PATH}>
            <Icon name="lock" size={18} /> {t('cta.private')}
          </Link>
        </div>
      </div>
    </Section>
  );
}
