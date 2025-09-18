import { useState } from "react";
import { SEO, Header, Footer } from "../components/layout";
import { ContactInfo, Map } from "../components/features";
import { ContactForm } from "../components/forms";
import { Notification } from "../components/ui";
import styles from "../styles/pages/Contact.module.css";
import Image from "next/image";

export default function Contact() {
  // État pour les notifications au niveau de la page
  const [notification, setNotification] = useState(null);

  const handleNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  return (
    <>
      <SEO
        title="Contact – Stéphanie Habert, Sophrologue à Villepreux"
        description="Contactez Stéphanie Habert, sophrologue à Villepreux. Prenez rendez-vous ou posez vos questions via notre formulaire simple et rapide."
        canonical="https://www.sophrologuevillepreux.fr/contact"
        ogImage="https://www.sophrologuevillepreux.fr/bannieres/contact.jpg"
        pageType="contact"
        keywords="contact sophrologue Villepreux, rendez-vous, Stéphanie Habert, téléphone"
      />

      {/* Notification toast au niveau de la page */}
      <Notification
        message={notification?.message}
        type={notification?.type}
        duration={6000}
        onClose={() => setNotification(null)}
      />

      <Header />
      <main>
        <div className={styles.pageContainer}>
          <section className={styles.hero}>
            <Image
              src="/bannieres/contact.jpg"
              alt="Contact"
              fill
              priority
              className={styles.heroImage}
              style={{ objectFit: "cover", objectPosition: "center 63%" }}
            />
            <div className={styles.heroOverlay}>
              <h1
                className={styles.heroTitle}
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
              >
                Contact
              </h1>
            </div>
          </section>
          <div className={styles.contentWrapper}>
            <ContactInfo />
            <section className={styles.contactFormMapSection}>
              <div className={styles.flexContainer}>
                <ContactForm onNotification={handleNotification} />
                <Map />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
