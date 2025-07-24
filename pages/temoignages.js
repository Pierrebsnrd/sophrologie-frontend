import React, { useState, useEffect } from "react";
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
                    {/* Témoignages statiques */}
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

                    {/* Témoignages depuis la BDD */}
                    {temoignages.map((t, index) => (
                        <div key={index} className={styles.temoignageCard}>
                            <p className={styles.temoignageText}>"{t.message}"</p>
                            <p className={styles.temoignageAuthor}>– {t.name}</p>
                        </div>
                    ))}
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
                        placeholder="Votre prénom"
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

            <Footer />
        </>
    );
}
