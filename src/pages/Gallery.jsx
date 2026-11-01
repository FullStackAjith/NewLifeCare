import { useRef, useState } from 'react';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import Picture from '../components/Picture.jsx';
import PageHero from '../components/PageHero.jsx';
import Section, { SectionHead } from '../components/Section.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import EnquiryCTA from '../components/EnquiryCTA.jsx';
import { GALLERY, VIDEOS } from '../data/gallery.js';

export default function Gallery() {
  usePageMeta('gallery');
  const { t } = useLang();
  const dialogRef = useRef(null);
  const [active, setActive] = useState(null);

  const open = (item) => {
    setActive(item);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <PageHero eyebrow={t('gallery.hero.eyebrow')} title={t('gallery.hero.title')} lead={t('gallery.hero.lead')} />
      <Section>
        <p className="notice notice--info"><Icon name="image" size={22} className="notice__icon" /><span>{t('gallery.notice')}</span></p>
        <SectionHead title={t('gallery.photosTitle')} />
        <ul className="gallery-grid">
          {GALLERY.map((item) => (
            <li key={item.id}>
              <button type="button" className="gallery-item" onClick={() => open(item)} aria-label={t('gallery.open', { title: t(item.titleKey) })}>
                <Picture name={item.image} alt={t(item.altKey)} sizes="(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw" />
                <span className="gallery-item__cap">{t(item.titleKey)}</span>
                {item.illustrative && <span className="badge">{t('common.illustrative')}</span>}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mist">
        <div className="split">
          <div className="video-card">
            {VIDEOS.map((v) => (
              <video key={v.id} controls playsInline preload="none" poster="/images/hero.webp" aria-label={t('gallery.videoLabel')}>
                <source src={v.src} type="video/mp4" />
                {t('gallery.videoUnsupported')}
              </video>
            ))}
          </div>
          <div className="split__text">
            <span className="badge badge--static"><Icon name="play" size={14} /> {t('gallery.videoTitle')}</span>
            <p className="lead">{t('gallery.videoText')}</p>
            <p className="form-note">{t('gallery.videoNote')}</p>
          </div>
        </div>
      </Section>

      <Section narrow>
        <h2>{t('gallery.channelTitle')}</h2>
        <p className="lead">{t('gallery.channelText')}</p>
        <SocialLinks className="social-links--lg" />
      </Section>
      <EnquiryCTA />

      <dialog ref={dialogRef} className="lightbox" onClose={() => setActive(null)} onClick={(e) => { if (e.target === dialogRef.current) close(); }} aria-label={active ? t(active.titleKey) : undefined}>
        {active && (
          <figure>
            <Picture name={active.image} alt={t(active.altKey)} sizes="90vw" priority />
            <figcaption>{t(active.titleKey)} {active.illustrative && <span>· {t('common.illustrative')}</span>}</figcaption>
          </figure>
        )}
        <button type="button" className="lightbox__close" onClick={close} aria-label={t('gallery.close')}><Icon name="close" size={22} /></button>
      </dialog>
    </>
  );
}
