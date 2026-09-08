import type { APIRoute } from 'astro';
import { lien, SITE } from '../lib/site';
import { LOCALE_DEFAUT, t } from '../i18n';

/**
 * Manifeste PWA généré au build.
 *
 * Il était statique dans `public/`, mais ses chemins (`start_url`, `scope`,
 * icônes) doivent suivre la base du site — `/krm-website/` sur GitHub Pages,
 * `/` une fois le domaine définitif en place. Le générer ici évite de les
 * maintenir à la main.
 *
 * Volontairement mono-langue : un manifeste ne porte qu'une `lang` et une
 * `start_url`, et l'installation PWA est un usage marginal pour un site
 * vitrine. En dupliquer un par langue coûterait plus que ça ne rapporte.
 */
export const GET: APIRoute = () => {
  const manifeste = {
    name: SITE.nom,
    short_name: SITE.nomCourt,
    description: `${t(LOCALE_DEFAUT, 'meta.siteAccroche')}.`,
    lang: LOCALE_DEFAUT,
    start_url: lien('/'),
    scope: lien('/'),
    display: 'standalone',
    background_color: '#f7f9fb',
    theme_color: '#2b4c66',
    icons: [
      {
        src: lien('/icone-192.png'),
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: lien('/icone-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  return new Response(JSON.stringify(manifeste, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
