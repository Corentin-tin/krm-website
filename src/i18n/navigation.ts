import { chemin, type CleRoute } from './routes';
import { t, type CleTexte, type Locale } from './index';

/**
 * Navigation principale.
 *
 * Chaque entrée associe une clé de route (qui produit l'URL localisée) à une
 * clé de texte (qui produit le libellé). Les deux tables étant vérifiées au
 * build, une langue ne peut pas dériver de l'autre.
 */
const ENTREES: { cle: CleRoute; texte: CleTexte }[] = [
  { cle: 'commerces', texte: 'nav.commerces' },
  { cle: 'services', texte: 'nav.services' },
  { cle: 'actualites', texte: 'nav.actualites' },
  { cle: 'infosPratiques', texte: 'nav.infosPratiques' },
  { cle: 'contact', texte: 'nav.contact' },
];

export type EntreeNav = { href: string; label: string };

export const nav = (locale: Locale): EntreeNav[] =>
  ENTREES.map((e) => ({ href: chemin(e.cle, locale), label: t(locale, e.texte) }));

/**
 * Navigation du pied de page : la navigation principale plus le raccourci
 * vers les locaux à louer, qui vivent dans une section de la page contact.
 */
export const navPied = (locale: Locale): EntreeNav[] => [
  ...nav(locale),
  {
    href: chemin('contact', locale, undefined, 'locaux'),
    label: t(locale, 'nav.locaux'),
  },
];
