# Site du Pôle commercial l'Albizia

Site vitrine du **Pôle commercial l'Albizia** — 4 rue de la Mouscane, 82700 Montech.

Objectif : faire connaître le pôle, informer les clients (horaires, accès,
services) et générer du passage dans les commerces.

- **Framework** : [Astro](https://astro.build) 7, sortie statique
- **Styles** : Tailwind CSS v4
- **Hébergement** : Railway

---

## Démarrer

```bash
npm install
npm run dev      # serveur de développement, http://localhost:4321
npm run build    # génère le site dans dist/
npm run preview  # prévisualise le build
npm start        # sert dist/ comme en production
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

### Un commerce

Créer `src/content/commerces/mon-enseigne.md`. Le nom du fichier devient
l'URL (`/commerces/mon-enseigne`).

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

Créer `src/content/actualites/mon-actu.md` :

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

Créer `src/content/services/mon-service.md` :

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
image: ../../assets/ma-photo.jpg
```

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

## Déploiement sur Railway

1. Créer un projet Railway et le connecter à ce dépôt GitHub.
2. Railway détecte `railway.json` : build via `npm run build`, démarrage via
   `npm start`.
3. Définir la variable d'environnement **`SITE_URL`** avec l'URL publique
   définitive (ex. `https://pole-albizia.fr`). Elle alimente les URL
   canoniques, le sitemap et les données structurées.
4. Le port est fourni automatiquement par Railway via `PORT`.

Chaque `git push` sur la branche principale déclenche un nouveau déploiement.

### Domaine

Un nom de domaine reste à réserver. En attendant, Railway fournit une URL
`*.up.railway.app` — renseigner cette URL dans `SITE_URL` pour que les
canoniques soient cohérentes.

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
  et le RCS dans `src/pages/mentions-legales.astro`.
- **Enseignes en brouillon** — six fiches attendent confirmation, dont
  l'enseigne de cigarette électronique (ambiguïté entre « rue » et « avenue »
  de la Mouscane).

---

## Structure

```
src/
├── assets/            # images sources, optimisées au build
├── components/        # composants réutilisables
├── content/
│   ├── actualites/    # articles
│   ├── commerces/     # fiches enseignes (_ = brouillon)
│   └── services/      # équipements communs
├── layouts/           # gabarit de page + SEO
├── lib/
│   ├── contenu.ts     # requêtes de contenu (filtre les brouillons)
│   ├── seo.ts         # données structurées schema.org
│   └── site.ts        # constantes du site (adresse, horaires, contact)
├── pages/             # routes
└── styles/            # styles globaux et palette
```
