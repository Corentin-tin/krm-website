import type { APIRoute } from 'astro';
import { lien, SITE } from '../lib/site';

/**
 * Manifeste PWA généré au build.
 *
 * Il était statique dans `public/`, mais ses chemins (`start_url`, `scope`,
 * icônes) doivent suivre la base du site — `/krm-website/` sur GitHub Pages,
 * `/` une fois le domaine définitif en place. Le générer ici évite de les
 * maintenir à la main.
 */
export const GET: APIRoute = () => {
  const manifeste = {
    name: SITE.nom,
    short_name: SITE.nomCourt,
    description: `${SITE.accroche}.`,
    lang: SITE.lang,
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
