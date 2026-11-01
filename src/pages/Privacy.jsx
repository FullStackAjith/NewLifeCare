import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import LocalInsights from '../components/LocalInsights.jsx';

export default function Privacy() {
  usePageMeta('privacy');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('privacy.hero.eyebrow')} title={t('privacy.hero.title')} lead={t('privacy.hero.lead')} />
      <Section narrow>
        {t('privacy.sections').map((s) => <div className="prose-block" key={s.title}><h2 className="h3">{s.title}</h2><p>{s.text}</p></div>)}
        <p className="form-note">{t('privacy.draftNote')}</p>
      </Section>
      <Section tone="mist" narrow><LocalInsights /></Section>
    </>
  );
}
