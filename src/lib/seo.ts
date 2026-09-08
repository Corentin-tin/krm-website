import { ADRESSE, AGENCE, HORAIRES, SITE, CONTACT } from './site';
import type { Locale } from '../i18n';

const adressePostale = {
  '@type': 'PostalAddress',
  streetAddress: ADRESSE.rue,
  postalCode: ADRESSE.codePostal,
  addressLocality: ADRESSE.ville,
  addressRegion: ADRESSE.region,
  addressCountry: ADRESSE.pays,
};

/**
 * Fiche du pôle lui-même. `ShoppingCenter` est le type schema.org le plus
 * proche d'un ensemble commercial multi-enseignes ; les équipements 24h/24
 * sont déclarés en `amenityFeature` car ce sont des requêtes à forte
 * intention (« borne de recharge 24h/24 Montech »).
 */
export function schemaPole(opts: {
  siteUrl: string;
  /** Description du pôle, dans la langue de la page. */
  description: string;
  locale: Locale;
  equipements?: string[];
}) {
  const { siteUrl, description, locale, equipements = [] } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'ShoppingCenter',
    name: SITE.nom,
    description,
    inLanguage: locale,
    url: siteUrl,
    address: adressePostale,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ADRESSE.geo.latitude,
      longitude: ADRESSE.geo.longitude,
    },
    openingHoursSpecification: HORAIRES.schema,
    ...(CONTACT.telephone ? { telephone: CONTACT.telephone } : {}),
    amenityFeature: equipements.map((nom) => ({
      '@type': 'LocationFeatureSpecification',
      name: nom,
      value: true,
    })),
    publicAccess: true,
    isAccessibleForFree: true,
  };
}

/** Fiche d'une enseigne, rattachée au pôle par `containedInPlace`. */
export function schemaCommerce(opts: {
  nom: string;
  description: string;
  url: string;
  siteUrl: string;
  telephone?: string;
  siteWeb?: string;
  image?: string;
  /** Langue réelle de la fiche, qui peut différer de celle de la page en repli. */
  locale: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: opts.nom,
    description: opts.description,
    inLanguage: opts.locale,
    url: opts.url,
    address: adressePostale,
    ...(opts.telephone ? { telephone: opts.telephone } : {}),
    ...(opts.siteWeb ? { sameAs: [opts.siteWeb] } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    containedInPlace: {
      '@type': 'ShoppingCenter',
      name: SITE.nom,
      url: opts.siteUrl,
      address: adressePostale,
    },
  };
}

/**
 * Annonce d'un local à louer.
 *
 * `RealEstateListing` est le type dédié aux annonces immobilières ; il est
 * compris par Google et permet de faire remonter la surface et la
 * disponibilité. Le loyer n'étant pas publié (politique « sur demande »),
 * aucune `offers.price` n'est déclarée : mieux vaut pas de prix qu'un prix
 * faux. L'agence figure en `provider`, jamais le bailleur.
 */
export function schemaLocal(opts: {
  reference: string;
  description: string;
  url: string;
  siteUrl: string;
  surface?: number;
  image?: string;
  /** Annonce du local chez l'agence : la source que nous reprenons. */
  annonce?: string;
  /** Date de mise en ligne de l'annonce, lue dans le frontmatter. */
  misEnLigne: Date;
  /** Nom de l'annonce, composé par l'appelant depuis son dictionnaire. */
  nomAnnonce: string;
  locale: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: opts.nomAnnonce,
    description: opts.description,
    inLanguage: opts.locale,
    url: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    /* Rattache notre fiche à l'annonce de l'agence, qui fait foi. */
    ...(opts.annonce ? { sameAs: opts.annonce } : {}),
    /*
     * Date lue dans le frontmatter, jamais `new Date()` : la date de build
     * ferait passer chaque reconstruction du site pour une remise en ligne,
     * et annoncerait des annonces perpétuellement neuves.
     */
    datePosted: opts.misEnLigne.toISOString().slice(0, 10),
    provider: {
      '@type': 'RealEstateAgent',
      name: AGENCE.nom,
      url: AGENCE.siteWeb,
      address: {
        '@type': 'PostalAddress',
        streetAddress: AGENCE.rue,
        postalCode: AGENCE.codePostal,
        addressLocality: AGENCE.ville,
        addressCountry: 'FR',
      },
    },
    about: {
      '@type': 'Place',
      name: `${opts.reference} — ${SITE.nom}`,
      address: adressePostale,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: ADRESSE.geo.latitude,
        longitude: ADRESSE.geo.longitude,
      },
      ...(opts.surface
        ? {
            floorSize: {
              '@type': 'QuantitativeValue',
              value: opts.surface,
              unitCode: 'MTK',
            },
          }
        : {}),
      containedInPlace: {
        '@type': 'ShoppingCenter',
        name: SITE.nom,
        url: opts.siteUrl,
        address: adressePostale,
      },
    },
  };
}

export function schemaFilAriane(
  items: { nom: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nom,
      item: item.url,
    })),
  };
}
