// components/GoogleAnalytics.js
import Script from "next/script";
import { useEffect, useState } from "react";

const GoogleAnalytics = ({ GA_MEASUREMENT_ID }) => {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Vérifier le consentement aux cookies
    const consent = localStorage.getItem("cookieConsent");
    setConsentGiven(consent === "accepted");
  }, []);

  // Ne charger GA4 que si le consentement est donné
  if (!consentGiven) return null;

  return (
    <>
      {/* Script Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
              cookie_expires: 63072000, // 2 ans
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;
