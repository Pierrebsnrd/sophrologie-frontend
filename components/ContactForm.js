import { useState } from "react";
import styles from "../styles/components/ContactForm.module.css";
import api from "../utils/api";
import { trackEvents } from "../utils/analytics";
import LoadingSpinner from "./LoadingSpinner";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
  const cleanPhone = phone.replace(/[\s\.\-]/g, "");
  return phoneRegex.test(cleanPhone);
}

export default function ContactForm({ onNotification }) {
  const [sending, setSending] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessages([]);
  };

  const handleSubmit = async () => {
    const { name, email, phone, message } = formData;
    const newErrors = [];

    // Validation front
    if (!name.trim()) newErrors.push("Le prénom est requis.");
    else if (name.trim().length < 2)
      newErrors.push("Le prénom doit contenir au moins 2 caractères.");

    if (!email.trim()) newErrors.push("L'email est requis.");
    else if (!isValidEmail(email))
      newErrors.push("Veuillez entrer un email valide.");

    if (!phone.trim()) {
      newErrors.push("Le numéro de téléphone est requis.");
    } else if (!isValidPhone(phone)) {
      newErrors.push(
        "Veuillez entrer un numéro de téléphone valide (format français).",
      );
    }

    if (!message.trim()) newErrors.push("Le message est requis.");
    else if (message.trim().length < 10)
      newErrors.push("Le message doit contenir au moins 10 caractères.");

    if (newErrors.length > 0) {
      setErrorMessages(newErrors);
      if (onNotification) {
        onNotification("Veuillez corriger les erreurs ci-dessous.", "error");
      }
      return;
    }

    setSending(true);
    setErrorMessages([]);

    try {
      const res = await api.post("/contact", { name, email, phone, message });

      if (res.data.success) {
        // Tracker l'événement
        trackEvents.contactFormSubmit();

        // Notification de succès
        if (onNotification) {
          onNotification(
            "Message envoyé avec succès ! Nous vous répondrons rapidement.",
            "success",
          );
        }

        // Reset du formulaire
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else if (res.data.errors) {
        setErrorMessages(Object.values(res.data.errors));
        if (onNotification) {
          onNotification(
            "Erreur lors de l'envoi. Vérifiez vos informations.",
            "error",
          );
        }
      } else {
        setErrorMessages([res.data.message || "Une erreur est survenue."]);
        if (onNotification) {
          onNotification("Une erreur inattendue s'est produite.", "error");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrorMessages(Object.values(err.response.data.errors));
      } else {
        setErrorMessages([
          err.response?.data?.message ||
            "Une erreur est survenue lors de l'envoi.",
        ]);
      }
      if (onNotification) {
        onNotification("Problème de connexion. Veuillez réessayer.", "error");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={styles.contactFormSection}>
      <h2>Formulaire de contact</h2>
      <p className={styles.contactFormText}>
        Vous avez des questions sur la sophrologie ? N'hésitez pas à me
        contacter, je vous répondrai dans les plus brefs délais.
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

      <div className={styles.contactFormFields}>
        <div>
          <label htmlFor="name">Prénom et Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Entrez votre prénom et nom"
            required
            disabled={sending}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Entrez votre email"
            required
            disabled={sending}
          />
        </div>

        <div>
          <label htmlFor="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="06 12 34 56 78"
            required
            disabled={sending}
          />
        </div>

        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Décrivez votre besoin ou posez votre question..."
            required
            disabled={sending}
          />
        </div>

        <button
          type="button"
          className={`${styles.contactSubmitButton} ${sending ? styles.loading : ""}`}
          onClick={handleSubmit}
          disabled={sending}
        >
          {sending ? (
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
  );
}
