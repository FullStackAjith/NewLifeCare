import { LANGUAGES, useLang } from '../i18n/LanguageContext.jsx';

/** Segmented EN | தமிழ் control. Reads/writes the central language context. */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label={t('nav.language')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          className={lang === l.code ? 'is-active' : ''}
          aria-pressed={lang === l.code}
          aria-label={l.label}
          onClick={() => setLang(l.code)}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
