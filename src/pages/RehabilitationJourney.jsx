import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import ContactButtons from '../components/ContactButtons.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';
import { JOURNEY_ICONS } from '../data/services.js';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';
import { whatsappUrl } from '../config/site.js';

export default function RehabilitationJourney() {
  usePageMeta('journey');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('journey.hero.eyebrow')} title={t('journey.hero.title')} lead={t('journey.hero.lead')}>
        <Link className="btn btn-gold" to={CONFIDENTIAL_PATH}>{t('journey.ctaConsult')} <Icon name="arrow" size={18} /></Link>
      </PageHero>

      <Section>
        <SectionHead title={t('journey.stagesTitle')} align="center" />
        <ol className="timeline">
          {t('journey.stages').map((s, i) => (
            <li className="timeline__item" key={s.title}>
              <div className="timeline__card">
                <span className="timeline__stage">{t('journey.stage', { n: i + 1 })}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <span className="timeline__marker" aria-hidden="true"><Icon name={JOURNEY_ICONS[i]} size={24} /></span>
            </li>
          ))}
        </ol>
        <p className="form-note form-note--center">{t('journey.note')}</p>
      </Section>

      <Section tone="mist">
        <SectionHead title={t('journey.startTitle')} lead={t('journey.startLead')} align="center" />
        <ol className="steps steps--4">
          {t('journey.start').map((s, i) => (
            <li className="step step--card" key={s.title}>
              <span className="step__num">{i + 1}</span>
              <h3>{s.title}</h3><p>{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy" className="cta-band">
        <div className="cta-band__inner">
          <div className="cta-band__copy"><h2>{t('journey.ctaTitle')}</h2><p>{t('journey.ctaText')}</p></div>
          <div className="cta-band__actions">
            <ContactButtons variant="gold" enquiry waMessage={t('contact.wa.topics.3.message')} />
          </div>
        </div>
      </Section>
      <EnquiryCTA />
    </>
  );
}
