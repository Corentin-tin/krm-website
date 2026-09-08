/**
 * Socle d'internationalisation.
 *
 * Le français est la langue par défaut et vit à la racine du site
 * (`/commerces`) ; l'anglais est préfixé et porte des slugs traduits
 * (`/en/shops`). Ce choix impose un routage manuel : la configuration
 * `i18n` native d'Astro suppose que le segment de langue est le seul
 * préfixe qui change, et son mécanisme de repli ne saurait pas relier
 * `/en/shops` à `/commerces`. Voir le commentaire d'astro.config.mjs.
 */
import { fr, type Dictionnaire } from './fr';
import { en } from './en';

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_DEFAUT: Locale = 'fr';

/** Locale au format Open Graph / hreflang étendu. */
export const LOCALE_OG: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_GB',
};

/** Locale BCP 47, pour les formats de date et les tris. */
export const LOCALE_BCP47: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
};

/**
 * Nom de chaque langue écrit dans sa propre langue.
 *
 * Jamais traduit : un visiteur anglophone égaré sur une page française doit
 * pouvoir reconnaître « English » sans comprendre le reste de la page.
 */
export const NOMS_LANGUES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

const DICTIONNAIRES: Record<Locale, Dictionnaire> = { fr, en };

/**
 * Locale déduite du chemin.
 *
 * Robuste à la base du site : sur GitHub Pages le chemin est
 * `/krm-website/en/shops`, la base doit donc être retirée avant de lire le
 * premier segment.
 */
export function localeDepuisChemin(pathname: string): Locale {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const chemin = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const premier = chemin.replace(/^\//, '').split('/')[0];
  return (LOCALES as readonly string[]).includes(premier) ? (premier as Locale) : LOCALE_DEFAUT;
}

/**
 * Chemins de clés du dictionnaire, en notation pointée.
 *
 * Les fonctions (chaînes paramétrées, pluriels) sont exclues : elles
 * s'appellent via `dico()`, qui les expose typées avec leurs arguments.
 */
type Feuilles<T, Prefixe extends string = ''> = {
  [K in keyof T & string]: T[K] extends (...a: never[]) => unknown
    ? never
    : T[K] extends string
      ? `${Prefixe}${K}`
      : Feuilles<T[K], `${Prefixe}${K}.`>;
}[keyof T & string];

export type CleTexte = Feuilles<Dictionnaire>;

/**
 * Texte simple. Une clé inexistante est une erreur de compilation, pas un
 * `undefined` affiché en production.
 */
export function t(locale: Locale, cle: CleTexte): string {
  const dictionnaire = DICTIONNAIRES[locale] as unknown as Record<string, unknown>;
  return cle
    .split('.')
    .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], dictionnaire) as string;
}

/** `t` lié à une locale, pour ne pas la répéter dans chaque appel d'un template. */
export function traducteur(locale: Locale) {
  return (cle: CleTexte): string => t(locale, cle);
}

/**
 * Dictionnaire complet — le seul accès aux chaînes paramétrées et aux
 * pluriels, écrits comme des fonctions pour que chaque langue gère ses
 * propres règles d'accord.
 */
export const dico = (locale: Locale): Dictionnaire => DICTIONNAIRES[locale];

export type { Dictionnaire };
