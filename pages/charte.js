import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Charte.module.css";
import Image from "next/image";

export default function Charte() {
    return (
        <>
            <Head>
                <title>Charte éthique – Sophrologie Villepreux | Stéphanie Habert</title>
                <meta
                    name="description"
                    content="Découvrez la charte éthique de Stéphanie Habert, sophrologue à Villepreux. Un engagement de respect, confidentialité et bienveillance pour un accompagnement de qualité."
                />

                {/* Open Graph */}
                <meta property="og:title" content="Charte éthique – Sophrologie Villepreux | Stéphanie Habert" />
                <meta
                    property="og:description"
                    content="Découvrez la charte éthique de Stéphanie Habert, sophrologue à Villepreux. Un engagement de respect, confidentialité et bienveillance pour un accompagnement de qualité."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.sophrologuevillepreux.fr/charte" />
                <meta property="og:image" content="https://www.sophrologuevillepreux.fr/bannieres/charte.jpg" />
                <meta property="og:image:alt" content="Charte éthique de Stéphanie Habert" />
            </Head>
            <Header />
            <div className={styles.pageContainer}>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <Image
                        src="/bannieres/charte.jpg"
                        alt="Charte"
                        fill
                        priority
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay}>
                        <h1 className={styles.heroTitle}>Charte éthique</h1>
                    </div>
                </section>

                {/* CONTENU PRINCIPAL */}
                <main className={styles.content}>
                    <section className={styles.charteSection}>
                        <p className={styles.intro}>
                            En tant que sophrologue, je m'engage à exercer ma pratique avec respect, bienveillance et responsabilité.
                            Cette charte éthique définit les principes qui guident mon accompagnement des personnes vers un mieux-être physique, mental et émotionnel.
                        </p>

                        {[
                            {
                                title: "1. Respect de la personne",
                                items: [
                                    "Je reconnais la singularité et les besoins propres à chaque individu.",
                                    "Je respecte les croyances, valeurs, choix et modes de vie de mes clients, sans jugement ni discrimination.",
                                ],
                            },
                            {
                                title: "2. Confidentialité",
                                items: [
                                    "Tous les échanges avec mes clients sont strictement confidentiels.",
                                    "Je m'engage à respecter le secret professionnel, sauf en cas de danger grave et imminent.",
                                ],
                            },
                            {
                                title: "3. Neutralité et non-jugement",
                                items: [
                                    "J'adopte une posture neutre et bienveillante, sans projeter mes opinions personnelles.",
                                    "Je crée un espace sécurisant où mes clients se sentent écoutés et compris.",
                                ],
                            },
                            {
                                title: "4. Autonomie et responsabilisation",
                                items: [
                                    "Je respecte l'autonomie et le libre arbitre de chaque client.",
                                    "Je propose des outils pour favoriser leur développement personnel, sans jamais imposer de solution.",
                                ],
                            },
                            {
                                title: "5. Compétences professionnelles",
                                items: [
                                    "Je reste dans le cadre de mes compétences et de ma formation.",
                                    "Je me forme en continu pour garantir une pratique de qualité.",
                                    "Je travaille en réseau avec d'autres professionnels si nécessaire.",
                                ],
                            },
                            {
                                title: "6. Bienveillance et non-malfaisance",
                                items: [
                                    "Mon intention est de favoriser le bien-être, sans nuire physiquement ou psychologiquement.",
                                ],
                            },
                            {
                                title: "7. Transparence",
                                items: [
                                    "J'informe mes clients des objectifs, limites, déroulé et tarifs des séances.",
                                    "Toute intervention est faite avec le consentement éclairé du client.",
                                ],
                            },
                            {
                                title: "8. Engagement responsable",
                                items: [
                                    "Je m'engage dans une pratique éthique et professionnelle.",
                                    "Je souscris une assurance professionnelle adaptée.",
                                ],
                            },
                        ].map(({ title, items }, idx) => (
                            <section className={styles.section} key={idx}>
                                <h2>{title}</h2>
                                <ul>
                                    {items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </section>
                        ))}

                        <section className={styles.conclusion}>
                            <h3>Conclusion</h3>
                            <p>
                                Cette charte constitue le socle de ma pratique. Elle reflète mon engagement à accompagner chaque personne avec respect, éthique et bienveillance.
                            </p>
                            <p>
                                Elle évoluera en fonction des besoins de mes clients et des exigences de ma profession.
                            </p>
                        </section>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}
