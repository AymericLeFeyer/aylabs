/**
 * Aynalytics (analytics auto-hébergé) : charge le SDK servi par le collector et
 * classe les clics sortants du site.
 *
 * - Visites, visiteurs uniques, pages vues : automatiques (un `screen` par route).
 * - Clics sortants : classés par `classifyLink` ci-dessous en `merchant_click`,
 *   `youtube_click`, `social_click`, `contact_click` ; le reste part en `outbound_click`.
 * - Événements métier : `track("promo_code_copy", { ... })`.
 *
 * Sans `VITE_AYNALYTICS_SITE_KEY` (dev local), tout est inactif. `VITE_AYNALYTICS_URL`
 * est facultative : par défaut, le SDK passe par le proxy `/_ay` du nginx du site.
 */

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Properties = Record<string, JsonValue>;

interface LinkClick {
  url: URL;
  element: HTMLAnchorElement;
  text: string;
  section: string | undefined;
  external: boolean;
  properties: Properties;
}

type LinkEvent = { name: string; properties?: Properties } | false | null | undefined;

interface AynalyticsApi {
  init(options: {
    siteKey: string;
    endpoint: string;
    persistence?: "session" | "local" | "memory";
    classifyLink?: (link: LinkClick) => LinkEvent;
  }): unknown;
  track(name: string, properties?: Properties): void;
}

type QueuedCall = [string, unknown[]];

declare global {
  interface Window {
    aynalytics?: AynalyticsApi | { q: QueuedCall[] };
  }
}

/** Par défaut, le collector est relayé par le nginx du site sur /_ay (docker/nginx.conf). */
const ENDPOINT = (import.meta.env.VITE_AYNALYTICS_URL || "/_ay").replace(/\/+$/, "");
const SITE_KEY = import.meta.env.VITE_AYNALYTICS_SITE_KEY;

/** Boutiques et programmes d'affiliation : domaine -> nom affiché dans les stats. */
const MERCHANTS: [RegExp, string][] = [
  [/(^|\.)amazon\.[a-z.]+$|(^|\.)amzn\.(to|eu)$/, "Amazon"],
  [/(^|\.)domadoo\.fr$/, "Domadoo"],
  [/(^|\.)geekbuying\.com$/, "Geekbuying"],
  [/(^|\.)minix/, "Minix"],
  [/(^|\.)reolink\.com$/, "Reolink"],
  [/(^|\.)bambulab\.com$/, "Bambu Lab"],
  [/(^|\.)meross\.com$/, "Meross"],
  [/(^|\.)aliexpress\.[a-z.]+$/, "AliExpress"],
  [/(^|\.)itead\.cc$/, "Sonoff"],
  [/(^|\.)(getproton\.me|proton\.me)$/, "Proton"],
  [/(^|\.)igraal\.com$/, "iGraal"],
  [/(^|\.)gladysassistant\.com$/, "Gladys Assistant"],
  [/(^|\.)arc\.net$/, "Arc"],
];

const SOCIALS: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)discord\.(gg|com)$/, "discord"],
  [/(^|\.)github\.com$/, "github"],
  [/(^|\.)makerworld\.com$/, "makerworld"],
  [/^links\.aylabs\.fr$/, "linktree"],
];

const match = (host: string, table: [RegExp, string][]) =>
  table.find(([pattern]) => pattern.test(host))?.[1];

function youtubeTarget(url: URL): Properties {
  if (url.hostname === "youtu.be") return { target: "video", video_id: url.pathname.slice(1) };
  if (url.pathname.endsWith("/join")) return { target: "membership" };
  const videoId = url.searchParams.get("v");
  if (videoId) return { target: "video", video_id: videoId };
  return { target: "channel" };
}

/** Exporté pour les tests manuels : ne dépend que de l'URL et des data-ay-prop-*. */
export function classifyLink({ url, external, properties }: LinkClick): LinkEvent {
  const host = url.hostname.replace(/^www\./, "");

  // Bouton déjà qualifié par la page (fiche produit, partenaires).
  if (properties.merchant) return { name: "merchant_click" };

  if (!external) {
    // Redirection nginx du site vers l'affiliation Domadoo.
    if (url.pathname === "/domadoo") return { name: "merchant_click", properties: { merchant: "Domadoo" } };
    return null;
  }

  if (url.protocol === "mailto:") return { name: "contact_click", properties: { channel: "email" } };

  // Liens courts go.aylabs.fr/<marchand>/<produit> (redirections cPanel).
  if (host === "go.aylabs.fr") {
    const [first = "", second] = url.pathname.split("/").filter(Boolean);
    const merchant = match(`${first}.fr`, MERCHANTS) ?? match(`${first}.com`, MERCHANTS);
    if (first === "youtube") return { name: "youtube_click", properties: { target: "channel" } };
    return merchant
      ? { name: "merchant_click", properties: { merchant, ...(second ? { product_slug: second } : {}) } }
      : null;
  }

  const merchant = match(host, MERCHANTS);
  if (merchant) return { name: "merchant_click", properties: { merchant } };

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
    return { name: "youtube_click", properties: youtubeTarget(url) };
  }

  const network = match(host, SOCIALS);
  if (network) return { name: "social_click", properties: { network } };

  return null; // outbound_click générique
}

let started = false;

export function initAynalytics(): void {
  if (started || !ENDPOINT || !SITE_KEY || typeof window === "undefined") return;
  started = true;

  // File d'attente : les appels faits avant le chargement du script sont rejoués après l'init.
  const queue: QueuedCall[] = [];
  window.aynalytics = { q: queue };

  const script = document.createElement("script");
  script.src = `${ENDPOINT}/sdk.js`;
  script.async = true;
  script.onload = () => {
    const api = window.aynalytics;
    if (!api || !("init" in api)) return;
    api.init({
      siteKey: SITE_KEY,
      endpoint: ENDPOINT,
      // Identifiant anonyme persistant (13 mois max) : visiteurs uniques sur plusieurs jours.
      persistence: "local",
      classifyLink,
    });
  };
  document.head.appendChild(script);
}

/** Événement métier. Sans effet si Aynalytics n'est pas configuré. */
export function track(name: string, properties?: Properties): void {
  const api = window.aynalytics;
  if (!api) return;
  if ("q" in api) api.q.push(["track", [name, properties]]);
  else api.track(name, properties);
}
