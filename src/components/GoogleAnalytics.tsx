
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

  // Add the analytics script to the head if it doesn't exist already
  useEffect(() => {
    if (!document.getElementById('ga-script')) {
      // Create and append the Google Analytics script tag
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      script.async = true;
      document.head.appendChild(script);
      
      // Initialize the dataLayer
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID);
      
      // Make gtag available globally
      window.gtag = gtag;
    }
  }, []);

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
