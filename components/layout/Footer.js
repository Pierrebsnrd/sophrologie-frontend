import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import styles from "../../styles/components/Footer.module.css";
import { SOCIAL_LINKS } from "../../config/constants";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerInfo}>
          <p>
            © {new Date().getFullYear()} Stéphanie Habert - Sophrologue à
            Villepreux
            <br />
            <span className={styles.credit}>Site créé par Pierre Boisnard</span>
          </p>
          <div className={styles.footerLinks}>
            <Link href="/charte" className={styles.footerLink}>
              Charte éthique
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className={styles.footerLink}
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
        <div className={styles.socialIcons}>
          <a
            href={SOCIAL_LINKS.INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className={styles.icon} />
          </a>
          <a
            href={SOCIAL_LINKS.FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF className={styles.icon} />
          </a>
        </div>
      </div>
    </footer>
  );
}
