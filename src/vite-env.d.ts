/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID?: string;
  /** URL publique du collector Aynalytics (ex : https://analytics.aylabs.fr). */
  readonly VITE_AYNALYTICS_URL?: string;
  /** Clé publique du site dans Aynalytics (ay_pk_...). */
  readonly VITE_AYNALYTICS_SITE_KEY?: string;
}
