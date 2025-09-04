import { useState } from "react";
import styles from "../styles/components/ContactForm.module.css";
import api from "../utils/api";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Accepte différents formats français : 06.12.34.56.78, 06 12 34 56 78, 0612345678, +33612345678
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
  const cleanPhone = phone.replace(/[\s\.\-]/g, ''); // Retire espaces, points, tirets
  return phoneRegex.test(cleanPhone);
}

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessages([]);
    setConfirmationMessage("");
  };

  const handleSubmit = async () => {
    const { name, email, phone, message } = formData;
    const newErrors = [];

    // Validation front
    if (!name.trim()) newErrors.push("Le prénom est requis.");
    else if (name.trim().length < 2) newErrors.push("Le prénom doit contenir au moins 2 caractères.");

    if (!email.trim()) newErrors.push("L'email est requis.");
    else if (!isValidEmail(email)) newErrors.push("Veuillez entrer un email valide.");

    // Validation téléphone (obligatoire)
    if (!phone.trim()) {
      newErrors.push("Le numéro de téléphone est requis.");
    } else if (!isValidPhone(phone)) {
      newErrors.push("Veuillez entrer un numéro de téléphone valide (format français).");
    }

    if (!message.trim()) newErrors.push("Le message est requis.");
    else if (message.trim().length < 10) newErrors.push("Le message doit contenir au moins 10 caractères.");

    if (newErrors.length > 0) {
      setErrorMessages(newErrors);
      return;
    }

    setSending(true);
    setErrorMessages([]);
    setConfirmationMessage("");

    try {
      const res = await api.post("/contact", { name, email, phone, message });

      if (res.data.success) {
        setConfirmationMessage(res.data.message || "Votre message a bien été envoyé.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else if (res.data.errors) {
        // Backend renvoie erreurs champ par champ
        setErrorMessages(Object.values(res.data.errors));
      } else {
        setErrorMessages([res.data.message || "Une erreur est survenue."]);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrorMessages(Object.values(err.response.data.errors));
      } else {
        setErrorMessages([err.response?.data?.message || "Une erreur est survenue lors de l'envoi."]);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={styles.contactFormSection}>
      <h2>Formulaire de contact</h2>
      <p className={styles.contactFormText}>
        Vous avez des questions sur la sophrologie ? N'hésitez pas à me contacter, je vous répondrai dans les plus brefs délais.
      </p>

      {confirmationMessage && <p className={styles.confirmationMessage}>{confirmationMessage}</p>}

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
          />
        </div>

        <button
          type="button"
          className={styles.contactSubmitButton}
          onClick={handleSubmit}
          disabled={sending}
        >
          {sending ? "Envoi en cours..." : "Envoyer"}
        </button>
      </div>
    </section>
  );
}