import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import styles from "../styles/Temoignages.module.css";
import api from "../utils/api";

export default function Temoignages() {
    const [temoignages, setTemoignages] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchTemoignages();
    }, []);

    const fetchTemoignages = async () => {
        try {
            const res = await api.get("/temoignage");
            setTemoignages(res.data);
        } catch (err) {
            console.error("Erreur chargement témoignages");
        }
    };

    const submitTestimonial = async () => {
        if (!name.trim() || !message.trim()) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        try {
            await api.post("/temoignage", { name, message });
            setConfirmation("Merci pour votre témoignage ! Il sera publié après validation.");
            setName("");
            setMessage("");
            setError("");
        } catch (err) {
            setError("Erreur lors de l'envoi du témoignage.");
        }
    };

    // Trie les témoignages par date décroissante
    const sortedTemoignages = [...temoignages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const visibleTemoignages = showAll ? sortedTemoignages : sortedTemoignages.slice(0, 4);

    return (
        <>
            <SEO
                title="Témoignages - Sophrologie avec Stéphanie Habert à Villepreux"
                description="Découvrez les témoignages des personnes accompagnées par Stéphanie Habert, sophrologue certifiée. Partagez aussi votre expérience."
                canonical="https://www.sophrologuevillepreux.fr/temoignages"
                ogImage="https://www.sophrologuevillepreux.fr/bannieres/temoignage.jpg"
                ogImageAlt="Image illustrant des témoignages clients"
                pageType="testimonials"
                keywords="témoignages sophrologie, avis clients, expérience, Stéphanie Habert Villepreux"
            />
            <Header />
            <main>
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
                        <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>Témoignages</h1>
                    </div>
                </section>

                {/* CONTENU PRINCIPAL */}
                <div className={styles.content}>
                    {/* SECTION TEMOIGNAGES */}
                    <section className={styles.temoignage}>
                        {/* Témoignages statiques */}
                        <div className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>
                                “Grâce à Stéphanie, j'ai appris à mieux gérer mon stress et à retrouver un sommeil réparateur.”
                            </p>
                            <div className={styles.temoignageFooter}>
                                <p className={styles.temoignageDate}>Publié le 12/03/2025</p>
                                <p className={styles.temoignageAuthor}>– Sophie Martin</p>
                            </div>
                        </div>
                        <div className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>
                                “La sophrologie avec Stéphanie m'a permis de renforcer ma confiance en moi et d'aborder les défis du quotidien avec plus de sérénité.”
                            </p>
                            <div className={styles.temoignageFooter}>
                                <p className={styles.temoignageDate}>Publié le 28/04/2025</p>
                                <p className={styles.temoignageAuthor}>– Luc Dubois</p>
                            </div>
                        </div>
                        <div className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>
                                “Un accompagnement bienveillant et professionnel. Stéphanie a su créer un espace de confiance où j'ai pu me reconnecter à moi-même.”
                            </p>
                            <div className={styles.temoignageFooter}>
                                <p className={styles.temoignageDate}>Publié le 15/06/2025</p>
                                <p className={styles.temoignageAuthor}>– Marie Lemoine</p>
                            </div>
                        </div>

                        {/* Témoignages depuis la BDD */}
                        {visibleTemoignages.map((t, index) => (
                            <div key={index} className={styles.temoignageCard}>
                                <p className={styles.temoignageText}>"{t.message}"</p>
                                <div className={styles.temoignageFooter}>
                                    <p className={styles.temoignageDate}>
                                        {t.createdAt ? `Publié le ${new Date(t.createdAt).toLocaleDateString('fr-FR')}` : ''}
                                    </p>
                                    <p className={styles.temoignageAuthor}>– {t.name}</p>
                                </div>
                            </div>
                        ))}
                        {sortedTemoignages.length > 4 && (
                            <div className={styles.loadMoreContainer}>
                                <button className={styles.submitButton} onClick={() => setShowAll(!showAll)}>
                                    {showAll ? 'Masquer les anciens témoignages' : 'Afficher tous les témoignages'}
                                </button>
                            </div>
                        )}

                    </section>

                    {/* FORMULAIRE DE SOUMISSION */}
                    <section className={styles.post}>
                        <h2 className={styles.postTitle}>Partagez votre expérience</h2>
                        <p className={styles.postText}>
                            Vous avez bénéficié d'un accompagnement en sophrologie avec Stéphanie Habert ? Partagez votre témoignage pour aider d'autres personnes à découvrir les bienfaits de cette pratique.
                        </p>

                        {error && <p style={{ color: "#c53030", textAlign: "center" }}>{error}</p>}
                        {confirmation && <p style={{ color: "#2f855a", textAlign: "center" }}>{confirmation}</p>}

                        <input
                            type="text"
                            placeholder="Votre prénom et nom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.textarea}
                            style={{ height: "50px" }}
                        />
                        <textarea
                            className={styles.textarea}
                            placeholder="Votre témoignage ici..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className={styles.submitButton} onClick={submitTestimonial}>
                            Envoyer
                        </button>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
