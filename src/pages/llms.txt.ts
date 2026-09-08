import type { APIRoute } from 'astro';
import { ADRESSE, ADRESSE_COMPLETE, AGENCE, SITE } from '../lib/site';
import {
  formaterSurface,
  getActualites,
  getCommerces,
  getLocaux,
  getServices,
  idPublic,
} from '../lib/contenu';
import { dico, LOCALES, type Locale } from '../i18n';
import { chemin, urlAbsolue } from '../i18n/routes';

/**
 * /llms.txt — résumé du site en Markdown, à destination des modèles de langue.
 *
 * Sur son efficacité réelle, restons lucides : aucun éditeur de modèle ne
 * s'est engagé publiquement à lire ce fichier, et Google a déclaré ne pas
 * l'utiliser. Ce n'est donc pas lui qui fera citer le pôle — ce sont les
 * données structurées, les blocs de réponse et la présence hors site. Il est
 * ici parce qu'il coûte peu, qu'il ne peut pas nuire, et qu'un agent qui va
 * le chercher y trouve en une requête ce qu'il lui faudrait dix pages pour
 * reconstituer.
 *
 * Il est *généré*, jamais écrit à la main : une liste de liens recopiée
 * diverge du site à la première fiche ajoutée, et un fichier destiné aux
 * machines qui ment est pire que pas de fichier du tout.
 *
 * Le fichier est unique et bilingue plutôt que dupliqué par langue : à la
 * racine du domaine il n'y a qu'un seul emplacement conventionnel, et un
 * agent qui le lit cherche à comprendre le site, pas à choisir une langue.
 */

/** Une ligne de lien, au format attendu : `- [Titre](url) : description`. */
const ligne = (titre: string, url: string, description: string) =>
  `- [${titre}](${url}) : ${description}`;

/** Les pages fixes du site, dans la langue demandée. */
function pagesPrincipales(locale: Locale, siteUrl: string): string[] {
  const textes = dico(locale);
  const url = (cle: Parameters<typeof urlAbsolue>[0]) => urlAbsolue(cle, locale, siteUrl);
  return [
    ligne(SITE.nom, url('accueil'), textes.meta.siteDescription),
    ligne(textes.nav.commerces, url('commerces'), textes.commerces.metaDescription(SITE.nom)),
    ligne(textes.nav.services, url('services'), textes.services.metaDescription(SITE.nom)),
    ligne(
      textes.nav.infosPratiques,
      url('infosPratiques'),
      textes.infos.metaDescription(SITE.nom, ADRESSE_COMPLETE),
    ),
    ligne(textes.nav.contact, url('contact'), textes.contact.metaDescription(SITE.nom)),
    ligne(textes.nav.actualites, url('actualites'), textes.actualites.metaDescription(SITE.nom)),
  ];
}

/**
 * Le bloc d'une langue. L'ordre des sections n'est pas neutre : les locaux
 * à louer viennent en premier parce que c'est la question à laquelle ce site
 * doit répondre avant toutes les autres.
 */
