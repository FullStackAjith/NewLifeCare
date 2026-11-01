import { useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';

function setMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Page-specific, language-aware <title> and meta description (no extra dependency). */
export default function usePageMeta(pageKey) {
  const { t, lang } = useLang();
  const title = t(`${pageKey}.seo.title`);
  const description = t(`${pageKey}.seo.description`);

  useEffect(() => {
    const full = pageKey === 'home' ? title : `${title} | NEW LIFE CARE`;
    document.title = full;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, [title, description, pageKey, lang]);
}
