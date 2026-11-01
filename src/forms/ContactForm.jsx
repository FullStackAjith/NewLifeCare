import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import { rules } from '../lib/validation.js';
import { telUrl } from '../config/site.js';
import { CONFIDENTIAL_PATH } from '../data/navigation.js';
import useEnquiryForm from './useEnquiryForm.js';

const INITIAL = { name: '', phone: '', service: '', callback: '', consent: false, website: '' };
const TOPICS = ['Alcohol addiction support', 'Drug addiction support', 'Tobacco support', 'Counselling', 'Family counselling', 'Rehabilitation', 'Aftercare support', 'Appointment or consultation', 'Admission and fees', 'Other enquiry'];
const CALLBACKS = ['', 'morning', 'afternoon', 'evening'];

const validate = (v) => ({
  name: rules.name(v.name),
  phone: rules.phone(v.phone),
  service: rules.select(v.service),
  consent: rules.consent(v.consent),
});

const buildPayload = (v) => ({
  type: 'general',
  name: v.name.trim(),
  phone: v.phone.trim(),
  service: v.service,
  callback: v.callback,
  consent: true,
  website: v.website,
});

export default function ContactForm() {
  const f = useEnquiryForm({ initial: INITIAL, validate, buildPayload });
  const { t, values, errors, status } = f;
  const successRef = useRef(null);
  const err = (n) => (errors[n] ? t(`form.${errors[n]}`) : '');
  const hasErrors = Object.values(errors).some(Boolean);
  useEffect(() => { if (status === 'success') successRef.current?.focus(); }, [status]);

  if (status === 'success') {
    return (
      <div className="form-card form-success" ref={successRef} tabIndex={-1} role="status">
        <Icon name="check" size={34} className="form-success__icon" />
        <h3>{t('form.successTitle')}</h3>
        <p>{t('form.successBody')}</p>
        {f.reference && <p className="form-success__ref">{t('form.reference', { ref: f.reference })}</p>}
        <div className="btn-row">
          <a className="btn btn-primary" href={telUrl()}><Icon name="phone" size={18} /> {t('common.callCentre')}</a>
          <button type="button" className="btn btn-outline" onClick={f.reset}>{t('form.sendAnother')}</button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" ref={f.formRef} onSubmit={f.submit} noValidate aria-labelledby="ct-title">
      <h2 id="ct-title" className="h3">{t('contact.form.title')}</h2>
      <p className="form-card__intro">{t('contact.form.intro')}</p>
      {hasErrors && <p className="form-alert" role="alert">{t('form.summary')}</p>}
      <div className="form-grid">
        <Field label={t('contact.form.name.label')} error={err('name')}>
          {(p) => <input {...p} name="name" required value={values.name} autoComplete="name" placeholder={t('contact.form.name.placeholder')} maxLength={90} onChange={(e) => f.setField('name', e.target.value)} onBlur={() => f.onBlurValidate('name')} />}
        </Field>
        <Field label={t('contact.form.phone.label')} error={err('phone')}>
          {(p) => <input {...p} name="phone" type="tel" inputMode="tel" required value={values.phone} autoComplete="tel" placeholder={t('contact.form.phone.placeholder')} maxLength={25} onChange={(e) => f.setField('phone', e.target.value)} onBlur={() => f.onBlurValidate('phone')} />}
        </Field>
        <Field label={t('contact.form.topic.label')} error={err('service')} className="field--wide">
          {(p) => (
            <select {...p} name="service" required value={values.service} onChange={(e) => f.setField('service', e.target.value)}>
              <option value="">{t('contact.form.topic.placeholder')}</option>
              {TOPICS.map((k) => <option key={k} value={k}>{t(`contact.form.topic.options.${k}`)}</option>)}
            </select>
          )}
        </Field>
        <Field label={t('contact.form.callback.label')} className="field--wide">
          {(p) => (
            <select {...p} name="callback" value={values.callback} onChange={(e) => f.setField('callback', e.target.value)}>
              {CALLBACKS.map((k) => <option key={k} value={k}>{t(`contact.form.callback.options.${k}`)}</option>)}
            </select>
          )}
        </Field>
      </div>
      <div className="hp" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => f.setField('website', e.target.value)} /></label>
      </div>
      <div className={`consent${errors.consent ? ' has-error' : ''}`}>
        <label>
          <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => f.setField('consent', e.target.checked)} aria-invalid={errors.consent ? 'true' : undefined} aria-describedby={errors.consent ? 'ct-consent-err' : undefined} />
          <span>{t('contact.form.consent')} <Link to="/privacy">{t('contact.form.consentLink')}</Link>.</span>
        </label>
        {errors.consent && <p className="field__error" id="ct-consent-err" role="alert">{err('consent')}</p>}
      </div>
      {status === 'error' && <p className="form-alert form-alert--error" role="alert">{f.serverError}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? t('form.submitting') : t('contact.form.submit')} <Icon name="arrow" size={18} />
      </button>
      <p className="form-card__note">{t('contact.form.note')} <Link to={CONFIDENTIAL_PATH}>{t('contact.form.privateLink')}</Link></p>
    </form>
  );
}
