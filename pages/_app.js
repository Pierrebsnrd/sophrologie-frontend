import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GoogleAnalytics, CookieConsent } from "../components/ui";
import { GA_MEASUREMENT_ID, pageview } from "../utils/analytics";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Tracker les changements de page (seulement si consentement donné)
    const handleRouteChange = (url) => {
      const consent = localStorage.getItem("cookieConsent");
      if (consent === "accepted") {
        pageview(url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        {/* Meta description générique en secours */}
        <meta
          name="description"
          content="Sophrologie à Villepreux avec Stéphanie Habert. Séances personnalisées pour votre bien-être."
        />
      </Head>

      {/* Google Analytics - seulement si consentement */}
      {GA_MEASUREMENT_ID && (
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      )}

      <Component {...pageProps} />

      {/* Banner de consentement aux cookies */}
      <CookieConsent />

      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

export default App;
