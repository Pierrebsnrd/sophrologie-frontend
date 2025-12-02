// Application constants and configuration

// Social Media URLs
export const SOCIAL_LINKS = {
  FACEBOOK: "https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr",
  INSTAGRAM: "https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr"
};

// External Services
export const EXTERNAL_SERVICES = {
  RESALIB_BOOKING: "https://www.resalib.fr/praticien/115051-stephanie-habert-sophrologue-saint-germain-en-laye",
  RESALIB_ADMIN: "https://www.resalib.fr/bo/home"
};

// Navigation links
export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/qui-suis-je", label: "Qui suis-je ?" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/rdv", label: "Prendre rendez-vous" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/contact", label: "Contact" },
  { href: "/charte", label: "Charte éthique" }
];

// Contact Information
export const CONTACT_INFO = {
  EMAIL: "stephaniehabert.sophrologue@gmail.com",
  PHONE: "06 11 42 17 65",
  ADDRESS: {
    STREET: "38 ter, rue des Ursulines",
    CITY: "Saint-Germain-en-Laye",
    POSTAL_CODE: "78100"
  }
};

// Application settings
export const APP_CONFIG = {
  SESSION_STORAGE_KEYS: {
    PLAY_MUSIC: "playMusic"
  },
  SCHEDULE: {
    TUESDAY: "9h30 - 17h30 à Villepreux ou en visioconsultation",
    FRIDAY: "9h30 - 17h30 au cabinet à Saint-Germain-en-Laye"
  }
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  ENDPOINTS: {
    CONTACT: "/contact",
    TESTIMONIALS: "/temoignage",
    ADMIN: "/admin"
  }
};