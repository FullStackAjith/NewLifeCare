import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import ContactButtons from '../components/ContactButtons.jsx';

const ITEMS = [['followup', 'calendar'], ['counselling', 'message'], ['monitoring', 'trend'], ['family', 'users'], ['relapse', 'shield'], ['continued', 'refresh']];

export default function Aftercare() {
  usePageMeta('aftercare');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('aftercare.hero.eyebrow')} title={t('aftercare.hero.title')} lead={t('aftercare.hero.lead')} />
      <Section narrow>
        <h2>{t('aftercare.intro.title')}</h2>
        <p className="lead">{t('aftercare.intro.text')}</p>
      </Section>
      <Section tone="mist">
        <SectionHead title={t('aftercare.itemsTitle')} align="center" />
        <div className="grid grid--3">
          {ITEMS.map(([id, icon]) => (
            <article className="card" key={id}>
              <span className="icon-badge"><Icon name={icon} size={24} /></span>
              <h3>{t(`aftercare.items.${id}.title`)}</h3>
              <p>{t(`aftercare.items.${id}.text`)}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <div className="card card--accent consult">
          <span className="icon-badge"><Icon name="calendar" size={24} /></span>
          <div>
            <h3>{t('aftercare.consult.title')}</h3>
            <p>{t('aftercare.consult.text')}</p>
          </div>
        </div>
        <p className="form-note form-note--center">{t('aftercare.note')}</p>
      </Section>
      <Section tone="navy" className="cta-band">
        <div className="cta-band__inner">
          <div className="cta-band__copy"><h2>{t('aftercare.cta.title')}</h2><p>{t('aftercare.cta.text')}</p></div>
          <div className="cta-band__actions"><ContactButtons variant="gold" enquiry waMessage={t('aftercare.cta.waMessage')} /></div>
        </div>
      </Section>
    </>
  );
}
