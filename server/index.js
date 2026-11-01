import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';
import OpenAI from 'openai';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const dataDir = path.resolve(process.env.DATA_DIR || './data');
fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'frame-src': ["'self'", 'https://www.google.com', 'https://maps.google.com'],
      'style-src': ["'self'", 'https:', "'unsafe-inline'"],
      'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
      'img-src': ["'self'", 'data:'],
      'media-src': ["'self'"],
      'connect-src': ["'self'"],
    },
  },
}));
app.use(express.json({ limit: '12kb', type: 'application/json' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: 'draft-7', legacyHeaders: false }));

const db = new Database(path.join(dataDir, 'enquiries.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  callback TEXT NOT NULL DEFAULT '',
  consent INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
// Lightweight migration for the confidential enquiry fields (safe to run repeatedly).
const existingColumns = new Set(db.prepare('PRAGMA table_info(enquiries)').all().map((c) => c.name));
for (const [column, ddl] of [
  ['type', "ALTER TABLE enquiries ADD COLUMN type TEXT NOT NULL DEFAULT 'general'"],
  ['contact_method', "ALTER TABLE enquiries ADD COLUMN contact_method TEXT NOT NULL DEFAULT ''"],
  ['seeking', "ALTER TABLE enquiries ADD COLUMN seeking TEXT NOT NULL DEFAULT ''"],
  ['note', "ALTER TABLE enquiries ADD COLUMN note TEXT NOT NULL DEFAULT ''"],
]) if (!existingColumns.has(column)) db.exec(ddl);

const insertEnquiry = db.prepare('INSERT INTO enquiries (name, phone, service, callback, consent, type, contact_method, seeking, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const deleteEnquiry = db.prepare('DELETE FROM enquiries WHERE id = ?');
const allowedServices = new Set(['Alcohol addiction support','Drug addiction support','Tobacco support','Counselling','Family counselling','Rehabilitation','Aftercare support','Appointment or consultation','Admission and fees','Other enquiry']);
const allowedMethods = new Set(['call', 'whatsapp', 'sms']);
const allowedSeeking = new Set(['self', 'family', 'friend']);
const allowedCallbacks = new Set(['', 'any', 'morning', 'afternoon', 'evening']);
const clean = (v, max) => typeof v === 'string' ? v.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max) : '';

app.post('/api/enquiries', async (req, res) => {
  // Honeypot: real visitors never fill this hidden field. Pretend success, store nothing.
  if (clean(req.body?.website, 100)) return res.status(201).json({ ok: true });

  const confidential = req.body?.type === 'confidential';
  const name = clean(req.body?.name, 90);
  const phone = clean(req.body?.phone, 25);
  const callback = clean(req.body?.callback, 20);
  const consent = req.body?.consent === true || req.body?.consent === 'on';
  const service = confidential ? 'Confidential enquiry' : clean(req.body?.service, 60);
  const contactMethod = confidential ? clean(req.body?.contactMethod, 12) : '';
  const seeking = confidential ? clean(req.body?.seeking, 12) : '';
  // Free text is accepted ONLY on the confidential form (optional, max 300 chars). The general form never stores free text.
  const note = confidential ? clean(req.body?.message, 300) : '';
  const phoneDigits = phone.replace(/\D/g, '');

  const nameOk = confidential ? (name === '' || name.length >= 2) : name.length >= 2;
  const serviceOk = confidential ? true : allowedServices.has(service);
  const confidentialOk = !confidential || (allowedMethods.has(contactMethod) && allowedSeeking.has(seeking));
  if (!nameOk || !/^[+()\d .-]{7,25}$/.test(phone) || phoneDigits.length < 10 || phoneDigits.length > 15 || !serviceOk || !confidentialOk || !allowedCallbacks.has(callback) || !consent) {
    return res.status(400).json({ error: 'Please check the required fields and consent.' });
  }
  if (!process.env.SMTP_HOST || !process.env.ENQUIRY_TO_EMAIL || !(process.env.ENQUIRY_FROM_EMAIL || process.env.SMTP_USER)) {
    return res.status(503).json({ error: 'The secure enquiry service is not fully configured yet.' });
  }
  let enquiryId;
  try {
    const result = insertEnquiry.run(name, phone, service, callback, 1, confidential ? 'confidential' : 'general', contactMethod, seeking, note);
    enquiryId = Number(result.lastInsertRowid);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || '' } : undefined,
    });
    const lines = [
      `A new ${confidential ? 'CONFIDENTIAL ' : ''}website enquiry was received.`,
      `Reference: ${enquiryId}`,
      `Name: ${name || '(not provided)'}`,
      `Phone: ${phone}`,
      `Topic: ${service}`,
    ];
    if (confidential) {
      lines.push(`Preferred contact method: ${contactMethod}`, `Enquiry is for: ${seeking}`, `Brief description: ${note || '(none)'}`);
    }
    lines.push(`Preferred callback: ${callback || 'No preference'}`, '', 'Please handle this enquiry privately and use your approved contact process to follow up.');
    await transporter.sendMail({
      from: process.env.ENQUIRY_FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.ENQUIRY_TO_EMAIL,
      subject: `New Life Care ${confidential ? 'confidential ' : ''}enquiry #${enquiryId}`,
      text: lines.join('\n'),
    });
    return res.status(201).json({ ok: true, reference: String(enquiryId) });
  } catch (error) {
    if (enquiryId) { try { deleteEnquiry.run(enquiryId); } catch { /* retain primary error */ } }
    console.error('Enquiry processing failed:', error?.message || 'unknown error');
    return res.status(500).json({ error: 'We could not process the enquiry right now.' });
  }
});

