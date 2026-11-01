# NEW LIFE CARE – Rehabilitation Centre Website (v2)

Multi-page, bilingual (English + தமிழ்), responsive React + Vite site for NEW LIFE CARE, Coimbatore.
Palette from the original brand: Royal Navy `#142B4A`, Gold `#C9A45C`, Mist `#EAF0F6`.
The original single-page site is preserved in `legacy/` for reference.

## Run

```bash
npm install
cp .env.example .env          # add SMTP / OpenAI credentials only if you use them
npm run server                # terminal 1 – API on :3000
npm run dev                   # terminal 2 – Vite (proxies /api to :3000)
```

Production: `npm run build`, then `npm start`. The Express server now also serves `dist/` and falls back to
`index.html`, so **direct URLs (e.g. `/family-support`) work on refresh**. If you host the frontend on a static
host instead, add an SPA fallback rewrite to `/index.html` (Netlify `_redirects`: `/*  /index.html  200`).

`npm run check:i18n` verifies English and Tamil have identical keys and placeholders.

## Pages (React Router, lazy-loaded chunks)

`/` Home · `/about` · `/services` · `/treatment-programs` · `/rehabilitation-journey` · `/facilities` · `/team` ·
`/family-support` · `/aftercare` · `/gallery` · `/testimonials` · `/faq` · `/contact` · `/confidential-enquiry` ·
plus `/privacy` (existing privacy + opt-in local activity snapshot) and a 404 page.

## Structure

```
src/
  config/site.js        verified phones, WhatsApp, email, address, social links, 24/7 flag
  i18n/                 en.js, ta.js (identical structure), LanguageContext (t(), persistence, lazy Tamil chunk)
  components/           Header, Footer, Layout, FloatingContact, ChatWidget, PageHero, Section, Picture, …
  forms/                ConfidentialForm, ContactForm, useEnquiryForm (shared validation/submit state)
  pages/                one file per route
  data/                 navigation, services, gallery, testimonials (add real, consented items here)
  lib/                  api client, validation, local insights
  styles.css, styles/pages.css
server/index.js         existing Express API (extended – see below)
legacy/                 original siteContent.html / styles.css / main.jsx (not bundled)
```

## Things the centre must confirm or supply before launch

1. **24/7 wording.** The original site said "24/7 enquiries". Because availability was not confirmed, the new site
   shows **"Contact us for enquiries"** everywhere. Once the centre confirms enquiries are really monitored around
   the clock, set `VITE_ENQUIRIES_247=true` and rebuild – every 24/7 label switches automatically.
2. **Real photos & video.** No photographs of the centre were supplied, so the site uses clearly labelled
   illustrations and the original sample clip. Add approved media in `public/images` (WebP/AVIF) and
   `src/data/gallery.js`. Photos of people need documented consent.
3. **Testimonials.** None are invented. `src/data/testimonials.js` is empty and the page explains the consent
   policy. Add only entries with written consent (`consent: true`).
4. **Team, fees, durations, admission rules, visiting policy, qualifications.** Left as "to be confirmed" – the
   same careful approach as the original site.
5. **Tamil review.** Tamil was written to match the original site's Tamil terminology but should be proof-read by a
   native speaker (especially the new Family Support, Aftercare and Privacy text).
6. **Privacy text, knowledge-hub articles, hosting security, backups, retention** – as in the original README, these
   need review by the centre/qualified professionals before launch.

## Backend changes (small, additive) – please review

- `/api/enquiries` also accepts `type: 'confidential'` with `contactMethod`, `seeking` and an **optional brief
  description (max 300 chars)**. New SQLite columns are added automatically on start.
  **Decision for you:** the original design deliberately never stored free text. The confidential form's
  "Brief description (optional)" field was requested, so for that form only the text is stored and emailed.
  The general contact form still stores no free text (its old message box was removed because the server always discarded it).
- Hidden honeypot field to deter bots; helmet CSP now allows Google Maps embeds and Google Fonts.
- Behaviour kept: if SMTP is not configured the API returns 503 and **nothing is stored**; the UI then tells the
  visitor to call or WhatsApp. Submissions are never silently lost.
- Confidentiality wording never promises absolute privacy; it states what is collected and who should have access.

## Verification performed (and its limits)

`npm install` and the real Vite build could not be run in the authoring sandbox (no network). Instead the real
source was bundled with esbuild (code-splitting on) using a small API-compatible stand-in for `react-router-dom`,
and tested in headless Chromium: **192 page/viewport/language loads** (16 routes × 6 sizes from 360 px phones to
2560 px TVs × EN/TA) – no console errors, missing translation keys, broken images, horizontal overflow, header
overlap or wrapped brand name – plus **67 behavioural checks** (language persistence, navigation, mobile menu,
dropdowns, social/tel/WhatsApp links, both forms incl. validation/success/failure, chat, lightbox, map, keyboard).
Not covered: real Vite/React Router runtime, Safari/iOS devices, Tamil glyph rendering (no Tamil font in the
sandbox), live SMTP, Lighthouse scores. Please run `npm install && npm run build` and re-check on real devices.
