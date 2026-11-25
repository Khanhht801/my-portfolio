import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The navigation has one document; hash sections and the dialog are not routes.
const pages = [{ entry: 'index.html', path: '/' }];

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

function pageHtml(html, canonical) {
  // Replace the existing tags rather than adding a second indexing policy.
  const clean = html
    .replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '')
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '');
  const tags = [`<meta name="robots" content="${canonical ? 'index, follow' : 'noindex, follow'}" />`];
  if (canonical) tags.push(`<link rel="canonical" href="${canonical}" />`);
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
        return pageHtml(html, origin ? new URL(page.path, origin).href : null);
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
