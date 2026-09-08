import type { APIRoute } from 'astro';
import { lien } from '../lib/site';

/**
 * robots.txt généré au build : l'URL du sitemap suit `site` et `base` définis
 * dans astro.config.mjs, sans avoir à modifier un fichier statique.
 *
 * `site` ne porte que l'origine (sans la base), d'où le passage par `lien()` :
 * sur GitHub Pages le sitemap vit sous `/krm-website/`, pas à la racine.
 *
 * Les robots d'IA sont déclarés un par un, alors qu'un `User-agent: *` en
 * `Allow: /` les couvre déjà. C'est délibéré : un hébergeur ou un CDN qui
 * bloquerait ces agents par défaut (pratique répandue depuis 2025) le ferait
 * silencieusement, et le pôle disparaîtrait des réponses de ChatGPT ou de
 * Claude sans qu'aucune page ne change. La déclaration explicite rend
 * l'intention lisible et vérifiable.
 *
 * Deux familles de robots, autorisées toutes les deux :
 *
 *   — les robots de *recherche*, qui vont chercher une page au moment où un
 *     utilisateur pose sa question et la citent en réponse. Ce sont eux qui
 *     font qu'un porteur de projet demandant « local commercial à louer vers
 *     Montech » s'entend citer l'Albizia ;
 *   — les robots d'*entraînement*, dont le contenu nourrit les modèles. Pour
 *     un site d'information publique sur un pôle commercial, y figurer est un
 *     avantage : le modèle connaît alors le pôle sans avoir à le rechercher.
 *     Le site ne publie de toute façon rien qui ne soit destiné à être lu.
 */

/** Robots de recherche : ils citent, avec un lien, au moment de la question. */
const AGENTS_RECHERCHE = [
  'OAI-SearchBot', // ChatGPT Search (OpenAI)
  'ChatGPT-User', // navigation déclenchée par un utilisateur de ChatGPT
  'Claude-SearchBot', // recherche web de Claude (Anthropic)
  'Claude-User', // navigation déclenchée par un utilisateur de Claude
  'PerplexityBot', // index de Perplexity
  'Perplexity-User', // navigation déclenchée par un utilisateur de Perplexity
  'Google-CloudVertexBot', // ancrage des réponses Vertex AI
  'Applebot-Extended', // Apple Intelligence
  'Amazonbot', // Alexa / Rufus
  'Bingbot', // index de Bing, dont dépend une partie de ChatGPT
];

/** Robots d'entraînement : le contenu alimente les modèles eux-mêmes. */
const AGENTS_ENTRAINEMENT = [
  'GPTBot', // entraînement OpenAI
  'ClaudeBot', // entraînement Anthropic
  'Google-Extended', // entraînement Gemini (distinct de Googlebot)
  'CCBot', // Common Crawl, source de nombreux corpus
  'Meta-ExternalAgent', // entraînement Meta
  'Bytespider', // entraînement ByteDance
  'cohere-ai', // entraînement Cohere
  'Diffbot', // graphe de connaissances
  'omgili', // Webz.io
];

const bloc = (agents: string[]) =>
  `${agents.map((a) => `User-agent: ${a}`).join('\n')}\nAllow: /`;

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(lien('/sitemap-index.xml'), site).href;
  const llms = new URL(lien('/llms.txt'), site).href;

  const corps = `# Pôle commercial l'Albizia — Montech (82700)
# Toutes les pages de ce site sont publiques et destinées à être indexées.

User-agent: *
Allow: /

# --- Robots de recherche assistée par IA (citations) -------------------------
${bloc(AGENTS_RECHERCHE)}

# --- Robots d'entraînement de modèles ----------------------------------------
${bloc(AGENTS_ENTRAINEMENT)}

# Résumé du site destiné aux modèles de langue : ${llms}

Sitemap: ${sitemap}
`;

  return new Response(corps, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
