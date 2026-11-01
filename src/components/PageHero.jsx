import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Shared page header with breadcrumb. `children` = action buttons, `media` = optional image node. */
export default function PageHero({ eyebrow, title, lead, media, children }) {
  const { t } = useLang();
  return (
    <header className="page-hero">
      <div className={`container page-hero__inner${media ? ' has-media' : ''}`}>
        <div className="page-hero__copy">
          <nav className="breadcrumb" aria-label={t('common.breadcrumb')}>
            <Link to="/">{t('common.home')}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
          {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children && <div className="page-hero__actions">{children}</div>}
        </div>
        {media && <div className="page-hero__media">{media}</div>}
      </div>
    </header>
  );
}
