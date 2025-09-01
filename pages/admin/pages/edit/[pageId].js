import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ContentEditor from '../../../../components/ContentEditor';
import DynamicPageRenderer from '../../../../components/DynamicPageRenderer';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import styles from '../../../../styles/pages/AdminPages.module.css';

export default function EditPage() {
  const router = useRouter();
  const { pageId } = router.query;
  const [pageTitle, setPageTitle] = useState('');
  const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Fonction pour rafraîchir la prévisualisation après sauvegarde
  const handleContentSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

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
        {/* Barre de navigation supérieure */}
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
            {/* Toggle pour basculer entre édition et prévisualisation */}
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.toggleButton} ${viewMode === 'edit' ? styles.active : ''}`}
                onClick={() => setViewMode('edit')}
              >
                ✏️ Éditer
              </button>
              <button 
                className={`${styles.toggleButton} ${viewMode === 'preview' ? styles.active : ''}`}
                onClick={() => setViewMode('preview')}
              >
                👁️ Prévisualiser
              </button>
            </div>

            <Link 
              href={getPageUrl(pageId)}
              target="_blank"
              className={styles.previewButton}
            >
              🌐 Voir sur le site
            </Link>

            <Link 
              href="/admin/pages"
              className={styles.backButton}
            >
              ← Retour aux pages
            </Link>
          </div>
        </div>

        {/* Mode édition */}
        {viewMode === 'edit' && (
          <>
            {/* Notice d'information */}
            <div className={styles.infoNotice}>
              <div className={styles.noticeIcon}>ℹ️</div>
              <div className={styles.noticeContent}>
                <h3>Édition de la page : {pageTitle}</h3>
                <p>
                  Vous pouvez ajouter, modifier, supprimer et réorganiser les sections de cette page. 
                  Utilisez l'onglet "Prévisualiser" pour voir le rendu final.
                </p>
              </div>
            </div>

            {/* Éditeur de contenu */}
            <div className={styles.editorContainer}>
              <ContentEditor 
                pageId={pageId} 
                onContentSaved={handleContentSaved}
              />
            </div>
          </>
        )}

        {/* Mode prévisualisation */}
        {viewMode === 'preview' && (
          <div className={styles.previewContainer}>
            {/* Notice de prévisualisation */}
            <div className={styles.previewNotice}>
              <div className={styles.noticeIcon}>👁️</div>
              <div className={styles.noticeContent}>
                <h3>Prévisualisation : {pageTitle}</h3>
                <p>
                  Voici comment votre page apparaîtra aux visiteurs. 
                  Retournez en mode "Éditer" pour apporter des modifications.
                </p>
              </div>
            </div>

            {/* Rendu de la page avec Header et Footer */}
            <div className={styles.previewWrapper}>
              <Header />
              <DynamicPageRenderer 
                key={refreshKey} 
                pageId={pageId}
                fallbackContent={
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Contenu en cours de chargement...</h2>
                    <p>Si cette page reste vide, vérifiez que vous avez bien configuré au moins une section.</p>
                  </div>
                }
              />
              <Footer />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .viewToggle {
          display: flex;
          background: #f1f5f9;
          border-radius: 8px;
          padding: 4px;
          gap: 2px;
        }
        
        .toggleButton {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          color: #64748b;
        }
        
        .toggleButton.active {
          background: white;
          color: #2d5a3d;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .toggleButton:hover:not(.active) {
          background: rgba(255,255,255,0.5);
          color: #475569;
        }
        
        .previewContainer {
          background: #f8fafc;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .previewNotice {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 1px solid #3b82f6;
          padding: 20px;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .previewNotice .noticeIcon {
          font-size: 24px;
        }
        
        .previewNotice h3 {
          color: #1e40af;
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .previewNotice p {
          color: #1e40af;
          margin: 0;
          line-height: 1.5;
        }
        
        .previewWrapper {
          background: white;
          min-height: 70vh;
        }
        
        .infoNotice {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 1px solid #48bb78;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .noticeIcon {
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .noticeContent h3 {
          color: #065f46;
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .noticeContent p {
          color: #065f46;
          margin: 0;
          line-height: 1.5;
        }
        
        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 25px;
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .breadcrumbLink {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .breadcrumbLink:hover {
          color: #48bb78;
        }
        
        .breadcrumbSeparator {
          color: #cbd5e1;
        }
        
        .breadcrumbCurrent {
          color: #2d5a3d;
          font-weight: 500;
        }
        
        .topActions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .editorContainer {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 0;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .topBar {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
            text-align: center;
          }
          
          .topActions {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .viewToggle {
            order: -1;
            align-self: center;
          }
        }
        
        @media (max-width: 480px) {
          .topActions {
            flex-direction: column;
            gap: 8px;
          }
          
          .infoNotice, .previewNotice {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
        }
      `}</style>
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