# Site du Pôle commercial l'Albizia

Site vitrine du **Pôle commercial l'Albizia** — 4 rue de la Mouscane, 82700 Montech.

Objectif : faire connaître le pôle, informer les clients (horaires, accès,
services) et générer du passage dans les commerces.

- **Framework** : [Astro](https://astro.build) 7, sortie statique
- **Styles** : Tailwind CSS v4
- **Hébergement** : GitHub Pages

---

## Démarrer

```bash
npm install
npm run dev      # serveur de développement, http://localhost:4321
npm run build    # génère le site dans dist/
npm run preview  # prévisualise le build, base incluse
npm run check    # vérification des types
```

Node 22 minimum (voir `.nvmrc`).

---

## Règle éditoriale importante

Ce site est **public**. Le dossier de gestion de la SCI (rent roll, baux,
associés, SIREN des locataires, régime fiscal) **ne doit jamais y figurer**.

Seules apparaissent : l'adresse, les horaires, les services communs et les
enseignes. Aucun numéro de local, aucun montant, aucune donnée de bail.

### Publication d'une enseigne

Une fiche n'est publiée que si son champ `statut` vaut `actif`. Les enseignes
repérées en base SIRENE mais **non confirmées bail en main** restent en
`brouillon` : leur fichier existe (préfixé `_`), mais aucune page n'est
générée.

Avant de passer une fiche en `actif`, vérifier que le commerce est bien
présent et en activité. Publier une enseigne partie est pire que de ne pas
la lister.

---

## Ajouter du contenu

Tout le contenu est en Markdown dans `src/content/`. Aucune base de données.

Chaque collection est rangée par langue : `fr/` pour le français, `en/` pour
l'anglais. **Le français est la langue de référence** — une fiche qui n'existe
qu'en `fr/` s'affiche telle quelle sur le site anglais, signalée par un
attribut `lang="fr"` pour les lecteurs d'écran. Rien ne casse tant qu'une
traduction manque.

```
src/content/commerces/
  fr/wash-n-dry.md      ← version française
  en/wash-n-dry.md      ← traduction, optionnelle
```

**Le nom du fichier doit être identique dans les deux langues** : c'est lui
qui apparie les deux versions, produit l'URL et alimente le sélecteur de
langue. Voir « Traduire une fiche » plus bas.

### Un commerce

Créer `src/content/commerces/fr/mon-enseigne.md`. Le nom du fichier devient
l'URL (`/commerces/mon-enseigne`, et `/en/shops/mon-enseigne`).

```markdown
---
nom: "Nom de l'enseigne"
categorie: beaute        # beaute | restauration | auto | services | commerce | artisanat
accroche: "Une phrase courte, 160 caractères maximum."
statut: actif            # actif = publié · brouillon = invisible
fiabilite: source        # source = confirmé · a-confirmer = à vérifier
ordre: 1                 # optionnel, tri dans la catégorie
telephone: "05 63 00 00 00"     # optionnel
siteWeb: https://exemple.fr      # optionnel
horaires:                        # optionnel
  - jours: "Mardi – Samedi"
    horaire: "9h00 – 19h00"
reseaux:                         # optionnel
  - nom: Facebook
    url: https://facebook.com/...
---

Le texte de présentation, en Markdown.
```

> **Attention YAML** : toute valeur contenant `:` suivi d'un espace doit être
> entre guillemets. C'est le cas de la plupart des accroches.

### Une actualité

Créer `src/content/actualites/fr/mon-actu.md` :

```markdown
---
titre: "Titre de l'actualité"
date: 2026-09-15
resume: "Résumé court affiché dans les listes, 200 caractères maximum."
tags:
  - nouveauté
brouillon: false
---

Le corps de l'article.
```

### Un service

Créer `src/content/services/fr/mon-service.md` :

```markdown
---
nom: "Nom du service"
resume: "Description courte."
icone: parking      # parking, pmr, colis, recharge, repas, pain, horloge, localisation, boutique
enAvant: true       # affiché sur la page d'accueil
permanent: true     # accessible 24h/24
ordre: 1
---
```

### Ajouter une photo

Déposer l'image dans `src/assets/`, puis référencer :

```yaml
image: ../../../assets/ma-photo.jpg
```

> **Trois niveaux de `../`**, pas deux : le fichier vit dans
> `src/content/<collection>/<langue>/`. Un chemin faux fait échouer le build.

---

## Traduire une fiche

Copier le fichier de `fr/` vers `en/` **en gardant exactement le même nom**,
puis traduire les champs de texte et le corps :

```bash
cp src/content/commerces/fr/wash-n-dry.md src/content/commerces/en/wash-n-dry.md
```

Le fichier anglais remplace alors le français sur `/en/shops/wash-n-dry`, et
sur cette page seulement. Aucun code à toucher.

Ce qui se traduit : `nom` (sauf si c'est un nom propre), `accroche`,
`resume`, `titre`, `atouts`, `destinations`, `disponibilite`, `tags`, les
légendes de galerie et le corps Markdown. Ce qui ne se traduit pas :
`categorie`, `statut`, `icone`, `ordre`, les URLs et les coordonnées.

> **Limites de longueur** : `accroche` est plafonnée à 160 caractères et
> `resume` à 200 — ce sont les meta-descriptions. Un dépassement fait échouer
> le build : c'est le signe qu'il faut resserrer la traduction, pas relever
> la limite.

### Textes de l'interface

Les libellés du site (navigation, titres de sections, boutons, mentions
légales) vivent dans `src/i18n/fr.ts` et `src/i18n/en.ts`. Le dictionnaire
français est la source de vérité : ajouter une clé dans `fr.ts` sans son
équivalent anglais fait échouer `npm run check`, et donc le déploiement.

Les URLs des pages sont traduites elles aussi — la table de correspondance
est dans `src/i18n/routes.ts` (`/commerces` ↔ `/en/shops`).

Astro optimise et redimensionne automatiquement. Sans `image:`, une vignette
de remplacement colorée avec les initiales s'affiche — le site reste
présentable sans photo.

---

## Assets à fournir

Le site fonctionne aujourd'hui avec des placeholders. Pour le finaliser :

| Élément | Format | Dimensions conseillées |
|---|---|---|
| Photo de façade du pôle | JPG | 2400 × 1350 px (16:9) |
| Vue du parking / accès | JPG | 2400 × 1350 px |
| Devanture de chaque commerce | JPG | 1600 × 1200 px (4:3) |
| Logo du pôle | SVG ou PNG transparent | hauteur ≥ 512 px |
| Image de partage (OG) | JPG | 1200 × 630 px |

Poids : viser moins de 500 Ko par photo avant optimisation.

---

## Déploiement sur GitHub Pages

Le site est statique : il n'y a pas de serveur, GitHub sert directement le
contenu de `dist/`.

### Mise en place (une seule fois)

1. Dans le dépôt GitHub : **Settings → Pages → Source = « GitHub Actions »**.
   Sans cela le workflow échoue à la dernière étape.
2. C'est tout. Le workflow `.github/workflows/deploy.yml` fait le reste.

Chaque `git push` sur `main` reconstruit et republie le site. Le déploiement
se suit dans l'onglet **Actions**, et peut être relancé à la main depuis ce
même onglet (« Run workflow »).

Le workflow vérifie les types (`npm run check`) avant de construire : une
erreur de type bloque la publication plutôt que de mettre en ligne un site
cassé.

### URL et `base`

Le site est publié sur l'URL par défaut du dépôt :

```
https://corentin-tin.github.io/krm-website
```

Il vit donc dans un **sous-dossier**, d'où le `base: '/krm-website'` dans
`astro.config.mjs`. Conséquence à retenir en écrivant du contenu :

> **Ne jamais écrire un lien interne en dur** (`href="/commerces"`) : il
> pointerait à la racine du domaine et renverrait un 404, et il ignorerait la
> langue de la page. Utiliser `chemin()` de `src/i18n/routes.ts` —
> `href={chemin('commerces', locale)}` — qui ajoute la base **et** traduit le
> segment (`/commerces` en français, `/en/shops` en anglais).
>
> `lien()` de `src/lib/site.ts` reste utilisé pour les fichiers qui ne sont
> pas des pages (favicon, vidéos de `public/`) : il n'ajoute que la base.

Les liens vers les images d'`src/assets/` et les pages générées par Astro
sont préfixés tout seuls : seuls les chemins écrits à la main sont concernés.

### Passer au domaine définitif

Le jour où `pole-albizia.fr` est réservé, trois gestes suffisent :

1. Dans `astro.config.mjs` : `site = 'https://pole-albizia.fr'` et
   `base = '/'`.
2. Créer `public/CNAME` contenant `pole-albizia.fr`.
3. Chez le registrar, faire pointer le domaine vers GitHub Pages : quatre
   enregistrements `A` sur `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153` — et un `CNAME` `www` vers
   `corentin-tin.github.io`.

Les liens internes suivent d'eux-mêmes grâce à `lien()` : aucun fichier de
contenu n'est à retoucher.

Le fichier `public/.nojekyll` est nécessaire et ne doit pas être supprimé :
sans lui, GitHub ignore le dossier `_astro/` (préfixé par un underscore) et
le site s'affiche sans styles.

---

## Référencement local

Le code couvre le volet technique : données structurées `ShoppingCenter` et
`LocalBusiness`, sitemap, canoniques, balises Open Graph, titres ciblés sur
les recherches réelles.

**Le reste se joue hors du site**, et pèse souvent davantage :

- [ ] Créer une **fiche Google Business Profile** pour le pôle (catégorie
      « centre commercial »), avec photos, horaires et le lien vers ce site.
- [ ] Encourager chaque commerçant à créer ou revendiquer **sa propre fiche**
      Google, en indiquant « Pôle commercial l'Albizia » dans l'adresse.
- [ ] Renseigner le pôle sur **OpenStreetMap** (utilisé par de nombreux GPS).
- [ ] Faire pointer la page Facebook existante vers le site.

---

## Points à confirmer avant la mise en ligne

Ces éléments sont volontairement neutralisés dans le code, en attente de
validation :

- **Téléphone** — le numéro 06 20 59 62 45 apparaît dans les annuaires mais
  n'est pas publié. Renseigner `CONTACT.telephone` dans `src/lib/site.ts`
  une fois son titulaire et son usage confirmés.
- **Horaires du site** — les sources divergent (lun–sam 8h30–23h selon
  certaines, 8h30–21h selon d'autres). La version affichée porte une mention
  de prudence. Corriger `HORAIRES` dans `src/lib/site.ts` après relevé sur
  place.
- **Coordonnées GPS** — approximatives dans `ADRESSE.geo`, à affiner.
- **Mentions légales** — compléter le directeur de la publication, le SIREN
  et le RCS dans `EDITEUR` (`src/lib/site.ts`).
- **Enseignes en brouillon** — deux fiches attendent confirmation
  (Cross Courtage, Delt@ Expertise) : leur logo est en place, la présence
  effective reste à vérifier bail en main.
- **Adresse « rue » vs « avenue »** — plusieurs enseignes se déclarent au
  « 4 avenue de la Mouscane » alors que le pôle est au **4 rue de la
  Mouscane** (Maison & Services, La Fabrique de Maëv). C'est une erreur des
  commerçants, pas deux adresses distinctes : ne pas s'y fier pour écarter
  une enseigne.

---

## Structure

```
src/
├── assets/            # images sources, optimisées au build
├── components/        # composants réutilisables
├── content/           # contenu éditorial, une sous-dossier par langue
│   ├── actualites/{fr,en}/
│   ├── commerces/{fr,en}/    # fiches enseignes
│   ├── locaux/{fr,en}/       # locaux à louer
│   └── services/{fr,en}/     # équipements communs
├── i18n/
│   ├── fr.ts          # dictionnaire français — source de vérité du type
│   ├── en.ts          # dictionnaire anglais — vérifié clé par clé au build
│   ├── routes.ts      # table des slugs par langue + helper chemin()
│   ├── navigation.ts  # entrées de menu, dérivées des deux tables
│   └── index.ts       # locales, t(), dico(), formats
├── layouts/           # gabarit de page + SEO (canonical, hreflang)
├── lib/
│   ├── contenu.ts     # requêtes de contenu : filtres, tri, repli FR
│   ├── seo.ts         # données structurées schema.org
│   └── site.ts        # constantes non traduisibles (adresse, éditeur…)
├── pages/             # routes — points d'entrée minces
│   └── en/            # mêmes pages, slugs anglais
├── pages-partagees/   # le contenu réel des pages, paramétré par locale
└── styles/            # styles globaux et palette
```

Les pages de `src/pages/` ne contiennent que quelques lignes : elles
délèguent à `src/pages-partagees/` en passant la langue. Une modification de
page se fait donc à un seul endroit et vaut pour les deux versions — c'est ce
qui les empêche de diverger.
