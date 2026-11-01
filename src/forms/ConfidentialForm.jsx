import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import { rules } from '../lib/validation.js';
import { SITE, telUrl } from '../config/site.js';
import useEnquiryForm from './useEnquiryForm.js';

const INITIAL = { name: '', phone: '', contactMethod: '', seeking: '', description: '', callback: 'any', consent: false, website: '' };

const validate = (v) => {
  const e = {
    phone: rules.phone(v.phone),
    contactMethod: rules.select(v.contactMethod),
    seeking: rules.select(v.seeking),
    consent: rules.consent(v.consent),
  };
  if (v.name.trim() && v.name.trim().length < 2) e.name = 'nameShort';
  return e;
};

const buildPayload = (v) => ({
  type: 'confidential',
  name: v.name.trim(),
  phone: v.phone.trim(),
  contactMethod: v.contactMethod,
  seeking: v.seeking,
  callback: v.callback,
  message: v.description.trim(),
  consent: true,
  website: v.website, // honeypot
});

export default function ConfidentialForm() {
  const f = useEnquiryForm({ initial: INITIAL, validate, buildPayload });
  const { t, values, errors, status } = f;
  const successRef = useRef(null);
  const err = (name) => (errors[name] ? t(`form.${errors[name]}`) : '');
  const hasErrors = Object.values(errors).some(Boolean);

  useEffect(() => { if (status === 'success') successRef.current?.focus(); }, [status]);

  if (status === 'success') {
    return (
      <div className="form-card form-success" ref={successRef} tabIndex={-1} role="status">
        <Icon name="check" size={34} className="form-success__icon" />
        <h2>{t('form.successTitle')}</h2>
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
    <form className="form-card" ref={f.formRef} onSubmit={f.submit} noValidate aria-labelledby="cf-title">
      <h2 id="cf-title">{t('confidential.form.title')}</h2>
      <p className="form-card__intro">{t('confidential.form.intro')}</p>

      {hasErrors && <p className="form-alert" role="alert">{t('form.summary')}</p>}

      <div className="form-grid">
        <Field label={t('confidential.form.name.label')} error={err('name')}>
          {(p) => <input {...p} name="name" value={values.name} autoComplete="given-name" placeholder={t('confidential.form.name.placeholder')} maxLength={90} onChange={(e) => f.setField('name', e.target.value)} onBlur={() => f.onBlurValidate('name')} />}
        </Field>
        <Field label={t('confidential.form.phone.label')} error={err('phone')} help={t('confidential.form.phone.help')}>
          {(p) => <input {...p} name="phone" type="tel" inputMode="tel" required value={values.phone} autoComplete="tel" placeholder={t('confidential.form.phone.placeholder')} maxLength={25} onChange={(e) => f.setField('phone', e.target.value)} onBlur={() => f.onBlurValidate('phone')} />}
        </Field>
        <Field label={t('confidential.form.method.label')} error={err('contactMethod')}>
          {(p) => (
            <select {...p} name="contactMethod" required value={values.contactMethod} onChange={(e) => f.setField('contactMethod', e.target.value)}>
              <option value="">{t('contact.form.topic.placeholder')}</option>
              {Object.keys(t('confidential.form.method.options')).map((k) => <option key={k} value={k}>{t(`confidential.form.method.options.${k}`)}</option>)}
            </select>
          )}
        </Field>
        <Field label={t('confidential.form.seeking.label')} error={err('seeking')}>
          {(p) => (
            <select {...p} name="seeking" required value={values.seeking} onChange={(e) => f.setField('seeking', e.target.value)}>
              <option value="">{t('contact.form.topic.placeholder')}</option>
              {Object.keys(t('confidential.form.seeking.options')).map((k) => <option key={k} value={k}>{t(`confidential.form.seeking.options.${k}`)}</option>)}
            </select>
          )}
        </Field>
        <Field label={t('confidential.form.callback.label')}>
          {(p) => (
            <select {...p} name="callback" value={values.callback} onChange={(e) => f.setField('callback', e.target.value)}>
              {Object.keys(t('confidential.form.callback.options')).map((k) => <option key={k} value={k}>{t(`confidential.form.callback.options.${k}`)}</option>)}
            </select>
          )}
        </Field>
        <Field label={t('confidential.form.description.label')} className="field--wide" help={t('confidential.form.description.counter', { n: values.description.length })}>
          {(p) => <textarea {...p} name="description" rows={4} maxLength={300} value={values.description} placeholder={t('confidential.form.description.placeholder')} onChange={(e) => f.setField('description', e.target.value)} />}
        </Field>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="hp" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => f.setField('website', e.target.value)} /></label>
      </div>

      <div className={`consent${errors.consent ? ' has-error' : ''}`}>
        <label>
          <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => f.setField('consent', e.target.checked)} aria-invalid={errors.consent ? 'true' : undefined} aria-describedby={errors.consent ? 'cf-consent-err' : undefined} />
          <span>{t('confidential.form.consent')} <Link to="/privacy">{t('confidential.form.consentLink')}</Link>.</span>
        </label>
        {errors.consent && <p className="field__error" id="cf-consent-err" role="alert">{err('consent')}</p>}
      </div>

      {status === 'error' && <p className="form-alert form-alert--error" role="alert">{f.serverError}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
        <Icon name="lock" size={18} /> {status === 'sending' ? t('form.submitting') : t('confidential.form.submit')}
      </button>
      <p className="form-card__urgent">{t('confidential.urgent')} <a href={telUrl()}>{SITE.phones[0].display}</a></p>
    </form>
  );
}
