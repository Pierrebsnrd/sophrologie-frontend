import Link from 'next/link';
import Image from 'next/image';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <Image
            src="/bannieres/accueil.jpg"
            alt="Paysage"
            layout="fill"
            objectFit="cover"
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>Stéphanie Habert Sophrologue</h1>
          </div>
        </section>

        {/* PRÉSENTATION */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2>Un moment pour soi, à Villepreux</h2>
            <p>
              Bienvenue chez Stéphanie Habert Sophrologue à Villepreux. Offrez-vous un espace de bienveillance, d'écoute inconditionnelle et de confidentialité pour un retour à soi et une prise de conscience.
            </p>
          </div>
        </section>

        {/* SOPHROLOGIE */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2>Qu'est-ce que la sophrologie ?</h2>
            <p>La sophrologie est une méthode psychocorporelle qui vise à renforcer l'équilibre entre les émotions, les pensées et le corps.</p>
            <p>Elle se pratique en séances individuelles ou collectives, et favorise la détente, la conscience de soi et la gestion du stress.</p>
            <p>Elle vous aide à retrouver l’harmonie entre corps et esprit et à retrouver confiance.</p>
          </div>
        </section>

        {/* BIENFAITS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Les bienfaits de la sophrologie</h2>
          <div className={styles.grid}>
            <div className={styles.card}><h3>Gestion du stress</h3><p>Apprenez à vous détendre</p></div>
            <div className={styles.card}><h3>Sommeil réparateur</h3><p>Améliorez votre sommeil</p></div>
            <div className={styles.card}><h3>Confiance en soi</h3><p>Renforcez votre estime</p></div>
          </div>
        </section>

        {/* MON APPROCHE */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2>Mon approche</h2>
            <p>Au cabinet ou en visio, je vous propose des séances sur-mesure basées sur l’écoute, la bienveillance et la confidentialité.</p>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.section}>
          <h2>Envie de découvrir la sophrologie ?</h2>
          <p>Prenez rendez-vous dès maintenant pour une première séance.</p>
          <Link href="/rdv"><button className={styles.button}>📅 Prendre rendez-vous</button></Link>

          <h2>Besoin d'un renseignement ?</h2>
          <Link href="/tarifs"><button className={styles.button}>Mes tarifs et prestations</button></Link>
          <Link href="/contact"><button className={styles.button}>Me contacter</button></Link>
        </section>

        {/* EN SAVOIR PLUS */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2>Envie d'en savoir plus</h2>
            <p>Je vous accompagne pour retrouver un équilibre intérieur et développer vos ressources personnelles.</p>
            <Link href="/qui-suis-je"><button className={styles.button}>🔍 Découvrir</button></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
