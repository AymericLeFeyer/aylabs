import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const AnalyticsTracker = () => {
  const location = useLocation();

  const gaId = import.meta.env.VITE_GA_ID;

  useEffect(() => {
    if (!gaId) return;
    ReactGA.initialize(gaId);
  }, []);

  useEffect(() => {
    if (!gaId) return;
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null; // Ce composant ne rend rien
};

export default AnalyticsTracker;
