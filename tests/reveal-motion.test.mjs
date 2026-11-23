import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
globalThis.window = window;
globalThis.document = window.document;
globalThis.MutationObserver = window.MutationObserver;
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const observers = [];
class Observer {
  constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; observers.push(this); }
  observe(target) { this.targets.push(target); }
  unobserve() {}
  disconnect() { this.disconnected = true; }
}
window.IntersectionObserver = globalThis.IntersectionObserver = Observer;
let motionChange;
const reducedMotion = { matches: false, addEventListener(type, listener) { motionChange = listener; }, removeEventListener() {} };
window.matchMedia = query => query.includes('reduced-motion') ? reducedMotion : { matches: false, addEventListener() {}, removeEventListener() {} };
window.HTMLElement.prototype.getAnimations = () => [];
const animations = new Map();
window.Element.prototype.animate = function (frames, options) {
  const listeners = {};
  const animation = {
    frames, options, state: 'running',
    pause() { this.state = 'paused'; },
    play() { this.state = 'running'; },
    cancel() { this.state = 'cancelled'; listeners.cancel?.(); },
    addEventListener(name, listener) { listeners[name] = listener; },
  };
  animations.set(this, animation);
  return animation;
};
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(createElement(App)));
  const observer = observers.find(item => item.options?.rootMargin === '0px 0px 100px 0px');
  const heading = document.querySelector('.animate-hero-line');
  const entrance = animations.get(heading);
  assert.ok(observer.targets.includes(heading));
  assert.equal(entrance.state, 'paused', 'The entrance is prepared before observation');
  assert.equal(entrance.frames[0].opacity, 0);
  assert.equal(entrance.frames[1].opacity, 1);
  assert.equal(entrance.options.duration, 700);
  observer.callback([{ target: heading, isIntersecting: true }]);
  assert.equal(entrance.state, 'running');
  const button = document.querySelector('.animate-booted[href="#work"]');
  button.dispatchEvent(new window.FocusEvent('focusin', { bubbles: true }));
  assert.equal(animations.get(button).state, 'cancelled', 'Focus reveals content immediately');
  reducedMotion.matches = true;
  motionChange({ matches: true });
  assert.equal(entrance.state, 'cancelled', 'Reduced motion cancels active effects');
  assert.ok(observer.disconnected);
  await act(async () => root.unmount());
  console.log('Reveal preparation, focus and reduced-motion checks passed.');
} finally { dom.window.close(); await server.close(); }
