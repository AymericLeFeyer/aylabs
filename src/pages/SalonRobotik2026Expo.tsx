import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Radio, WifiOff } from "lucide-react";
import { SEO } from "../components/SEO";
import { PageHeader } from "../components/PageHeader";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useMarkdownContent";
import { EXPO_GROUPS } from "../data/salonRobotik2026";

const deviceCount = EXPO_GROUPS.reduce((n, g) => n + g.slugs.length, 0);

const principles = [
  { icon: WifiOff, title: "Sans Internet", text: "Tout tourne en local : rien ne passe par le cloud." },
  { icon: Radio, title: "Zigbee", text: "Les appareils parlent Zigbee, sauf quelques exceptions en Wi-Fi ou Matter." },
  { icon: Cpu, title: "Home Assistant", text: "Un seul cerveau orchestre toutes les démos." },
];

export const SalonRobotik2026Expo: React.FC = () => {
  const { products, loading } = useProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Mon stand au Salon Robotik 2026 - AyLabs"
        description={`Les ${deviceCount} appareils de la planche de démo AyLabs au Salon Robotik 2026 à Orchies, avec leur fiche de test.`}
        url="https://aylabs.fr/events/salon-robotik-2026/expo"
      />
      <PageHeader
        eyebrow={
          <Link
            to="/events/salon-robotik-2026"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-bright hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Salon Robotik 2026
          </Link>
        }
        title="Mon stand"
        description={`Les ${deviceCount} appareils de la planche de démo, samedi 28 novembre à Orchies. Cliquez sur un appareil pour lire sa fiche.`}
      />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            </div>
          ))}
        </section>

        {loading ? (
          <p className="text-center text-gray-500">Chargement du matériel…</p>
        ) : (
          EXPO_GROUPS.map((group) => {
            const items = group.slugs.flatMap((slug) => bySlug.get(slug) ?? []);
            if (!items.length) return null;
            return (
              <section key={group.title}>
                <h2 className="font-display text-3xl font-bold text-gray-900">{group.title}</h2>
                <p className="mt-2 max-w-2xl text-gray-600">{group.hint}</p>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};
