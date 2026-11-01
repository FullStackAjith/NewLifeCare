import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import SocialLinks from './SocialLinks.jsx';
import { NAV, CONFIDENTIAL_PATH } from '../data/navigation.js';
import { SITE, telUrl, mailUrl, whatsappUrl } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';

const linkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`;

export default function Header() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const navRef = useRef(null);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, []);

  useEffect(() => { closeAll(); }, [pathname, closeAll]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeAll(); };
    const onClick = (e) => { if (navRef.current && !navRef.current.contains(e.target) && !e.target.closest('.menu-btn')) setOpenGroup(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, [closeAll]);

  const availability = SITE.enquiries247Confirmed ? 'availability.topbar247' : 'availability.topbarGeneral';
  const phone = SITE.phones[0];

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar__inner">
          <span>{t('topbar.tagline')}</span>
          <span className="topbar__contact">
            <a href={telUrl(phone.tel)}><Icon name="phone" size={14} /> {phone.display}</a>
            <a href={mailUrl()}><Icon name="mail" size={14} /> {SITE.email}</a>
            <span className="topbar__avail"><Icon name="clock" size={14} /> {t(availability)}</span>
          </span>
        </div>
      </div>

      <div className="navbar">
        <div className="container navbar__inner">
          <Link to="/" className="brand" aria-label={t('brand.homeAria')}>
            <picture>
              <source type="image/avif" srcSet="/logo-320.avif" />
              <img src="/logo-160.webp" srcSet="/logo-160.webp 1x, /logo-320.webp 2x" width="93" height="96" alt="" decoding="async" fetchPriority="high" />
            </picture>
            <span className="brand__text"><span className="brand__name">New Life Care</span><span className="brand__tag">De-addiction &amp; Rehabilitation Centre</span></span>
          </Link>

          <nav id="primary-nav" ref={navRef} className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label={t('nav.label')}>
            <ul className="nav-list">
              {NAV.map((item) =>
                item.type === 'link' ? (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className={linkClass}>{t(item.key)}</NavLink>
                  </li>
                ) : (
                  <li key={item.id} className={`nav-group${openGroup === item.id ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="nav-link nav-group__btn"
                      aria-expanded={openGroup === item.id}
                      aria-controls={`submenu-${item.id}`}
                      onClick={() => setOpenGroup(openGroup === item.id ? null : item.id)}
                    >
                      {t(item.key)} <Icon name="chevron" size={16} />
                    </button>
                    <ul id={`submenu-${item.id}`} className="submenu">
                      {item.items.map((sub) => (
                        <li key={sub.to}><NavLink to={sub.to} className={linkClass}>{t(sub.key)}</NavLink></li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ul>

            <div className="nav-drawer-extra">
              <Link className="btn btn-gold" to={CONFIDENTIAL_PATH}><Icon name="lock" size={18} /> {t('nav.confidential')}</Link>
              <div className="btn-row">
                <a className="btn btn-outline" href={telUrl(phone.tel)}><Icon name="phone" size={18} /> {t('common.call')}</a>
                <a className="btn btn-whatsapp" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={18} /> {t('common.whatsapp')}</a>
              </div>
              <SocialLinks />
            </div>
          </nav>

          <div className="nav-actions">
            <LanguageSwitcher />
            <Link className="btn btn-gold btn-sm nav-cta" to={CONFIDENTIAL_PATH}><Icon name="lock" size={16} /> {t('nav.confidential')}</Link>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              aria-label={t(menuOpen ? 'nav.menuClose' : 'nav.menuOpen')}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
