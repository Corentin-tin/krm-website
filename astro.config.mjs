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

// Pas de bloc `i18n` ici, volontairement.
//
// La configuration i18n d'Astro suppose que le segment de langue est le seul
// préfixe qui change d'une langue à l'autre : son mécanisme de repli mappe
// `/en/<chemin>` sur `/<chemin>`, et `getRelativeLocaleUrl('en', 'commerces')`
// produit `/en/commerces`. Or nos slugs sont traduits (`/en/shops`), donc ce
// mapping n'existe pas et la config ne saurait relier les deux versions.
// Le routage est donc manuel : la table des routes vit dans
// src/i18n/routes.ts et `chemin()` compose les URLs des deux langues.
//
// Même raison pour `sitemap({ i18n })` : l'intégration déduit la locale du
// premier segment du chemin et attend des slugs identiques entre langues.
// Elle ne saurait ni apparier `/commerces` (français, sans préfixe) avec
// `/en/shops`, ni deviner la traduction des segments. Les liens hreflang
// sont donc portés par le <head> (voir BaseLayout.astro), ce qui suffit aux
// moteurs de recherche.

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    sitemap({
      /*
       * Les mentions légales portent `noindex` (cf. BaseLayout) : les lister
       * dans le sitemap reviendrait à en demander l'indexation tout en la
       * refusant dans la page. Les moteurs signalent cette contradiction, et
       * elle consomme du budget d'exploration pour rien.
       *
       * Le filtre reçoit des URL absolues, d'où le test par suffixe : il doit
       * attraper les deux langues (`/mentions-legales`, `/en/legal-notice`)
       * quelle que soit la base du site.
       */
      filter: (page) =>
        !['mentions-legales', 'legal-notice'].some((segment) =>
          new URL(page).pathname.replace(/\/$/, '').endsWith(`/${segment}`),
        ),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
