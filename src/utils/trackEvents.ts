/**
 * Catalogue des événements Aynalytics du site. Chaque bouton ou lien suivi appelle l'une
 * de ces fonctions dans son `onClick` : les noms et propriétés restent cohérents d'un
 * composant à l'autre.
 *
 * | Événement             | Propriétés                                                         |
 * |-----------------------|--------------------------------------------------------------------|
 * | `merchant_click`      | merchant, url, placement, [product_id, product_name, category, price] |
 * | `youtube_click`       | target (channel, video, membership), url, placement, [video_id, video_title] |
 * | `social_click`        | network, url, placement                                            |
 * | `contact_click`       | channel, placement, [subject]                                      |
 * | `external_link_click` | url, host, label, placement, [page]                                |
 * | `promo_code_copy`     | code, platform, page, [product_id, product_name, percent]          |
 */
import type { Product } from "../types";
import { track } from "./aynalytics";
import { CHANNEL_URL, SOCIAL_LINKS, type SocialNetwork } from "./links";

/** Emplacement du lien dans la page (permet de comparer header, footer, hero...). */
export type Placement =
  | "header"
  | "mobile-header"
  | "nav"
  | "mobile-nav"
  | "footer"
  | "hero"
  | "buy-box"
  | "partners"
  | "contact"
  | "media-kit"
  | "support"
  | "video-header"
  | "views-chart"
  | "article";

const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** Code vidéo YouTube d'une URL `watch?v=` ou `youtu.be/` (undefined sinon). */
const youtubeVideoId = (url: string): string | undefined => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || undefined;
    return parsed.searchParams.get("v") ?? undefined;
  } catch {
    return undefined;
  }
};

/** Lien vers une boutique ou un programme d'affiliation. */
export function trackMerchantClick(event: {
  merchant: string;
  url: string;
  placement: Placement;
  product?: Pick<Product, "id" | "name" | "category" | "price" | "promoPrice">;
}): void {
  const { product } = event;
  track(
    "merchant_click",
    {
      merchant: event.merchant,
      url: event.url,
      placement: event.placement,
      ...(product && {
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        price: product.promoPrice ?? product.price,
      }),
    },
    { leavingPage: true },
  );
}

/** Lien vers la chaîne, une vidéo ou l'adhésion YouTube. */
export function trackYoutubeClick(event: {
  target: "channel" | "video" | "membership";
  placement: Placement;
  url?: string;
  videoId?: string;
  videoTitle?: string;
}): void {
  const url = event.url ?? CHANNEL_URL;
  const videoId = event.videoId ?? youtubeVideoId(url);
  track(
    "youtube_click",
    {
      target: event.target,
      url,
      placement: event.placement,
      ...(videoId && { video_id: videoId }),
      ...(event.videoTitle && { video_title: event.videoTitle }),
    },
    { leavingPage: true },
  );
}

/** Lien vers un réseau social ou la page de liens (URL issue de `SOCIAL_LINKS`). */
export function trackSocialClick(event: { network: SocialNetwork; placement: Placement }): void {
  track(
    "social_click",
    { network: event.network, url: SOCIAL_LINKS[event.network], placement: event.placement },
    { leavingPage: true },
  );
}

/** Lien de contact (mailto). */
export function trackContactClick(event: { placement: Placement; subject?: string }): void {
  track(
    "contact_click",
    { channel: "email", placement: event.placement, ...(event.subject && { subject: event.subject }) },
    { leavingPage: true },
  );
}

/** Autre lien externe : sites annexes du menu, liens dans les articles. */
export function trackExternalLinkClick(event: {
  url: string;
  label: string;
  placement: Placement;
  page?: string;
}): void {
  track(
    "external_link_click",
    {
      url: event.url,
      host: hostOf(event.url),
      label: event.label.slice(0, 100),
      placement: event.placement,
      ...(event.page && { page: event.page }),
    },
    { leavingPage: true },
  );
}

/** Entrée de menu : seuls les liens externes (sites annexes) sont suivis, les pages internes le sont déjà en screen. */
export function trackNavItemClick(
  item: { to: string; label: string; external?: boolean },
  placement: Placement,
): void {
  if (item.external) trackExternalLinkClick({ url: item.to, label: item.label, placement });
}

/** Copie d'un code promo (reste sur la page : envoi groupé normal). */
export function trackPromoCodeCopy(event: {
  code: string;
  page: "product" | "deals";
  platform: string | null;
  product?: Pick<Product, "id" | "name">;
  percent?: number;
}): void {
  track("promo_code_copy", {
    code: event.code,
    page: event.page,
    platform: event.platform,
    ...(event.product && { product_id: event.product.id, product_name: event.product.name }),
    ...(event.percent !== undefined && { percent: event.percent }),
  });
}