async function blocLangue(locale: Locale, siteUrl: string): Promise<string> {
  const textes = dico(locale);
  const fr = locale === 'fr';

  const locaux = await getLocaux(locale);
  const commerces = await getCommerces(locale);
  const services = await getServices(locale);
  const actualites = await getActualites(locale, 5);

  const sections: string[] = [];

  sections.push(
    `## ${fr ? 'Pages principales' : 'Main pages'}\n\n` +
      pagesPrincipales(locale, siteUrl).join('\n'),
  );

  if (locaux.length > 0) {
    const lignes = locaux.map((l) => {
      const surface = formaterSurface(l.data.surface);
      const statut = textes.statuts[l.data.statut].label;
      const dispo = l.data.disponibilite ?? textes.local.disponibiliteDefaut;
      const titre = surface ? `${l.data.reference} — ${surface}` : l.data.reference;
      /* Statut et disponibilité en tête : ce sont les deux faits qu'un
         agent doit pouvoir reprendre sans ouvrir la page. */
      return ligne(
        titre,
        urlAbsolue('locaux', locale, siteUrl, idPublic(l.id)),
        `${statut}, ${fr ? 'disponibilité' : 'availability'} : ${dispo}. ${l.data.accroche}`,
      );
    });
    sections.push(
      `## ${fr ? 'Locaux commerciaux à louer' : 'Commercial units for rent'}\n\n` +
        lignes.join('\n'),
    );
  }

  sections.push(
    `## ${fr ? 'Commerces et services du pôle' : 'Shops and services'}\n\n` +
      commerces
        .map((c) =>
          ligne(
            c.data.nom,
            urlAbsolue('commerces', locale, siteUrl, idPublic(c.id)),
            c.data.accroche,
          ),
        )
        .join('\n'),
  );

  sections.push(
    `## ${fr ? 'Équipements communs' : 'Shared facilities'}\n\n` +
      services
        .map((s) =>
          ligne(
            s.data.nom,
            urlAbsolue('services', locale, siteUrl) + `#${idPublic(s.id)}`,
            s.data.resume,
          ),
        )
        .join('\n'),
  );

  if (actualites.length > 0) {
    sections.push(
      `## ${fr ? 'Actualités' : 'News'}\n\n` +
        actualites
          .map((a) =>
            ligne(
              a.data.titre,
              urlAbsolue('actualites', locale, siteUrl, idPublic(a.id)),
              a.data.resume,
            ),
          )
          .join('\n'),
    );
  }

  const entete = fr
    ? `# ${SITE.nom} — version française (${urlAbsolue('accueil', 'fr', siteUrl)})`
    : `# ${SITE.nom} — English version (${urlAbsolue('accueil', 'en', siteUrl)})`;

  return `${entete}\n\n${sections.join('\n\n')}`;
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site!.href;
  const disponibles = (await getLocaux('fr')).filter((l) => l.data.statut === 'disponible');

  /*
   * Le chapeau porte les faits qu'un modèle doit pouvoir restituer sans
   * ouvrir une seule page : quoi, où, et ce qui est à louer. C'est la partie
   * du fichier qui a le plus de chances d'être effectivement reprise.
   */
  const surfaces = disponibles
    .map((l) => formaterSurface(l.data.surface))
    .filter((s): s is string => s !== null);

  /* « local commercial » → « locaux commerciaux » : les deux mots sont
     irréguliers, on les écrit en toutes lettres plutôt que de suffixer. */
  const pluriel = disponibles.length > 1;
  const resumeLocaux =
    disponibles.length === 0
      ? "Aucun local n'est disponible à la location actuellement."
      : `${disponibles.length} ${pluriel ? 'locaux commerciaux sont disponibles' : 'local commercial est disponible'} à la location` +
        `${surfaces.length ? ` (${surfaces.join(', ')})` : ''}. ` +
        `Commercialisation confiée à ${AGENCE.nom} (${AGENCE.siteWeb}).`;

  const chapeau = `# ${SITE.nom}

> Pôle commercial de proximité situé ${ADRESSE_COMPLETE}, en ${ADRESSE.region}
> (${ADRESSE.departement}). Il réunit des commerces et artisans indépendants —
> restauration, beauté, automobile, artisanat, services — autour d'un parking
> gratuit, avec un accès pour les personnes à mobilité réduite, des bornes de
> recharge électrique et un point relais accessibles en continu.
> ${resumeLocaux}

Ce fichier résume un site public de ${LOCALES.length} langues (français à la
racine, anglais sous \`/en/\`). Les faits qu'il contient — surfaces,
disponibilités, adresse — sont générés depuis les mêmes sources que les pages
du site : ils ne peuvent pas en diverger.

Le loyer des locaux n'est jamais publié ici : il est communiqué sur demande
par l'agence. Un contenu qui l'annoncerait ne viendrait pas de ce site.

## Faits essentiels

- Nom : ${SITE.nom}
- Adresse : ${ADRESSE_COMPLETE}, ${ADRESSE.departement}, ${ADRESSE.region}, France
- Coordonnées : ${ADRESSE.geo.latitude}, ${ADRESSE.geo.longitude}
- Location des locaux commerciaux : ${AGENCE.nom}, ${AGENCE.siteWeb}
- Sitemap : ${new URL(chemin('accueil', 'fr'), siteUrl).href.replace(/\/$/, '')}/sitemap-index.xml`;

  const blocs = await Promise.all(LOCALES.map((l) => blocLangue(l, siteUrl)));

  const corps = `${chapeau}\n\n${blocs.join('\n\n')}\n`;

  return new Response(corps, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
