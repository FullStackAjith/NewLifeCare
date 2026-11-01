import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import Picture from '../components/Picture.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';
import { SITE, telUrl, mailUrl } from '../config/site.js';

const VALUES = [['respect', 'heart'], ['family', 'users'], ['clarity', 'shield'], ['continuity', 'refresh']];

export default function About() {
  usePageMeta('about');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('about.hero.eyebrow')} title={t('about.hero.title')} lead={t('about.hero.lead')} />
      <Section>
        <div className="split">
          <div className="split__media"><Picture name="garden" alt={t('about.story.imgAlt')} /></div>
          <div className="split__text">
            <h2>{t('about.story.title')}</h2>
            <p className="lead">{t('about.story.lead')}</p>
            <ul className="check-list">{t('about.story.checks').map((c) => <li key={c}><Icon name="check" size={18} />{c}</li>)}</ul>
            <p className="form-note">{t('about.note')}</p>
          </div>
        </div>
      </Section>
      <Section tone="mist">
        <SectionHead title={t('about.valuesTitle')} align="center" />
        <div className="grid grid--4">
          {VALUES.map(([id, icon]) => (
            <article className="card" key={id}>
              <span className="icon-badge"><Icon name={icon} size={24} /></span>
              <h3>{t(`about.values.${id}.title`)}</h3>
              <p>{t(`about.values.${id}.text`)}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHead title={t('about.visitTitle')} />
        <ul className="contact-list contact-list--row">
          <li><Icon name="pin" size={20} /><address>{SITE.address.join(', ')}</address></li>
          <li><Icon name="phone" size={20} /><a href={telUrl()}>{SITE.phones[0].display}</a></li>
          <li><Icon name="mail" size={20} /><a href={mailUrl()}>{SITE.email}</a></li>
        </ul>
        <Link className="btn btn-outline" to="/contact">{t('nav.contact')} <Icon name="arrow" size={18} /></Link>
      </Section>
      <EnquiryCTA />
    </>
  );
}
