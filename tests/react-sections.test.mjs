import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { JSDOM } from 'jsdom';

const names = ['Navbar', 'Hero', 'Work', 'About', 'Experience', 'Capabilities', 'Testimonials', 'Contact', 'Footer'];
const originals = ['01-navbar', '02-hero', '03-work', '04-about', '05-experience', '06-capabilities', '09-testimonials', '07-contact', '08-footer'];
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  for (let i = 0; i < names.length; i++) {
    const { default: Component } = await server.ssrLoadModule(`/src/sections/${names[i]}.jsx`);
    const original = await readFile(`sections/${originals[i]}.fragment`, 'utf8');
    const parse = html => new JSDOM(`<body>${html}</body>`).window.document.body;
    const before = parse(original);
    const after = parse(renderToStaticMarkup(createElement(Component)));
    after.querySelectorAll('link[rel="preload"]').forEach(node => node.remove());
    const elements = root => [...root.querySelectorAll('*')].map(el => ({
      tag: el.tagName,
      style: el.getAttribute('style') ? el.style.cssText : '',
      attrs: [...el.attributes].filter(a => !['onerror', 'style'].includes(a.name)).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b)),
    }));
    assert.deepEqual(elements(after), elements(before), `${names[i]} elements or attributes differ`);
    const text = root => root.textContent.replace(/\s+/g, '').trim();
    assert.equal(text(after), text(before), `${names[i]} text differs`);
  }
  console.log('React sections match source structure, attributes and text.');
} finally { await server.close(); }
