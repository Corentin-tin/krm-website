/**
 * Génère les déclinaisons d'icônes à partir des logos fournis par le client.
 *
 *   node scripts/generer-icones.mjs
 *
 * Sources (src/assets/, NE PAS retoucher) :
 *   logo-albizia.png            logo complet, ovale + texte « ALBIZIA ».
 *                               Trop détaillé pour une favicon : réservé à
 *                               l'affichage dans les pages.
 *   logo-albizia-batiment.png   le bâtiment seul, sans texte : c'est la
 *                               source de toutes les icônes.
 *
 * Le script ne fait que redimensionner et centrer sur un fond — aucun
 * redessin. Les fichiers produits sont versionnés dans public/.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = fileURLToPath(
  new URL('../src/assets/logo-albizia-batiment.png', import.meta.url),
);
const sortie = new URL('../public/', import.meta.url);

/**
 * Fond transparent : le logo se détache aussi bien sur un onglet clair que
 * sombre (ses aplats clairs et son vitrage bleu portent la forme, les
 * contours noirs ne représentent qu'une petite part des pixels visibles).
 */
const FOND = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * Redimensionne le bâtiment dans un carré de `taille`, en gardant ses
 * proportions et en laissant une marge (`ratio` = part occupée).
 */
async function icone(taille, { ratio = 0.86, fond = FOND } = {}) {
  const utile = Math.round(taille * ratio);
  const logo = await sharp(source)
    .resize(utile, utile, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const image = sharp({
    create: { width: taille, height: taille, channels: 4, background: fond },
  }).composite([{ input: logo, gravity: 'center' }]);

  return image.png({ compressionLevel: 9 }).toBuffer();
}

/** Assemble plusieurs PNG en un .ico (ICONDIR + entrées PNG). */
function construireIco(images) {
  const entetes = Buffer.alloc(6 + images.length * 16);
  entetes.writeUInt16LE(0, 0);
  entetes.writeUInt16LE(1, 2);
  entetes.writeUInt16LE(images.length, 4);

  let decalage = entetes.length;
  images.forEach(({ taille, donnees }, i) => {
    const p = 6 + i * 16;
    entetes.writeUInt8(taille >= 256 ? 0 : taille, p);
    entetes.writeUInt8(taille >= 256 ? 0 : taille, p + 1);
    entetes.writeUInt8(0, p + 2);
    entetes.writeUInt8(0, p + 3);
    entetes.writeUInt16LE(1, p + 4);
    entetes.writeUInt16LE(32, p + 6);
    entetes.writeUInt32LE(donnees.length, p + 8);
    entetes.writeUInt32LE(decalage, p + 12);
    decalage += donnees.length;
  });

  return Buffer.concat([entetes, ...images.map((i) => i.donnees)]);
}

const ecrire = async (nom, donnees) => {
  await writeFile(new URL(nom, sortie), donnees);
  console.log(nom);
};

// iOS ne gère pas la transparence (elle vire au noir sur l'écran d'accueil) :
// c'est la seule icône à recevoir un fond plein.
await ecrire(
  'apple-touch-icon.png',
  await icone(180, { ratio: 0.8, fond: { r: 247, g: 249, b: 251, alpha: 1 } }),
);

// Icônes PWA « maskable » : Android recadre en cercle, d'où la marge accrue.
await ecrire('icone-192.png', await icone(192, { ratio: 0.62 }));
await ecrire('icone-512.png', await icone(512, { ratio: 0.62 }));

// Favicon classique, multi-résolutions.
const tailles = [16, 32, 48];
await ecrire(
  'favicon.ico',
  construireIco(
    await Promise.all(
      tailles.map(async (taille) => ({
        taille,
        donnees: await icone(taille, { ratio: 0.94 }),
      })),
    ),
  ),
);
console.log(`  (favicon.ico : ${tailles.join(', ')} px)`);
