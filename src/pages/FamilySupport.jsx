import { useState } from 'react';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import Picture from '../components/Picture.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import FaqList from '../components/FaqList.jsx';
import EmergencyNotice from '../components/EmergencyNotice.jsx';
import ContactButtons from '../components/ContactButtons.jsx';
import { SITE } from '../config/site.js';

const GUIDE_ICONS = ['heart', 'clipboard', 'lock', 'refresh'];
const COMM_ICONS = ['message', 'users', 'shield', 'heart'];

function Checklist() {
  const { t } = useLang();
  const items = t('family.checklist.items');
  const [done, setDone] = useState(() => new Set());
  const toggle = (i) => setDone((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <div className="card checklist">
      <h3>{t('family.checklist.title')}</h3>
      <p>{t('family.checklist.lead')}</p>
      <ul>
        {items.map((item, i) => (
          <li key={item}>
            <label><input type="checkbox" checked={done.has(i)} onChange={() => toggle(i)} /><span>{item}</span></label>
          </li>
        ))}
      </ul>
      <div className="checklist__foot">
        <span aria-live="polite">{t('family.checklist.progress', { done: done.size, total: items.length })}</span>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setDone(new Set())}>{t('family.checklist.reset')}</button>
      </div>
    </div>
  );
}

export default function FamilySupport() {
  usePageMeta('family');
  const { t } = useLang();
  return (
    <>
      <PageHero
        eyebrow={t('family.hero.eyebrow')} title={t('family.hero.title')} lead={t('family.hero.lead')}
        media={<Picture name="family" alt={t('family.hero.imgAlt')} priority sizes="(min-width: 900px) 40vw, 100vw" />}
      />

      <Section>
        <div className="split split--top">
          <div className="split__text">
            <h2>{t('family.understand.title')}</h2>
            <p className="lead">{t('family.understand.text')}</p>
          </div>
          <ul className="check-list card card--accent">{t('family.understand.points').map((p) => <li key={p}><Icon name="check" size={18} />{p}</li>)}</ul>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHead title={t('family.support.title')} align="center" />
        <div className="grid grid--2">
          <div className="card card--do">
            <h3><Icon name="check" size={22} /> {t('family.support.dos')}</h3>
            <ul className="bullet-list">{t('family.support.doList').map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="card card--dont">
            <h3><Icon name="close" size={22} /> {t('family.support.donts')}</h3>
            <ul className="bullet-list">{t('family.support.dontList').map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="split split--top">
          <div className="split__text">
            <h2>{t('family.counselling.title')}</h2>
            <p className="lead">{t('family.counselling.text')}</p>
            <h2 className="mt">{t('family.involvement.title')}</h2>
            <p className="lead">{t('family.involvement.text')}</p>
          </div>
          <Picture name="counselling" alt={t('facilities.items.counselling.alt')} />
        </div>
      </Section>

      <Section tone="mist">
        <SectionHead title={t('family.communication.title')} align="center" />
        <div className="grid grid--4">
          {t('family.communication.items').map((c, i) => (
            <article className="card" key={c.title}>
              <span className="icon-badge"><Icon name={COMM_ICONS[i]} size={24} /></span>
              <h3>{c.title}</h3><p>{c.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead title={t('family.guide.title')} />
        <div className="grid grid--4">
          {t('family.guide.items').map((g, i) => (
            <article className="card card--flat" key={g.title}>
              <span className="icon-badge icon-badge--sm"><Icon name={GUIDE_ICONS[i]} size={20} /></span>
              <h3>{g.title}</h3><p>{g.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <div className="split split--top">
          <Checklist />
          <div>
            <h2>{t('family.faqTitle')}</h2>
            <FaqList items={t('family.faq')} />
          </div>
        </div>
      </Section>

      <Section narrow>
        <h2>{t('family.seekTitle')}</h2>
        <ol className="number-list">{t('family.seek', { number: SITE.emergencyNumber }).map((s) => <li key={s}>{s}</li>)}</ol>
        <EmergencyNotice />
      </Section>

      <Section tone="navy" className="cta-band">
        <div className="cta-band__inner">
          <div className="cta-band__copy">
            <span className="eyebrow eyebrow--gold"><Icon name="heart" size={16} /> {t('nav.family')}</span>
            <h2>{t('family.cta.title')}</h2>
            <p>{t('family.cta.text')}</p>
          </div>
          <div className="cta-band__actions">
            <ContactButtons variant="gold" callLabel={t('family.cta.call')} waLabel={t('family.cta.whatsapp')} waMessage={t('family.cta.waMessage')} />
          </div>
        </div>
      </Section>
    </>
  );
}
