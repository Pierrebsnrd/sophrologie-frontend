import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaBars } from "react-icons/fa";
import styles from "../../styles/components/Header.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { trackEvents } from "../../utils/analytics";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/qui-suis-je", label: "Qui suis-je ?" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/rdv", label: "Prendre rendez-vous" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/contact", label: "Contact" },
  { href: "/charte", label: "Charte éthique" },
];

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fonction pour gérer les clics sur les liens de navigation
  const handleNavClick = (href, label) => {
    // Tracker les clics sur "Prendre rendez-vous"
    if (href === "/rdv") {
      trackEvents.clickRdv();
    }
    
    // Gestion spéciale pour "qui-suis-je"
    if (href === "/qui-suis-je") {
      sessionStorage.setItem("playMusic", "true");
    }
    
    setMenuOpen(false);
  };

  // Fonction pour gérer les clics sur les réseaux sociaux
  const handleSocialClick = (platform) => {
    trackEvents.clickSocial(platform);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.topBar}>
        {/* Logo à gauche desktop, au centre mobile */}
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image src="/logo/logo.jpeg" alt="Logo" width={60} height={60} />
          </Link>
        </div>

        {/* Menu navigation centré (desktop uniquement) */}
        <nav className={styles.navbar}>
          <ul className={styles.navList}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${router.pathname === href ? styles.active : ""}`}
                  onClick={() => handleNavClick(href, label)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icônes sociales à droite desktop, à gauche mobile */}
        <div className={styles.socialIcons}>
          <a
            href="https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            onClick={() => handleSocialClick("Facebook")}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            onClick={() => handleSocialClick("Instagram")}
          >
            <FaInstagram />
          </a>
        </div>

        {/* Hamburger menu (visible uniquement mobile) */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <FaBars />
        </button>
      </div>

      {/* Menu mobile (dropdown) */}
      {menuOpen && (
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => handleNavClick(href, label)}
                  className={`${styles.navLink} ${router.pathname === href ? styles.active : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}