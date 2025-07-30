import { useState } from 'react';
import styles from '../styles/Contact.module.css';
import api from '../utils/api';

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default function ContactForm() {
    const [sending, setSending] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Fonction pour gérer les changements d'input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Réinitialiser les erreurs quand l'utilisateur tape
        if (name === 'email' && emailError) {
            setEmailError('');
        }
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    const handleSubmit = async () => {
        const { name, email, message } = formData;

        if (!name.trim() || !email.trim() || !message.trim()) {
            setErrorMessage('Merci de remplir tous les champs.');
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError('Veuillez entrer un email valide.');
            return;
        } else {
            setEmailError('');
        }

        setSending(true);
        setConfirmationMessage('');
        setErrorMessage('');

        try {
            const res = await api.post('/contact', { name, email, message });

            if (res.data.success) {
                setConfirmationMessage(res.data.message || 'Votre message a bien été envoyé.');
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            } else {
                setErrorMessage(res.data.message || "Une erreur est survenue lors de l'envoi.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage(
                err.response?.data?.message ||
                "Une erreur est survenue lors de l'envoi du message."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <section className={styles.contactFormSection}>
            <h2>Formulaire de contact</h2>
            <p className={styles.contactFormText}>
                Vous avez des questions sur la sophrologie ?
                N'hésitez pas à me contacter, je vous répondrai dans les plus brefs délais.
            </p>

            {confirmationMessage && <p className={styles.confirmationMessage}>{confirmationMessage}</p>}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <div className={styles.contactFormFields}>
                <div>
                    <label htmlFor="name">Nom complet</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Entrez votre nom complet"
                    />
                </div>

                <div>
                    <div className={styles.labelErrorContainer}>
                        <label htmlFor="email">Email</label>
                        {emailError && <p className={styles.emailErrorMessage}>{emailError}</p>}
                    </div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Entrez votre email"
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
                    />
                </div>

                <button
                    type="button"
                    className={styles.contactSubmitButton}
                    onClick={handleSubmit}
                    disabled={sending}
                >
                    {sending ? 'Envoi en cours...' : 'Envoyer'}
                </button>
            </div>
        </section>
    );
}