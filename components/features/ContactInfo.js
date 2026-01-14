import { FaFacebookF, FaInstagram } from "react-icons/fa";
import styles from "../../styles/components/ContactInfo.module.css";
import { SOCIAL_LINKS, CONTACT_INFO, APP_CONFIG } from "../../config/constants";

export default function ContactInfo() {
  return (
    <section className={styles.contactSection}>
      <h2 className={styles.mainTitle}>Coordonnées</h2>
      <p>
        <strong>Cabinet :</strong> Stéphanie Habert Sophrologue
      </p>
      <p>
        <strong>Adresse :</strong> {CONTACT_INFO.ADDRESS.STREET} {CONTACT_INFO.ADDRESS.POSTAL_CODE}{" "}
        {CONTACT_INFO.ADDRESS.CITY}
      </p>

      <h3>Horaires d'ouverture</h3>
      <ul>
        <li>Mardi : {APP_CONFIG.SCHEDULE.TUESDAY}</li>
        <li>Vendredi : {APP_CONFIG.SCHEDULE.FRIDAY}</li>
      </ul>

      <h3>Contact</h3>
      <p>
        <strong>Téléphone :</strong> <a href={`tel:${CONTACT_INFO.PHONE.replace(/\s/g, "")}`}>{CONTACT_INFO.PHONE}</a>
      </p>
      <p>
        <strong>Email :</strong>{" "}
        <a href={`mailto:${CONTACT_INFO.EMAIL}`}>
          {CONTACT_INFO.EMAIL}
        </a>
      </p>

      <h3>Réseaux sociaux</h3>
      <div className={styles.socialIcons}>
        <a
          href={SOCIAL_LINKS.FACEBOOK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>
        <a
          href={SOCIAL_LINKS.INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
      </div>
    </section>
  );
}
