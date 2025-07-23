import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import styles from "../styles/Temoignages.module.css";

export default function Temoignages() {
    return (
        <>
            <Header />
            {/* HERO SECTION */}
            <section className={styles.hero}>
                <Image
                    src="/bannieres/temoignage.jpg"
                    alt="Feedback"
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroTitle}>Témoignages</h1>
                </div>
            </section>

            {/* CONTENU PRINCIPAL */}
            <div className={styles.content}>
                {/* SECTION TEMOIGNAGES */}
                <section className={styles.temoignage}>
                    <div className={styles.temoignageCard}>
                        <p className={styles.temoignageText}>
                            “Grâce à Stéphanie, j'ai appris à mieux gérer mon stress et à retrouver un sommeil réparateur.”
                        </p>
                        <p className={styles.temoignageAuthor}>– Sophie Martin</p>
                    </div>
                    <div className={styles.temoignageCard}>
                        <p className={styles.temoignageText}>
                            “La sophrologie avec Stéphanie m'a permis de renforcer ma confiance en moi et d'aborder les défis du quotidien avec plus de sérénité.”
                        </p>
                        <p className={styles.temoignageAuthor}>– Luc Dubois</p>
                    </div>
                    <div className={styles.temoignageCard}>
                        <p className={styles.temoignageText}>
                            “Un accompagnement bienveillant et professionnel. Stéphanie a su créer un espace de confiance où j'ai pu me reconnecter à moi-même.”
                        </p>
                        <p className={styles.temoignageAuthor}>– Marie Lemoine</p>
                    </div>
                </section>


                {/* SECTION POST */}
                <section className={styles.post}>
                    <h2 className={styles.postTitle}>Partagez votre expérience</h2>
                    <p className={styles.postText}>
                        Vous avez bénéficié d'un accompagnement en sophrologie avec Stéphanie Habert ? Partagez votre témoignage pour aider d'autres personnes à découvrir les bienfaits de cette pratique.
                    </p>
                    <textarea className={styles.textarea} placeholder="Votre témoignage ici..."></textarea>
                    <button className={styles.submitButton}>Envoyer</button>
                </section>
            </div>
            <Footer />
        </>
    );
}