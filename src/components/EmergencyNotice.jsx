import Icon from './Icon.jsx';
import { SITE, telUrl } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function EmergencyNotice({ className = '' }) {
  const { t } = useLang();
  return (
    <aside className={`notice notice--alert ${className}`.trim()} role="note" aria-labelledby="emergency-title">
      <Icon name="alert" size={26} className="notice__icon" />
      <div>
        <h3 id="emergency-title">{t('emergency.title')}</h3>
        <p>{t('emergency.body', { number: SITE.emergencyNumber })}</p>
        <p className="notice__sub">
          {t('emergency.centre')}{' '}
          {SITE.phones.map((p, i) => (
            <span key={p.tel}><a href={telUrl(p.tel)}>{p.display}</a>{i < SITE.phones.length - 1 ? ', ' : ''}</span>
          ))}
        </p>
      </div>
    </aside>
  );
}
