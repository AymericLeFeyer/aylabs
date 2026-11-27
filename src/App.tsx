import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Videos } from "./pages/Videos";
import { VideoDetail } from "./pages/VideoDetail";
import { Tutorials } from "./pages/Tutorials";
import { TutorialDetail } from "./pages/TutorialDetail";
import { ProductsTested } from "./pages/ProductsTested";
import { ProductDetail } from "./pages/ProductDetail";
import { Contact } from "./pages/Contact";
import { HelmetProvider } from "react-helmet-async";
import { Support } from "./pages/Support";
import { Deals } from "./pages/Deals";
import { Services } from "./pages/Services";
import { Events } from "./pages/Events";
import { SalonRobotik2026 } from "./pages/SalonRobotik2026";
import { SalonRobotik2026Expo } from "./pages/SalonRobotik2026Expo";

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
            <Route path="/deals" element={<Deals />} />
            <Route path="/support" element={<Support />} />
            <Route path="/services" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/salon-robotik-2026" element={<SalonRobotik2026 />} />
            <Route path="/events/salon-robotik-2026/expo" element={<SalonRobotik2026Expo />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
