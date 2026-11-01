import Icon from './Icon.jsx';
import { SITE, telUrl, whatsappUrl } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Floating click-to-call and WhatsApp buttons, visible on every page. */
export default function FloatingContact() {
  const { t } = useLang();
  const phone = SITE.phones[0];
  return (
    <div className="floating-contact">
      <a className="fab fab--call" href={telUrl(phone.tel)} aria-label={t('common.callAria', { number: phone.display })}>
        <Icon name="phone" size={26} />
      </a>
      <a className="fab fab--wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={t('common.whatsappAria')}>
        <Icon name="whatsapp" size={28} />
      </a>
    </div>
  );
}
