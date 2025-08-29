import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ContentEditor from '../../../../components/ContentEditor';
import styles from '../../../../styles/pages/AdminPages.module.css';

export default function EditPage() {
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
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h1>Page non trouvée</h1>
          <p>La page que vous essayez de modifier n'existe pas.</p>
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour aux pages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Éditer {pageTitle} - Administration</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.breadcrumb}>
            <Link href="/admin" className={styles.breadcrumbLink}>
              Dashboard
            </Link>
            <span className={styles.breadcrumbSeparator}>→</span>
            <Link href="/admin/pages" className={styles.breadcrumbLink}>
              Pages
            </Link>
            <span className={styles.breadcrumbSeparator}>→</span>
            <span className={styles.breadcrumbCurrent}>{pageTitle}</span>
          </div>

          <div className={styles.topActions}>
            <Link 
              href={getPageUrl(pageId)}
              target="_blank"
              className={styles.previewButton}
            >
              👁️ Aperçu du site
            </Link>
            <Link 
              href="/admin/pages"
              className={styles.backButton}
            >
              ← Retour aux pages
            </Link>
          </div>
        </div>

        {/* Notice d'information */}
        <div className={styles.infoNotice}>
          <div className={styles.noticeIcon}>ℹ️</div>
          <div className={styles.noticeContent}>
            <h3>Édition de la page : {pageTitle}</h3>
            <p>
              Vous pouvez ajouter, modifier, supprimer et réorganiser les sections de cette page. 
              Vos modifications seront automatiquement sauvegardées et visibles sur votre site.
            </p>
          </div>
        </div>

        {/* Éditeur de contenu */}
        <div className={styles.editorContainer}>
          <ContentEditor pageId={pageId} />
        </div>
      </div>
    </>
  );

  // Fonction utilitaire pour obtenir l'URL de la page
  function getPageUrl(pageId) {
    const urls = {
      home: '/',
      about: '/qui-suis-je',
      pricing: '/tarifs',
      appointment: '/rdv',
      testimonials: '/temoignages',
      contact: '/contact',
      ethics: '/charte'
    };
    return urls[pageId] || '/';
  }
}