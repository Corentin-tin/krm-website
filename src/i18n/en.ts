import type { Dictionnaire } from './fr';

/**
 * Dictionnaire anglais.
 *
 * Le type est celui du dictionnaire français : toute clé absente ou en trop
 * fait échouer `astro check`, et donc le déploiement — le workflow lance
 * `npm run check` avant `npm run build`.
 *
 * Noms propres conservés en français : « Pôle commercial l'Albizia »,
 * « Laforêt Montech », les noms de rues et de communes, et les dénominations
 * légales (forme juridique, RCS), qui sont glosées plutôt que traduites.
 */
export const en: Dictionnaire = {
  /* ---------------------------------------------------------------- commun */
  commun: {
    accueil: 'Home',
    adresse: 'Address',
    horairesTitre: 'Opening hours',
    horairesMention:
      'Opening hours of the common areas, given for guidance only. ' +
      'Each shop sets its own hours.',
    accessibles24h: 'Available 24/7:',
    parkingGratuit: 'Free parking',
    visiterSite: 'Visit website',
    voirSurMaps: 'View on Google Maps',
    parkingPlainPied: 'Free parking and step-free access throughout the centre.',
    nousContacter: 'Contact us',
  },

  /* ------------------------------------------------------------- horaires */
  horaires: {
    lundiSamedi: 'Monday – Saturday',
    dimanche: 'Sunday',
    plageSemaine: '8:30 am – 11:00 pm',
    plageDimanche: '11:00 am – 11:00 pm',
  },

  /* ------------------------------------------------------------ métadonnées */
  meta: {
    siteAccroche: 'Your local shops in Montech',
    siteDescription:
      "Pôle commercial l'Albizia brings together local shops and craftspeople " +
      'in Montech: beauty, food, motoring and everyday services. Free parking, ' +
      'step-free access, pizza vending machine and parcel points available 24/7.',
  },

  /* ------------------------------------------------------------ navigation */
  nav: {
    commerces: 'Our shops',
    services: 'Services',
    actualites: 'News',
    infosPratiques: 'Visitor info',
    contact: 'Contact',
    locaux: 'Units to let',
    mentionsLegales: 'Legal notice',
  },

  /* --------------------------------------------------------------- en-tête */
  entete: {
    sousTitre: 'Shopping centre · Montech',
    menu: 'Menu',
  },

  /* ---------------------------------------------------------- pied de page */
  pied: {
    colonneSite: 'This site',
    situation: 'Just off the RD 928 — avenue de Montauban',
    arguments: 'Free parking · Step-free access · 24/7 services',
    horairesMentionCourte: 'Common-area hours, for guidance only.',
    copyright: (annee: number, nom: string) => `© ${annee} ${nom}. All rights reserved.`,
  },

  /* ------------------------------------------------------------ catégories */
  categories: {
    restauration: 'Food & dining',
    artisanat: 'Crafts & local produce',
    commerce: 'Shops',
    beaute: 'Beauty & wellbeing',
    services: 'Services',
    auto: 'Motoring & mobility',
  },

  /* --------------------------------------------------------------- statuts */
  statuts: {
    disponible: { label: 'Available', description: 'Available to let' },
    reserve: { label: 'Under offer', description: 'Under offer, please enquire' },
    loue: { label: 'Let', description: 'Occupied' },
  },

  /* --------------------------------------------------------------- accueil */
  accueil: {
    heroSurtitre: 'Montech · Tarn-et-Garonne',
    heroIntro:
      'Local shops and craftspeople gathered in one place, at the entrance to ' +
      'Montech. Free parking, step-free access, and services available around ' +
      'the clock.',
    heroCtaCommerces: 'Browse the shops',
    heroCtaVenir: 'Plan your visit',
    stationnement: 'Parking',
    accessibilite: 'Accessibility',
    accessibiliteValeur: 'Step-free, wheelchair access',
    permanentsTitre: 'Open when everything else is closed',
    /** Nombres en toutes lettres et accord anglais — divergent du français. */
    permanentsIntro: (n: number) => {
      const mots = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
      const nombre = mots[n] ?? String(n);
      return (
        `${nombre} self-service facilit${n > 1 ? 'ies are' : 'y is'} available ` +
        '24 hours a day, 7 days a week, including Sundays and public holidays.'
      );
    },
    permanentsCta: 'All on-site services',
    commercesTitre: 'Shops at the centre',
    commercesIntro:
      'Beauty, food, motoring, services and crafts: local businesses, run by ' +
      'independent owners.',
    commercesCta: 'View the directory',
    actualitesTitre: 'Latest news',
    actualitesCta: 'All news',
    venirTitre: "Getting to l'Albizia",
    venirIntro:
      'Just off the RD 928 (avenue de Montauban), in the Mouscane retail area. ' +
      'Free parking on site.',
    venirCta: 'Directions and visitor info',
  },

  /* -------------------------------------------------------- liste commerces */
  commerces: {
    metaTitre: 'Our shops',
    metaDescription: (nom: string) =>
      `Directory of shops and craftspeople at ${nom} in Montech: beauty, food, ` +
      'motoring, services and local produce. Free parking on site.',
    titre: 'Shops at the centre',
    intro:
      'Independent businesses gathered in one place, at the entrance to Montech. ' +
      'Beauty, food, motoring, services and crafts.',
    vide: 'The directory is still being compiled. Please check back soon.',
    encartTitre: 'Do you run a business here?',
    encartTexte:
      'Is your business missing from this directory, or is the information shown ' +
      'out of date? Get in touch and we will add or update your listing.',
    listeNom: (nom: string) => `Shops at ${nom}`,
  },

  /* --------------------------------------------------------- fiche commerce */
  commerce: {
    infosPratiques: 'Useful information',
    retour: '← All shops',
    metaDescription: (accroche: string, nom: string, adresse: string) =>
      `${accroche} ${nom} welcomes you to Pôle commercial l'Albizia, ${adresse}. Free parking.`,
  },

  /* -------------------------------------------------------------- services */
  services: {
    metaTitre: 'Services and facilities',
    metaDescription: (nom: string) =>
      'Free parking, wheelchair access, Mondial Relay parcel locker, Pickup ' +
      `point and electric vehicle charging at ${nom} in Montech.`,
    titre: 'Services and facilities',
    intro:
      'Beyond the shops, the centre offers self-service facilities — several of ' +
      'which are available around the clock.',
    badge24h: '24/7',
    mention:
      'Self-service facilities are operated by independent providers. ' +
      'Availability may vary during maintenance.',
  },

  /* ------------------------------------------------------ liste actualités */
  actualites: {
    metaTitre: 'News',
    metaDescription: (nom: string) =>
      `New businesses, new services and events at ${nom} in Montech.`,
    titre: 'Latest news',
    intro:
      "New businesses, new services, events: what's happening at l'Albizia.",
    vide: 'No news at the moment.',
  },

  /* ------------------------------------------------------- fiche actualité */
  actualite: {
    retour: '← All news',
  },

  /* ------------------------------------------------------- infos pratiques */
  infos: {
    metaTitre: 'Visitor information',
    metaDescription: (nom: string, adresse: string) =>
      `Address, directions, opening hours and parking at ${nom}, ${adresse}. ` +
      'Free parking and wheelchair access.',
    titre: 'Visitor information',
    intro:
      'Where to find us, how to get here, and when. Everything you need to know ' +
      'before you visit.',
    situationTexte:
      'The centre sits just off the <strong>RD 928</strong> (avenue de ' +
      'Montauban), in the Mouscane retail area, at the entrance to Montech as ' +
      'you arrive from Montauban.',
    ctaItineraire: 'Get directions',
    ctaCarte: 'View on the map',
    encart24h:
      'The Mondial Relay locker, the charging point and the pizza vending ' +
      'machine remain available <strong>24 hours a day, 7 days a week</strong>, ' +
      'outside these hours.',
    stationnementTitre: 'Parking and accessibility',
    parkingTitre: 'Free parking',
    parkingTexte:
      'Free on-site parking, with no disc or time limit, plus additional spaces ' +
      'on the surrounding streets.',
    pmrTitre: 'Wheelchair access',
    pmrTexte:
      'Dedicated bays near the entrances, step-free routes throughout and ' +
      'accessible toilets.',
    electriqueTitre: 'Electric vehicles',
    electriqueTexte:
      'A Powerdot charging station with three simultaneous rapid charging ' +
      'points, freely available with no subscription.',
  },

  /* --------------------------------------------------------------- contact */
  contact: {
    metaTitre: 'Contact',
    metaDescription: (nom: string) =>
      `Contact ${nom} in Montech: information about the centre, renting a ` +
      'retail unit, or updating a business listing.',
    titre: 'Get in touch',
    intro:
      'A question about the centre, a unit to let, a listing to correct: ' +
      'here is how to reach us.',
    coordonnees: 'Contact details',
    telephone: 'Phone',
    courriel: 'Email',
    selonDemande: 'How can we help?',
    chercheCommerceTitre: 'Looking for a shop',
    chercheCommerceTexte:
      'Each business sets its own opening hours and appointments. The quickest ' +
      'way is to contact them directly from their listing.',
    chercheCommerceCta: 'Browse the directory →',
    louerTitre: 'Looking to rent a unit',
    /** Pluriel anglais : « 1 unit is » / « 2 units are ». */
    louerTexte: (n: number, agence: string) =>
      n > 0
        ? `${n} ${n > 1 ? 'units are' : 'unit is'} currently available to let. ` +
          `Lettings are handled by ${agence}.`
        : `All units at the centre are currently occupied. ` +
          `Lettings are handled by ${agence}.`,
    louerCta: 'View available units →',
    commercantTitre: 'You run a business here',
    commercantTexte:
      'To add your business to the directory, correct a detail or share some ' +
      'news, just let us know and your listing will be updated.',
    commercantCta: 'Email the centre →',
    mailSujet: (nom: string) => `My listing on the ${nom} website`,
    locauxTitre: 'Units to let',
    locauxIntro: (nbCommerces: number) =>
      `Join the ${nbCommerces} businesses already established at Pôle commercial ` +
      "l'Albizia, at the entrance to Montech. Free parking with no time limit, " +
      'step-free access, and shared facilities — parcel lockers and electric ' +
      'vehicle charging — that bring footfall throughout the day.',
    listeNom: (nom: string) => `Retail units to let at ${nom}`,
  },

  /* --------------------------------------------------------------------- faq */
  faq: {
    titre: 'Frequently asked questions',
    locauxQuestion: 'Are there retail units to rent in Montech, France?',
    locauxReponse: (n: number, surfaces: string, nom: string, adresse: string) =>
      n > 0
        ? `Yes. ${n > 1 ? `${n} retail units are available` : '1 retail unit is available'} ` +
          `to rent at ${nom}, ${adresse}, in the Tarn-et-Garonne, France: ${surfaces}. ` +
          'They suit retail, services, independent professionals and office use. ' +
          'Lettings are handled by the Laforêt Montech agency.'
        : `All units at ${nom}, ${adresse}, are currently occupied. ` +
          'The Laforêt Montech agency keeps the availability up to date.',

    loyerQuestion: 'How much is the rent for a unit at Pôle commercial l\'Albizia?',
    loyerReponse: (agence: string) =>
      'Rents are not published on this site: they are provided on request by ' +
      `${agence}, which markets the units. The agency supplies the letting ` +
      'terms, arranges viewings and answers questions about the lease.',

    ouQuestion: 'Where is Pôle commercial l\'Albizia?',
    ouReponse: (nom: string, adresse: string) =>
      `${nom} is at ${adresse}, on the edge of Montech in the Tarn-et-Garonne ` +
      '(Occitanie, southern France), about twenty minutes from Montauban. ' +
      'Parking is free and untimed, and every shop is step-free.',

    activitesQuestion: 'What kind of business can open in a unit at the centre?',
    activitesReponse:
      'The units suit retail, services, beauty and wellbeing, independent ' +
      'professionals and office use. The first-floor unit is not suitable for ' +
      'food businesses. Existing tenants cover catering, hairdressing, a spa, ' +
      'driving tuition, accountancy and insurance broking.',

    stationnementQuestion: 'Is parking free at Pôle commercial l\'Albizia?',
    stationnementReponse:
      "Yes. Parking at Pôle commercial l'Albizia in Montech is free, untimed " +
      'and needs no disc. It includes bays reserved for people with reduced ' +
      'mobility and a Powerdot rapid electric charging point with three ' +
      'charging bays.',

    horairesQuestion: 'What are the opening hours of Pôle commercial l\'Albizia?',
    horairesReponse:
      'The common areas are open Monday to Saturday from 8.30am to 11pm, and ' +
      'on Sunday from 11am to 11pm. Each business sets its own hours. The ' +
      'pizza vending machine, the Mondial Relay parcel locker and the electric ' +
      'charging point are accessible 24 hours a day.',
  },

  /* ------------------------------------------------------------ fiche local */
  local: {
    titreAvecSurface: (surface: string) => `${surface} retail unit to let`,
    titreSansSurface: (reference: string) => `${reference} — retail unit to let`,
    metaDescription: (
      accroche: string,
      reference: string,
      surface: string | null,
      nom: string,
      adresse: string,
      disponibilite: string,
    ) =>
      `${accroche} ${reference}${surface ? `, ${surface}` : ''} to let at ` +
      `${nom}, ${adresse}. Availability: ${disponibilite}.`,
    nomAnnonce: (reference: string, nom: string) =>
      `${reference} — retail unit to let, ${nom}`,
    resume: (
      reference: string,
      surface: string | null,
      statut: string,
      disponibilite: string,
      nom: string,
      adresse: string,
      destinations: string[],
    ) =>
      `${reference}${surface ? `, ${surface},` : ''} to rent at ${nom}, ` +
      `${adresse}, in the Tarn-et-Garonne (Occitanie, southern France). ` +
      `${statut}, availability: ${disponibilite}.` +
      (destinations.length
        ? ` Suitable for: ${destinations.join(', ').toLowerCase()}.`
        : '') +
      ' Rent is provided on request by the letting agency.',
    atoutsTitre: 'Unit highlights',
    galerieTitre: 'Photo gallery',
    caracteristiques: 'Key details',
    surface: 'Floor area',
    statut: 'Status',
    disponibilite: 'Availability',
    disponibiliteDefaut: 'Please enquire',
    loyer: 'Rent',
    loyerDefaut: 'On request',
    destinations: 'Suitable uses',
    mention:
      'Free parking and step-free access throughout the centre. Floor areas are ' +
      'indicative and should be confirmed during a viewing.',
    legendeSituation: (reference: string) =>
      `Location of ${reference} within the centre, outlined in red.`,
    retour: '← All units',
  },

  /* -------------------------------------------------------- contact agence */
  agence: {
    titreGenerique: 'Interested in a unit?',
    titreLocal: (reference: string) => `View ${reference}`,
    /** Contient une balise <strong> : rendu via set:html. */
    introAgence: (agence: string) =>
      `Lettings at the centre are handled by ` +
      `<strong class="font-semibold text-albizia-900">${agence}</strong>.`,
    texteAvecAnnonce:
      'The listing for this unit on their website sets out the terms, the ' +
      'detailed floor areas and a viewing request form.',
    texteSansAnnonce:
      'Contact the agency for the terms, detailed floor areas and to arrange ' +
      'a viewing.',
    ctaAnnonce: (agence: string) => `View the ${agence} listing`,
    ctaContact: (agence: string) => `Contact ${agence}`,
  },

  /* ------------------------------------------------------- mentions légales */
  mentions: {
    metaTitre: 'Legal notice',
    metaDescription:
      "Legal notice and publisher information for the Pôle commercial l'Albizia website.",
    editeurTitre: 'Website publisher',
    editeurTexte: (raisonSociale: string, forme: string, nom: string) =>
      `This website is published by <strong>${raisonSociale}</strong>, a ` +
      `${forme.toLowerCase()} (a French property holding company), owner of ${nom}.`,
    siegeSocial: (adresse: string) => `Registered office: ${adresse}`,
    siren: (siren: string) =>
      `SIREN: ${siren} — Montauban Trade and Companies Register ${siren}`,
    directeur: (nom: string) => `Publication director: ${nom}, managing partner.`,
    contactLabel: 'Contact:',
    hebergementTitre: 'Hosting',
    hebergementTexte:
      'This website is hosted by <strong>GitHub, Inc.</strong>, 88 Colin P. Kelly Jr. ' +
      'Street, San Francisco, CA 94107, United States —',
    proprieteTitre: 'Intellectual property',
    proprieteTexte:
      'The text and graphics on this website are the property of its publisher ' +
      'unless stated otherwise. The trade names, trademarks and logos of the ' +
      'businesses featured in the directory remain the property of their ' +
      'respective owners and are reproduced with their consent, for information purposes.',
    donneesTitre: 'Personal data',
    donneesTexte1:
      'This is a static showcase website. It collects no personal data, sets no ' +
      'cookies and uses no analytics tools.',
    donneesTexte2:
      'If you write to us, the information you provide is used solely to handle ' +
      'your enquiry and is never passed on to third parties. Under Regulation ' +
      '(EU) 2016/679 (GDPR) and the French Data Protection Act, you have the ' +
      'right to access, rectify and erase data concerning you, by contacting the ' +
      'website publisher.',
    commercesTitre: 'Information about the businesses',
    commercesTexte:
      'Information about the businesses (activities, opening hours, contact ' +
      'details) is provided for guidance only and may change. Each business ' +
      'remains solely responsible for its activity, its opening hours and the ' +
      'services it offers. We recommend contacting the business directly before ' +
      'travelling.',
    erreurTitre: 'Report an error',
    erreurTexteAvant:
      'For any request to correct or remove information concerning you, please ' +
      'visit the',
    erreurLien: 'contact page',
    erreurTexteApres: '.',
  },

  /* ------------------------------------------------------------------- 404 */
  erreur404: {
    metaTitre: 'Page not found',
    metaDescription: 'The page you requested does not exist or has been moved.',
    surtitre: 'Error 404',
    titre: 'This page does not exist',
    texte:
      'The page you are looking for may have been moved, or the address you ' +
      'entered contains a mistake.',
    ctaAccueil: 'Back to home',
    ctaCommerces: 'Browse the shops',
  },

  /* ---------------------------------------------------------- accessibilité */
  a11y: {
    lienEvitement: 'Skip to main content',
    navPrincipale: 'Main navigation',
    filAriane: 'Breadcrumb',
    choixLangue: 'Language selection',
    allerCategorie: 'Jump to a category',
    altLogo: (nom: string) => `${nom} logo`,
    altLogoSimple: (nom: string) => `${nom} logo`,
    altDevanture: (nom: string) => `${nom} storefront`,
    ariaPhotoAvenir: (nom: string) => `${nom} — photo coming soon`,
    surReseau: (nom: string, reseau: string) => `${nom} on ${reseau}`,
    altVueAerienne: (nom: string, reference: string) =>
      `Aerial view of ${nom}, with ${reference} outlined in red`,
    altVueAerienneCarte: (reference: string) =>
      `Aerial view of Pôle commercial l'Albizia, with ${reference} outlined in red`,
    altLocalAlouer: (reference: string) =>
      `${reference} to let at Pôle commercial l'Albizia`,
    ariaLocalPlaceholder: (reference: string, surface: string | null) =>
      `${reference}${surface ? `, ${surface}` : ''}`,
  },
};
