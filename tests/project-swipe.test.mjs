import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const start = source.indexOf('    const seekProjects =');
const handlers = {};
const frames = new Map();
let frame = 0;
let time = 0;
const animation = { currentTime: 0, effect: { getTiming: () => ({ duration: 10000 }) } };
const viewport = {
  clientWidth: 375,
  classList: { add() {}, remove() {} },
  addEventListener: (name, fn) => { handlers[name] = fn; },
  setPointerCapture() {},
  hasPointerCapture: () => false,
};
const element = () => ({ setAttribute() {}, appendChild() {}, addEventListener() {} });
runInNewContext(source.slice(start, source.indexOf('    let isInViewport =', start)), {
  projectTrack: { getAnimations: () => [animation] },
  projectViewport: viewport,
  projectSection: { querySelector: () => null },
  originalItems: Array.from({ length: 5 }, () => ({ querySelector: () => null })),
  cycleWidth: 1500,
  document: { createElement: element },
  window: {
    matchMedia: (query) => ({ matches: query.includes('767') }),
    addEventListener: (name, fn) => { handlers[name] = fn; },
  },
  performance: { now: () => time },
  requestAnimationFrame: (fn) => { frames.set(++frame, fn); return frame; },
  cancelAnimationFrame: (id) => frames.delete(id),
});

function swipe(from, to, expected) {
  handlers.pointerdown({ isPrimary: true, button: 0, pointerId: 1, clientX: from, clientY: 0 });
  handlers.pointermove({ pointerId: 1, clientX: to, clientY: 0 });
  // Browsers send this from the initially touched image when capture transfers.
  handlers.lostpointercapture({ type: 'lostpointercapture', pointerId: 1, target: {} });
  handlers.pointerup({ type: 'pointerup', pointerId: 1 });
  time += 250;
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((fn) => fn(time));
  const error = Math.min(...[-10000, 0, 10000].map((offset) => Math.abs(animation.currentTime - expected + offset)));
  assert.ok(error < 0.001, `Expected position ${expected}, received ${animation.currentTime}`);
}

swipe(200, 160, 2000); // Short swipe advances a complete card.
swipe(300, 20, 4000); // Long swipe advances only one card.
swipe(100, 160, 2000); // Swipe right returns to the previous card.
swipe(100, 110, 2000); // Tiny movement returns to the current card.
animation.currentTime = 0;
swipe(100, 160, 8000); // Wrap backward.
swipe(200, 160, 0); // Wrap forward.
console.log('Project swipe regression checks passed.');
