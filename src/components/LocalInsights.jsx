import { useSyncExternalStore } from 'react';
import { insights } from '../lib/insights.js';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Existing opt-in, local-only activity snapshot. Nothing leaves the browser. */
export default function LocalInsights() {
  const { t } = useLang();
  const s = useSyncExternalStore(insights.subscribe, insights.get);
  const show = (n) => (s.enabled ? String(n) : '—');
  const cells = [
    ['views', s.pageViews], ['wa', s.whatsappClicks], ['forms', s.formAttempts],
  ];
  return (
    <div className="card insights">
      <h3>{t('privacy.insights.title')}</h3>
      <p>{t('privacy.insights.lead')}</p>
      <div className="insights__controls">
        <label className="consent-inline">
          <input type="checkbox" checked={s.enabled} onChange={(e) => { insights.setEnabled(e.target.checked); if (e.target.checked) insights.reset(); }} />
          <span>{t('privacy.insights.optIn')}</span>
        </label>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => insights.reset()}>{t('privacy.insights.reset')}</button>
      </div>
      <div className="insights__grid">
        {cells.map(([k, n]) => (
          <div key={k}>
            <span>{t(`privacy.insights.${k}`)}</span>
            <strong>{show(n)}</strong>
            <small>{t(`privacy.insights.${k}Sub`)}</small>
          </div>
        ))}
      </div>
      <p className="form-note">{t('privacy.insights.note')}</p>
    </div>
  );
}
