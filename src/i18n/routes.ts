import { lien } from '../lib/site';
import { LOCALE_DEFAUT, type Locale } from './index';

/**
 * Clés de route canoniques ↔ segment d'URL publié, par langue.
 *
 * La clé est un identifiant stable et neutre : elle ne change jamais, même
 * si le libellé de la page change. Les valeurs sont les segments réellement
 * publiés — ce sont eux qui sont indexés par les moteurs, on n'y touche donc
 * plus une fois le site en ligne.
 *
 * Le `satisfies` fait échouer `astro check` si une route est ajoutée sans sa
 * traduction anglaise.
 */
export const ROUTES = {
  accueil: { fr: '', en: '' },
  commerces: { fr: 'commerces', en: 'shops' },
  services: { fr: 'services', en: 'services' },
  actualites: { fr: 'actualites', en: 'news' },
  infosPratiques: { fr: 'infos-pratiques', en: 'visitor-info' },
  contact: { fr: 'contact', en: 'contact' },
  locaux: { fr: 'locaux', en: 'units' },
  mentionsLegales: { fr: 'mentions-legales', en: 'legal-notice' },
} as const satisfies Record<string, Record<Locale, string>>;

export type CleRoute = keyof typeof ROUTES;

/**
 * Chemin interne d'une route, dans une langue donnée.
 *
 *   chemin('commerces', 'en')                     → /krm-website/en/shops
 *   chemin('commerces', 'fr')                     → /krm-website/commerces
 *   chemin('commerces', 'en', 'wash-n-dry')       → /krm-website/en/shops/wash-n-dry
 *   chemin('contact', 'fr', undefined, 'locaux')  → /krm-website/contact#locaux
 *
 * `lien()` reste la seule à connaître BASE_URL : on compose au-dessus d'elle
 * plutôt que de dupliquer sa logique.
 */
export function chemin(
  cle: CleRoute,
  locale: Locale,
  segment?: string,
  ancre?: string,
): string {
  const prefixe = locale === LOCALE_DEFAUT ? '' : locale;
  const parties = [prefixe, ROUTES[cle][locale], segment].filter(Boolean).join('/');
  return lien(`/${parties}`) + (ancre ? `#${ancre}` : '');
}

/** URL absolue d'une route — pour le canonical, les hreflang et le JSON-LD. */
export function urlAbsolue(
  cle: CleRoute,
  locale: Locale,
  site: URL | string,
  segment?: string,
): string {
  return new URL(chemin(cle, locale, segment), site).href;
}
