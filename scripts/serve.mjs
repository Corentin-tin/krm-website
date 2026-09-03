/**
 * Serveur statique minimal pour Railway.
 *
 * Sert le contenu de `dist/` sans dépendance externe : Railway fournit le
 * port via la variable d'environnement PORT, et l'écoute doit se faire sur
 * 0.0.0.0 pour que le conteneur soit joignable.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const RACINE = resolve('dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
};

/** Les assets versionnés d'Astro peuvent être mis en cache indéfiniment. */
const estImmuable = (chemin) => chemin.startsWith('/_astro/');

async function resoudre(cheminUrl) {
  // Normalise et bloque toute tentative de remontée hors de dist/.
  const relatif = normalize(decodeURIComponent(cheminUrl)).replace(/^(\.\.[/\\])+/, '');
  const candidat = join(RACINE, relatif);
  if (candidat !== RACINE && !candidat.startsWith(RACINE + sep)) return null;

  try {
    const infos = await stat(candidat);
    if (infos.isFile()) return candidat;
    if (infos.isDirectory()) {
      const index = join(candidat, 'index.html');
      const infosIndex = await stat(index);
      if (infosIndex.isFile()) return index;
    }
  } catch {
    // Essaie l'équivalent .html (routes sans slash final).
    try {
      const html = `${candidat}.html`;
      const infosHtml = await stat(html);
      if (infosHtml.isFile()) return html;
    } catch {
      return null;
    }
  }
  return null;
}

const serveur = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method Not Allowed');
    return;
  }

  const cheminUrl = new URL(req.url, `http://${req.headers.host}`).pathname;
  let fichier = await resoudre(cheminUrl);
  let statut = 200;

  if (!fichier) {
    fichier = join(RACINE, '404.html');
    statut = 404;
    try {
      await stat(fichier);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 — Page introuvable');
      return;
    }
  }

  const type = TYPES[extname(fichier).toLowerCase()] ?? 'application/octet-stream';
  const cache = estImmuable(cheminUrl)
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';

  res.writeHead(statut, {
    'Content-Type': type,
    'Cache-Control': cache,
    'X-Content-Type-Options': 'nosniff',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(fichier).pipe(res);
});

serveur.listen(PORT, '0.0.0.0', () => {
  console.log(`Site servi sur http://0.0.0.0:${PORT}`);
});
