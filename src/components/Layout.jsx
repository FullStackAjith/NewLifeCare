import { Suspense, lazy, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingContact from './FloatingContact.jsx';
import PageLoader from './PageLoader.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';
import { insights } from '../lib/insights.js';

const ChatWidget = lazy(() => import('./ChatWidget.jsx'));

/** Scroll to top (or to #hash) on navigation and count page views (opt-in, local only). */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
    insights.track('pageViews');
  }, [pathname, hash]);

  useEffect(() => {
    const onClick = (e) => { if (e.target.closest?.('a[href*="wa.me/"]')) insights.track('whatsappClicks'); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}

export default function Layout() {
  const { t } = useLang();
  const [showChat, setShowChat] = useState(false);

  // Load the chat bundle only after the page is idle.
  useEffect(() => {
    const start = () => setShowChat(true);
    if ('requestIdleCallback' in window) { const id = window.requestIdleCallback(start, { timeout: 3000 }); return () => window.cancelIdleCallback(id); }
    const id = setTimeout(start, 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">{t('common.skip')}</a>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
      </main>
      <Footer />
      <FloatingContact />
      {showChat && <Suspense fallback={null}><ChatWidget /></Suspense>}
    </>
  );
}
