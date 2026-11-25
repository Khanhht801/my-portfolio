import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const defaultShareImage = {
  path: '/og/portfolio.png',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'Hoàng Thanh Khánh — Lập trình viên Fullstack, với chân dung trên nền kem và xanh của Khanhht Portfolio.',
};
const siteName = 'Khanhht Portfolio';

// The only document is the portfolio home page; its cover is also the fallback.
// Add a real page's own image here when that document exists.
const pages = [{ entry: 'index.html', path: '/', image: defaultShareImage }];

function readDomain(root) {
  let domain;
  try {
    domain = readFileSync(resolve(root, 'CNAME'), 'utf8').trim();
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (!domain) return null;
  const url = new URL(`https://${domain}/`);
  if (url.hostname !== domain || url.port || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('CNAME must contain only the confirmed production hostname.');
  }
  return domain;
}

function pageHtml(html, canonical, image = defaultShareImage) {
  const title = html.match(/<title\b[^>]*>([^<]*)<\/title>/i)?.[1].trim();
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0];
  const description = descriptionTag?.match(/\bcontent=(["'])(.*?)\1/i)?.[2];
  if (!title || !description) throw new Error('Sharing metadata requires a page title and meta description.');
  // Replace the existing tags rather than adding a second indexing policy.
  const clean = html
    .replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '')
    .replace(/<meta\b(?=[^>]*\b(?:name|property)=["'](?:og|twitter):[^"']+["'])[^>]*>/gi, '')
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '');
  const tags = [`<meta name="robots" content="${canonical ? 'index, follow' : 'noindex, follow'}" />`];
  if (canonical) tags.push(`<link rel="canonical" href="${canonical}" />`);
  const imageUrl = canonical ? new URL(image.path, canonical).href : image.path;
  const metadata = {
    'og:type': 'website',
    'og:title': title,
    'og:description': description,
    ...(canonical ? { 'og:url': canonical } : {}),
    'og:image': imageUrl,
    'og:image:type': image.type,
    'og:image:width': image.width,
    'og:image:height': image.height,
    'og:image:alt': image.alt,
    'og:locale': 'vi_VN',
    'og:site_name': siteName,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
    'twitter:image:alt': image.alt,
  };
  for (const [key, value] of Object.entries(metadata)) {
    // Title/description come from already HTML-encoded source attributes/text.
    const content = String(value).replace(/"/g, '&quot;');
    tags.push(`<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${content}" />`);
  }
  return clean.replace('</head>', `${tags.join('\n    ')}\n  </head>`);
}

function crawlFiles(urls, origin) {
  return {
    'robots.txt': `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}sitemap.xml\n` : ''}`,
    ...(origin ? { 'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n` } : {}),
  };
}

export function technicalSeo({ command, mode }) {
  let root;
  let outDir;
  let domain;
  let origin;
  let indexable;
  return {
    name: 'portfolio-technical-seo',
    configResolved(config) {
      root = config.root;
      outDir = resolve(root, config.build.outDir);
      domain = readDomain(root);
      // Preserve indexing for the confirmed production site only.
      indexable = command === 'build' && mode === 'production' && Boolean(domain);
      origin = indexable ? `https://${domain}/` : null;
      if (!domain) config.logger.warn('No confirmed CNAME: canonical and indexing remain disabled.');
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        const page = pages.find(item => resolve(root, item.entry) === resolve(context.filename));
        if (!page) throw new Error(`Configure canonical/indexability for HTML entry: ${context.filename}`);
        return pageHtml(html, origin ? new URL(page.path, origin).href : null, page.image);
      },
    },
    generateBundle() {
      const urls = origin ? pages.map(page => new URL(page.path, origin).href) : [];
      for (const [fileName, source] of Object.entries(crawlFiles(urls, origin))) {
        this.emitFile({ type: 'asset', fileName, source });
      }
      // Preview artifacts must not bind the production custom domain.
      if (indexable) this.emitFile({ type: 'asset', fileName: 'CNAME', source: `${domain}\n` });
    },
    configureServer(server) {
      serveCrawlFiles(server, crawlFiles([], null));
    },
    configurePreviewServer(server) {
      serveCrawlFiles(server, crawlFiles([], null));
      // Vite preview can serve a production build: keep its response noindex.
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        if (!['/', '/index.html'].includes(path)) return next();
        try {
          const html = readFileSync(resolve(outDir, 'index.html'), 'utf8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(req.method === 'HEAD' ? undefined : pageHtml(html, null));
        } catch (error) { next(error); }
      });
    },
  };
}

function serveCrawlFiles(server, files) {
  server.middlewares.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, follow');
    const name = req.url?.split('?')[0].slice(1);
    if (name === 'sitemap.xml' && !Object.hasOwn(files, name)) {
      res.statusCode = 404;
      res.end();
      return;
    }
    if (!Object.hasOwn(files, name)) return next();
    res.statusCode = 200;
    res.setHeader('Content-Type', name.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8');
    res.end(req.method === 'HEAD' ? undefined : files[name]);
  });
}
