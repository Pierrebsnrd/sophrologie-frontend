import React from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import styles from "../styles/components/Footer.module.css";

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
            <Link href="/politique-de-confidentialite" className={styles.footerLink}>
              Politique de confidentialité
            </Link>
          </div>
        </div>
        <div className={styles.socialIcons}>
          <a
            href="https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className={styles.icon} />
          </a>
          <a
            href="https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr"
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