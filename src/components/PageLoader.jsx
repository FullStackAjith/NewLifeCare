import { useLang } from '../i18n/LanguageContext.jsx';

export default function PageLoader() {
  const { t } = useLang();
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{t('common.loading')}</span>
    </div>
  );
}
