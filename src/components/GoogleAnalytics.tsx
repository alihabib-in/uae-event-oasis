
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics tag ID
const GA_TRACKING_ID = "G-Z5T2Q2JMNC";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    const initGA = () => {
      if (typeof window.gtag === "function") {
        window.gtag("config", GA_TRACKING_ID, {
          page_path: location.pathname + location.search,
        });
      }
    };

    // Track page views when the route changes
    initGA();
  }, [location]);

  return null;
};

export default GoogleAnalytics;

// Add global window type definition
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
