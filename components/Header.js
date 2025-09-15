import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaBars } from "react-icons/fa";
import styles from "../styles/components/Header.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { trackEvents } from "../utils/analytics";

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
                  className={`${styles.navLink} ${router.pathname === href ? styles.activeLink : ""}`}
                  onClick={() => handleNavClick(href, label)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Réseaux sociaux à droite (desktop uniquement) */}
        <div className={styles.socialIcons}>
          <a
            href="https://www.facebook.com/profile.php?id=61566511205757"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            onClick={() => handleSocialClick('Facebook')}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/stephanie_habert_sophrologue/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            onClick={() => handleSocialClick('Instagram')}
          >
            <FaInstagram />
          </a>
        </div>

        {/* Bouton menu mobile */}
        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className={styles.mobileMenu}>
          <ul className={styles.mobileNavList}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.mobileNavLink} ${router.pathname === href ? styles.activeMobileLink : ""}`}
                  onClick={() => handleNavClick(href, label)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Réseaux sociaux mobile */}
          <div className={styles.mobileSocialIcons}>
            <a
              href="https://www.facebook.com/profile.php?id=61566511205757"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialIcon}
              onClick={() => handleSocialClick('Facebook')}
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/stephanie_habert_sophrologue/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialIcon}
              onClick={() => handleSocialClick('Instagram')}
            >
              <FaInstagram />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}