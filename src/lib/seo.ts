import { ADRESSE, HORAIRES, SITE, CONTACT } from './site';

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
export function schemaPole(siteUrl: string, equipements: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ShoppingCenter',
    name: SITE.nom,
    description: SITE.description,
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
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: opts.nom,
    description: opts.description,
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
