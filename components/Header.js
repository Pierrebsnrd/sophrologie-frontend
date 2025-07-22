import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/qui-suis-je', label: 'Qui suis-je ?' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/rdv', label: 'Prendre rendez-vous' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/contact', label: 'Contact' },
  { href: '/charte', label: 'Charte éthique' },
];


export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.headerContainer}>
      {/* LOGO */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={60} height={60} />
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${router.pathname === href ? styles.active : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* RESEAUX SOCIAUX */}
      <div className={styles.socialIcons}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram />
        </a>
      </div>
    </header>
  );
}
