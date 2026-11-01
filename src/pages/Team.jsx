import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import ContactButtons from '../components/ContactButtons.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';

const CARDS = [['clinical', 'shield'], ['counselling', 'message'], ['family', 'users']];

export default function Team() {
  usePageMeta('team');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('team.hero.eyebrow')} title={t('team.hero.title')} lead={t('team.hero.lead')} />
      <Section>
        <div className="grid grid--3">
          {CARDS.map(([id, icon]) => (
            <article className="card team-card" key={id}>
              <span className="team-card__photo"><Icon name={icon} size={34} /></span>
              <h3>{t(`team.cards.${id}.title`)}</h3>
              <p>{t(`team.cards.${id}.text`)}</p>
            </article>
          ))}
        </div>
        <p className="form-note form-note--center">{t('team.note')}</p>
      </Section>
      <Section tone="mist" narrow>
        <h2>{t('team.ctaTitle')}</h2>
        <p className="lead">{t('team.ctaText')}</p>
        <ContactButtons />
      </Section>
      <EnquiryCTA />
    </>
  );
}
