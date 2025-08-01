import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import styles from '../styles/components/ContactInfo.module.css';

export default function ContactInfo() {
    return (
        <section className={styles.contactSection}>
            <h2 className={styles.mainTitle}>Coordonnées</h2>
            <p><strong>Cabinet :</strong> Stéphanie Habert Sophrologue</p>
            <p><strong>Adresse :</strong> Villepreux, 78450</p>
            
            <h3>Horaires d'ouverture</h3>
            <ul>
                <li>Lundi au vendredi : 9h - 18h</li>
                <li>Samedi : 9h - 12h</li>
                <li>Dimanche : Fermé</li>
            </ul>
            
            <h3>Contact</h3>
            <p><strong>Téléphone :</strong> <a href="tel:0611421765">06 11 42 17 65</a></p>
            <p><strong>Email :</strong> <a href="mailto:stephaniehabert.sophrologue@gmail.com">stephaniehabert.sophrologue@gmail.com</a></p>
            
            <h3>Réseaux sociaux</h3>
            <div className={styles.socialIcons}>
                <a href="https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FaFacebookF />
                </a>
                <a href="https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram />
                </a>
            </div>
        </section>
    );
}