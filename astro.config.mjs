// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Le site est publié sur GitHub Pages, à l'URL par défaut du dépôt. Il vit
// donc dans un sous-dossier : `base` doit refléter le nom du dépôt, sinon
// tous les liens internes pointent à la racine du domaine et cassent.
//
// Le jour où le domaine définitif (pole-albizia.fr) est réservé : remplacer
// `site` par ce domaine, passer `base` à '/' et déposer un fichier
// `public/CNAME`. Les liens internes suivent automatiquement (voir `lien()`
// dans src/lib/site.ts).
const site = process.env.SITE_URL ?? 'https://corentin-tin.github.io';
const base = process.env.BASE_URL ?? '/krm-website';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
