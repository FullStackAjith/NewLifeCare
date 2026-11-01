import { useEffect, useRef } from 'react';

/** Page section with optional tone and a one-time, subtle reveal when scrolled into view. */
export default function Section({ tone = 'default', id, className = '', narrow = false, children, ariaLabelledby }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in-view');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className={`section section--${tone} ${className}`.trim()} aria-labelledby={ariaLabelledby}>
      <div ref={ref} className={`container reveal${narrow ? ' container--narrow' : ''}`}>{children}</div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, align = 'left', id, children }) {
  return (
    <div className={`section-head section-head--${align}`}>
      <div className="section-head__text">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 id={id}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children && <div className="section-head__action">{children}</div>}
    </div>
  );
}
