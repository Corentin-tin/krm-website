import type { APIRoute } from 'astro';
import { lien } from '../lib/site';

/**
 * robots.txt généré au build : l'URL du sitemap suit `site` et `base` définis
 * dans astro.config.mjs, sans avoir à modifier un fichier statique.
 *
 * `site` ne porte que l'origine (sans la base), d'où le passage par `lien()` :
 * sur GitHub Pages le sitemap vit sous `/krm-website/`, pas à la racine.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(lien('/sitemap-index.xml'), site).href;

  const corps = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;

  return new Response(corps, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
