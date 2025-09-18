import { useState, useEffect } from "react";
import styles from "../../styles/components/CookieConsent.module.css";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    // Recharger la page pour activer GA4
    window.location.reload();
  };

  const refuseCookies = () => {
    localStorage.setItem("cookieConsent", "refused");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.cookieContent}>
        <div className={styles.cookieText}>
          <h3>🍪 Gestion des cookies</h3>
          <p>
            Ce site utilise des cookies pour améliorer votre expérience et
            analyser le trafic via Google Analytics. Vos données sont
            anonymisées et utilisées uniquement à des fins statistiques.
          </p>
        </div>
        <div className={styles.cookieButtons}>
          <button onClick={refuseCookies} className={styles.refuseButton}>
            Refuser
          </button>
          <button onClick={acceptCookies} className={styles.acceptButton}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
