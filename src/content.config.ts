import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { ORDRE_CATEGORIES } from './lib/site';

/**
 * Fiabilité de la donnée, reprise de la convention du dossier KRM.
 * Sert de garde-fou éditorial : on ne publie pas une enseigne non confirmée.
 */
const fiabilite = z.enum(['source', 'a-confirmer']);

const horaires = z
  .array(z.object({ jours: z.string(), horaire: z.string() }))
  .optional();

const commerces = defineCollection({
  loader: glob({ base: './src/content/commerces', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      categorie: z.enum(ORDRE_CATEGORIES as [string, ...string[]]),
      accroche: z.string().max(160),
      telephone: z.string().optional(),
      email: z.email().optional(),
      siteWeb: z.url().optional(),
      reseaux: z
        .array(z.object({ nom: z.string(), url: z.url() }))
        .optional(),
      horaires,
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
      ordre: z.number().default(99),
    }),
});

export const collections = { commerces, actualites, services };
