// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domaine définitif à réserver ; SITE_URL permet de surcharger sur Railway
// (l'URL *.up.railway.app) sans toucher au code.
const site = process.env.SITE_URL ?? 'https://pole-albizia.fr';

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
