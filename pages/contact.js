import SEO from "../components/SEO";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import Map from "../components/Map";
import styles from "../styles/pages/Contact.module.css";
import Image from "next/image";

export default function Contact() {
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
                            style={{ objectFit: 'cover', objectPosition: 'center 63%' }}
                        />
                        <div className={styles.heroOverlay}>
                            <h1 className={styles.heroTitle} style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>Contact</h1>
                        </div>
                    </section>
                    <div className={styles.contentWrapper}>
                        <ContactInfo />
                        <section className={styles.contactFormMapSection}>
                            <div className={styles.flexContainer}>
                                <ContactForm />
                                <Map />
                            </div>
                        </section>
                    </div>
                </div >
            </main>
            <Footer />
        </>
    );
}