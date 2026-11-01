import { useCallback, useRef, useState } from 'react';
import { postEnquiry, EnquiryError } from '../lib/api.js';
import { insights } from '../lib/insights.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { SITE } from '../config/site.js';

/**
 * Shared form state: values, per-field error KEYS (translated at render time so language
 * switches update messages), submit status and server feedback.
 */
export default function useEnquiryForm({ initial, validate, buildPayload }) {
  const { t } = useLang();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [serverError, setServerError] = useState('');
  const [reference, setReference] = useState('');
  const formRef = useRef(null);

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: '' } : e));
  }, []);

  const onBlurValidate = (name) => {
    const all = validate(values);
    setErrors((e) => ({ ...e, [name]: all[name] || '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    insights.track('formAttempts');
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found).find((k) => found[k]);
    if (firstInvalid) {
      const el = formRef.current?.querySelector(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      const data = await postEnquiry(buildPayload(values));
      setReference(data?.reference ? String(data.reference) : '');
      setStatus('success');
      setValues(initial);
    } catch (err) {
      const kind = err instanceof EnquiryError ? err.kind : 'server';
      setServerError(t(kind === 'network' ? 'form.networkError' : 'form.serverError', { phone: SITE.phones[0].display }));
      setStatus('error');
    }
  };

  const reset = () => { setStatus('idle'); setServerError(''); setReference(''); };

  return { values, errors, status, serverError, reference, formRef, setField, onBlurValidate, submit, reset, t };
}
