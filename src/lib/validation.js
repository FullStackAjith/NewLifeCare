const PHONE_CHARS = /^[+()\d .-]+$/;

export function isValidPhone(value) {
  const v = (value || '').trim();
  if (!PHONE_CHARS.test(v)) return false;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/** Each rule returns a translation key (relative to `form.`) or ''. */
export const rules = {
  name: (v) => ((v || '').trim().length < 2 ? 'nameShort' : ''),
  phone: (v) => (!(v || '').trim() ? 'required' : isValidPhone(v) ? '' : 'phoneInvalid'),
  select: (v) => (!v ? 'selectRequired' : ''),
  consent: (v) => (v ? '' : 'consentRequired'),
};
