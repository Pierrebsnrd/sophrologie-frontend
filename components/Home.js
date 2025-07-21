import React from 'react';
import Link from 'next/link';
import Header from './Header';

export default function Home() {
  return (
    <div style={styles.container}>
      {/* HEADER + NAVIGATION */}
      <header style={styles.header}>
       <Header />
      </header>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Cabinet de Sophrologie</h1>
        <p style={styles.subtitle}>
          Retrouvez votre équilibre et votre bien-être grâce à la sophrologie.
          Prenez rendez-vous facilement en ligne.
        </p>

        {/* DEFINITION */}
        <section style={styles.definition}>
          <h2 style={styles.defTitle}>Ma définition de la Sophrologie :</h2>
          <p>
            La sophrologie est fondée dans les années 1960 par le Docteur Alfonso Caycedo, médecin psychiatre.
            Cette discipline est une approche centrée sur la personne qui vise à harmoniser le corps et l'esprit, 
            en mobilisant ses propres ressources pour développer un mieux-être au quotidien.
          </p>
          <p>
            Par des exercices de respiration, de relaxation dynamique et de visualisation libre et neutre, 
            elle aide chacun à mieux se connaître, à renforcer ses ressources intérieures et à accueillir 
            les défis de la vie avec sérénité.
          </p>
          <p>
            Cette discipline vise à apporter à ses consultants une amélioration de la qualité de vie. 
            Sa pratique nécessite un entrainement quotidien du corps et de l'esprit.
            Elle favorise le bien-être global de la personne. Accessible à tous, la sophrologie est une voie 
            vers l'épanouissement personnel et la pleine présence à soi-même.
          </p>
        </section>

        {/* FEATURES */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.icon}>🧘‍♀️</span>
            <h3>Relaxation</h3>
            <p>Techniques de relaxation pour gérer le stress</p>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>💭</span>
            <h3>Bien-être mental</h3>
            <p>Accompagnement personnalisé pour votre épanouissement</p>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>⚖️</span>
            <h3>Équilibre</h3>
            <p>Retrouvez l'harmonie entre corps et esprit</p>
          </div>
        </div>

        <Link href="/rdv">
          <button style={styles.ctaButton}>📅 Prendre rendez-vous</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoContainer: {
    width: '120px',
  },
  nav: {
    display: 'flex',
    gap: '20px',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '900px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '60px 40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: '1.4rem',
    marginBottom: '40px',
    color: '#555',
    lineHeight: '1.6',
  },
  definition: {
    textAlign: 'left',
    fontSize: '1.1rem',
    lineHeight: '1.7',
    color: '#333',
    marginBottom: '40px',
  },
  defTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '50px',
  },
  feature: {
    padding: '30px 20px',
    background: '#f8f9fa',
    borderRadius: '15px',
  },
  icon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '15px',
  },
  ctaButton: {
    padding: '18px 36px',
    fontSize: '1.2rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)',
    fontWeight: '600',
  },
};
