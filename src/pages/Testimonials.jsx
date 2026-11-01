import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import ContactButtons from '../components/ContactButtons.jsx';
import { TESTIMONIALS } from '../data/testimonials.js';

const ICONS = ['shield', 'lock', 'alert'];

export default function Testimonials() {
  usePageMeta('testimonials');
  const { t, lang } = useLang();
  return (
    <>
      <PageHero eyebrow={t('testimonials.hero.eyebrow')} title={t('testimonials.hero.title')} lead={t('testimonials.hero.lead')} />
      <Section>
        {TESTIMONIALS.length > 0 ? (
          <div className="grid grid--3">
            {TESTIMONIALS.filter((x) => x.consent === true).map((x) => (
              <figure className="card quote" key={x.id}>
                <Icon name="quote" size={28} />
                <blockquote>{x.quote[lang] || x.quote.en}</blockquote>
                <figcaption>{x.author[lang] || x.author.en}<span className="badge badge--static">{t('testimonials.verified')}</span></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="quote" size={36} />
            <h2 className="h3">{t('testimonials.emptyTitle')}</h2>
            <p>{t('testimonials.emptyText')}</p>
          </div>
        )}
      </Section>
      <Section tone="mist">
        <SectionHead title={t('testimonials.principlesTitle')} align="center" />
        <div className="grid grid--3">
          {t('testimonials.principles').map((p, i) => (
            <article className="card" key={p.title}>
              <span className="icon-badge"><Icon name={ICONS[i]} size={24} /></span>
              <h3>{p.title}</h3><p>{p.text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section narrow>
        <h2>{t('testimonials.ctaTitle')}</h2>
        <p className="lead">{t('testimonials.ctaText')}</p>
        <ContactButtons />
      </Section>
    </>
  );
}
