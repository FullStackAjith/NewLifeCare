import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';

const COMPONENTS = [['assessment', 'clipboard'], ['counselling', 'message'], ['rehabilitation', 'trend'], ['family', 'users'], ['discharge', 'home'], ['aftercare', 'refresh']];

export default function TreatmentPrograms() {
  usePageMeta('programs');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('programs.hero.eyebrow')} title={t('programs.hero.title')} lead={t('programs.hero.lead')} />
      <Section narrow>
        <h2>{t('programs.introTitle')}</h2>
        <p className="lead">{t('programs.intro')}</p>
      </Section>
      <Section tone="mist">
        <SectionHead title={t('programs.componentsTitle')} align="center" />
        <div className="grid grid--3">
          {COMPONENTS.map(([id, icon]) => (
            <article className="card" key={id}>
              <span className="icon-badge"><Icon name={icon} size={24} /></span>
              <h3>{t(`programs.components.${id}.title`)}</h3>
              <p>{t(`programs.components.${id}.text`)}</p>
            </article>
          ))}
        </div>
        <p className="form-note">{t('programs.disclaimer')}</p>
      </Section>
      <Section>
        <div className="split split--top">
          <div>
            <SectionHead title={t('programs.confirmTitle')} lead={t('programs.confirmLead')} />
            <dl className="detail-list">
              {t('programs.confirm').map((r) => (
                <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>
              ))}
            </dl>
          </div>
          <aside className="card card--accent">
            <h3>{t('programs.askTitle')}</h3>
            <ul className="check-list">{t('programs.ask').map((a) => <li key={a}><Icon name="check" size={18} />{a}</li>)}</ul>
            <Link className="btn btn-primary" to="/contact">{t('common.askCentre')} <Icon name="arrow" size={18} /></Link>
          </aside>
        </div>
      </Section>
      <EnquiryCTA />
    </>
  );
}
