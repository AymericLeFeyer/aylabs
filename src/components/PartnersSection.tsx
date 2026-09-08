import React from "react";
import { ArrowUpRight } from "lucide-react";

interface Partner {
  name: string;
  url: string;
  description: string;
  /** Ce que le lien apporte concrètement au visiteur. */
  perk: string;
  /** Teinte reprise de l'identité du partenaire (halo, monogramme, survol). */
  color: string;
  /**
   * URL d'un logo carré (PNG/SVG/JPG), distante ou locale (`/partners/x.svg`
   * depuis `public/`). Si absente, l'initiale du nom sert de monogramme.
   */
  logo?: string;
}

const partners: Partner[] = [
  {
    name: "Domadoo",
    url: "https://www.domadoo.fr/fr/?domid=79",
    description: "Domotique & objets connectés",
    perk: "Le revendeur que j'utilise le plus",
    color: "#a20fbf",
    logo: "https://www.domadoo.fr/img/favicon.ico?1712752227",
  },
  {
    name: "Gladys Assistant",
    url: "https://gladysassistant.com/fr/?utm_source=youtube&utm_campaign=aylabs",
    description: "Solution domotique française",
    perk: "Serveur domotique local, made in France",
    color: "#0061a6",
    logo: "https://gladysassistant.com/fr/img/logo.svg"
  },
  {
    name: "Reolink",
    url: "https://reolink.com/fr/product/e1-zoom/?aff=107",
    description: "Caméras de surveillance",
    perk: "Caméras qui tournent sans abonnement",
    color: "#2C67F2",
    logo: "https://home-cdn.reolink.us/wp-content/assets/favicon.png?v=1788401543698"
  },
  {
    name: "ProtonVPN",
    url: "https://go.getproton.me/aff_c?offer_id=7&aff_id=16744&url_id=860",
    description: "Suite logicielle européenne",
    perk: "VPN et messagerie chiffrés, hébergés en Suisse",
    color: "#6D4AFF",
    logo: "https://proton.me/favicons/apple-touch-icon.png"
  },
  {
    name: "Sonoff",
    url: "https://itead.cc/ref/312/",
    description: "Solutions IoT & domotique",
    perk: "Les modules SONOFF, à la source",
    color: "#dfa403",
    logo: "https:///sonoff.tech/cdn/shop/files/SONOFF-favicon.png?v=1747725092&width=180"
  },
  
  {
    name: "iGraal",
    url: "https://fr.igraal.com/parrainage?parrain=AG_59d219b78f2e3&utm_medium=raf&utm_source=refer_friend",
    description: "Cashback sur vos achats",
    perk: "Faites des économies sur ce que vous achetez déjà",
    color: "#e49103",
    logo: "https://fr.igraal.com/assets/images/favicons/igraalfr.ico?v=2"
  },
];

export const PartnersSection: React.FC = () => (
  <section id="partners" className="relative overflow-hidden bg-ink py-20">
    <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden="true" />
    <div
      className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand/20 blur-[120px]"
      aria-hidden="true"
    />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          Les marques qui soutiennent mon travail
        </h2>
        <p className="mt-3 leading-relaxed text-gray-400">
          Des boutiques et des services que j'utilise pour de vrai. Passer par
          ces liens soutient la chaîne, sans rien vous coûter de plus.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            style={
              { "--partner": partner.color } as React.CSSProperties
            }
            className="group relative overflow-hidden rounded-xl border border-ink-line bg-ink-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--partner)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright"
          >
            {/* Le halo prend la couleur du partenaire au survol */}
            <span
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--partner)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
              aria-hidden="true"
            />

            <div className="relative flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-line bg-white/5 font-display text-xl font-bold text-[var(--partner)] transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt=""
                    loading="lazy"
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  partner.name.charAt(0)
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {partner.name}
                  </h3>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-gray-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--partner)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  {partner.description}
                </p>
                <p className="mt-3 text-sm leading-snug text-gray-300">
                  {partner.perk}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-10 text-sm text-gray-600">
        Liens affiliés : ils rapportent une commission à la chaîne, jamais un
        centime de plus pour vous.
      </p>
    </div>
  </section>
);
