import React from 'react';
import { Hero } from '../components/Hero';
import { VideoSection } from '../components/VideoSection';
import { MediaKitSection } from '../components/MediaKitSection';
import { PartnersSection } from '../components/PartnersSection';

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <VideoSection />
      <PartnersSection />
      <MediaKitSection />
    </div>
  );
};