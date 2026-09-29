import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

assert.doesNotMatch(
  index,
  /cdn\.tailwindcss\.com/,
  'Production HTML must use the compiled Tailwind stylesheet, not the CDN runtime.',
);
assert.doesNotMatch(
  index,
  /<script[^>]+auto-reload\.js/,
  'The development-only auto-reload client must not be shipped to GitHub Pages.',
);
assert.match(
  index,
  /href="tailwind\.css\?v=[^"]+"/,
  'Compiled Tailwind CSS must be linked with a cache-busting version.',
);
assert.match(
  index,
  /src="section-loader\.js\?v=[^"]+"/,
  'The section loader must use a cache-busting URL.',
);
assert.match(
  index,
  /src="script\.js\?v=[^"]+"/,
  'The application script must use a cache-busting URL.',
);
assert.match(
  script,
  /if \(header\) \{[\s\S]*?header\.classList\.toggle/,
  'Scroll handling must tolerate a missing asynchronously-loaded header.',
);

console.log('Deployment smoke checks passed.');
