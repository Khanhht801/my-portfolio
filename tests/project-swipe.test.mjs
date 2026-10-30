import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const start = source.indexOf('    const seekProjects =');
const handlers = {};
const frames = new Map();
const timers = new Map();
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
const documentMock = { createElement: element, hidden: false };
const controls = runInNewContext(source.slice(start, source.indexOf('    let dotsFrame =', start)) + `
  ({ start: () => { isInViewport = true; scheduleMobileAutoplay(); },
     stop: () => { isInViewport = false; scheduleMobileAutoplay(); } });
`, {
  projectTrack: { getAnimations: () => [animation] },
  projectViewport: viewport,
  projectSection: { querySelector: () => null },
  originalItems: Array.from({ length: 5 }, () => ({ querySelector: () => null })),
  cycleWidth: 1500,
  document: documentMock,
  window: {
    matchMedia: (query) => ({ matches: query.includes('767') }),
    addEventListener: (name, fn) => { handlers[name] = fn; },
  },
  performance: { now: () => time },
  requestAnimationFrame: (fn) => { frames.set(++frame, fn); return frame; },
  cancelAnimationFrame: (id) => frames.delete(id),
  clearTimeout: (id) => timers.delete(id),
  setTimeout: (fn, delay) => { assert.equal(delay, 2500); timers.set(++frame, fn); return frame; },
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
assert.equal(timers.size, 0, 'No autoplay outside viewport');
controls.start();
assert.equal(timers.size, 1);
const autoplay = [...timers.values()][0];
timers.clear();
autoplay();
time += 250;
const autoplayFrames = [...frames.values()];
frames.clear();
autoplayFrames.forEach((fn) => fn(time));
assert.ok(Math.abs(animation.currentTime - 2000) < 0.001, 'Autoplay advances exactly one card');
assert.equal(timers.size, 1, 'Next countdown starts after transition');
handlers.pointerdown({ isPrimary: true, button: 0, pointerId: 2, clientX: 200, clientY: 0 });
assert.equal(timers.size, 0, 'Touch pauses autoplay');
handlers.pointerup({ type: 'pointerup', pointerId: 2 });
assert.equal(timers.size, 1, 'Release restarts countdown');
documentMock.hidden = true;
controls.start();
assert.equal(timers.size, 0, 'Hidden tab pauses autoplay');
documentMock.hidden = false;
controls.start();
controls.stop();
assert.equal(timers.size, 0, 'Leaving viewport clears countdown');
console.log('Project swipe regression checks passed.');
