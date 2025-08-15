import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Videos } from './pages/Videos';
import { VideoDetail } from './pages/VideoDetail';
import { Tutorials } from './pages/Tutorials';
import { TutorialDetail } from './pages/TutorialDetail';
import { ProductsTested } from './pages/ProductsTested';
import { ProductDetail } from './pages/ProductDetail';
import { Contact } from './pages/Contact';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/tutoriels" element={<Tutorials />} />
            <Route path="/tutoriel/:slug" element={<TutorialDetail />} />
            <Route path="/produits-testes" element={<ProductsTested />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/reseaux" element={<Contact />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;