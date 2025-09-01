import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import VisualEditor from '../../../../components/VisualEditor';

export default function VisualEditPage() {
  const router = useRouter();
  const { pageId } = router.query;
  const [pageTitle, setPageTitle] = useState('');

  const pageNames = {
    home: 'Accueil',
    about: 'Qui suis-je ?',
    pricing: 'Tarifs',
    appointment: 'Prendre rendez-vous',
    testimonials: 'Témoignages',
    contact: 'Contact',
    ethics: 'Charte éthique'
  };

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    if (pageId && pageNames[pageId]) {
      setPageTitle(pageNames[pageId]);
    } else if (pageId && !pageNames[pageId]) {
      // Page ID non valide, rediriger
      router.replace('/admin/pages');
    }
  }, [router, pageId]);

  if (!pageId || !pageNames[pageId]) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        background: '#f8fafc'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Page non trouvée</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          La page que vous essayez de modifier n'existe pas.
        </p>
        <a 
          href="/admin/pages" 
          style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          ← Retour aux pages
        </a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Éditeur Visuel - {pageTitle} - Administration</title>
        <meta name="description" content={`Édition visuelle de la page ${pageTitle}`} />
      </Head>

      <VisualEditor pageId={pageId} />
    </>
  );
}