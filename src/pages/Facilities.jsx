import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import Picture from '../components/Picture.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';

const ITEMS = ['garden', 'room', 'common', 'counselling'];

export default function Facilities() {
  usePageMeta('facilities');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('facilities.hero.eyebrow')} title={t('facilities.hero.title')} lead={t('facilities.hero.lead')} />
      <Section>
        <p className="notice notice--info"><Icon name="image" size={22} className="notice__icon" /><span>{t('facilities.notice')}</span></p>
        <div className="grid grid--2">
          {ITEMS.map((id) => (
            <figure className="photo-card" key={id}>
              <Picture name={id} alt={t(`facilities.items.${id}.alt`)} />
              <figcaption><strong>{t(`facilities.items.${id}.title`)}</strong><span>{t(`facilities.items.${id}.text`)}</span></figcaption>
              <span className="badge">{t('common.illustrative')}</span>
            </figure>
          ))}
        </div>
      </Section>
      <Section tone="mist" narrow>
        <h2>{t('facilities.askTitle')}</h2>
        <ul className="check-list">{t('facilities.ask').map((a) => <li key={a}><Icon name="check" size={18} />{a}</li>)}</ul>
        <p className="form-note">{t('facilities.askNote')}</p>
      </Section>
      <EnquiryCTA />
    </>
  );
}
