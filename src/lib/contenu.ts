import { getCollection, type CollectionEntry } from 'astro:content';
import {
  ADRESSE_COMPLETE,
  AGENCE,
  ORDRE_CATEGORIES,
  ORDRE_STATUTS,
  SITE,
  type CategorieId,
  type StatutLocal,
} from './site';
import { LOCALES, LOCALE_BCP47, LOCALE_DEFAUT, dico, type Locale } from '../i18n';

export type Commerce = CollectionEntry<'commerces'>;
export type Actualite = CollectionEntry<'actualites'>;
export type Service = CollectionEntry<'services'>;
export type Local = CollectionEntry<'locaux'>;

/**
 * Langue d'une entrée, lue depuis le dossier qui la contient.
 *
 * Le loader `glob` slugifie le chemin relatif à sa base : un fichier
 * `commerces/fr/wash-n-dry.md` a donc l'id `fr/wash-n-dry`. On ne cherche
 * pas à « nettoyer » cet id via `generateId` — `fr/foo` et `en/foo`
 * produiraient alors le même identifiant et s'écraseraient silencieusement
 * dans le data store. Le préfixe est conservé, et masqué à l'affichage.
 */
export const langueEntree = (id: string): Locale => {
  const premier = id.split('/')[0];
  return (LOCALES as readonly string[]).includes(premier) ? (premier as Locale) : LOCALE_DEFAUT;
};

/**
 * Identifiant public d'une entrée, sans son dossier de langue.
 *
 * C'est lui qui va dans l'URL et dans les ancres — un id non nettoyé
 * produirait `/commerces/fr/wash-n-dry` et des ancres `#fr/parking`
 * (sélecteur CSS invalide) sans faire échouer le build.
 */
export const idPublic = (id: string): string =>
  id.includes('/') ? id.split('/').slice(1).join('/') : id;

/**
 * Une entrée par identifiant public, dans la langue demandée quand elle
 * existe, sinon en français.
 *
 * Le repli est indispensable au démarrage — les dossiers `en/` sont vides ou
 * partiels, et sans lui le site anglais serait une coquille. Il reste la
 * bonne réponse à long terme : une actualité peut n'exister qu'en français
 * sans qu'on veuille pour autant la faire disparaître du site anglais.
 */
function replier<T extends { id: string }>(entrees: T[], locale: Locale): T[] {
  const parId = new Map<string, T>();
  for (const entree of entrees) {
    const cle = idPublic(entree.id);
    const existante = parId.get(cle);
    // La locale demandée l'emporte toujours ; sinon on garde ce qu'on avait.
    if (!existante || langueEntree(entree.id) === locale) parId.set(cle, entree);
  }
  return [...parId.values()];
}

const parNom = (locale: Locale) => (a: Commerce, b: Commerce) => {
  const oa = a.data.ordre ?? Number.MAX_SAFE_INTEGER;
  const ob = b.data.ordre ?? Number.MAX_SAFE_INTEGER;
  if (oa !== ob) return oa - ob;
  return a.data.nom.localeCompare(b.data.nom, locale);
};

/**
 * Les commerces publiés. Point de passage unique : le filtre `statut`
 * est appliqué ici et nulle part ailleurs, pour qu'aucune page ne puisse
 * publier par inadvertance une enseigne non confirmée.
 *
 * Le filtre s'applique avant le repli : une fiche anglaise en brouillon
 * laisse donc réapparaître sa version française, ce qui est le comportement
 * voulu.
 */
export async function getCommerces(locale: Locale = LOCALE_DEFAUT): Promise<Commerce[]> {
  const tous = await getCollection('commerces', (e) => e.data.statut === 'actif');
  return replier(tous, locale).sort(parNom(locale));
}

export type GroupeCommerces = {
  id: CategorieId;
  label: string;
  commerces: Commerce[];
};

/** Commerces groupés par catégorie, dans l'ordre défini, catégories vides omises. */
export async function getCommercesParCategorie(
  locale: Locale = LOCALE_DEFAUT,
): Promise<GroupeCommerces[]> {
  const commerces = await getCommerces(locale);
  const labels = dico(locale).categories;
  return ORDRE_CATEGORIES.map((id) => ({
    id,
    label: labels[id],
    commerces: commerces.filter((c) => c.data.categorie === id),
  })).filter((g) => g.commerces.length > 0);
}

/** Actualités publiées, de la plus récente à la plus ancienne. */
export async function getActualites(
  locale: Locale = LOCALE_DEFAUT,
  limite?: number,
): Promise<Actualite[]> {
  const toutes = await getCollection('actualites', (e) => !e.data.brouillon);
  const triees = replier(toutes, locale).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return limite ? triees.slice(0, limite) : triees;
}

/** Services communs, dans l'ordre d'affichage choisi. */
export async function getServices(locale: Locale = LOCALE_DEFAUT): Promise<Service[]> {
  const tous = await getCollection('services');
  return replier(tous, locale).sort((a, b) => a.data.ordre - b.data.ordre);
}

