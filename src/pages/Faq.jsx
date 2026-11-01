import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import FaqList from '../components/FaqList.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';
import { SITE } from '../config/site.js';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';

const LEARN_LINKS = [CONFIDENTIAL_PATH, CONFIDENTIAL_PATH, CONFIDENTIAL_PATH, '/family-support'];

function KnowledgeHub() {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const articles = t('faq.hub.articles');
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => !q || `${a.keywords} ${a.title} ${a.tag} ${a.summary}`.toLowerCase().includes(q));
  }, [articles, query]);
  return (
    <>
      <SectionHead eyebrow={t('faq.hub.eyebrow')} title={t('faq.hub.title')} lead={t('faq.hub.lead')} />
      <div className="search">
        <label htmlFor="kh-search">{t('faq.hub.search')}</label>
        <div className="search__box">
          <Icon name="search" size={18} />
          <input id="kh-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('faq.hub.placeholder')} />
        </div>
      </div>
      <div className="grid grid--3" aria-live="polite">
        {shown.map((a) => {
          const open = openId === a.id;
          return (
            <article className="card knowledge" key={a.id}>
              <span className="tag">{a.tag}</span>
              <h3>{a.title}</h3>
              <p>{open ? a.body : a.summary}</p>
              <button type="button" className="card__link card__link--btn" aria-expanded={open} onClick={() => setOpenId(open ? null : a.id)}>
                {open ? t('faq.hub.close') : t('faq.hub.read')} <Icon name={open ? 'close' : 'arrow'} size={16} />
              </button>
            </article>
          );
        })}
        {shown.length === 0 && <p>{t('faq.hub.none')}</p>}
      </div>
      <p className="form-note">{t('faq.hub.note')}</p>
    </>
  );
}

export default function Faq() {
  usePageMeta('faq');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('faq.hero.eyebrow')} title={t('faq.hero.title')} lead={t('faq.hero.lead')} />
      <Section narrow><FaqList items={t('faq.items', { number: SITE.emergencyNumber })} /></Section>

      <Section tone="mist">
        <SectionHead eyebrow={t('faq.learn.eyebrow')} title={t('faq.learn.title')} lead={t('faq.learn.lead')} />
        <div className="grid grid--4">
          {t('faq.learn.cards').map((c, i) => (
            <article className="card" key={c.title}>
              <span className="tag">{c.tag}</span>
              <h3>{c.title}</h3><p>{c.text}</p>
              <Link className="card__link" to={LEARN_LINKS[i]}>{c.link} <Icon name="arrow" size={16} /></Link>
            </article>
          ))}
        </div>
        <div className="card card--accent tip"><Icon name="clipboard" size={26} /><div><h3>{t('faq.learn.tipTitle')}</h3><p>{t('faq.learn.tipText')}</p></div></div>
      </Section>

      <Section><KnowledgeHub /></Section>
      <EnquiryCTA />
    </>
  );
}
