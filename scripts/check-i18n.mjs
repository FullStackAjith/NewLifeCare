// Verifies that en.js and ta.js have identical key structure, no empty strings and matching {{placeholders}}.
import en from '../src/i18n/en.js';
import ta from '../src/i18n/ta.js';

const problems = [];
const ph = (s) => (typeof s === 'string' ? (s.match(/\{\{\w+\}\}/g) || []).sort().join(',') : '');
function walk(a, b, path) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return problems.push(`${path}: expected array in ta`);
    if (a.length !== b.length) problems.push(`${path}: array length en=${a.length} ta=${b.length}`);
    a.forEach((v, i) => b[i] !== undefined && walk(v, b[i], `${path}[${i}]`));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return problems.push(`${path}: expected object in ta`);
    for (const k of Object.keys(a)) {
      if (!(k in b)) problems.push(`${path}.${k}: missing in ta`);
      else walk(a[k], b[k], `${path}.${k}`);
    }
    for (const k of Object.keys(b)) if (!(k in a)) problems.push(`${path}.${k}: extra in ta`);
  } else {
    if (typeof b !== typeof a) problems.push(`${path}: type mismatch`);
    if (typeof b === 'string' && b.trim() === '' && a !== '') problems.push(`${path}: empty in ta`);
    if (ph(a) !== ph(b)) problems.push(`${path}: placeholder mismatch en="${ph(a)}" ta="${ph(b)}"`);
  }
}
walk(en, ta, 'root');
let strings = 0;
(function count(o) { if (typeof o === 'string') strings++; else if (o && typeof o === 'object') Object.values(o).forEach(count); })(ta);
if (problems.length) {
  console.error(`i18n check FAILED (${problems.length}):\n` + problems.map((p) => ' - ' + p).join('\n'));
  process.exit(1);
}
console.log(`i18n check passed: identical structure, ${strings} Tamil strings.`);
