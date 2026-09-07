/**
 * Constantes du site — source unique de vérité.
 *
 * Ne contient QUE des informations publiques et vérifiées ([SOURCÉ] dans le
 * dossier KRM). Aucune donnée de la SCI, aucun SIREN, aucun numéro de local,
 * aucune donnée de bail ne doit apparaître ici.
 */

export const SITE = {
  nom: "Pôle commercial l'Albizia",
  nomCourt: "L'Albizia",
  accroche: 'Vos commerces de proximité à Montech',
  description:
    "Le pôle commercial l'Albizia réunit à Montech des commerces " +
    'et artisans de proximité : beauté, restauration, auto, services. Parking ' +
    'gratuit, accès PMR, distributeur de pizzas et point relais accessibles 24h/24.',
  locale: 'fr_FR',
  lang: 'fr',
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
  mention:
    'Horaires des parties communes, donnés à titre indicatif. ' +
    'Les horaires de chaque commerce sont propres à l’enseigne.',
  jours: [
    { jours: 'Lundi – Samedi', horaire: '8h30 – 23h00' },
    { jours: 'Dimanche', horaire: '11h00 – 23h00' },
  ],
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
 * Le numéro 06 20 59 62 45 apparaît dans les annuaires mais n'est pas
 * publié tant que son titulaire et son usage ne sont pas confirmés.
 * Passer `telephone` à la valeur voulue une fois validé.
 */
export const CONTACT = {
  telephone: null as string | null,
  email: null as string | null,
} as const;

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

/** Libellés des statuts d'un local, et ordre d'affichage des groupes. */
export const STATUTS_LOCAL = {
  disponible: { label: 'Disponible', description: 'Libre à la location' },
  reserve: { label: 'Réservé', description: 'Sous option, nous consulter' },
  loue: { label: 'Loué', description: 'Occupé' },
} as const;

export type StatutLocal = keyof typeof STATUTS_LOCAL;

export const ORDRE_STATUTS = Object.keys(STATUTS_LOCAL) as StatutLocal[];

/** Éditeur du site — mentions légales uniquement. */
export const EDITEUR = {
  raisonSociale: 'SCI KRM',
  forme: 'Société civile immobilière',
  adresse: ADRESSE_COMPLETE,
} as const;

export const NAV = [
  { href: '/commerces', label: 'Les commerces' },
  { href: '/services', label: 'Services' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/infos-pratiques', label: 'Infos pratiques' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Libellés et ordre d'affichage des catégories de commerces. */
export const CATEGORIES = {
  restauration: { label: 'Restauration', pluriel: 'Restauration' },
  artisanat: { label: 'Artisanat & produits locaux', pluriel: 'Artisanat & produits locaux' },
  commerce: { label: 'Commerces', pluriel: 'Commerces' },
  beaute: { label: 'Beauté & bien-être', pluriel: 'Beauté & bien-être' },
  services: { label: 'Services', pluriel: 'Services' },
  auto: { label: 'Auto & mobilité', pluriel: 'Auto & mobilité' },
} as const;

export type CategorieId = keyof typeof CATEGORIES;

export const ORDRE_CATEGORIES = Object.keys(CATEGORIES) as CategorieId[];
