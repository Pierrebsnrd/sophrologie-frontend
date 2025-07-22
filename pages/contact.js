import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/Contact.module.css";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Contact() {
    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                {/* HERO SECTION */}
                <section className={styles.hero}>
                    <Image
                        src="/musique.jpg"
                        alt="Note de musique symbolisant l'harmonie et l'équilibre"
                        fill
                        priority
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay}>
                        <h1 className={styles.heroTitle}>Contact</h1>
                    </div>
                </section>

                {/* CONTENU PRINCIPAL */}
                <div className={styles.contentWrapper}>
                    {/* ENCARTE 1 : Infos + Réseaux */}
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
                        <p><strong>Téléphone :</strong> <a href="tel:0607985675">06 07 98 56 75</a></p>
                        <p><strong>Email :</strong> <a href="mailto:stephaniehabert@sophrologue.com">stephaniehabert@sophrologue.com</a></p>

                        <h2>Réseaux sociaux</h2>
                        <div className={styles.socialIcons}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </section>

                    {/* ENCARTE 2 : Formulaire + Carte */}
                    <section className={styles.contactFormMapSection}>
                        <div className={styles.flexContainer}>
                            <div className={styles.formContainer}>
                                <h2>Formulaire de contact</h2>
                                <form className={styles.contactForm}>
                                    <label htmlFor="name">Nom</label>
                                    <input type="text" id="name" name="name" required />

                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" required />

                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" rows="5" required />

                                    <button type="submit">Envoyer</button>
                                </form>
                            </div>

                            <div className={styles.mapContainer}>
                                <iframe
                                    title="Cabinet Stéphanie Habert"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.4126037209037!2d1.9877313156759884!3d48.828308979286794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e68b780bffb055%3A0x2c2a75f8e34365cd!2sVillepreux%2078450!5e0!3m2!1sfr!2sfr!4v1697890000000!5m2!1sfr!2sfr"
                                    /* src="https://www.google.com/maps?q=18-36+Av.+du+Grand+Parc,+78450+Villepreux&hl=fr&z=16&output=embed" */
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
