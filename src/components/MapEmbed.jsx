import { useState } from 'react';
import Icon from './Icon.jsx';
import { mapEmbedUrl, mapLinkUrl } from '../config/site.js';
import { useLang } from '../i18n/LanguageContext.jsx';

/** Google Maps embed that loads only on request (faster page, fewer third-party requests). */
export default function MapEmbed() {
  const { t } = useLang();
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map">
      {loaded ? (
        <iframe
          title={t('contact.map.frameTitle')}
          src={mapEmbedUrl()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map__placeholder">
          <Icon name="pin" size={34} />
          <p>{t('contact.map.loadNote')}</p>
          <button type="button" className="btn btn-primary" onClick={() => setLoaded(true)}>{t('contact.map.load')}</button>
        </div>
      )}
      <a className="btn btn-outline btn-sm map__link" href={mapLinkUrl()} target="_blank" rel="noopener noreferrer">
        {t('contact.map.open')} <Icon name="external" size={16} />
      </a>
      <p className="map__note">{t('contact.map.reveal')}</p>
    </div>
  );
}
