import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { ORDRE_CATEGORIES, ORDRE_STATUTS } from './lib/site';

/**
 * Fiabilité de la donnée, reprise de la convention du dossier KRM.
 * Sert de garde-fou éditorial : on ne publie pas une enseigne non confirmée.
 */
const fiabilite = z.enum(['source', 'a-confirmer']);

/**
 * Réseaux pour lesquels on dispose d'un logo (cf. src/assets/reseaux/).
 * `lien` couvre le reste (Planity, annuaire d'une enseigne de réseau…).
 */
const reseau = z.enum(['instagram', 'facebook', 'linkedin', 'lien']);

const commerces = defineCollection({
  loader: glob({ base: './src/content/commerces', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      categorie: z.enum(ORDRE_CATEGORIES),
      accroche: z.string().max(160),
      telephone: z.string().optional(),
      email: z.email().optional(),
      siteWeb: z.url().optional(),
      /**
       * Fiche Google Maps de l'enseigne. On y renvoie plutôt que de
       * recopier horaires et avis : c'est le commerçant qui la tient à jour.
       */
      googleMaps: z.url().optional(),
      reseaux: z
        .array(z.object({ reseau: reseau, url: z.url() }))
        .optional(),
      /**
       * Enseigne accessible 24h/24 (distributeur automatique, libre-service) :
       * elle rejoint alors les équipements permanents mis en avant en accueil.
       */
      permanent: z.boolean().default(false),
      /** Icône (cf. Icone.astro), utilisée quand l'enseigne est `permanent`. */
      icone: z.string().optional(),
      /** Bâtiment A (octogonal), B (rectangle) ou C (annexe). Interne, non affiché. */
      batiment: z.enum(['A', 'B', 'C']).optional(),
      image: image().optional(),
      /** L'image est un logo d'enseigne : affiché entier, sans recadrage. */
      logo: z.boolean().default(false),
      /**
       * Seules les fiches `actif` sont rendues et listées.
       * `brouillon` = enseigne repérée mais non confirmée : le fichier existe,
       * la page n'est pas générée. Basculer après vérification.
       */
      statut: z.enum(['actif', 'brouillon']).default('brouillon'),
      fiabilite: fiabilite.default('a-confirmer'),
      /** Ordre d'affichage manuel ; à défaut, tri alphabétique. */
      ordre: z.number().optional(),
    }),
});

const actualites = defineCollection({
  loader: glob({ base: './src/content/actualites', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      date: z.coerce.date(),
      resume: z.string().max(200),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
      brouillon: z.boolean().default(false),
    }),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      resume: z.string().max(200),
      /** Nom de l'icône dans src/components/Icone.astro. */
      icone: z.string(),
      /** Mis en avant sur la page d'accueil. */
      enAvant: z.boolean().default(false),
      /** Accessible 24h/24 — argument de recherche locale fort. */
      permanent: z.boolean().default(false),
      image: image().optional(),
      /** L'image est un logo de partenaire : affiché entier, sans recadrage. */
      logo: z.boolean().default(false),
      /** Site de l'exploitant de l'équipement. */
      siteWeb: z.url().optional(),
      /** Fiche Google Maps de l'équipement, quand il en a une propre. */
      googleMaps: z.url().optional(),
      ordre: z.number().default(99),
    }),
});

/**
 * Locaux vacants proposés à la location.
 *
 * Objectif de la section : maximiser le taux de remplissage du pôle. On
 * publie donc ce qui aide un porteur de projet à se décider (surface,
 * disponibilité, atouts, visuel) et rien qui relève du bail ou de la SCI.
 * La commercialisation est confiée à l'agence (cf. `AGENCE` dans site.ts) :
 * aucune coordonnée du bailleur n'apparaît sur ces pages.
 */
const locaux = defineCollection({
  loader: glob({ base: './src/content/locaux', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      /** Référence publique, neutre. Jamais le numéro de lot interne. */
      reference: z.string(),
      /** Surface en m². Sert au tri et à l'affichage. */
      surface: z.number().positive().optional(),
      statut: z.enum(ORDRE_STATUTS).default('disponible'),
      /**
       * Texte libre : « Immédiate », « Mars 2027 »…
       *
       * Optionnel plutôt que défaut en dur : un défaut français
       * s'appliquerait tel quel aux fiches anglaises. L'absence de valeur est
       * rendue par `local.disponibiliteDefaut`, qui existe dans chaque langue.
       */
      disponibilite: z.string().optional(),
      /** Bâtiment A (octogonal), B (rectangle) ou C (annexe). */
      batiment: z.enum(['A', 'B', 'C']).optional(),
      accroche: z.string().max(160),
      /** Points forts affichés en liste sur la fiche. */
      atouts: z.array(z.string()).default([]),
      /** Activités envisageables dans le local. */
      destinations: z.array(z.string()).default([]),
      /**
       * Loyer : laissé vide, la politique retenue est « sur demande ».
       * Le champ existe pour le jour où l'on choisirait de l'afficher.
       */
      loyer: z.string().optional(),
      /**
       * Annonce du local sur le site de l'agence (cf. `AGENCE`). Quand elle
       * est renseignée, le bouton de contact y renvoie directement plutôt
       * que vers l'accueil de l'agence : conditions, photos et loyer y sont
       * tenus à jour par elle, on n'en maintient pas de copie ici.
       */
      annonce: z.url().optional(),
      image: image().optional(),
      /** Racine d'une vidéo de `public/videos/` (sans suffixe ni extension). */
      video: z.string().optional(),
      /** Photos complémentaires, affichées en galerie sous le visuel principal. */
      galerie: z
        .array(z.object({ image: image(), legende: z.string().optional() }))
        .default([]),
      /**
       * Comme pour les commerces : `brouillon` = fiche préparée mais non
       * publiée. La page n'est pas générée tant que ce n'est pas `actif`.
       */
      publication: z.enum(['actif', 'brouillon']).default('brouillon'),
      /** Ordre d'affichage manuel ; à défaut, tri par surface croissante. */
      ordre: z.number().optional(),
    }),
});

export const collections = { commerces, actualites, services, locaux };
