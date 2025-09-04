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
            objectPosition="50% 35%"
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>Stéphanie Habert Sophrologue</h1>
          </div>
        </section>

        {/* PRÉSENTATION */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2>Un moment pour soi</h2>
            <p>
              Bienvenue chez Stéphanie Habert Sophrologue dans les Yvelines. Offrez-vous un moment pour vous reconnecter à l’essentiel : VOUS.</p>
            <p>
              Dans un cadre chaleureux et bienveillant, je vous accompagne avec douceur et authenticité vers plus de sérénité, de clarté intérieure et d'équilibre.</p>
          </div>
        </section>

        {/* SOPHROLOGIE */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2>La Sophrologie :</h2>
            <p>La sophrologie est fondée dans les années 1960 par le Docteur Alfonso Caycedo, médecin psychiatre. Cette discipline est une approche centrée sur la personne qui vise à harmoniser le corps et l'esprit, en mobilisant ses propres ressources pour développer un mieux-être au quotidien.</p>
            <p>Par des exercices de respiration, de relaxation dynamique et de visualisation libre et neutre, elle aide chacun à mieux se connaître, à renforcer ses ressources intérieures et à accueillir les défis de la vie avec sérénité.</p>
            <p>Cette discipline vise à apporter à ses consultants une amélioration de la qualité de vie. Sa pratique nécessite un entrainement quotidien du corps et de l'esprit.</p>
            <p>Elle favorise le bien être global de la personne. Accessible à tous, la sophrologie est une voie vers l'épanouissement personnel et la pleine présence à soi-même.</p>
          </div>
        </section>

        {/* BIENFAITS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Les bienfaits de la sophrologie</h2>
          <p className={styles.benefitHighlight}>La sophrologie s’adapte à chacun et peut accompagner dans de nombreuses situations.</p>
          <div className={styles.grid}>
            <div className={styles.card}><h3>Gestion du stress et des émotions</h3><p>(Surmenage, charge mentale, Anxiété, angoisses, irritabilité, Burn-out, prévention de l'épuisement…)</p></div>
            <div className={styles.card}><h3>Confiance en soi</h3><p>(Manque d'estime de soi, Peur du jugement ou du regard des autres, Besoin de s'affirmer dans sa vie personnelle et/ou professionnelle…)</p></div>
            <div className={styles.card}><h3>Sommeil et récupération</h3><p>(Difficultés d’endormissement, Réveils nocturnes ou sommeil agité, Fatigue persistante, besoin de récupération)</p></div>
            <div className={styles.card}><h3>Préparation mentale</h3><p>(Examens, concours, compétitions ou événements importants, prise de parole en public, Projets artistiques, Concentration, gestion du trac…)</p></div>
            {/* <div className={styles.card}>
              <h3>Gestion de la douleur</h3>
              <p>(Douleurs chroniques, Accompagnement de traitements médicaux : cancer, fibromyalgie, etc.)</p>
              <p><em>La sophrologie ne remplace pas un traitement médical mais peut le compléter efficacement, en favorisant une meilleure qualité de vie au quotidien.</em></p>
            </div> */}
            <div className={styles.card}><h3>Accompagnement des étapes de vie</h3><p>(Deuil, séparation, maladie, transition de vie personnelle ou professionnelle)</p></div>
           {/*  <div className={styles.card}><h3>Accompagnement de la maternité</h3><p>(Grossesse, post-partum, confiance en soi, gestion des peurs et de la douleur…)</p></div> */}
            {/* <div className={styles.card}><h3>Accompagnement des enfants à partir de 5 ans</h3><p>(Gestion des émotions, colère, peurs, agitation, confiance, timidité, sommeil, adaptation au changement…)</p></div> */}
          </div>
        </section>

        {/* MON APPROCHE */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <h2>Mon approche ou Comment se déroule mon accompagnement ?</h2>
            <div className={styles.approachText}>
              <p>J’accompagne les adultes et les adolescents en cabinet à Saint-Germain-en-Laye le mardi, et en visioconsultation le vendredi.</p>
              <p>Chaque séance débute par un échange basé sur une écoute inconditionnelle, afin de comprendre vos besoins et ce que vous traversez.</p>
              <p>Je construis ensuite un protocole personnalisé, adapté à vos objectifs et à votre rythme. Généralement 6 à 10 séances sont nécessaires en fonction de votre objectif.</p>
              <p>Les séances s’organisent en 3 temps : un accueil bienveillant avec un échange, la pratique de la sophrologie avec des exercices de respirations, de relaxation dynamique et de visualisation neutre, puis un moment d’échange pour partager cette expérience intérieure vécue durant la séance.</p>
              <p>Pour obtenir le résultat attendu, la sophrologie demande un investissement personnel et régulier.</p>
              <p>À la fin de chaque séance, je vous donne des petits exercices à faire chez vous.</p>
              <p>N’hésitez pas à me contacter si vous désirez plus d’informations.</p>
              <p className={styles.signature}>Belle journée à vous,<br />Stéphanie Habert<br />Sophrologue</p>
            </div>
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
