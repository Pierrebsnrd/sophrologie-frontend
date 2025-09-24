import { useState } from "react";
import styles from "../../styles/components/TestimonialForm.module.css";
import api from "../../utils/api";
import { trackEvents } from "../../utils/analytics";
import { LoadingSpinner, Notification } from "../ui";

export default function TestimonialForm({ onTestimonialSubmitted }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errorMessages.length > 0) setErrorMessages([]);
    if (notification) setNotification(null);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (errorMessages.length > 0) setErrorMessages([]);
    if (notification) setNotification(null);
  };

  const submitTestimonial = async () => {
    // Reset des messages
    setErrorMessages([]);
    setNotification(null);

    const newErrors = [];

    // Validation côté client
    if (!name.trim()) newErrors.push("Veuillez saisir votre nom.");
    else if (name.trim().length < 2)
      newErrors.push("Le nom doit contenir au moins 2 caractères.");

    if (!message.trim()) newErrors.push("Veuillez saisir votre message.");
    else if (message.trim().length < 10)
      newErrors.push("Le message doit contenir au moins 10 caractères.");

    if (newErrors.length > 0) {
      setErrorMessages(newErrors);
      // Notification d'erreur de validation
      showNotification("⚠️ Veuillez corriger les erreurs ci-dessous.", "error");
      return;
    }

    try {
      // PHASE 1 : Démarrer le chargement (LoadingSpinner)
      setSubmitting(true);

      const response = await api.post("/temoignage", {
        name: name.trim(),
        message: message.trim(),
      });

      if (response.data.success) {
        // Tracker l'événement
        trackEvents.testimonialSubmit();

        // PHASE 2 : Notification de succès + reset formulaire
        showNotification(
          "🙏 Merci pour votre témoignage ! Il sera publié après validation.",
          "success",
        );

        // Reset du formulaire
        setName("");
        setMessage("");

        // Callback pour actualiser la liste des témoignages
        if (onTestimonialSubmitted) onTestimonialSubmitted();
      } else if (response.data.error) {
        setErrorMessages([response.data.error]);
        showNotification("❌ Erreur lors de l'envoi du témoignage.", "error");
      } else {
        setErrorMessages(["Erreur lors de l'envoi du témoignage."]);
        showNotification("❌ Une erreur inattendue s'est produite.", "error");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setErrorMessages([err.response.data.error]);
        showNotification("❌ " + err.response.data.error, "error");
      } else if (err.response?.data?.message) {
        setErrorMessages([err.response.data.message]);
        showNotification("❌ " + err.response.data.message, "error");
      } else {
        setErrorMessages([
          err.message ||
            "Erreur lors de l'envoi du témoignage. Veuillez réessayer.",
        ]);
        showNotification(
          "❌ Problème de connexion. Veuillez réessayer.",
          "error",
        );
      }
    } finally {
      // PHASE 3 : Arrêter le chargement
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Notification toast flottante */}
      <Notification
        message={notification?.message}
        type={notification?.type}
        duration={6000}
        onClose={() => setNotification(null)}
      />

      <section className={styles.post}>
        <h2 className={styles.postTitle}>Partagez votre expérience</h2>
        <p className={styles.postText}>
          Vous avez bénéficié d'un accompagnement en sophrologie avec Stéphanie
          Habert ? Partagez votre témoignage pour aider d'autres personnes à
          découvrir les bienfaits de cette pratique.
        </p>

        {/* Messages d'erreur dans la page (complément aux notifications) */}
        {errorMessages.length > 0 && (
          <div className={styles.errorBox}>
            <ul>
              {errorMessages.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`${styles.formFields} ${submitting ? styles.formLoading : ""}`}
        >
          <input
            type="text"
            placeholder="Votre prénom et nom"
            value={name}
            onChange={handleNameChange}
            className={styles.textarea}
            style={{ height: "50px" }}
            disabled={submitting} // Désactiver pendant l'envoi
          />

          <textarea
            className={styles.textarea}
            placeholder="Votre témoignage ici... (minimum 10 caractères)"
            value={message}
            onChange={handleMessageChange}
            disabled={submitting}
            rows={5}
          />

          {/* Bouton avec LoadingSpinner intégré */}
          <button
            className={`${styles.submitButton} ${submitting ? styles.loading : ""}`}
            onClick={submitTestimonial}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              "Envoyer"
            )}
          </button>
        </div>
      </section>
    </>
  );
}