export async function getServicesEnAvant(locale: Locale = LOCALE_DEFAUT): Promise<Service[]> {
  return (await getServices(locale)).filter((s) => s.data.enAvant);
}

export type Permanent = {
  nom: string;
  resume: string;
  icone: string;
  /** Lien vers la fiche détaillée, quand l'entrée en a une. */
  href?: string;
  /** Ancre ou identifiant public, pour composer le lien côté page. */
  id: string;
  /** Collection d'origine : les deux ne pointent pas vers la même route. */
  source: 'service' | 'commerce';
};

/**
 * Tout ce qui reste accessible 24h/24, services communs ET enseignes en
 * libre-service (le distributeur de pizzas est un commerce, pas un
 * équipement du pôle). Les deux collections alimentent le même encart.
 */
export async function getPermanents(locale: Locale = LOCALE_DEFAUT): Promise<Permanent[]> {
  const services = (await getServices(locale))
    .filter((s) => s.data.permanent)
    .map((s) => ({
      nom: s.data.nom,
      resume: s.data.resume,
      icone: s.data.icone,
      id: idPublic(s.id),
      source: 'service' as const,
    }));

  const commerces = (await getCommerces(locale))
    .filter((c) => c.data.permanent)
    .map((c) => ({
      nom: c.data.nom,
      resume: c.data.accroche,
      icone: c.data.icone ?? 'boutique',
      id: idPublic(c.id),
      source: 'commerce' as const,
    }));

  return [...services, ...commerces];
}

/**
 * Les locaux publiés. Comme pour les commerces, le filtre de publication est
 * appliqué ici et nulle part ailleurs.
 *
 * Tri : les disponibles d'abord (c'est l'objet de la page), puis par ordre
 * manuel, puis par surface croissante — un porteur de projet cherche
 * généralement la plus petite surface qui lui convient.
 */
export async function getLocaux(locale: Locale = LOCALE_DEFAUT): Promise<Local[]> {
  const tous = await getCollection('locaux', (e) => e.data.publication === 'actif');
  return replier(tous, locale).sort((a, b) => {
    const sa = ORDRE_STATUTS.indexOf(a.data.statut as StatutLocal);
    const sb = ORDRE_STATUTS.indexOf(b.data.statut as StatutLocal);
    if (sa !== sb) return sa - sb;
    const oa = a.data.ordre ?? Number.MAX_SAFE_INTEGER;
    const ob = b.data.ordre ?? Number.MAX_SAFE_INTEGER;
    if (oa !== ob) return oa - ob;
    return (a.data.surface ?? 0) - (b.data.surface ?? 0);
  });
}

/** Locaux effectivement libres — ce que compte le bandeau d'accroche. */
export async function getLocauxDisponibles(locale: Locale = LOCALE_DEFAUT): Promise<Local[]> {
  return (await getLocaux(locale)).filter((l) => l.data.statut === 'disponible');
}

/** « 120 m² » ou null si la surface n'est pas encore relevée. Identique dans les deux langues. */
export const formaterSurface = (surface?: number): string | null =>
  typeof surface === 'number' ? `${surface} m²` : null;

export const formaterDate = (date: Date, locale: Locale = LOCALE_DEFAUT): string =>
  date.toLocaleDateString(LOCALE_BCP47[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Les questions fréquentes, composées depuis le contenu réel du site.
 *
 * Elles vivent ici plutôt que dans le dictionnaire parce qu'elles ne sont pas
 * que du texte : le nombre de locaux libres et leurs surfaces sont lus dans
 * la collection. Une FAQ recopiée à la main annoncerait « 2 locaux de 71 et
 * 74 m² » longtemps après leur location — et c'est précisément la réponse
 * qu'un moteur génératif citerait.
 *
 * L'ordre n'est pas neutre : la disponibilité des locaux vient en premier,
 * c'est la question à laquelle ce site doit répondre avant les autres, et
 * c'est celle que le composant affiche dépliée.
 */
export async function getFaq(
  locale: Locale = LOCALE_DEFAUT,
): Promise<{ question: string; reponse: string }[]> {
  const textes = dico(locale);
  const { faq } = textes;
  const disponibles = await getLocauxDisponibles(locale);

  const surfaces = disponibles
    .map((l) => formaterSurface(l.data.surface))
    .filter((s): s is string => s !== null)
    .join(', ');

  return [
    {
      question: faq.locauxQuestion,
      reponse: faq.locauxReponse(disponibles.length, surfaces, SITE.nom, ADRESSE_COMPLETE),
    },
    { question: faq.loyerQuestion, reponse: faq.loyerReponse(AGENCE.nom) },
    { question: faq.ouQuestion, reponse: faq.ouReponse(SITE.nom, ADRESSE_COMPLETE) },
    { question: faq.activitesQuestion, reponse: faq.activitesReponse },
    { question: faq.stationnementQuestion, reponse: faq.stationnementReponse },
    { question: faq.horairesQuestion, reponse: faq.horairesReponse },
  ];
}
