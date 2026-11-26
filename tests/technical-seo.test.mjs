import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, access, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer, preview } from 'vite';
import { JSDOM } from 'jsdom';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { technicalSeo } from '../scripts/technical-seo.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const configFile = resolve(root, 'vite.config.mjs');
const temporaryRoot = await mkdtemp(join(tmpdir(), 'portfolio-seo-'));
const productionDir = join(temporaryRoot, 'production');
const parse = html => new JSDOM(html).window.document;
const checkSharing = (document, canonical) => {
  const metadata = [...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')];
  const values = new Map();
  for (const tag of metadata) {
    const key = tag.getAttribute('property') || tag.getAttribute('name');
    assert.ok(!values.has(key), `Duplicate sharing metadata: ${key}`);
    values.set(key, tag.content);
  }
  assert.equal(values.get('og:title'), document.title);
  assert.equal(values.get('twitter:title'), document.title);
  const description = document.querySelector('meta[name="description"]').content;
  assert.equal(values.get('og:description'), description);
  assert.equal(values.get('twitter:description'), description);
  assert.equal(values.get('og:url'), canonical || undefined);
  const image = canonical ? new URL('/og/portfolio.png', canonical).href : '/og/portfolio.png';
  assert.equal(values.get('og:image'), image);
  assert.equal(values.get('twitter:image'), image);
  assert.equal(values.get('og:image:type'), 'image/png');
  assert.equal(values.get('og:image:width'), '1200');
  assert.equal(values.get('og:image:height'), '630');
  assert.ok(values.get('og:image:alt')?.includes('Fullstack'));
  assert.equal(values.get('twitter:image:alt'), values.get('og:image:alt'));
  assert.equal(values.get('twitter:card'), 'summary_large_image');
  assert.equal(values.get('og:site_name'), 'Khanhht Portfolio');
  assert.equal(values.get('og:locale'), 'vi_VN');
};
const checkImage = image => {
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  assert.ok(image.length < 5_000_000);
};
const locs = xml => {
  const document = new JSDOM(xml, { contentType: 'application/xml' }).window.document;
  return [...document.querySelectorAll('loc')].map(node => node.textContent);
};
let previewServer;
let devServer;

try {
  await build({ root, configFile, logLevel: 'silent', build: { outDir: productionDir, emptyOutDir: true } });
  // npm run build copies this legacy asset directory after Vite (copy-static.mjs).
  await cp(resolve(root, 'image'), join(productionDir, 'image'), { recursive: true });
  const production = parse(await readFile(join(productionDir, 'index.html'), 'utf8'));
  const domain = (await readFile(resolve(root, 'CNAME'), 'utf8')).trim();
  const canonical = `https://${domain}/`;
  assert.equal(production.querySelectorAll('link[rel="canonical"]').length, 1);
  assert.equal(production.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(production.querySelectorAll('meta[name="robots"]').length, 1);
  assert.equal(production.querySelector('meta[name="robots"]').content, 'index, follow');
  checkSharing(production, canonical);
  checkImage(await readFile(join(productionDir, 'og/portfolio.png')));
  const jsonLd = production.querySelectorAll('script[type="application/ld+json"]');
  assert.equal(jsonLd.length, 1, 'One managed schema for the single profile page');
  const schema = JSON.parse(jsonLd[0].textContent);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'ProfilePage');
  assert.equal(schema.url, canonical);
  assert.equal(schema.name, production.title);
  assert.equal(schema.description, production.querySelector('meta[name="description"]').content);
  assert.equal(schema.mainEntity['@type'], 'Person');
  assert.equal(schema.mainEntity.url, canonical);
  assert.notEqual(schema['@id'], schema.mainEntity['@id']);
  const forbidden = ['review', 'aggregateRating', 'offers', 'price', 'availability', 'address', 'openingHours', 'hasCredential', 'hasCertification', 'interactionStatistic', 'dateCreated', 'dateModified'];
  const checkProperties = value => {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!forbidden.includes(key), `Unverified property must not appear: ${key}`);
      checkProperties(child);
    }
  };
  checkProperties(schema);
  assert.deepEqual(locs(await readFile(join(productionDir, 'sitemap.xml'), 'utf8')), [canonical]);
  const robots = await readFile(join(productionDir, 'robots.txt'), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
  assert.doesNotMatch(robots, /noindex/i, 'Indexing instructions do not belong in robots.txt');
  assert.equal((await readFile(join(productionDir, 'CNAME'), 'utf8')).trim(), domain);

  for (const mode of ['preview', 'staging']) {
    const outDir = join(temporaryRoot, mode);
    await build({ root, configFile, mode, logLevel: 'silent', build: { outDir, emptyOutDir: true } });
    const document = parse(await readFile(join(outDir, 'index.html'), 'utf8'));
    assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex, follow');
    assert.equal(document.querySelector('link[rel="canonical"]'), null);
    checkSharing(document, null);
    assert.equal(document.querySelector('script[type="application/ld+json"]'), null, 'No production schema on noindex builds');
    await assert.rejects(access(join(outDir, 'sitemap.xml')), { code: 'ENOENT' });
    assert.doesNotMatch(await readFile(join(outDir, 'robots.txt'), 'utf8'), /Sitemap:|noindex/i);
    await assert.rejects(access(join(outDir, 'CNAME')), { code: 'ENOENT' });
  }

  // Missing domain must fail closed without introducing localhost metadata.
  const pending = technicalSeo({ command: 'build', mode: 'production' });
  pending.configResolved({ root: temporaryRoot, build: { outDir: 'pending' }, logger: { warn() {} } });
  const pendingDocument = parse(pending.transformIndexHtml.handler('<head><title>Portfolio</title><meta name="description" content="Portfolio"><meta name="robots" content="index, follow"></head>', { filename: join(temporaryRoot, 'index.html') }));
  assert.equal(pendingDocument.querySelector('meta[name="robots"]').content, 'noindex, follow');
  assert.equal(pendingDocument.querySelector('link[rel="canonical"]'), null);
  checkSharing(pendingDocument, null);
  assert.equal(pendingDocument.querySelector('script[type="application/ld+json"]'), null);

  const repeated = technicalSeo({ command: 'build', mode: 'production' });
  repeated.configResolved({ root, build: { outDir: productionDir }, logger: { warn() {} } });
  const repeatedDocument = parse(repeated.transformIndexHtml.handler(production.documentElement.outerHTML, { filename: resolve(root, 'index.html') }));
  assert.equal(repeatedDocument.querySelectorAll('script[type="application/ld+json"]').length, 1, 'Transforming built HTML must replace the existing managed block');

  // Verify real local HTTP responses, including previewing production output.
  previewServer = await preview({ root, configFile, logLevel: 'silent', build: { outDir: productionDir }, preview: { host: '127.0.0.1', port: 0, open: false } });
  devServer = await createServer({ root, configFile, logLevel: 'silent', server: { host: '127.0.0.1', port: 0, open: false } });
  await devServer.listen();
  const { default: App } = await devServer.ssrLoadModule('/src/App.jsx');
  const rendered = parse(renderToStaticMarkup(createElement(App)));
  assert.ok(rendered.querySelector('h1').textContent.includes(schema.mainEntity.name), 'Schema name matches the visible heading');
  assert.ok(rendered.body.textContent.includes(schema.mainEntity.alternateName), 'Schema alias is visible');
  for (const url of schema.mainEntity.sameAs) {
    assert.ok([...rendered.querySelectorAll('a[href]')].some(link => link.getAttribute('href') === url), 'sameAs must use an actual public profile link shown on the page');
  }
  const portrait = rendered.querySelector('#hero img').getAttribute('src');
  assert.equal(schema.mainEntity.image, new URL(portrait, canonical).href, 'Use the visible profile portrait, not the default OG card or an invented image');
  for (const [name, server] of [['preview', previewServer], ['dev', devServer]]) {
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    for (const path of ['/', '/index.html']) {
      const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
      assert.equal(response.status, 200, `${name} ${path}`);
      assert.match(response.headers.get('x-robots-tag'), /noindex/);
      const document = parse(await response.text());
      assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex, follow');
      assert.equal(document.querySelector('link[rel="canonical"]'), null);
      checkSharing(document, null);
      assert.equal(document.querySelector('script[type="application/ld+json"]'), null, 'Preview must remove production JSON-LD from its HTTP response');
    }
    for (const userAgent of ['facebookexternalhit/1.1', 'Twitterbot/1.0']) {
      const pageResponse = await fetch(`${origin}/`, { headers: { 'User-Agent': userAgent } });
      assert.equal(pageResponse.status, 200);
      checkSharing(parse(await pageResponse.text()), null);
      const imageResponse = await fetch(`${origin}/og/portfolio.png`, { headers: { 'User-Agent': userAgent }, redirect: 'manual' });
      assert.equal(imageResponse.status, 200, `${name}: the sharing image must be accessible without authentication`);
      assert.match(imageResponse.headers.get('content-type'), /^image\/png/);
      checkImage(Buffer.from(await imageResponse.arrayBuffer()));
    }
    const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
    assert.equal(sitemapResponse.status, 404, 'Preview must not expose the production sitemap');
    const robotsResponse = await fetch(`${origin}/robots.txt`);
    assert.equal(robotsResponse.status, 200);
    assert.match(robotsResponse.headers.get('content-type'), /text\/plain/);
    assert.doesNotMatch(await robotsResponse.text(), /Sitemap:|noindex/i);
    const missing = await fetch(`${origin}/technical-seo-not-found-check`, { redirect: 'manual' });
    assert.equal(missing.status, 404, `${name}: nonexistent documents must not return the home page`);
    const portraitResponse = await fetch(new URL(portrait, origin));
    assert.equal(portraitResponse.status, 200);
    assert.match(portraitResponse.headers.get('content-type'), /^image\/webp/);
  }
  console.log('Technical SEO, sharing and JSON-LD passed: ProfilePage/Person matches rendered content, one valid JSON block, no schema on noindex responses, image HTTP access, canonical/OG and HTTP 404.');
} finally {
  if (previewServer) await new Promise((resolve, reject) => previewServer.httpServer.close(error => error ? reject(error) : resolve()));
  if (devServer) await devServer.close();
  // Only remove the unique directory created by this test under the OS temp root.
  assert.equal(dirname(resolve(temporaryRoot)), resolve(tmpdir()));
  assert.ok(basename(temporaryRoot).startsWith('portfolio-seo-'));
  await rm(temporaryRoot, { recursive: true, force: true });
}
