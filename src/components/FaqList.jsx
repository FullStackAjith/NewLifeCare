import Icon from './Icon.jsx';

/** Zero-JS accessible accordion built on native <details>/<summary>. */
export default function FaqList({ items }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details className="faq-item" key={i}>
          <summary>
            <span>{item.q}</span>
            <Icon name="chevron" size={20} className="faq-item__chevron" />
          </summary>
          <div className="faq-item__answer"><p>{item.a}</p></div>
        </details>
      ))}
    </div>
  );
}
