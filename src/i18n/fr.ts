/**
 * Dictionnaire français — source de vérité du type `Dictionnaire`.
 *
 * Pas de `as const` : les littéraux figeraient le type et rendraient `en.ts`
 * non assignable. TypeScript infère `string` pour les feuilles, ce qui est
 * exactement ce qu'il faut pour que le dictionnaire anglais soit vérifié
 * clé par clé au build.
 *
 * Convention : `<portee>.<element>` en camelCase, la clé décrit le rôle et
 * non le texte (`heroCtaCommerces`, pas `decouvrirLesCommerces`) — sinon
 * renommer un bouton oblige à renommer la clé.
 *
 * Les chaînes paramétrées et les pluriels sont des fonctions : chaque langue
 * gère ses propres règles d'accord, ce qu'aucun moteur d'interpolation
 * générique ne ferait sans être plus lourd.
 */
export const fr = {
  /* ---------------------------------------------------------------- commun */
  commun: {
    accueil: 'Accueil',
    adresse: 'Adresse',
    horairesTitre: 'Horaires du site',
    horairesMention:
      'Horaires des parties communes, donnés à titre indicatif. ' +
      'Les horaires de chaque commerce sont propres à l’enseigne.',
    accessibles24h: 'Accessibles 24h/24 :',
    parkingGratuit: 'Parking gratuit',
    visiterSite: 'Visiter le site web',
    voirSurMaps: 'Voir sur Google Maps',
    parkingPlainPied:
      "Parking gratuit et accès de plain-pied sur l'ensemble du pôle.",
    nousContacter: 'Nous contacter',
  },

  /* ------------------------------------------------------------- horaires */
  horaires: {
    lundiSamedi: 'Lundi – Samedi',
    dimanche: 'Dimanche',
    plageSemaine: '8h30 – 23h00',
    plageDimanche: '11h00 – 23h00',
  },

  /* ------------------------------------------------------------ métadonnées */
  meta: {
    siteAccroche: 'Vos commerces de proximité à Montech',
    siteDescription:
      "Le pôle commercial l'Albizia réunit à Montech des commerces " +
      'et artisans de proximité : beauté, restauration, auto, services. Parking ' +
      'gratuit, accès PMR, distributeur de pizzas et point relais accessibles 24h/24.',
  },

  /* ------------------------------------------------------------ navigation */
  nav: {
    commerces: 'Les commerces',
    services: 'Services',
    actualites: 'Actualités',
    infosPratiques: 'Infos pratiques',
    contact: 'Contact',
    locaux: 'Locaux à louer',
    mentionsLegales: 'Mentions légales',
  },

  /* --------------------------------------------------------------- en-tête */
  entete: {
    sousTitre: 'Pôle commercial · Montech',
    menu: 'Menu',
  },

  /* ---------------------------------------------------------- pied de page */
  pied: {
    colonneSite: 'Le site',
    situation: 'En bordure de la RD 928 — avenue de Montauban',
    arguments: 'Parking gratuit · Accès PMR · Services 24h/24',
    horairesMentionCourte: 'Horaires indicatifs des parties communes.',
    copyright: (annee: number, nom: string) => `© ${annee} ${nom}. Tous droits réservés.`,
  },

  /* ------------------------------------------------------------ catégories */
  categories: {
    restauration: 'Restauration',
    artisanat: 'Artisanat & produits locaux',
    commerce: 'Commerces',
    beaute: 'Beauté & bien-être',
    services: 'Services',
    auto: 'Auto & mobilité',
  },

  /* --------------------------------------------------------------- statuts */
  statuts: {
    disponible: { label: 'Disponible', description: 'Libre à la location' },
    reserve: { label: 'Réservé', description: 'Sous option, nous consulter' },
    loue: { label: 'Loué', description: 'Occupé' },
  },

  /* --------------------------------------------------------------- accueil */
  accueil: {
    heroSurtitre: 'Montech · Tarn-et-Garonne',
    heroIntro:
      "Des commerces et artisans de proximité réunis au même endroit, à l'entrée " +
      'de Montech. Parking gratuit, accès de plain-pied, et des services ' +
      'accessibles à toute heure.',
    heroCtaCommerces: 'Découvrir les commerces',
    heroCtaVenir: 'Venir sur place',
    stationnement: 'Stationnement',
    accessibilite: 'Accessibilité',
    accessibiliteValeur: 'Plain-pied, accès PMR',
    videoTitre: 'Le pôle en images',
    videoIntro:
      'Une visite aérienne du site en moins de deux minutes : les enseignes, ' +
      'le parking, les accès et les services en libre accès.',
    videoLecture: 'Lire la vidéo de présentation',
    videoDuree: '1 min 42',
    permanentsTitre: 'Ouvert même quand tout est fermé',
    /** Écrit les nombres en toutes lettres et gère l'accord — cf. en.ts. */
    permanentsIntro: (n: number) => {
      const mots = ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept'];
      const nombre = mots[n] ?? String(n);
      return (
        `${nombre} service${n > 1 ? 's' : ''} en libre accès ` +
        `fonctionne${n > 1 ? 'nt' : ''} 24 heures sur 24 et 7 jours sur 7, ` +
        'y compris le dimanche et les jours fériés.'
      );
    },
    permanentsCta: 'Tous les services du site',
    commercesTitre: 'Les commerces du pôle',
    commercesIntro:
      'Beauté, restauration, auto, services, artisanat : des enseignes de ' +
      'proximité, tenues par des indépendants.',
    commercesCta: "Voir l'annuaire",
    actualitesTitre: 'Actualités du pôle',
    actualitesCta: 'Toutes les actualités',
    venirTitre: "Venir à l'Albizia",
    venirIntro:
      'En bordure de la RD 928 (avenue de Montauban), dans la zone commerciale ' +
      'de la Mouscane. Parking gratuit sur place.',
    venirCta: 'Itinéraire et infos pratiques',
  },

  /* -------------------------------------------------------- liste commerces */
  commerces: {
    metaTitre: 'Les commerces',
    metaDescription: (nom: string) =>
      `Annuaire des commerces et artisans du ${nom} à Montech : beauté, ` +
      'restauration, auto, services et produits locaux. Parking gratuit sur place.',
    titre: 'Les commerces du pôle',
    intro:
      "Des enseignes indépendantes réunies au même endroit, à l'entrée de " +
      'Montech. Beauté, restauration, auto, services, artisanat.',
    vide: "L'annuaire est en cours de constitution. Revenez prochainement.",
    encartTitre: 'Vous êtes commerçant sur le pôle\u00a0?',
    encartTexte:
      "Votre enseigne n'apparaît pas encore dans cet annuaire, ou les " +
      'informations affichées sont à corriger\u00a0? Écrivez-nous pour que votre ' +
      'fiche soit ajoutée ou mise à jour.',
    listeNom: (nom: string) => `Les commerces du ${nom}`,
  },

  /* --------------------------------------------------------- fiche commerce */
  commerce: {
    infosPratiques: 'Informations pratiques',
    retour: '← Tous les commerces',
    metaDescription: (accroche: string, nom: string, adresse: string) =>
      `${accroche} ${nom} vous accueille au pôle commercial l'Albizia, ${adresse}. Parking gratuit.`,
  },

  /* -------------------------------------------------------------- services */
  services: {
    metaTitre: 'Services et équipements',
    metaDescription: (nom: string) =>
      `Parking gratuit, accès PMR, casier Mondial Relay, consigne Pickup et ` +
      `borne de recharge électrique au ${nom} à Montech.`,
    titre: 'Services et équipements',
    intro:
      'Au-delà des commerces, le pôle met à disposition des équipements en ' +
      'libre accès — dont plusieurs fonctionnent 24 heures sur 24.',
    badge24h: '24h/24 · 7j/7',
    mention:
      'Les équipements en libre accès sont exploités par des prestataires ' +
      'indépendants. Leur disponibilité peut varier en cas de maintenance.',
  },

  /* ------------------------------------------------------ liste actualités */
  actualites: {
    metaTitre: 'Actualités',
    metaDescription: (nom: string) =>
      `Nouvelles enseignes, nouveaux services et animations du ${nom} à Montech.`,
    titre: 'Actualités du pôle',
    intro:
      "Nouvelles enseignes, nouveaux services, animations : ce qui bouge à l'Albizia.",
    vide: 'Aucune actualité pour le moment.',
  },

  /* ------------------------------------------------------- fiche actualité */
  actualite: {
    retour: '← Toutes les actualités',
  },

  /* ------------------------------------------------------- infos pratiques */
  infos: {
    metaTitre: 'Infos pratiques',
    metaDescription: (nom: string, adresse: string) =>
      `Adresse, accès, horaires et stationnement du ${nom}, ${adresse}. ` +
      'Parking gratuit et accès PMR.',
    titre: 'Infos pratiques',
    intro:
      'Où nous trouver, comment venir, à quelle heure. Tout ce qu\'il faut ' +
      'savoir avant de passer.',
    situationTexte:
      "Le pôle se situe en bordure de la <strong>RD 928</strong> (avenue de " +
      "Montauban), dans la zone commerciale de la Mouscane, à l'entrée de " +
      'Montech en venant de Montauban.',
    ctaItineraire: 'Calculer mon itinéraire',
    ctaCarte: 'Voir sur la carte',
    encart24h:
      'Le casier Mondial Relay, la borne de recharge et le distributeur ' +
      'automatique de pizzas restent accessibles <strong>24h/24 et 7j/7</strong>, ' +
      'en dehors de ces horaires.',
    stationnementTitre: 'Stationnement et accessibilité',
    parkingTitre: 'Parking gratuit',
    parkingTexte:
      'Stationnement gratuit sur site, sans disque ni limitation de durée, ' +
      'complété par les rues adjacentes.',
    pmrTitre: 'Accès PMR',
    pmrTexte:
      'Places dédiées près des entrées, cheminements de plain-pied et ' +
      'sanitaires adaptés.',
    electriqueTitre: 'Véhicules électriques',
    electriqueTexte:
      'Borne Powerdot avec trois points de charge rapide simultanés, en ' +
      'libre accès et sans abonnement.',
  },

  /* --------------------------------------------------------------- contact */
  contact: {
    metaTitre: 'Contact',
    metaDescription: (nom: string) =>
      `Contacter le ${nom} à Montech : informations sur le site, location ` +
      "d'un local commercial, mise à jour d'une fiche commerçant.",
    titre: 'Nous contacter',
    intro:
      'Une question sur le pôle, un local à louer, une fiche à corriger : ' +
      'voici comment nous joindre.',
    coordonnees: 'Coordonnées',
    telephone: 'Téléphone',
    courriel: 'Courriel',
    selonDemande: 'Selon votre demande',
    chercheCommerceTitre: 'Vous cherchez un commerce',
    chercheCommerceTexte:
      'Chaque enseigne gère ses propres horaires et rendez-vous. Le plus ' +
      'rapide est de la contacter directement depuis sa fiche.',
    chercheCommerceCta: "Consulter l'annuaire →",
    louerTitre: 'Vous souhaitez louer un local',
    /** Pluriel manuel : « 1 local est » / « 2 locaux sont ». */
    louerTexte: (n: number, agence: string) =>
      n > 0
        ? `${n} ${n > 1 ? 'locaux sont disponibles' : 'local est disponible'} ` +
          `à la location. La commercialisation est confiée à ${agence}.`
        : `Tous les locaux du pôle sont actuellement occupés. ` +
          `La commercialisation est confiée à ${agence}.`,
    louerCta: 'Voir les locaux disponibles →',
    commercantTitre: 'Vous êtes commerçant sur le pôle',
    commercantTexte:
      "Pour ajouter votre enseigne à l'annuaire, corriger une information ou " +
      'signaler une actualité, faites-le nous savoir : votre fiche sera mise à jour.',
    commercantCta: 'Écrire au pôle →',
    mailSujet: (nom: string) => `Ma fiche sur le site du ${nom}`,
    locauxTitre: 'Les locaux à louer',
    locauxIntro: (nbCommerces: number) =>
      `Rejoignez les ${nbCommerces} enseignes déjà installées au pôle ` +
      "commercial l'Albizia, à l'entrée de Montech. Parking gratuit et sans " +
      'limite de durée, accès de plain-pied, et des services communs — casiers ' +
      'de retrait de colis, borne de recharge électrique — qui amènent du ' +
      'passage tout au long de la journée.',
    listeNom: (nom: string) => `Locaux commerciaux à louer au ${nom}`,
  },

  /* --------------------------------------------------------------------- faq */
  /**
   * Questions fréquentes, écrites telles qu'elles sont réellement posées —
   * « Y a-t-il des locaux à louer… », pas « Disponibilité locative ».
   *
   * Deux contraintes gouvernent ces textes :
   *
   *   — chaque réponse doit être autonome. Elle est extraite de la page et
   *     citée seule par un moteur génératif : « il est à 5 minutes » ne veut
   *     alors plus rien dire, il faut renommer le pôle et la ville ;
   *   — chaque réponse tient en 40 à 60 mots. Au-delà, elle est résumée par
   *     le moteur, et c'est lui qui choisit ce qu'il en retient.
   *
   * Les chiffres (nombre de locaux, surfaces) sont passés en paramètres et
   * calculés depuis le contenu : une FAQ qui annonce des surfaces périmées
   * est pire qu'une absence de FAQ.
   */
  faq: {
    titre: 'Questions fréquentes',
    /** Locaux disponibles — la question que ce site doit servir en premier. */
    locauxQuestion: 'Y a-t-il des locaux commerciaux à louer à Montech ?',
    locauxReponse: (n: number, surfaces: string, nom: string, adresse: string) =>
      n > 0
        ? `Oui. ${n > 1 ? `${n} locaux commerciaux sont disponibles` : '1 local commercial est disponible'} ` +
          `à la location au ${nom}, ${adresse}, en Tarn-et-Garonne : ${surfaces}. ` +
          'Ils conviennent au commerce, aux services, aux professions libérales ' +
          "et au bureau. La location est confiée à l'agence Laforêt Montech."
        : `Tous les locaux du ${nom}, ${adresse}, sont actuellement occupés. ` +
          "L'agence Laforêt Montech tient à jour les disponibilités du pôle.",

    loyerQuestion: 'Quel est le loyer d\'un local au pôle commercial l\'Albizia ?',
    loyerReponse: (agence: string) =>
      `Les loyers ne sont pas publiés sur ce site : ils sont communiqués sur ` +
      `demande par ${agence}, qui commercialise les locaux du pôle. ` +
      "L'agence transmet les conditions de location, organise les visites et " +
      'répond aux questions sur le bail.',

    ouQuestion: 'Où se trouve le pôle commercial l\'Albizia ?',
    ouReponse: (nom: string, adresse: string) =>
      `Le ${nom} se situe ${adresse}, à l'entrée de Montech, dans le ` +
      "Tarn-et-Garonne (Occitanie), à une vingtaine de minutes de Montauban. " +
      'Le parking est gratuit et sans limite de durée, et tous les commerces ' +
      'sont accessibles de plain-pied.',

    activitesQuestion: 'Quelles activités peut-on ouvrir dans un local du pôle ?',
    activitesReponse:
      'Les locaux se prêtent au commerce de détail, aux services, à la beauté ' +
      'et au bien-être, aux professions libérales et au bureau. Le plateau ' +
      "de l'étage ne convient pas aux activités alimentaires. Les enseignes " +
      'déjà installées couvrent la restauration, la coiffure, le spa, ' +
      "l'automobile, la comptabilité et le courtage.",

    stationnementQuestion: 'Le parking du pôle est-il gratuit ?',
    stationnementReponse:
      "Oui. Le parking du pôle commercial l'Albizia à Montech est gratuit, " +
      'sans limite de durée et sans disque. Il comprend des places réservées ' +
      'aux personnes à mobilité réduite et une borne de recharge électrique ' +
      'rapide Powerdot à trois points de charge.',

    horairesQuestion: 'À quelle heure le pôle commercial l\'Albizia est-il ouvert ?',
    horairesReponse:
      'Les parties communes du pôle sont accessibles du lundi au samedi de ' +
      '8h30 à 23h00, et le dimanche de 11h00 à 23h00. Chaque enseigne fixe ' +
      'ses propres horaires. Le distributeur de pizzas, le casier Mondial ' +
      'Relay et la borne de recharge sont accessibles 24h/24.',
  },

  /* ------------------------------------------------------------ fiche local */
  local: {
    /** Reprend la formulation d'une recherche réelle plutôt que la référence interne. */
    titreAvecSurface: (surface: string) => `Local commercial ${surface} à louer`,
    titreSansSurface: (reference: string) => `${reference} — local commercial à louer`,
    metaDescription: (
      accroche: string,
      reference: string,
      surface: string | null,
      nom: string,
      adresse: string,
      disponibilite: string,
    ) =>
      `${accroche} ${reference}${surface ? `, ${surface}` : ''} à louer au ` +
      `${nom}, ${adresse}. Disponibilité : ${disponibilite}.`,
    nomAnnonce: (reference: string, nom: string) =>
      `${reference} — local commercial à louer, ${nom}`,
    /**
     * Résumé autonome, placé en tête de la fiche.
     *
     * Il redit ce que la page montre déjà (surface, statut, ville), et c'est
     * voulu : c'est le seul paragraphe de la fiche qui reste vrai extrait de
     * son contexte. Un moteur génératif qui cite « 71 m² de plain-pied avec
     * vitrine » sans savoir de quelle ville il parle ne sert à personne ; ce
     * bloc lui donne la phrase complète à reprendre.
     */
    resume: (
      reference: string,
      surface: string | null,
      statut: string,
      disponibilite: string,
      nom: string,
      adresse: string,
      destinations: string[],
    ) =>
      `${reference}${surface ? ` de ${surface}` : ''} à louer au ${nom}, ` +
      `${adresse}, en Tarn-et-Garonne (Occitanie). ` +
      `${statut}, disponibilité : ${disponibilite}.` +
      (destinations.length
        ? ` Activités envisageables : ${destinations.join(', ').toLowerCase()}.`
        : '') +
      " Le loyer est communiqué sur demande par l'agence qui commercialise le local.",
    atoutsTitre: 'Les atouts du local',
    galerieTitre: 'Le local en images',
    caracteristiques: 'Caractéristiques',
    surface: 'Surface',
    statut: 'Statut',
    disponibilite: 'Disponibilité',
    disponibiliteDefaut: 'Nous consulter',
    loyer: 'Loyer',
    loyerDefaut: 'Sur demande',
    destinations: 'Activités envisageables',
    mention:
      "Parking gratuit et accès de plain-pied sur l'ensemble du pôle. " +
      'Surfaces données à titre indicatif, à vérifier lors de la visite.',
    legendeSituation: (reference: string) =>
      `Emplacement de ${reference} au sein du pôle, signalé par un cadre rouge.`,
    retour: '← Tous les locaux',
  },

  /* -------------------------------------------------------- contact agence */
  agence: {
    titreGenerique: 'Intéressé par un local\u00a0?',
    titreLocal: (reference: string) => `Visiter ${reference}`,
    /** Contient une balise <strong> : rendu via set:html. */
    introAgence: (agence: string) =>
      `La location des locaux du pôle est confiée à ` +
      `<strong class="font-semibold text-albizia-900">${agence}</strong>.`,
    texteAvecAnnonce:
      "L'annonce de ce local sur son site donne les conditions, le détail " +
      'des surfaces et le formulaire de demande de visite.',
    texteSansAnnonce:
      "Contactez l'agence pour obtenir les conditions, le détail des surfaces " +
      "et convenir d'une visite.",
    ctaAnnonce: (agence: string) => `Voir l'annonce ${agence}`,
    ctaContact: (agence: string) => `Contacter ${agence}`,
  },

  /* ------------------------------------------------------- mentions légales */
  mentions: {
    metaTitre: 'Mentions légales',
    metaDescription:
      "Mentions légales et informations sur l'éditeur du site du pôle commercial l'Albizia.",
    editeurTitre: 'Éditeur du site',
    editeurTexte: (raisonSociale: string, forme: string, nom: string) =>
      `Le présent site est édité par <strong>${raisonSociale}</strong>, ` +
      `${forme.toLowerCase()}, propriétaire du ${nom}.`,
    siegeSocial: (adresse: string) => `Siège social : ${adresse}`,
    siren: (siren: string) => `SIREN : ${siren} — RCS Montauban ${siren}`,
    directeur: (nom: string) => `Directeur de la publication : ${nom}, gérant.`,
    contactLabel: 'Contact :',
    hebergementTitre: 'Hébergement',
    hebergementTexte:
      'Le site est hébergé par <strong>GitHub, Inc.</strong>, 88 Colin P. Kelly Jr. ' +
      'Street, San Francisco, CA 94107, États-Unis —',
    proprieteTitre: 'Propriété intellectuelle',
    proprieteTexte:
      'Les textes et éléments graphiques de ce site sont la propriété de leur ' +
      'éditeur, sauf mention contraire. Les noms commerciaux, marques et logos ' +
      "des enseignes présentées dans l'annuaire demeurent la propriété de leurs " +
      "titulaires respectifs et sont reproduits avec leur accord, à des fins d'information.",
    donneesTitre: 'Données personnelles',
    donneesTexte1:
      'Ce site est un site vitrine statique. Il ne collecte aucune donnée ' +
      "personnelle, ne dépose aucun cookie et n'utilise aucun outil de mesure d'audience.",
    donneesTexte2:
      'Si vous nous écrivez, les informations transmises servent uniquement à ' +
      "traiter votre demande et ne font l'objet d'aucune cession à des tiers. " +
      'Conformément au règlement (UE) 2016/679 (RGPD) et à la loi « Informatique ' +
      "et Libertés », vous disposez d'un droit d'accès, de rectification et " +
      "d'effacement des données vous concernant, exerçable auprès de l'éditeur du site.",
    commercesTitre: 'Informations sur les commerces',
    commercesTexte:
      'Les informations relatives aux enseignes (activités, horaires, ' +
      'coordonnées) sont fournies à titre indicatif et peuvent évoluer. Chaque ' +
      'commerce reste seul responsable de son activité, de ses horaires ' +
      "d'ouverture et des prestations qu'il propose. Nous vous invitons à " +
      "contacter directement l'enseigne concernée avant tout déplacement.",
    erreurTitre: 'Signaler une erreur',
    erreurTexteAvant:
      'Pour toute demande de correction ou de retrait d\'une information vous ' +
      'concernant, rendez-vous sur la',
    erreurLien: 'page contact',
    erreurTexteApres: '.',
  },

  /* ------------------------------------------------------------------- 404 */
  erreur404: {
    metaTitre: 'Page introuvable',
    metaDescription: "La page demandée n'existe pas ou a été déplacée.",
    surtitre: 'Erreur 404',
    titre: "Cette page n'existe pas",
    texte:
      "La page que vous cherchez a peut-être été déplacée, ou l'adresse saisie " +
      'comporte une erreur.',
    ctaAccueil: "Retour à l'accueil",
    ctaCommerces: 'Voir les commerces',
  },

  /* ---------------------------------------------------------- accessibilité */
  a11y: {
    lienEvitement: 'Aller au contenu principal',
    navPrincipale: 'Navigation principale',
    filAriane: "Fil d'Ariane",
    choixLangue: 'Choix de la langue',
    allerCategorie: 'Aller à une catégorie',
    altLogo: (nom: string) => `Logo de ${nom}`,
    altLogoSimple: (nom: string) => `Logo ${nom}`,
    altDevanture: (nom: string) => `Devanture de ${nom}`,
    ariaPhotoAvenir: (nom: string) => `${nom} — photo à venir`,
    surReseau: (nom: string, reseau: string) => `${nom} sur ${reseau}`,
    altVueAerienne: (nom: string, reference: string) =>
      `Vue aérienne du ${nom}, ${reference} signalé par un cadre rouge`,
    altVueAerienneCarte: (reference: string) =>
      `Vue aérienne du pôle commercial l'Albizia, ${reference} signalé en rouge`,
    altLocalAlouer: (reference: string) =>
      `${reference} à louer au pôle commercial l'Albizia`,
    ariaLocalPlaceholder: (reference: string, surface: string | null) =>
      `${reference}${surface ? `, ${surface}` : ''}`,
  },
};

export type Dictionnaire = typeof fr;
