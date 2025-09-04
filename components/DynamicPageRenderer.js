import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import TestimonialForm from './TestimonialForm';
import TestimonialCard from './TestimonialCard';
import Calendly from './Calendly';
import Map from './Map';
import api from '../utils/api';
import styles from '../styles/components/DynamicPageRenderer.module.css';

// Composant pour rendre une section Hero
const HeroSection = ({ section }) => (
  <section className={styles.hero}>
    {section.image?.url && (
      <Image
        src={section.image.url}
        alt={section.image.alt || section.title || 'Image hero'}
        fill
        priority
        className={styles.heroImage}
      />
    )}
    <div className={styles.heroOverlay}>
      {section.title && (
        <h1 className={styles.heroTitle}>{section.title}</h1>
      )}
      {section.subtitle && (
        <p className={styles.heroSubtitle}>{section.subtitle}</p>
      )}
    </div>
  </section>
);

// Composant pour rendre une section de texte
const TextSection = ({ section }) => (
  <section
    className={`${styles.section} ${section.settings?.backgroundColor === '#f0fdfa' ? styles.sectionAlt : ''}`}
    style={{
      textAlign: section.settings?.alignment || 'left',
      backgroundColor: section.settings?.backgroundColor,
      color: section.settings?.textColor
    }}
  >
    <div className={styles.sectionInner}>
      {section.title && (
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      )}
      {section.content && (
        <div className={styles.textContent}>
          {section.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  </section>
);

// Composant pour rendre une grille de cartes
const CardGridSection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      {section.title && (
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      )}
      {section.content && (
        <p className={styles.benefitHighlight}>{section.content}</p>
      )}
      {section.items && section.items.length > 0 && (
        <div className={styles.grid}>
          {section.items.map((item, index) => (
            <div key={index} className={styles.card}>
              {item.image?.url && (
                <div className={styles.cardImage}>
                  <Image
                    src={item.image.url}
                    alt={item.image.alt || item.title || ''}
                    width={300}
                    height={200}
                  />
                </div>
              )}
              {item.title && <h3>{item.title}</h3>}
              {item.content && <p>{item.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

// Composant pour rendre un tableau de tarifs
const PricingTableSection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      {section.title && (
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      )}
      {section.content && (
        <p className={styles.intro}>{section.content}</p>
      )}
      {section.items && section.items.length > 0 && (
        <div className={styles.pricingList}>
          {section.items.map((item, index) => (
            <div key={index} className={styles.pricingItem}>
              <div className={styles.pricingHeader}>
                {item.title && <h3 className={styles.pricingTitle}>{item.title}</h3>}
                {item.price && <span className={styles.pricingPrice}>{item.price}</span>}
              </div>
              {item.content && <p className={styles.pricingDescription}>{item.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

// Composant pour rendre une section Call-to-Action
const CTASection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      {section.title && (
        <h2 className={styles.sectionTitle}>{section.title}</h2>
      )}
      {section.content && (
        <p className={styles.ctaParagraph}>{section.content}</p>
      )}
      {section.buttons && section.buttons.length > 0 && (
        <div className={styles.ctaButtons}>
          {section.buttons.map((button, index) => (
            <Link key={index} href={button.url || '#'}>
              <button
                className={`${styles.button} ${button.style === 'secondary' ? styles.buttonSecondary : ''}`}
              >
                {button.text}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  </section>
);

// Composant pour rendre une section image + texte
const ImageTextSection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.imageTextContainer}>
      {section.image?.url && (
        <div className={styles.imageContainer}>
          <Image
            src={section.image.url}
            alt={section.image.alt || section.title || ''}
            width={300}
            height={300}
            className={styles.profileImage}
          />
        </div>
      )}
      <div className={styles.textContainer}>
        {section.title && <h2 className={styles.title}>{section.title}</h2>}
        {section.content && (
          <div className={styles.textContent}>
            {section.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index} className={styles.paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
);

// Composant pour rendre les informations de contact
const ContactInfoSection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <ContactInfo />
    </div>
  </section>
);

// Composant pour rendre le formulaire de témoignage
const TestimonialFormSection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <TestimonialForm />
    </div>
  </section>
);

// Nouveau composant pour les sections de liste (charte éthique)
const ListSectionsComponent = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      {section.sections && section.sections.map((listSection, index) => (
        <div key={index} className={styles.listSection}>
          <h3 className={styles.listSectionTitle}>{listSection.title}</h3>
          {listSection.items && (
            <ul className={styles.ethicsList}>
              {listSection.items.map((item, itemIndex) => (
                <li key={itemIndex} className={styles.ethicsListItem}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </section>
);

// Nouveau composant pour la liste de témoignages
const TestimonialListSection = ({ section }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (section.fetchFromApi) {
      fetchTestimonials();
    } else {
      setLoading(false);
    }
  }, [section.fetchFromApi]);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/temoignage');

      // Validation robuste
      const testimonials = response?.data?.success
        ? (response.data?.data?.temoignages || [])
        : [];

      console.log('📝 Témoignages chargés:', testimonials.length);
      setTestimonials(testimonials);
    } catch (error) {
      console.error('❌ Erreur témoignages:', error);
      setTestimonials([]); // Fallback sécurisé
    } finally {
      setLoading(false);
    }
  };

  // Combiner les témoignages statiques et dynamiques
  const staticTestimonials = section.staticTestimonials || [];
  const allTestimonials = [...staticTestimonials, ...testimonials];
  const sortedTestimonials = allTestimonials.sort((a, b) =>
    new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
  );
  const visibleTestimonials = showAll ? sortedTestimonials : sortedTestimonials.slice(0, 4);

  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <div className={styles.testimonialsGrid}>
          {visibleTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial._id || `static-${index}`}
              message={testimonial.message}
              author={testimonial.name || testimonial.author}
              date={testimonial.createdAt || testimonial.date}
            />
          ))}
        </div>

        {sortedTestimonials.length > 4 && (
          <div className={styles.loadMoreContainer}>
            <button
              className={styles.loadMoreButton}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Masquer les anciens témoignages' : 'Afficher tous les témoignages'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Nouveau composant pour le widget de rendez-vous
const AppointmentWidgetSection = ({ section }) => (
  <div>
    <Calendly />
  </div>
);

// Nouveau composant pour formulaire de contact + carte
const ContactFormMapSection = ({ section }) => (
  <section className={styles.section}>
    <div className={styles.sectionInner}>
      <div className={styles.contactFormMapContainer}>
        <ContactForm />
        <Map />
      </div>
    </div>
  </section>
);

// Composant principal pour rendre une page dynamiquement
const DynamicPageRenderer = ({ pageId, fallbackContent = null }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPageContent();
  }, [pageId]);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/pages/${pageId}`);
      setPageContent(response.data.data);
    } catch (err) {
      console.error('Erreur lors du chargement du contenu:', err);
      setError(err.message);
      // En cas d'erreur, utiliser le contenu de fallback
      if (fallbackContent) {
        setPageContent(fallbackContent);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (section) => {
    // Vérifier si la section est visible
    if (section.settings?.visible === false) {
      return null;
    }

    const key = section.id || `section-${section.order}`;

    switch (section.type) {
      case 'hero':
        return <HeroSection key={key} section={section} />;

      case 'text':
        return <TextSection key={key} section={section} />;

      case 'card-grid':
        return <CardGridSection key={key} section={section} />;

      case 'pricing-table':
        return <PricingTableSection key={key} section={section} />;

      case 'cta':
        return <CTASection key={key} section={section} />;

      case 'image-text':
        return <ImageTextSection key={key} section={section} />;

      case 'contact-info':
        return <ContactInfoSection key={key} section={section} />;

      case 'testimonial-form':
        return <TestimonialFormSection key={key} section={section} />;

      case 'list-sections':
        return <ListSectionsComponent key={key} section={section} />;

      case 'testimonial-list':
        return <TestimonialListSection key={key} section={section} />;

      case 'appointment-widget':
        return <AppointmentWidgetSection key={key} section={section} />;

      case 'contact-form-map':
        return <ContactFormMapSection key={key} section={section} />;

      // Sections spéciales qui nécessitent des composants existants
      case 'contact-form':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <ContactForm />
            </div>
          </section>
        );

      case 'map':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <Map />
            </div>
          </section>
        );

      case 'calendly':
        return <Calendly key={key} />;

      default:
        console.warn(`Type de section non supporté: ${section.type}`);
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <div className={styles.unsupportedSection}>
                <h3>⚠️ Section non supportée</h3>
                <p>Type: <code>{section.type}</code></p>
                <p>Cette section n'est pas encore implémentée dans le renderer.</p>
              </div>
            </div>
          </section>
        );
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement du contenu...</p>
      </div>
    );
  }

  if (error && !pageContent) {
    return (
      <div className={styles.errorContainer}>
        <h2>Erreur de chargement</h2>
        <p>Le contenu de la page n'a pas pu être chargé.</p>
        {fallbackContent && (
          <p>Affichage du contenu par défaut.</p>
        )}
      </div>
    );
  }

  if (!pageContent || !pageContent.sections) {
    // Utiliser le contenu de fallback si disponible
    if (fallbackContent) {
      return (
        <main>
          {fallbackContent}
        </main>
      );
    }

    return (
      <div className={styles.errorContainer}>
        <h2>Contenu non disponible</h2>
        <p>Cette page n'a pas encore été configurée.</p>
      </div>
    );
  }

  // Trier les sections par ordre
  const sortedSections = pageContent.sections
    .filter(section => section.settings?.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <main>
      {sortedSections.map(renderSection)}
    </main>
  );
};

export default DynamicPageRenderer;