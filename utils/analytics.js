export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Vérifier si l'utilisateur a donné son consentement
const hasConsent = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookieConsent") === "accepted";
};

// Fonction pour tracker les pages vues
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag && hasConsent()) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Fonction pour tracker les événements
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag && hasConsent()) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Événements prédéfinis pour le site de sophrologie
export const trackEvents = {
  // Contact
  contactFormSubmit: () =>
    event({
      action: "submit_form",
      category: "Contact",
      label: "Formulaire de contact",
    }),

  // Témoignages
  testimonialSubmit: () =>
    event({
      action: "submit_testimonial",
      category: "Engagement",
      label: "Témoignage soumis",
    }),

  // Navigation
  clickRdv: () =>
    event({
      action: "click",
      category: "Navigation",
      label: "Prise de rendez-vous",
    }),

  // Resalib
  clickResalib: () =>
    event({
      action: "click_external",
      category: "Booking",
      label: "Widget Resalib",
    }),

  // Réseaux sociaux
  clickSocial: (platform) =>
    event({
      action: "click_social",
      category: "Social",
      label: platform,
    }),

  // Cookies
  cookieConsent: (choice) =>
    event({
      action: "cookie_consent",
      category: "Privacy",
      label: choice, // 'accepted' ou 'refused'
    }),
};
