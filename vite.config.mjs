import { defineConfig } from 'vite';
import { technicalSeo } from './scripts/technical-seo.mjs';

export default defineConfig(({ command, mode }) => ({
  base: './',
  // There are no client-side routes; unknown URLs must stay HTTP 404.
  appType: 'mpa',
  plugins: [technicalSeo({ command, mode })],
}));
