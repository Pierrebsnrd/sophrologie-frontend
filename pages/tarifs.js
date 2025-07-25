import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import styles from '../styles/Tarifs.module.css';
import Link from 'next/link';

export default function Tarifs() {
    return (
        <>
            <SEO
                title="Tarifs - Sophrologie avec Stéphanie Habert à Villepreux"
                description="Découvrez les tarifs des séances de sophrologie individuelles, de groupe, et entreprises proposées par Stéphanie Habert, sophrologue certifiée."
                canonical="https://www.sophrologuevillepreux.fr/tarifs"
                ogImage="https://www.sophrologuevillepreux.fr/bannieres/tarifs.jpg"
                ogImageAlt="Paysage illustrant la sérénité et l'équilibre"
                pageType="pricing"
                keywords="tarifs sophrologie Villepreux, prix séance, consultation, Stéphanie Habert"
            />
            <Header />
            <main>
                <div className={styles.pageContainer}>
                    {/* HERO SECTION */}
                    <section className={styles.hero}>
                        <Image
                            src="/bannieres/tarifs.jpg"
                            alt="Paysage"
                            fill
                            className={styles.heroImage}
                            priority
                        />
                        <div className={styles.heroOverlay}>
                            <h1 className={styles.heroTitle}>Tarifs</h1>
                        </div>
                    </section>

                    {/* CONTENU PRINCIPAL */}
                    <div className={styles.content}>

                        {/* SECTION TARIFS PRINCIPALE */}
                        <section className={styles.tarifSection}>
                            <h2 className={styles.title}>Explorez une approche personnalisée de la Sophrologie</h2>
                            <p className={styles.intro}>
                                Parce que chaque parcours est unique, je propose un accompagnement accessible, adapté à vos besoins et à votre situation.
                            </p>
                            <div className={styles.note}>
                                Les tarifs des accompagnements sont identiques quelle que soit la méthode utilisée, qu'ils se fassent au cabinet ou en visio.
                            </div>

                            <h3 className={styles.subTitle}>Séances de sophrologie</h3>
                            <ul className={styles.tarifList}>
                                <li>
                                    <strong>Première séance individuelle adulte :</strong> 60 € (1h30)<br />
                                    <em>Bilan, définition des objectifs, première pratique</em>
                                </li>
                                <li>
                                    <strong>Séance suivi individuelle adulte :</strong> 50 € (1h00)
                                </li>
                                <li>
                                    <strong>Première séance individuelle mineur :</strong> 50 € (1h30)
                                </li>
                                <li>
                                    <strong>Séance suivi individuelle mineur :</strong> 40 € (1h00)
                                </li>
                                <li>
                                    <strong>Séance de suivi étudiant :</strong> 45 € (1h00)<br />
                                    <em>(sur présentation de la carte d'étudiant)</em>
                                </li>
                                <li>
                                    <strong>Séance de groupe :</strong> 15 € par personne (1h00)<br />
                                    <em>Minimum 4 participants</em>
                                </li>
                                <li>
                                    <strong>Intervention en entreprise :</strong> Tarif sur demande<br />
                                    <em>Merci de me contacter pour un devis personnalisé, plus d'informations ici</em>
                                </li>
                            </ul>

                            {/* SECTION TARIF SOLIDAIRE */}
                            <div className={styles.solidaireInfo}>
                                <h4 className={styles.subTitle}>Tarif solidaire</h4>
                                <p className={styles.info}>
                                    Vous avez de faibles revenus ? Contactez-moi : je propose un tarif solidaire dans certains cas.
                                </p>
                            </div>

                            {/* SECTION REMBOURSEMENT */}
                            <div className={styles.remboursementInfo}>
                                <h4 className={styles.subTitle}>Remboursement</h4>
                                <p className={styles.info}>
                                    Les consultations de sophrologie ne sont pas prises en charge par la Sécurité Sociale.
                                </p>
                                <p className={styles.info}>
                                    Cependant, certaines mutuelles de santé proposent un remboursement partiel des médecines douces sur présentation d'une facture.
                                    <br />
                                    <strong>Pensez à vous rapprocher de votre mutuelle pour connaître vos conditions de prise en charge.</strong>
                                </p>
                            </div>
                        </section>

                        {/* SECTION CTA */}
                        <section className={styles.ctaSection}>
                            <Link href="/rdv">
                                <button className={styles.ctaButton}>
                                    📅 Réserver votre séance
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