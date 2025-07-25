import React, { useEffect } from 'react';
import { InlineWidget } from 'react-calendly';
import styles from '../styles/Calendly.module.css';
import Image from 'next/image';

export default function Calendly() {
  // Hook pour écouter les événements Calendly
  useEffect(() => {
    const handleCalendlyEvent = (e) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        console.log('Événement Calendly:', e.data.event);
        
        switch (e.data.event) {
          case 'calendly.event_scheduled':
            console.log('Rendez-vous planifié:', e.data.payload);
            // Vous pouvez ajouter ici des actions comme :
            // - Envoyer des données vers Google Analytics
            // - Rediriger vers une page de remerciement
            // - Afficher une notification de succès
            break;
          case 'calendly.profile_page_viewed':
            console.log('Page de profil vue');
            break;
          case 'calendly.event_type_viewed':
            console.log('Type d\'événement vu');
            break;
          case 'calendly.date_and_time_selected':
            console.log('Date et heure sélectionnées');
            break;
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  return (
    <main>
      <div className={styles.pageContainer}>
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <Image
            src="/bannieres/rdv.jpg"
            alt="Bureau"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>Prendre rendez-vous</h1>
          </div>
        </section>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Réservez votre consultation</h1>
          <p className={styles.subtitle}>
            Choisissez directement le créneau qui vous convient dans l'agenda ci-dessous.
            Vous recevrez une confirmation automatique par email.
          </p>

          {/* Widget Calendly */}
          <div className={styles.calendlyContainer}>
            <InlineWidget
              url="https://calendly.com/stephaniehabert-sophrologue" // ⚠️ REMPLACEZ PAR VOTRE URL CALENDLY
              styles={{
                height: '700px',
                width: '100%'
              }}
              pageSettings={{
                backgroundColor: 'ffffff',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: '2c5aa0', // Couleur de votre thème
                textColor: '4d5055'
              }}
              prefill={{
                // Optionnel : vous pouvez pré-remplir des informations si vous les avez
                // email: 'user@example.com',
                // firstName: 'John',
                // lastName: 'Doe'
              }}
              utm={{
                utmCampaign: 'Site Web',
                utmSource: 'Page RDV',
                utmMedium: 'Widget Inline'
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}