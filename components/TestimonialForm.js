import { useState } from 'react';
import styles from '../styles/components/TestimonialForm.module.css';
import api from '../utils/api';

export default function TestimonialForm({ onTestimonialSubmitted }) {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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
                
                // Callback optionnel pour rafraîchir la liste
                if (onTestimonialSubmitted) {
                    onTestimonialSubmitted();
                }
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

    return (
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
    );
}