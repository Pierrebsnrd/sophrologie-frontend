import Link from "next/link";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import styles from "../styles/QuiSuisJe.module.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import BackgroundMusic from "../components/BackgroundMusic";

export default function QuiSuisJe() {
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const router = useRouter();
  const hasInitialized = useRef(false);

  // Démarrage automatique de la musique au chargement de la page
  useEffect(() => {
    if (!hasInitialized.current) {
      // Vérifier si on arrive depuis le menu
      const shouldPlay = sessionStorage.getItem("playMusic") === "true";

      if (shouldPlay) {
        sessionStorage.removeItem("playMusic");
      }

      // Toujours déclencher l'autoplay sur cette page
      setShouldAutoPlay(true);
      hasInitialized.current = true;
    }
  }, []);

  return (
    <>
      <SEO
        title="Qui suis-je ? - Stéphanie Habert Sophrologue à Villepreux"
        description="Découvrez le parcours et l'approche bienveillante de Stéphanie Habert, sophrologue certifiée, pour vous accompagner vers l'équilibre et le mieux-être."
        canonical="https://www.sophrologuevillepreux.fr/qui-suis-je"
        ogImage="https://www.sophrologuevillepreux.fr/bannieres/musique.jpg"
        ogImageAlt="Note de musique symbolisant l'harmonie et l'équilibre"
        pageType="about"
        keywords="Stéphanie Habert, parcours sophrologue, chanteuse opéra, reconversion, Villepreux"
      />
      <Header />
      <BackgroundMusic autoPlay={shouldAutoPlay} />
      <main>
        <div className={styles.pageContainer}>
          {/* HERO SECTION */}
          <section className={styles.hero}>
            <Image
              src="/bannieres/musique.jpg"
              alt="Note de musique symbolisant l'harmonie et l'équilibre"
              fill
              priority
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <h1 className={styles.heroTitle}>Qui suis-je ?</h1>
            </div>
          </section>

          {/* CONTENU PRINCIPAL */}
          <div className={styles.content}>
            {/* SECTION PRÉSENTATION */}
            <section className={styles.presentationSection}>
              <div className={styles.imageContainer}>
                <Image
                  src="/profile/sophrologue.jpg"
                  alt="Stéphanie Habert, Sophrologue certifiée à Villepreux"
                  width={300}
                  height={300}
                  className={styles.image}
                />
              </div>

              <div className={styles.textContainer}>
                <h2 className={styles.title}>Stéphanie Habert</h2>
                <p className={styles.paragraph}>
                  Je m'appelle Stéphanie Habert, Sophrologue certifiée, je vous propose un accompagnement personnalisé basé sur l'écoute, la bienveillance et le respect de votre individualité. Mon objectif est de vous aider à retrouver un équilibre intérieur et à développer vos propres ressources pour faire face aux défis de la vie.
                </p>
                <p className={styles.paragraph}>
                  Dans mon cabinet à Villepreux ou en visioconférence, je crée un espace de sécurité et de confiance où chacun peut se reconnecter à ses sensations, ses émotions et ses ressources intérieures. Ma pratique s'adapte aux besoins spécifiques de chaque personne, que ce soit pour la gestion du stress, l'amélioration du sommeil, ou le renforcement de la confiance en soi.
                </p>
              </div>
            </section>

            {/* SECTION HISTOIRE */}
            <section className={styles.historySection}>
              <h2 className={styles.historyTitle}>Mon parcours unique</h2>
              <p className={styles.paragraph}>
                Chanteuse d'opéra de formation, j'ai découvert la sophrologie à un moment où j'en avais vraiment besoin. Confrontée aux défis de la scène et aux exigences de la performance artistique, j'ai trouvé dans cette discipline un véritable chemin vers l'équilibre et la sérénité.
              </p>
              <p className={styles.paragraph}>
                Grâce à la sophrologie, j'ai retrouvé confiance en moi et j'ai enfin osé laisser ma voix s'exprimer pleinement sur scène. Cette transformation personnelle profonde m'a naturellement menée vers le désir d'accompagner à mon tour d'autres personnes dans leur propre cheminement.
              </p>
              <p className={styles.paragraph}>
                Mon parcours unique d'artiste influence aujourd'hui mon approche thérapeutique. Je puise dans cette expérience de la sensibilité artistique et de la vulnérabilité créative pour créer un espace bienveillant, dans un cadre chaleureux, propice au retour à soi, à la détente et à la gestion harmonieuse des émotions.
              </p>
            </section>

            {/* SECTION CTA */}
            <section className={styles.ctaSection}>
              <p className={styles.ctaParagraph}>
                Prêt(e) à commencer votre propre voyage vers l'équilibre et le mieux-être ?
              </p>
              <Link href="/rdv">
                <button className={styles.ctaButton}>
                  📅 Prendre rendez-vous
                </button>
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}