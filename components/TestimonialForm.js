import { useState } from "react";
import styles from "../styles/components/TestimonialForm.module.css";
import api from "../utils/api";

export default function TestimonialForm({ onTestimonialSubmitted }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const submitTestimonial = async () => {
    // Reset des messages
    setErrorMessages([]);
    setConfirmation("");

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
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/temoignage", {
        name: name.trim(),
        message: message.trim(),
      });

      if (response.data.success) {
        setConfirmation(
          response.data.message ||
            "Merci pour votre témoignage ! Il sera publié après validation.",
        );
        setName("");
        setMessage("");
        if (onTestimonialSubmitted) onTestimonialSubmitted();
      } else if (response.data.error) {
        setErrorMessages([response.data.error]);
      } else {
        setErrorMessages(["Erreur lors de l'envoi du témoignage."]);
      }
    } catch (err) {
      if (err.response?.data?.error)
        setErrorMessages([err.response.data.error]);
      else if (err.response?.data?.message)
        setErrorMessages([err.response.data.message]);
      else
        setErrorMessages([
          err.message ||
            "Erreur lors de l'envoi du témoignage. Veuillez réessayer.",
        ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.post}>
      <h2 className={styles.postTitle}>Partagez votre expérience</h2>
      <p className={styles.postText}>
        Vous avez bénéficié d'un accompagnement en sophrologie avec Stéphanie
        Habert ? Partagez votre témoignage pour aider d'autres personnes à
        découvrir les bienfaits de cette pratique.
      </p>

      {errorMessages.length > 0 && (
        <div className={styles.errorBox}>
          <ul>
            {errorMessages.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {confirmation && (
        <div
          style={{
            color: "#2f855a",
            textAlign: "center",
            backgroundColor: "#c6f6d5",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
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
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Envoi en cours..." : "Envoyer"}
      </button>
    </section>
  );
}
