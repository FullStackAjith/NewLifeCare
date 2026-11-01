import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Section from '../components/Section.jsx';
import ContactButtons from '../components/ContactButtons.jsx';

export default function NotFound() {
  usePageMeta('notFound');
  const { t } = useLang();
  return (
    <Section narrow className="not-found">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1>{t('notFound.title')}</h1>
      <p className="lead">{t('notFound.text')}</p>
      <div className="btn-row">
        <Link className="btn btn-primary" to="/">{t('notFound.home')}</Link>
      </div>
      <ContactButtons variant="outline" />
    </Section>
  );
}
