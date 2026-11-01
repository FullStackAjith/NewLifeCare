import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { SITE, telUrl, whatsappUrl } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';

/** Click-to-call + WhatsApp (+ optional confidential enquiry) buttons used in CTAs. */
export default function ContactButtons({ waMessage, callLabel, waLabel, enquiry = false, variant = 'primary', className = '' }) {
  const { t } = useLang();
  const phone = SITE.phones[0];
  return (
    <div className={`btn-row ${className}`.trim()}>
      <a className={`btn btn-${variant}`} href={telUrl(phone.tel)} aria-label={t('common.callAria', { number: phone.display })}>
        <Icon name="phone" size={18} /> {callLabel || t('common.callCentre')}
      </a>
      <a className="btn btn-whatsapp" href={whatsappUrl(waMessage)} target="_blank" rel="noopener noreferrer" aria-label={t('common.whatsappAria')}>
        <Icon name="whatsapp" size={18} /> {waLabel || t('common.whatsapp')}
      </a>
      {enquiry && (
        <Link className="btn btn-outline-light" to={CONFIDENTIAL_PATH}>
          <Icon name="lock" size={18} /> {t('nav.confidential')}
        </Link>
      )}
    </div>
  );
}
