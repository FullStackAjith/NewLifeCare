import { useId } from 'react';

/** Accessible form field wrapper. children is a render-prop receiving aria/id props. */
export default function Field({ label, error, help, children, className = '' }) {
  const id = useId();
  const errId = `${id}-err`;
  const helpId = `${id}-help`;
  const describedBy = [error ? errId : null, help ? helpId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' has-error' : ''} ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      {children({ id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': describedBy })}
      {help && !error && <p className="field__help" id={helpId}>{help}</p>}
      {error && <p className="field__error" id={errId} role="alert">{error}</p>}
    </div>
  );
}
