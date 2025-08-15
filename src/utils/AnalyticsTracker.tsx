import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_GA_ID);
  }, []);

  useEffect(() => {
    console.log("send event");
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null; // Ce composant ne rend rien
};

export default AnalyticsTracker;
