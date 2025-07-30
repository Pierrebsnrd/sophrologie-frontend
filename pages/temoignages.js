import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TestimonialCard from "../components/TestimonialCard";
import TestimonialForm from "../components/TestimonialForm";
import Image from "next/image";
import styles from "../styles/Temoignages.module.css";
import api from "../utils/api";

export default function Temoignages() {
    const [temoignages, setTemoignages] = useState([]);
    const [error, setError] = useState("");
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchTemoignages();
    }, []);

    const fetchTemoignages = async () => {
        try {   
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
        }
    };

    // Trie les témoignages par date décroissante
    const sortedTemoignages = [...temoignages].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    const visibleTemoignages = showAll ? sortedTemoignages : sortedTemoignages.slice(0, 4);

    // Témoignages statiques
    const staticTestimonials = [
        {
            message: "Grâce à Stéphanie, j'ai appris à mieux gérer mon stress et à retrouver un sommeil réparateur.",
            author: "Sophie Martin",
            date: "12/03/2025"
        },
        {
            message: "La sophrologie avec Stéphanie m'a permis de renforcer ma confiance en moi et d'aborder les défis du quotidien avec plus de sérénité.",
            author: "Luc Dubois", 
            date: "28/04/2025"
        },
        {
            message: "Un accompagnement bienveillant et professionnel. Stéphanie a su créer un espace de confiance où j'ai pu me reconnecter à moi-même.",
            author: "Marie Lemoine",
            date: "15/06/2025"
        }
    ];

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
                        {/* Témoignages statiques */}
                        {staticTestimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={`static-${index}`}
                                message={testimonial.message}
                                author={testimonial.author}
                                date={testimonial.date}
                            />
                        ))}

                        {/* Message d'erreur pour le chargement */}
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

                        {/* Témoignages depuis la BDD */}
                        {visibleTemoignages.map((testimonial, index) => (
                            <TestimonialCard
                                key={testimonial._id || `dynamic-${index}`}
                                message={testimonial.message}
                                author={testimonial.name}
                                date={testimonial.createdAt}
                            />
                        ))}

                        {sortedTemoignages.length > 4 && (
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
                    <TestimonialForm onTestimonialSubmitted={fetchTemoignages} />
                </div>
            </main>
            <Footer />
        </>
    );
}