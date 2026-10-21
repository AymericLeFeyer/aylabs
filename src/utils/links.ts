/** Liens externes du site, partagés par les composants et le suivi Aynalytics. */

export const CHANNEL_URL = "https://youtube.com/@ay_labs";
export const MEMBERSHIP_URL = "https://www.youtube.com/channel/UClCAe7FyrIwpkt9H56XRndA/join";
export const CONTACT_EMAIL = "contact@aylabs.fr";

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/aylabs_yt",
  tiktok: "https://www.tiktok.com/@ay_labs",
  discord: "https://discord.gg/aylabs",
  github: "https://github.com/aylabscode",
  makerworld: "https://makerworld.com/@aylabs",
  linktree: "https://links.aylabs.fr",
} as const;

export type SocialNetwork = keyof typeof SOCIAL_LINKS;
