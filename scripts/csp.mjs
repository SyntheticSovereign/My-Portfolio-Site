import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const PLACEHOLDER = '__INLINE_SCRIPT_HASHES__';

const html = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) html.push(p);
  }
})(DIST);

const hashes = new Set();
for (const file of html) {
  const src = readFileSync(file, 'utf8');
  if (/<style[\s>]/.test(src)) throw new Error(`Inline <style> in ${file}; the CSP would block it.`);
  if (/\sstyle="/.test(src)) throw new Error(`Inline style attribute in ${file}; the CSP would block it.`);
  for (const [, attrs, body] of src.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\ssrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs)) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
}

const headersPath = join(DIST, '_headers');
const headers = readFileSync(headersPath, 'utf8');
if (!headers.includes(PLACEHOLDER)) throw new Error('dist/_headers has no hash placeholder.');
writeFileSync(headersPath, headers.replace(PLACEHOLDER, [...hashes].join(' ')));
console.log(`csp: ${hashes.size} inline script hash(es) from ${html.length} pages`);
