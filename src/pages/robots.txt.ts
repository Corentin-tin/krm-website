import type { APIRoute } from 'astro';

/**
 * robots.txt généré au build : l'URL du sitemap suit la valeur de `site`
 * (donc SITE_URL sur Railway), sans avoir à modifier un fichier statique.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  const corps = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;

  return new Response(corps, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
