import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const style = readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const about = readFileSync(new URL('../about.css', import.meta.url), 'utf8');
const testimonials = readFileSync(new URL('../testimonials.css', import.meta.url), 'utf8');
const sectionLoader = readFileSync(new URL('../section-loader.js', import.meta.url), 'utf8');
const aboutFragment = readFileSync(new URL('../sections/04-about.fragment', import.meta.url), 'utf8');

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
assert.match(
  script,
  /const setupProjectMarquee = \(projectSection\) => \{/,
  'The project gallery must autoplay when it enters the viewport.',
);
assert.match(
  script,
  /IntersectionObserver[\s\S]*?projectObserver\.observe\(projectSection\)/,
  'The project marquee must start based on section visibility.',
);
assert.match(
  style,
  /@keyframes project-marquee-scroll[\s\S]*?--project-marquee-translate/,
  'The project gallery must have a continuous horizontal marquee animation.',
);
assert.match(
  style,
  /project-gallery__viewport:hover \.project-gallery__track[\s\S]*?animation-play-state:\s*paused/,
  'The project marquee must pause while the pointer is over its cards.',
);
assert.doesNotMatch(
  script,
  /data-project-playback/,
  'The project marquee must not require a separate playback button.',
);
assert.doesNotMatch(
  style,
  /\.marquee-track\s*\{\s*animation:\s*none\s*!important;/,
  'Tech marquees must remain available when the operating system requests reduced motion.',
);
assert.doesNotMatch(
  testimonials,
  /\.testimonials-track(?:\[[^\]]+\])?\s*\{\s*animation:\s*none\s*!important;/,
  'Testimonial marquees must remain available when the operating system requests reduced motion.',
);
assert.match(
  sectionLoader,
  /const priority = new Set\(getPrioritySections\(\)\);[\s\S]*?!priority\.has\(name\)/,
  'Background loading must exclude sections that were already loaded as priority content.',
);
assert.match(
  aboutFragment,
  /data-autoplay-ms="3000"[\s\S]*?data-slide-next/,
  'The About portrait must advance on image click and autoplay every three seconds.',
);
assert.doesNotMatch(
  aboutFragment,
  /data-(?:prev|next)\b|about-slider__arrow/,
  'The About portrait must not render overlay arrow buttons.',
);
assert.match(
  script,
  /slideNextTarget\?\.addEventListener\('click'[\s\S]*?goNext\(\);[\s\S]*?bump\(\);/,
  'Clicking the About portrait must advance once and restart its autoplay timer.',
);
assert.doesNotMatch(
  about,
  /\.about-slider__arrow/,
  'Removed About slider arrows must not leave dead CSS behind.',
);

console.log('Deployment smoke checks passed.');
