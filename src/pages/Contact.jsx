import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import EmergencyNotice from '../components/EmergencyNotice.jsx';
import ContactForm from '../forms/ContactForm.jsx';
import { SITE, telUrl, mailUrl, whatsappUrl } from '../config/site.js';

export default function Contact() {
  usePageMeta('contact');
  const { t } = useLang();
  const avail = SITE.enquiries247Confirmed ? 'availability.label247' : 'availability.labelGeneral';
  return (
    <>
      <PageHero eyebrow={t('contact.hero.eyebrow')} title={t('contact.hero.title')} lead={t('contact.hero.lead')} />

      <Section>
        <div className="contact-layout">
          <aside className="contact-card">
            <h2 className="h3">{t('contact.info.title')}</h2>
            <p>{t('contact.info.text')}</p>
            <ul className="contact-list">
              <li><Icon name="phone" size={20} /><div><small>{t('contact.info.call')}</small>{SITE.phones.map((p) => <a key={p.tel} href={telUrl(p.tel)}>{p.display}</a>)}</div></li>
              <li><Icon name="whatsapp" size={20} /><div><small>{t('contact.info.whatsapp')}</small><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{SITE.whatsapp.display}</a></div></li>
              <li><Icon name="mail" size={20} /><div><small>{t('contact.info.email')}</small><a href={mailUrl()}>{SITE.email}</a></div></li>
              <li><Icon name="pin" size={20} /><div><small>{t('contact.info.visit')}</small><address>{SITE.address.map((l) => <span key={l}>{l}<br /></span>)}</address></div></li>
              <li><Icon name="clock" size={20} /><div><small>{t('common.availability')}</small><strong>{t(avail)}</strong></div></li>
            </ul>
            <div><small className="muted">{t('common.followUs')}</small><SocialLinks className="social-links--light" /></div>
          </aside>
          <ContactForm />
        </div>
      </Section>

      <Section tone="mist">
        <SectionHead eyebrow={t('contact.wa.eyebrow')} title={t('contact.wa.title')} lead={t('contact.wa.lead')} />
        <div className="grid grid--4">
          {t('contact.wa.topics').map((topic, i) => (
            <a className="card card--topic" key={topic.title} href={whatsappUrl(topic.message)} target="_blank" rel="noopener noreferrer">
              <span className="topic__num">0{i + 1}</span>
              <strong>{topic.title}</strong><span>{topic.text}</span>
              <span className="card__link">{t('contact.wa.continue')} <Icon name="external" size={16} /></span>
            </a>
          ))}
        </div>
        <p className="form-note">{t('contact.wa.note')}</p>
      </Section>

      <Section>
        <div className="split split--top">
          <div><SectionHead title={t('contact.map.title')} /><MapEmbed /></div>
          <div>
            <SectionHead title={t('contact.steps.title')} />
            <ol className="number-list">{t('contact.steps.items').map((s) => <li key={s.title}><strong>{s.title}</strong> {s.text}</li>)}</ol>
          </div>
        </div>
      </Section>
      <Section><EmergencyNotice /></Section>
    </>
  );
}
