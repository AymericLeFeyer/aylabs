/**
 * Matériel exposé sur le stand AyLabs au Salon Robotik 2026
 * (page /events/salon-robotik-2026/expo).
 *
 * Chaque entrée est le slug d'une fiche de src/content/products (nom de
 * fichier sans .md). Une fiche introuvable est simplement ignorée.
 */
export interface ExpoGroup {
  title: string;
  hint: string;
  slugs: string[];
}

export const EXPO_GROUPS: ExpoGroup[] = [
  {
    title: "Box et coordinateurs",
    hint: "Le cerveau de la planche : Home Assistant et les clés qui parlent Zigbee et Thread.",
    slugs: [
      "home-assistant-green",
      "raspberry-pi-5",
      "smlight-smhub-nano-mr",
      "sky-connect",
      "sonoff-zigbee-3e",
    ],
  },
  {
    title: "Capteurs",
    hint: "Présence, ouverture, fumée, fuite d'eau, température : ce qui déclenche les automatisations.",
    slugs: [
      "snzb-06p",
      "aqara-fp400",
      "snzb-04p",
      "heiman-hs1sa-e",
      "ikea-badring",
      "sonoff-airguard-th",
      "nodon-stph-4-1-00",
      "aqara-wsdcgq11lm",
      "snzb-02",
    ],
  },
  {
    title: "Énergie et chauffage",
    hint: "Suivre sa consommation et piloter radiateurs, têtes thermostatiques et clim.",
    slugs: [
      "lixee-z-linky",
      "nodon-sem-4-1-00",
      "nodon-fil-pilote",
      "aqara-w600",
      "nodon-irb-4-1-00",
    ],
  },
  {
    title: "Prises, modules et volets",
    hint: "Ce qui agit : prises connectées, micro-modules et volets roulants.",
    slugs: [
      "sonoff-orb-zbrbs",
      "loratap-sc500zb",
      "zb-mini-l2",
      "sonoff-s61s-outdoor",
      "ikea-inspelning",
      "nous-a1z",
    ],
  },
  {
    title: "Éclairage et affichage",
    hint: "Les retours visibles : ampoules qui changent de couleur et alertes sur l'Awtrix.",
    slugs: ["moes-gu10", "hue-gu10", "ulanzi-tc001-awtrix-3"],
  },
];
