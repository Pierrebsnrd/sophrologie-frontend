import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaBars } from 'react-icons/fa';
import styles from '../styles/Header.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.headerContainer}>
      {/* Social + Logo + Hamburger */}
      <div className={styles.topBar}>
        <div className={styles.socialIcons}>
          <a href="https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>

        <div className={styles.logoContainer}>
          <Link href="/">
            <Image src="/logo/logo-mod.jpeg" alt="Logo" width={60} height={60} />
          </Link>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <FaBars />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className={`${styles.navbar} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.navList}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => {
                  setMenuOpen(false);
                  if (href === "/qui-suis-je") sessionStorage.setItem("playMusic", "true");
                }}
                className={`${styles.navLink} ${router.pathname === href ? styles.active : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
