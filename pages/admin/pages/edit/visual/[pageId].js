import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import VisualEditor from '../../../../../components/VisualEditor';

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
        textAlign: 'center'
      }}>
        <h1>Page non trouvée</h1>
        <p>La page que vous essayez de modifier n'existe pas.</p>
        <a 
          href="/admin/pages" 
          style={{
            background: '#f1f5f9',
            color: '#475569',
            padding: '10px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            marginTop: '1rem'
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
      </Head>

      <VisualEditor pageId={pageId} />
    </>
  );
}