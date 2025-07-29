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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTemoignages();
    }, []);

    const fetchTemoignages = async () => {
        try {
            console.log('🔍 Chargement des témoignages...');
            setLoading(true);
            
            const res = await api.get("/temoignage");
            console.log('📡 Réponse API:', res.data);

            if (res.data.success) {
                // Structure avec success
                const testimonialsData = res.data.data?.temoignages || [];
                setTemoignages(testimonialsData);
                console.log(`✅ ${testimonialsData.length} témoignages chargés`);
            } else {
                // Fallback pour ancienne structure
                const testimonialsData = Array.isArray(res.data) ? res.data : [];
                setTemoignages(testimonialsData);
                console.log(`✅ ${testimonialsData.length} témoignages chargés (fallback)`);
            }
        } catch (err) {
            console.error("❌ Erreur chargement témoignages:", err);
            setError("Erreur lors du chargement des témoignages");
            setTemoignages([]);
        } finally {
            setLoading(false);
        }
    };

    const submitTestimonial = async () => {
        // Reset des messages
        setError("");
        setConfirmation("");

        // Validation côté client
        if (!name.trim()) {
            setError("Veuillez saisir votre nom.");
            return;
        }

        if (!message.trim()) {
            setError("Veuillez saisir votre message.");
            return;
        }

        if (name.trim().length < 2) {
            setError("Le nom doit contenir au moins 2 caractères.");
            return;
        }

        if (message.trim().length < 10) {
            setError("Le message doit contenir au moins 10 caractères.");
            return;
        }

        try {
            setSubmitting(true);
            console.log('📤 Envoi du témoignage:', { name: name.trim(), message: message.trim() });

            const response = await api.post("/temoignage", { 
                name: name.trim(), 
                message: message.trim() 
            });

            console.log('📡 Réponse soumission:', response.data);

            if (response.data.success) {
                setConfirmation(
                    response.data.message || 
                    "Merci pour votre témoignage ! Il sera publié après validation."
                );
                // Reset du formulaire
                setName("");
                setMessage("");
                console.log('✅ Témoignage envoyé avec succès');
            } else {
                setError(response.data.error || "Erreur lors de l'envoi du témoignage.");
            }
        } catch (err) {
            console.error("❌ Erreur soumission témoignage:", err);
            
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(`Erreur de connexion: ${err.message}`);
            } else {
                setError("Erreur lors de l'envoi du témoignage. Veuillez réessayer.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Trie les témoignages par date décroissante
    const sortedTemoignages = [...temoignages].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    const visibleTemoignages = showAll ? sortedTemoignages : sortedTemoignages.slice(0, 4);

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('fr-FR');
        } catch (error) {
            console.error('Erreur formatage date:', error);
            return 'Date non disponible';
        }
    };

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
                        <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
                            Témoignages
                        </h1>
                    </div>
                </section>

                {/* CONTENU PRINCIPAL */}
                <div className={styles.content}>
                    {/* SECTION TEMOIGNAGES */}
                    <section className={styles.temoignage}>
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <p>Chargement des témoignages...</p>
                            </div>
                        )}

                        {/* Témoignages statiques */}
                        <div className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>
                                "Grâce à Stéphanie, j'ai appris à mieux gérer mon stress et à retrouver un sommeil réparateur."
                            </p>
                            <div className={styles.temoignageFooter}>
                                <p className={styles.temoignageDate}>Publié le 12/03/2025</p>
                                <p className={styles.temoignageAuthor}>– Sophie Martin</p>
                            </div>
                        </div>
                        <div className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>
                                "La sophrologie avec Stéphanie m'a permis de renforcer ma confiance en moi et d'aborder les défis du quotidien avec plus de sérénité."
                            </p>
                            <div className={styles.temoignageFooter}>
                                <p className={styles.temoignageDate}>Publié le 28/04/2025</p>
                                <p className={styles.temoignageAuthor}>– Luc Dubois</p>
                            </div>
                        </div>
                        <div className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>
                                "Un accompagnement bienveillant et professionnel. Stéphanie a su créer un espace de confiance où j'ai pu me reconnecter à moi-même."
                            </p>
                            <div className={styles.temoignageFooter}>
                                <p className={styles.temoignageDate}>Publié le 15/06/2025</p>
                                <p className={styles.temoignageAuthor}>– Marie Lemoine</p>
                            </div>
                        </div>

                        {/* Témoignages depuis la BDD */}
                        {!loading && visibleTemoignages.map((t, index) => (
                            <div key={t._id || index} className={styles.temoignageCard}>
                                <p className={styles.temoignageText}>"{t.message}"</p>
                                <div className={styles.temoignageFooter}>
                                    <p className={styles.temoignageDate}>
                                        {t.createdAt ? `Publié le ${formatDate(t.createdAt)}` : ''}
                                    </p>
                                    <p className={styles.temoignageAuthor}>– {t.name}</p>
                                </div>
                            </div>
                        ))}

                        {!loading && sortedTemoignages.length > 4 && (
                            <div className={styles.loadMoreContainer}>
                                <button 
                                    className={styles.submitButton} 
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? 'Masquer les anciens témoignages' : 'Afficher tous les témoignages'}
                                </button>
                            </div>
                        )}


                    </section>

                    {/* FORMULAIRE DE SOUMISSION */}
                    <section className={styles.post}>
                        <h2 className={styles.postTitle}>Partagez votre expérience</h2>
                        <p className={styles.postText}>
                            Vous avez bénéficié d'un accompagnement en sophrologie avec Stéphanie Habert ? 
                            Partagez votre témoignage pour aider d'autres personnes à découvrir les bienfaits de cette pratique.
                        </p>

                        {error && (
                            <div style={{ 
                                color: "#c53030", 
                                textAlign: "center", 
                                backgroundColor: "#fed7d7", 
                                padding: "10px", 
                                borderRadius: "5px", 
                                marginBottom: "15px" 
                            }}>
                                {error}
                            </div>
                        )}

                        {confirmation && (
                            <div style={{ 
                                color: "#2f855a", 
                                textAlign: "center", 
                                backgroundColor: "#c6f6d5", 
                                padding: "10px", 
                                borderRadius: "5px", 
                                marginBottom: "15px" 
                            }}>
                                {confirmation}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Votre prénom et nom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.textarea}
                            style={{ height: "50px" }}
                            disabled={submitting}
                        />
                        <textarea
                            className={styles.textarea}
                            placeholder="Votre témoignage ici... (minimum 10 caractères)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={submitting}
                            rows={5}
                        />
                        <button 
                            className={styles.submitButton} 
                            onClick={submitTestimonial}
                            disabled={submitting}
                            style={{
                                opacity: submitting ? 0.7 : 1,
                                cursor: submitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {submitting ? 'Envoi en cours...' : 'Envoyer'}
                        </button>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}