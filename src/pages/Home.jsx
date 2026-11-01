import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import Picture from '../components/Picture.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import ServiceGrid from '../components/ServiceGrid.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';
import EmergencyNotice from '../components/EmergencyNotice.jsx';
import { SITE, whatsappUrl } from '../config/site.js';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';
import { JOURNEY_ICONS } from '../data/services.js';

export default function Home() {
  usePageMeta('home');
  const { t } = useLang();
  const is247 = SITE.enquiries247Confirmed;
  const trust = [
    { icon: 'heart', ...t('home.trust.compassion') },
    { icon: 'users', ...t('home.trust.family') },
    { icon: 'compass', ...t('home.trust.individual') },
    { icon: 'clock', title: t(is247 ? 'availability.trustTitle247' : 'availability.trustTitleGeneral'), text: t('availability.trustText') },
  ];
  const pathIcons = ['heart', 'users', 'trend'];

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">{t('home.hero.eyebrow')}</span>
            <h1>{t('home.hero.title1')} <em>{t('home.hero.title2')}</em></h1>
            <p className="lead">{t('home.hero.lead')}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to={CONFIDENTIAL_PATH}>{t('home.hero.support')} <Icon name="arrow" size={18} /></Link>
              <Link className="btn btn-outline" to="/family-support">{t('home.hero.helping')}</Link>
              <a className="btn btn-whatsapp" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={t('common.whatsappAria')}>
                <Icon name="whatsapp" size={18} /> {t('common.whatsappQuick')}
              </a>
            </div>
            <p className="hero__note"><Icon name="lock" size={16} /> {t('home.hero.note')}</p>
          </div>
          <div className="hero__visual">
            <div className="hero__image">
              <Picture name="hero" alt={t('home.hero.imgAlt')} width={1000} height={675} full={1000} priority sizes="(min-width: 900px) 46vw, 100vw" />
            </div>
            <div className="hero__card">
              <strong>{t('home.hero.cardTitle')}</strong>
              <span>{t('home.hero.cardText')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="container trust-strip__grid">
          {trust.map((item) => (
            <div className="trust-item" key={item.icon}>
              <span className="icon-badge icon-badge--sm"><Icon name={item.icon} size={20} /></span>
              <div><strong>{item.title}</strong><span>{item.text}</span></div>
            </div>
          ))}
        </div>
      </div>

      <Section>
        <div className="split">
          <div className="split__media">
            <Picture name="garden" alt={t('home.about.imgAlt')} />
            <div className="media-label"><strong>{t('home.about.label')}</strong><span>{t('home.about.sub')}</span></div>
          </div>
          <div className="split__text">
            <span className="eyebrow">{t('home.about.eyebrow')}</span>
            <h2>{t('home.about.title')}</h2>
            <p className="lead">{t('home.about.lead')}</p>
            <ul className="check-list">
              {t('home.about.checks').map((c) => <li key={c}><Icon name="check" size={18} />{c}</li>)}
            </ul>
            <Link className="btn btn-primary" to="/about">{t('home.about.cta')} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid grid--3">
          {t('home.pathways').map((p, i) => (
            <div className="card card--flat" key={p.title}>
              <span className="icon-badge"><Icon name={pathIcons[i]} size={24} /></span>
              <h3>{p.title}</h3><p>{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow={t('home.services.eyebrow')} title={t('home.services.title')} lead={t('home.services.lead')}>
          <Link className="btn btn-outline" to="/services">{t('home.services.cta')} <Icon name="arrow" size={18} /></Link>
        </SectionHead>
        <ServiceGrid withLinks={false} />
      </Section>

      <Section tone="mist">
        <SectionHead eyebrow={t('home.journey.eyebrow')} title={t('home.journey.title')} lead={t('home.journey.lead')}>
          <Link className="btn btn-outline" to="/rehabilitation-journey">{t('home.journey.cta')} <Icon name="arrow" size={18} /></Link>
        </SectionHead>
        <ol className="steps">
          {t('journey.stages').map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step__num"><Icon name={JOURNEY_ICONS[i]} size={22} /></span>
              <h3>{s.title}</h3>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="split split--reverse">
          <div className="split__text">
            <span className="eyebrow">{t('home.family.eyebrow')}</span>
            <h2>{t('home.family.title')}</h2>
            <p className="lead">{t('home.family.lead')}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/family-support">{t('home.family.cta')} <Icon name="arrow" size={18} /></Link>
              <Link className="btn btn-outline" to="/aftercare">{t('nav.aftercare')}</Link>
            </div>
          </div>
          <div className="split__media"><Picture name="family" alt={t('home.family.imgAlt')} /></div>
        </div>
      </Section>

      <EnquiryCTA />
      <Section><EmergencyNotice /></Section>
    </>
  );
}
