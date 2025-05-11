
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Function to load the Google Analytics script
    const loadGoogleAnalytics = () => {
      // Create the first script (gtag.js)
      const scriptTag = document.createElement("script");
      scriptTag.async = true;
      scriptTag.src = "https://www.googletagmanager.com/gtag/js?id=G-Z5T2Q2JMNC";
      document.head.appendChild(scriptTag);

      // Create the second script (configuration)
      const configScript = document.createElement("script");
      configScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-Z5T2Q2JMNC');
      `;
      document.head.appendChild(configScript);
    };

    // Load the scripts on mount
    loadGoogleAnalytics();
  }, []);

  useEffect(() => {
    // Track page view on route change
    if (window.gtag) {
      window.gtag("config", "G-Z5T2Q2JMNC", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;
