import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, ORDRE_CATEGORIES, type CategorieId } from './site';

export type Commerce = CollectionEntry<'commerces'>;
export type Actualite = CollectionEntry<'actualites'>;
export type Service = CollectionEntry<'services'>;

const parNom = (a: Commerce, b: Commerce) => {
  const oa = a.data.ordre ?? Number.MAX_SAFE_INTEGER;
  const ob = b.data.ordre ?? Number.MAX_SAFE_INTEGER;
  if (oa !== ob) return oa - ob;
  return a.data.nom.localeCompare(b.data.nom, 'fr');
};

/**
 * Les commerces publiés. Point de passage unique : le filtre `statut`
 * est appliqué ici et nulle part ailleurs, pour qu'aucune page ne puisse
 * publier par inadvertance une enseigne non confirmée.
 */
export async function getCommerces(): Promise<Commerce[]> {
  const tous = await getCollection('commerces', (e) => e.data.statut === 'actif');
  return tous.sort(parNom);
}

export type GroupeCommerces = {
  id: CategorieId;
  label: string;
  commerces: Commerce[];
};

/** Commerces groupés par catégorie, dans l'ordre défini, catégories vides omises. */
export async function getCommercesParCategorie(): Promise<GroupeCommerces[]> {
  const commerces = await getCommerces();
  return ORDRE_CATEGORIES.map((id) => ({
    id,
    label: CATEGORIES[id].label,
    commerces: commerces.filter((c) => c.data.categorie === id),
  })).filter((g) => g.commerces.length > 0);
}

/** Actualités publiées, de la plus récente à la plus ancienne. */
export async function getActualites(limite?: number): Promise<Actualite[]> {
  const toutes = await getCollection('actualites', (e) => !e.data.brouillon);
  const triees = toutes.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return limite ? triees.slice(0, limite) : triees;
}

/** Services communs, dans l'ordre d'affichage choisi. */
export async function getServices(): Promise<Service[]> {
  const tous = await getCollection('services');
  return tous.sort((a, b) => a.data.ordre - b.data.ordre);
}

export async function getServicesEnAvant(): Promise<Service[]> {
  return (await getServices()).filter((s) => s.data.enAvant);
}

export type Permanent = {
  nom: string;
  resume: string;
  icone: string;
  /** Lien vers la fiche détaillée, quand l'entrée en a une. */
  href?: string;
};

/**
 * Tout ce qui reste accessible 24h/24, services communs ET enseignes en
 * libre-service (le distributeur de pizzas est un commerce, pas un
 * équipement du pôle). Les deux collections alimentent le même encart.
 */
export async function getPermanents(): Promise<Permanent[]> {
  const services = (await getServices())
    .filter((s) => s.data.permanent)
    .map((s) => ({
      nom: s.data.nom,
      resume: s.data.resume,
      icone: s.data.icone,
      href: `/services#${s.id}`,
    }));

  const commerces = (await getCommerces())
    .filter((c) => c.data.permanent)
    .map((c) => ({
      nom: c.data.nom,
      resume: c.data.accroche,
      icone: c.data.icone ?? 'boutique',
      href: `/commerces/${c.id}`,
    }));

  return [...services, ...commerces];
}

export const formaterDate = (date: Date): string =>
  date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
