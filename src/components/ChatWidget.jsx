import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { SITE } from '../config/site.js';
import { postChat } from '../lib/api.js';
import { useLang } from '../i18n/LanguageContext.jsx';

let nextId = 1;

/** Existing help-chat feature, now a bilingual React component. Falls back to prepared replies when the API is off. */
export default function ChatWidget() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const prepared = (question) => {
    const q = question.toLowerCase();
    for (const topic of ['contact', 'fees', 'admission', 'treatment', 'address']) {
      if (t(`chat.keywords.${topic}`).some((k) => q.includes(k.toLowerCase()))) return t(`chat.replies.${topic}`);
    }
    return t('chat.replies.fallback');
  };

  const ask = async (question) => {
    const q = question.trim();
    if (!q) return;
    const pendingId = nextId++;
    setMessages((m) => [...m, { id: nextId++, who: 'user', text: q }, { id: pendingId, who: 'bot', text: t('chat.thinking') }]);
    let reply;
    try {
      reply = await postChat(q, lang);
    } catch {
      reply = `${prepared(q)} ${t('chat.demo')}`;
    }
    setMessages((m) => m.map((x) => (x.id === pendingId ? { ...x, text: reply } : x)));
  };

  const submit = (e) => {
    e.preventDefault();
    const q = text;
    setText('');
    ask(q);
  };

  const quick = t('chat.quick');
  const quickTopics = ['contact', 'treatment', 'admission'];

  return (
    <div className="chat">
      {open && (
        <section className="chat__panel" role="dialog" aria-label={t('chat.title')}>
          <header className="chat__head">
            <div>
              <strong>{t('chat.title')}</strong>
              <span>{t('chat.subtitle')}</span>
            </div>
            <button type="button" className="chat__close" onClick={() => setOpen(false)} aria-label={t('chat.close')}>
              <Icon name="close" size={20} />
            </button>
          </header>
          <div className="chat__messages" ref={listRef} aria-live="polite">
            <div className="bubble">{t('chat.greeting')}</div>
            {messages.map((m) => (
              <div key={m.id} className={`bubble${m.who === 'user' ? ' bubble--user' : ''}`}>{m.text}</div>
            ))}
          </div>
          <div className="chat__quick">
            {quick.map((label, i) => (
              <button key={quickTopics[i]} type="button" onClick={() => ask(label)}>{label}</button>
            ))}
          </div>
          <p className="chat__emergency">{t('chat.emergency', { number: SITE.emergencyNumber })}</p>
          <form className="chat__form" onSubmit={submit}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t('chat.placeholder')} aria-label={t('chat.placeholder')} autoComplete="off" maxLength={500} />
            <button type="submit" aria-label={t('chat.send')}><Icon name="send" size={18} /></button>
          </form>
        </section>
      )}
      <button type="button" className="chat__launch" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={t('chat.open')}>
        <Icon name="message" size={20} /> <span>{t('chat.launch')}</span>
      </button>
    </div>
  );
}
