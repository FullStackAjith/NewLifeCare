import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import en from './en.js';

export const LANGUAGES = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ta', short: 'தமிழ்', label: 'தமிழ்' },
];

// English ships in the main bundle; Tamil is loaded on demand (separate chunk).
const LOADERS = { ta: () => import('./ta.js') };
const SUPPORTED = ['en', 'ta'];
const STORAGE_KEY = 'nlc-language';

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch {
    /* storage unavailable (private mode etc.) */
  }
  return 'en';
}

function lookup(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

function interpolate(value, vars) {
  if (!vars) return value;
  if (typeof value === 'string') return value.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? ''));
  if (Array.isArray(value)) return value.map((v) => interpolate(v, vars));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, interpolate(v, vars)]));
  return value;
}

/** Pure translate function. Falls back to English, then to the key. */
export function translate(dict, path, vars) {
  let value = lookup(dict, path);
  if (value === undefined) value = lookup(en, path);
  if (value === undefined) {
    if (import.meta.env?.DEV) console.warn(`[i18n] Missing key: ${path}`);
    return path;
  }
  return interpolate(value, vars);
}

let tamilFontRequested = false;
function ensureTamilFont() {
  if (tamilFontRequested || typeof document === 'undefined') return;
  tamilFontRequested = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLanguage);
  const [dicts, setDicts] = useState({ en });

  // Load a language's dictionary the first time it is needed.
  useEffect(() => {
    if (dicts[lang] || !LOADERS[lang]) return undefined;
    let cancelled = false;
    LOADERS[lang]().then((m) => { if (!cancelled) setDicts((d) => ({ ...d, [lang]: m.default })); });
    return () => { cancelled = true; };
  }, [lang, dicts]);

  const setLang = useCallback((next) => {
    if (!SUPPORTED.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  // Text stays in the current language until the requested dictionary has arrived (no flash of mixed content).
  const ready = Boolean(dicts[lang]);
  const [shown, setShown] = useState(ready ? lang : 'en');
  useEffect(() => { if (ready) setShown(lang); }, [ready, lang]);
  const activeLang = ready ? lang : shown;
  const appShown = useRef(false); // true once the app has rendered at least once
  useEffect(() => { if (ready) appShown.current = true; });

  useEffect(() => {
    document.documentElement.lang = activeLang;
    document.documentElement.dataset.lang = activeLang;
    if (activeLang === 'ta') ensureTamilFont();
  }, [activeLang]);

  const t = useCallback((path, vars) => translate(dicts[activeLang] || en, path, vars), [dicts, activeLang]);
  const value = useMemo(() => ({ lang: activeLang, setLang, t }), [activeLang, setLang, t]);

  // Only on first load for returning Tamil visitors: a minimal loader until the Tamil chunk arrives.
  // Switching languages later never unmounts the app (keeps scroll position and form input).
  if (lang === 'ta' && !ready && !appShown.current) {
    return <div className="page-loader" role="status" aria-live="polite"><span className="spinner" aria-hidden="true" /><span>Loading… / ஏற்றப்படுகிறது…</span></div>;
  }
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
