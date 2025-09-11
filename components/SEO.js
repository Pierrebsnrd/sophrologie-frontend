import Head from "next/head";

const SEO = ({
  title = "Stéphanie Habert – Sophrologie à Villepreux",
  description = "Découvrez les séances de sophrologie personnalisées avec Stéphanie Habert à Villepreux. Améliorez votre bien-être grâce à un accompagnement professionnel et bienveillant.",
  canonical = "https://www.sophrologuevillepreux.fr/",
  ogImage = "https://www.sophrologuevillepreux.fr/bannieres/accueil.jpg",
  ogImageAlt = "Stéphanie Habert - Sophrologue à Villepreux",
  pageType = "website",
  specificJsonLd = null,
  keywords = "sophrologie, Villepreux, bien-être, stress, relaxation, Stéphanie Habert, sophrologue, accompagnement, sommeil, confiance en soi",
}) => {
  // JSON-LD Global - Organisation/Personne
  const globalJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.sophrologuevillepreux.fr/#person",
        name: "Stéphanie Habert",
        jobTitle: "Sophrologue certifiée",
        description:
          "Sophrologue certifiée proposant un accompagnement personnalisé basé sur l'écoute, la bienveillance et le respect de l'individualité.",
        url: "https://www.sophrologuevillepreux.fr",
        image: "https://www.sophrologuevillepreux.fr/profile/sophrologue.jpg",
        email: "stephaniehabert.sophrologue@gmail.com",
        telephone: "+33611421765",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Villepreux",
          postalCode: "78450",
          addressCountry: "FR",
        },
        sameAs: [
          "https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr",
          "https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr",
        ],
        knowsAbout: [
          "Sophrologie",
          "Gestion du stress",
          "Amélioration du sommeil",
          "Confiance en soi",
          "Relaxation",
          "Bien-être",
        ],
        alumniOf: "Formation de sophrologie certifiée",
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.sophrologuevillepreux.fr/#business",
        name: "Stéphanie Habert - Cabinet de Sophrologie",
        description:
          "Cabinet de sophrologie proposant des séances individuelles et de groupe à Saint-Germain-en-Laye et en visioconsultation.",
        url: "https://www.sophrologuevillepreux.fr",
        telephone: "+33611421765",
        email: "stephaniehabert.sophrologue@gmail.com",
        priceRange: "60€-80€",
        paymentAccepted: "Cash, Check, Bank transfer",
        currenciesAccepted: "EUR",
        openingHours: ["Mo 09:30-17:30", "Fr 09:30-17:30"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Villepreux",
          postalCode: "78450",
          addressCountry: "FR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "48.8283",
          longitude: "1.9877",
        },
        image: "https://www.sophrologuevillepreux.fr/logo/logo.jpeg",
        logo: "https://www.sophrologuevillepreux.fr/logo/logo.jpeg",
        founder: {
          "@id": "https://www.sophrologuevillepreux.fr/#person",
        },
        employee: {
          "@id": "https://www.sophrologuevillepreux.fr/#person",
        },
        serviceArea: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: "48.8283",
            longitude: "1.9877",
          },
          geoRadius: "50000",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services de sophrologie",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Séance individuelle adulte - première consultation",
                description:
                  "Bilan, définition des objectifs, première pratique",
              },
              price: "80",
              priceCurrency: "EUR",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Séance de suivi individuelle adulte",
                description: "Séance de sophrologie individuelle de suivi",
              },
              price: "70",
              priceCurrency: "EUR",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Séance individuelle adolescent",
                description:
                  "Accompagnement sophrologique pour les adolescents",
              },
              price: "60-70",
              priceCurrency: "EUR",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Séance de groupe",
                description:
                  "Séance de sophrologie en groupe (minimum 4 participants)",
              },
              price: "20",
              priceCurrency: "EUR",
            },
          ],
        },
        areaServed: [
          {
            "@type": "City",
            name: "Villepreux",
          },
          {
            "@type": "State",
            name: "Île-de-France",
          },
        ],
        sameAs: [
          "https://www.facebook.com/share/1BnUXyDqhg/?mibextid=wwXIfr",
          "https://www.instagram.com/sophrologuevillepreuxstephanie?igsh=MWdjdHQ5dml5NDB0bw%3D%3D&utm_source=qr",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.sophrologuevillepreux.fr/#website",
        url: "https://www.sophrologuevillepreux.fr",
        name: "Stéphanie Habert - Sophrologue à Villepreux",
        description:
          "Site officiel de Stéphanie Habert, sophrologue certifiée à Villepreux. Prenez rendez-vous pour des séances de sophrologie personnalisées.",
        publisher: {
          "@id": "https://www.sophrologuevillepreux.fr/#person",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://www.sophrologuevillepreux.fr/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  // JSON-LD spécifiques selon le type de page
  const getSpecificJsonLd = () => {
    if (specificJsonLd) return specificJsonLd;

    switch (pageType) {
      case "about":
        return {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntity: {
            "@id": "https://www.sophrologuevillepreux.fr/#person",
          },
          description:
            "Découvrez le parcours de Stéphanie Habert, sophrologue certifiée, chanteuse d'opéra reconvertie dans l'accompagnement thérapeutique.",
          significantLink: [
            "https://www.sophrologuevillepreux.fr/rdv",
            "https://www.sophrologuevillepreux.fr/contact",
          ],
        };

      case "service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Séances de sophrologie",
          description:
            "Accompagnement personnalisé en sophrologie pour la gestion du stress, l'amélioration du sommeil et le renforcement de la confiance en soi.",
          provider: {
            "@id": "https://www.sophrologuevillepreux.fr/#person",
          },
          areaServed: {
            "@type": "City",
            name: "Villepreux",
          },
          hasOfferCatalog: {
            "@id": "https://www.sophrologuevillepreux.fr/#business",
          },
        };

      case "pricing":
        return {
          "@context": "https://schema.org",
          "@type": "PriceSpecification",
          description:
            "Tarifs des séances de sophrologie avec Stéphanie Habert",
          priceCurrency: "EUR",
          valueAddedTaxIncluded: true,
        };

      case "contact":
        return {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          mainEntity: {
            "@id": "https://www.sophrologuevillepreux.fr/#business",
          },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: [".contact-info", ".opening-hours"],
          },
        };

      case "testimonials":
        return {
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: {
            "@id": "https://www.sophrologuevillepreux.fr/#business",
          },
          reviewBody:
            "Témoignages de clients ayant bénéficié des services de sophrologie de Stéphanie Habert.",
          author: {
            "@type": "Person",
            name: "Anonyme",
          },
        };

      case "ethics":
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          about: {
            "@type": "Thing",
            name: "Charte éthique en sophrologie",
            description:
              "Principes éthiques guidant la pratique de la sophrologie",
          },
          mainEntity: {
            "@type": "Article",
            headline: "Charte éthique - Sophrologie",
            author: {
              "@type": "Person",
              name: "Stéphanie Habert",
            },
          },
        };

      case "appointment":
        return {
          "@context": "https://schema.org",
          "@type": "Schedule",
          name: "Prise de rendez-vous sophrologie",
          description:
            "Réservez votre séance de sophrologie avec Stéphanie Habert",
          scheduleTimezone: "Europe/Paris",
        };

      default:
        return null;
    }
  };

  const specificSchema = getSpecificJsonLd();

  return (
    <Head>
      {/* Balises Meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Stéphanie Habert" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="fr" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta
        property="og:site_name"
        content="Stéphanie Habert - Sophrologie Villepreux"
      />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Données structurées - Schema.org Global */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(globalJsonLd),
        }}
      />

      {/* Données structurées spécifiques à la page */}
      {specificSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(specificSchema),
          }}
        />
      )}

      {/* Balises supplémentaires pour le SEO local */}
      <meta name="geo.region" content="FR-78" />
      <meta name="geo.placename" content="Villepreux" />
      <meta name="geo.position" content="48.8283;1.9877" />
      <meta name="ICBM" content="48.8283, 1.9877" />

      {/* Hreflang pour le multilangue (si nécessaire) */}
      <link rel="alternate" hrefLang="fr" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
    </Head>
  );
};

export default SEO;
