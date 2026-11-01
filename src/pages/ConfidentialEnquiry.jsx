import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import EmergencyNotice from '../components/EmergencyNotice.jsx';
import ConfidentialForm from '../forms/ConfidentialForm.jsx';

export default function ConfidentialEnquiry() {
  usePageMeta('confidential');
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t('confidential.hero.eyebrow')} title={t('confidential.hero.title')} lead={t('confidential.hero.lead')} />
      <Section>
        <div className="contact-layout contact-layout--form-first">
          <ConfidentialForm />
          <aside className="contact-card">
            <h2 className="h3"><Icon name="lock" size={22} /> {t('confidential.privacy.title')}</h2>
            <ul className="check-list check-list--light">
              {t('confidential.privacy.points').map((p) => <li key={p}><Icon name="check" size={18} />{p}</li>)}
            </ul>
            <Link className="btn btn-outline-light btn-sm" to="/privacy">{t('confidential.privacy.link')} <Icon name="arrow" size={16} /></Link>
          </aside>
        </div>
      </Section>
      <Section><EmergencyNotice /></Section>
    </>
  );
}
