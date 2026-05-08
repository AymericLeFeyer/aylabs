import React from "react";
import { ExternalLink, Handshake } from "lucide-react";

export const PartnersSection: React.FC = () => {
  const partners = [
    {
      name: "Domadoo",
      url: "https://www.domadoo.fr/fr/?ae=6",
      description: "Domotique & objets connectés",
    },
    {
      name: "Sunlu",
      url: "https://www.sunlu.com?sca_ref=8673819.e6xLp1xWaj/",
      description: "Filaments impression 3D",
    },
    {
      name: "GeekBuying",
      url: "https://affiliate.geekbuying.com/gkbaffiliate.php?id=6265",
      description: "Électronique & gadgets",
    },
    {
      name: "NordVPN",
      url: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=126314&url_id=1172",
      description: "Sécurité & confidentialité",
    },
    {
      name: "Itead",
      url: "https://itead.cc/ref/312/",
      description: "Solutions IoT & domotique",
    },
    {
      name: "Reolink",
      url: "https://reolink.com/fr/product/e1-zoom/?aff=107",
      description: "Caméras de surveillance",
    },
  ];

  return (
    <section id="partners" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4 flex items-center justify-center space-x-3">
            <Handshake className="h-8 w-8 text-[#398FBA]" />
            <span>Mes partenaires</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white hover:bg-[#398FBA] border border-gray-200 hover:border-[#398FBA] rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-[#141414] group-hover:text-white transition-colors">
                  {partner.name}
                </h3>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                {partner.description}
              </p>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Les liens ci-dessus sont des liens affiliés qui permettent de
            soutenir la chaîne sans coût supplémentaire pour vous.
          </p>
        </div>
      </div>
    </section>
  );
};
