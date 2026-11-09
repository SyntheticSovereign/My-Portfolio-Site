import { readdirSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const site = new URL(process.env.SITE_URL || 'https://tanvirahmedaadeef.com');

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === 'index.html') pages.push('/' + relative(DIST, dir).split(sep).filter(Boolean).map((s) => s + '/').join(''));
  }
})(DIST);

const urls = pages.sort().map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
const aiBots = [
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'GoogleOther', 'Applebot-Extended', 'CCBot',
  'Bytespider', 'Amazonbot', 'meta-externalagent', 'FacebookBot', 'cohere-ai', 'cohere-training-data-crawler',
  'AI2Bot', 'Ai2Bot-Dolma', 'Diffbot', 'Timpibot', 'ImagesiftBot', 'Omgilibot', 'Omgili', 'PetalBot', 'PanguBot', 'Kangaroo Bot',
  'img2dataset', 'Scrapy', 'webzio-extended', 'TikTokSpider',
];
const robots = [
  ...aiBots.map((b) => `User-agent: ${b}`),
  'Disallow: /',
  '',
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${new URL('/sitemap.xml', site).href}`,
];
writeFileSync(join(DIST, 'robots.txt'), robots.join('\n') + '\n');

console.log(`seo: sitemap with ${pages.length} pages for ${site.origin}`);
