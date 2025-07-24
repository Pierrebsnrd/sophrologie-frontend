import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/Contact.module.css";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import api from "../utils/api";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function Contact() {
    const [sending, setSending] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        const email = e.target.email.value.trim();
        const message = e.target.message.value.trim();

        if (!name || !email || !message) {
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
            if (res.status === 200) {
                setConfirmationMessage('Votre message a bien été envoyé.');
                e.target.reset();
            } else {
                setErrorMessage("Une erreur est survenue lors de l'envoi.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Une erreur est survenue lors de l'envoi du message.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <section className={styles.hero}>
                    <Image
                        src="/bannieres/contact.jpg"
                        alt="Contact"
                        fill
                        priority
                        className={styles.heroImage}
                        style={{ objectFit: 'cover', objectPosition: 'center 63%' }}
                    />
                    <div className={styles.heroOverlay}>
                        <h1 className={styles.heroTitle}>Contact</h1>
                    </div>
                </section>
                <div className={styles.contentWrapper}>
                    <section className={styles.contactSection}>
                        <h1>Contact</h1>
                        <p><strong>Cabinet :</strong> Stéphanie Habert Sophrologue</p>
                        <p><strong>Adresse :</strong> Villepreux, 78450</p>
                        <h2>Horaires d'ouverture</h2>
                        <ul>
                            <li>Lundi au vendredi : 9h - 18h</li>
                            <li>Samedi : 9h - 12h</li>
                            <li>Dimanche : Fermé</li>
                        </ul>
                        <h2>Contact</h2>
                        <p><strong>Téléphone :</strong> <a href="tel:0611421765">06 11 42 17 65</a></p>
                        <p><strong>Email :</strong> <a href="mailto:stephaniehabert.sophrologue@gmail.com">stephaniehabert.sophrologue@gmail.com</a></p>
                        <h2>Réseaux sociaux</h2>
                        <div className={styles.socialIcons}>
                            <a href="https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </section>
                    <section className={styles.contactFormMapSection}>
                        <div className={styles.flexContainer}>
                            <div className={styles.formContainer}>
                                <h2>Formulaire de contact</h2>
                                <form className={styles.contactForm} onSubmit={handleSubmit}>
                                    <label htmlFor="name">Nom</label>
                                    <input type="text" id="name" name="name" placeholder="Entrez votre nom" required />
                                    <div className={styles.labelErrorContainer}>
                                        <label htmlFor="email">Email</label>
                                        {emailError && <p className={styles.emailErrorMessage}>{emailError}</p>}
                                    </div>
                                    <input type="email" id="email" name="email" placeholder="Entrez votre email" required />
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" rows="5" placeholder="Entrez votre message" required />
                                    {confirmationMessage && <p className={styles.confirmationMessage}>{confirmationMessage}</p>}
                                    <button type="submit" disabled={sending}>
                                        {sending ? 'Envoi en cours...' : 'Envoyer'}
                                    </button>
                                </form>
                            </div>
                            <div className={styles.mapContainer}>
                                <iframe
                                    title="Cabinet Stéphanie Habert"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.4126037209037!2d1.9877313156759884!3d48.828308979286794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e68b780bffb055%3A0x2c2a75f8e34365cd!2sVillepreux%2078450!5e0!3m2!1sfr!2sfr!4v1697890000000!5m2!1sfr!2sfr"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                                <div className={styles.locationText}>
                                    <p><strong>Localisation :</strong><br />
                                        Stéphanie Habert - Sophrologue<br />
                                        Villepreux, France</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}
