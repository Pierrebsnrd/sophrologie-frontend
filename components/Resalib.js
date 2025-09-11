import React from "react";
import styles from "../styles/components/Resalib.module.css";
import Image from "next/image";

export default function Resalib() {
  return (
    <main className={styles.pageContainer}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <Image
          src="/bannieres/rdv.jpg"
          alt="Bureau"
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Prendre rendez-vous</h1>
        </div>
      </section>

      {/* FORM / WIDGET */}
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Réservez votre consultation</h2>
        <p className={styles.subtitle}>
          Choisissez directement le créneau qui vous convient dans l'agenda
          ci-dessous. Vous recevrez une confirmation automatique par email.
        </p>

        <div className={styles.resalibContainer}>
          <a
            href="https://www.resalib.fr/praticien/115051-stephanie-habert-sophrologue-saint-germain-en-laye"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.resalib.fr/app/images/generate/fbk_115051.png"
              alt="Retrouvez Stéphanie Habert sur Resalib"
              className={styles.resalibCard}
            />
          </a>
        </div>
      </div>
    </main>
  );
}
