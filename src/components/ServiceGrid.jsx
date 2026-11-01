import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { SERVICES } from '../data/services.js';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function ServiceGrid({ withLinks = true }) {
  const { t } = useLang();
  return (
    <div className="grid grid--4">
      {SERVICES.map((s) => (
        <article className="card card--service" key={s.id}>
          <span className="icon-badge"><Icon name={s.icon} size={24} /></span>
          <h3>{t(`services.items.${s.id}.title`)}</h3>
          <p>{t(`services.items.${s.id}.text`)}</p>
          {withLinks && (
            <Link className="card__link" to={s.id === 'other' ? '/contact' : CONFIDENTIAL_PATH}>
              {t(s.id === 'other' ? 'common.talk' : 'services.cardLink')} <Icon name="arrow" size={16} />
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
