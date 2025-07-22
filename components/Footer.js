import React from 'react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© {new Date().getFullYear()} Stéphanie Habert Sophrologue Villepreux</p>
        <div className={styles.socialIcons}>
          <a
            href="https://www.instagram.com/tonprofil"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className={styles.icon} />
          </a>
          <a
            href="https://www.facebook.com/tonprofil"
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
