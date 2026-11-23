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
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.HTMLElement.prototype.getAnimations = () => [];
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(createElement(App)); });
  const toggle = document.getElementById('mobile-toggle');
  assert.ok(document.querySelector('#work') && document.querySelector('#contact'));
  await act(async () => toggle.click());
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  await act(async () => document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  const slider = document.querySelector('[data-autoplay-slider]');
  const slides = [...slider.querySelectorAll('[data-slide]')];
  const before = slides.map(slide => slide.className);
  await act(async () => slider.querySelector('[data-slide-next]').click());
  assert.notDeepEqual(slides.map(slide => slide.className), before);
  console.log('React mount, mobile menu and portrait slider checks passed.');
  await act(async () => root.unmount());
} finally {
  dom.window.close();
  await server.close();
}
