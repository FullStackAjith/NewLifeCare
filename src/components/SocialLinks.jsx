import Icon from './Icon.jsx';
import { SITE } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Official social links: recognisable icons, new tab, accessible names. */
export default function SocialLinks({ className = '' }) {
  const { t } = useLang();
  return (
    <ul className={`social-links ${className}`.trim()}>
      {SITE.social.map((s) => {
        const name = t(`common.social.${s.id}`);
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-link social-link--${s.id}`}
              aria-label={t('common.socialAria', { name })}
              title={name}
            >
              <Icon name={s.icon} size={20} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
