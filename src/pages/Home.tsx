import React from "react";
import { SEO } from "../components/SEO";
import { Hero } from "../components/Hero";
import { VideoSection } from "../components/VideoSection";
import { MediaKitSection } from "../components/MediaKitSection";
import { PartnersSection } from "../components/PartnersSection";
import { ProductSections } from "../components/ProductsSection";

export const Home: React.FC = () => {
  return (
    <div>
      <SEO
        title="AyLabs - Domotique, Homelab, Impression 3D & Tech"
        description="AyLabs explore la domotique, le homelab, l'impression 3D et les technologies innovantes. Tutoriels, guides et projets pour passionnés de tech."
        url="https://aylabs.fr/"
      />
      <Hero />
      <VideoSection />
      <ProductSections />
      <PartnersSection />
      <MediaKitSection />
    </div>
  );
};
