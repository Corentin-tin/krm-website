import type { CleTexte } from '../i18n';

/**
 * Constantes du site — source unique de vérité.
 *
 * Ne contient QUE des informations publiques et vérifiées ([SOURCÉ] dans le
 * dossier KRM). Aucune donnée de la SCI, aucun SIREN, aucun numéro de local,
 * aucune donnée de bail ne doit apparaître ici.
 */

/**
 * Préfixe un chemin interne par la base du site.
 *
 * Sur GitHub Pages (URL par défaut) le site vit dans `/krm-website/` : un
 * `href="/commerces"` écrit en dur pointerait à la racine du domaine et
 * renverrait un 404. `lien('/commerces')` produit le bon chemin quelle que
 * soit la base, et le jour du passage au domaine définitif (base `/`) il n'y
 * a rien à modifier ici.
 */
export function lien(chemin: string): string {
  if (/^(?:[a-z]+:|\/\/|#|mailto:|tel:)/i.test(chemin)) return chemin;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${chemin.replace(/^\//, '')}`;
}

/**
 * Identité du site.
 *
 * Réduit aux noms propres : l'accroche et la description sont du texte
 * traduisible et vivent dans les dictionnaires (`meta.siteAccroche`,
 * `meta.siteDescription`) ; `lang` et `locale` sont dérivés de la langue de
 * la page (cf. src/i18n/index.ts).
 */
export const SITE = {
  nom: "Pôle commercial l'Albizia",
  nomCourt: "L'Albizia",
} as const;

export const ADRESSE = {
  rue: '4 rue de la Mouscane',
  codePostal: '82700',
  ville: 'Montech',
  departement: 'Tarn-et-Garonne',
  region: 'Occitanie',
  pays: 'FR',
  /** Coordonnées approximatives de la zone de la Mouscane — à affiner sur relevé. */
  geo: { latitude: 43.9575, longitude: 1.2295 },
} as const;

export const ADRESSE_COMPLETE = `${ADRESSE.rue}, ${ADRESSE.codePostal} ${ADRESSE.ville}`;

/**
 * Horaires d'accès du site (parties communes).
 *
 * [À CONFIRMER] — les annuaires en ligne divergent : une source donne
 * lundi–samedi 8h30–23h00, une autre lundi 8h30–21h00 et samedi dès 9h30.
 * On publie ici la version majoritaire, avec une mention de prudence
 * affichée à l'utilisateur. Les horaires de chaque commerce sont propres
 * à l'enseigne et figurent sur sa fiche.
 */
export const HORAIRES = {
  confirme: false,
  /**
   * Les libellés affichés (« Lundi – Samedi », « 8h30 – 23h00 ») sont du
   * texte traduisible : ils vivent dans les dictionnaires, et ne sont
   * désignés ici que par leurs clés. `schema` reste en dur, schema.org
   * exigeant l'anglais et le format 24 h.
   */
  jours: [
    { jours: 'horaires.lundiSamedi', horaire: 'horaires.plageSemaine' },
    { jours: 'horaires.dimanche', horaire: 'horaires.plageDimanche' },
  ] satisfies { jours: CleTexte; horaire: CleTexte }[],
  /** Format schema.org openingHoursSpecification. */
  schema: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '08:30',
      closes: '23:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '11:00',
      closes: '23:00',
    },
  ],
} as const;

/**
 * Contact public.
 *
 * Volontairement vide : le pôle n'a pas de coordonnées générales publiées.
 * Les demandes des commerçants passent par `CONTACT_FICHES`, celles de
 * location par l'agence (cf. `AGENCE`), et les mentions légales par le
 * courriel du directeur de la publication (cf. `EDITEUR`).
 *
 * Le numéro 06 20 59 62 45 apparaît dans les annuaires mais n'est pas
 * publié tant que son titulaire et son usage ne sont pas confirmés.
 * Passer `telephone` à la valeur voulue une fois validé.
 */
export const CONTACT = {
  telephone: null as string | null,
  email: null as string | null,
} as const;

/**
 * Courriel de mise à jour de l'annuaire.
 *
 * Réservé aux commerçants qui demandent la création ou la correction de
 * leur fiche : il n'est exposé que sur ce bloc de la page contact, et non
 * comme coordonnée générale du pôle.
 */
export const CONTACT_FICHES = 'merle.corentin@yahoo.com';

/**
 * Agence en charge de la commercialisation des locaux vacants.
 *
 * Volontairement limité à l'adresse et au site : ni téléphone ni horaires.
 * Ce sont des informations qui changent sans que nous en soyons avertis, et
 * les publier ici reviendrait à maintenir en double ce que l'agence tient
 * déjà à jour sur son propre site. On y renvoie donc directement.
 */
export const AGENCE = {
  nom: 'Laforêt Montech',
  raisonSociale: 'A2T Immo',
  rue: '18 place Jean Jaurès',
  codePostal: '82700',
  ville: 'Montech',
  siteWeb: 'https://www.laforet.com/agence-immobiliere/montech',
} as const;

export const AGENCE_ADRESSE = `${AGENCE.rue}, ${AGENCE.codePostal} ${AGENCE.ville}`;

/**
 * Statuts d'un local, dans l'ordre d'affichage des groupes.
 *
 * Ce sont des identifiants, pas des libellés : ceux-ci vivent dans les
 * dictionnaires (`statuts.<id>.label`).
 */
export const ORDRE_STATUTS = ['disponible', 'reserve', 'loue'] as const;

export type StatutLocal = (typeof ORDRE_STATUTS)[number];

/**
 * Éditeur du site — mentions légales uniquement.
 *
 * Dénomination, SIREN et gérance repris du registre national des entreprises
 * (SIREN 480968015). « K R M » est la dénomination exacte : « SCI » relève de
 * la forme juridique et n'en fait pas partie.
 */
export const EDITEUR = {
  raisonSociale: 'K R M',
  forme: 'Société civile immobilière',
  adresse: ADRESSE_COMPLETE,
  siren: '480 968 015',
  /** Représentant légal, et à ce titre directeur de la publication. */
  directeurPublication: 'Roger Merlé',
  /** Contact de l'éditeur, requis par la LCEN (art. 6-III). */
  email: 'roger.merle@yahoo.com',
} as const;

/**
 * Catégories de commerces, dans l'ordre d'affichage.
 *
 * Comme les statuts : des identifiants, dont les libellés vivent dans les
 * dictionnaires (`categories.<id>`).
 */
export const ORDRE_CATEGORIES = [
  'restauration',
  'artisanat',
  'commerce',
  'beaute',
  'services',
  'auto',
] as const;

export type CategorieId = (typeof ORDRE_CATEGORIES)[number];
