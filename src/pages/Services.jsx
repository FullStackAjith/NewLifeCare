import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import ServiceGrid from '../components/ServiceGrid.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';

export default function Services() {
  usePageMeta('services');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('services.hero.eyebrow')} title={t('services.hero.title')} lead={t('services.hero.lead')} />
      <Section>
        <ServiceGrid />
        <p className="form-note">{t('services.note')}</p>
      </Section>
      <Section tone="mist">
        <SectionHead title={t('services.whoTitle')} align="center" />
        <div className="grid grid--2">
          {t('services.who').map((w, i) => (
            <article className="card" key={w.title}>
              <span className="icon-badge"><Icon name={i === 0 ? 'heart' : 'users'} size={24} /></span>
              <h3>{w.title}</h3><p>{w.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <EnquiryCTA />
    </>
  );
}
