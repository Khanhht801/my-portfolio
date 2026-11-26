// Measures HTTP image payloads, not rendering metrics or browser srcset choice.
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/';
const groups = {
  heroOriginal: ['image/chandung2remove.png'],
  hero420: ['image/optimized/hero-420.webp'],
  hero840: ['image/optimized/hero-840.webp'],
  hero1086: ['image/optimized/hero-1086.webp'],
  aboutOriginal: [1, 2, 3, 4, 5].map(i => `image/about/a${i}.jpg`),
  about480: [1, 2, 3, 4, 5].map(i => `image/optimized/about-a${i}-480.webp`),
  about768: [1, 2, 3, 4, 5].map(i => `image/optimized/about-a${i}-768.webp`),
  about1024: [1, 2, 3, 4, 5].map(i => `image/optimized/about-a${i}-1024.webp`),
};
const results = {};
for (const [name, paths] of Object.entries(groups)) {
  const resources = [];
  for (const path of paths) {
    const response = await fetch(new URL(path, baseUrl), { headers: { 'Accept-Encoding': 'identity' } });
    if (response.status !== 200) throw new Error(`${path}: HTTP ${response.status}`);
    const type = response.headers.get('content-type');
    const expected = path.endsWith('.webp') ? 'image/webp' : path.endsWith('.png') ? 'image/png' : 'image/jpeg';
    if (!type?.startsWith(expected)) throw new Error(`${path}: unexpected content type ${type}`);
    resources.push({ path, status: response.status, type, bytes: (await response.arrayBuffer()).byteLength });
  }
  results[name] = { bytes: resources.reduce((sum, item) => sum + item.bytes, 0), resources };
}
console.log(JSON.stringify({
  conditions: {
    baseUrl, tool: `Node ${process.version} fetch`, viewport: 'not applicable: HTTP payload audit, no browser renderer',
    throttling: 'none', cache: 'no persistent HTTP cache in Node fetch', acceptEncoding: 'identity',
    scope: 'Hero and About image sources; totals are not an observed page-load waterfall',
  },
  results,
}, null, 2));