const centreFacts = `You are the New Life Care website information assistant in Coimbatore, Tamil Nadu. You may share only these verified site facts: phone +91 89256 20885, +91 89256 20886, +91 89256 20887; WhatsApp +91 89256 20885; email newlifecarecbe@gmail.com; address No. 3/3, Bajanai Kovil Street, Udayampalayam, Coimbatore 641049, Tamil Nadu. Listed topics are alcohol support, drug support, tobacco support, counselling, family counselling, rehabilitation and aftercare support. Fees, staff credentials, opening hours, admission requirements and programme details are not confirmed in the site data; direct users to contact the centre. Reply in the requested language (Tamil or English). Keep replies brief, empathetic and non-judgemental. Never diagnose, recommend treatment/medication, assess risk, promise outcomes or give emergency treatment advice. Do not ask for detailed health information. For immediate danger or a medical emergency, tell the user to contact local emergency services or go to the nearest emergency department. If the question is outside general centre information, recommend speaking with a qualified professional or the centre team.`;
app.post('/api/chat', async (req, res) => {
  const message = clean(req.body?.message, 1200);
  const language = req.body?.language === 'ta' ? 'Tamil' : 'English';
  if (message.length < 1) return res.status(400).json({ error: 'Please enter a question.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'AI chat has not been configured.' });
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 260,
      messages: [
        { role: 'system', content: `${centreFacts}\nRespond in ${language}.` },
        { role: 'user', content: message },
      ],
    });
    const reply = completion.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty AI response');
    return res.json({ reply });
  } catch (error) {
    console.error('AI chat failed:', error?.message || 'unknown error');
    return res.status(502).json({ error: 'The assistant is temporarily unavailable.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Production: serve the built React app and fall back to index.html so direct URLs
// such as /family-support or /confidential-enquiry work on refresh.
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir, { index: false, maxAge: '7d', setHeaders: (res, file) => { if (file.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); } }));
  app.get('/{*splat}', (req, res, next) => (req.path.startsWith('/api/') ? next() : res.sendFile(path.join(distDir, 'index.html'))));
}
app.listen(PORT, () => console.log(`New Life Care API listening on port ${PORT}`));
