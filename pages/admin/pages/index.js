import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import api from '../../../utils/api';
import styles from '../../../styles/pages/AdminPages.module.css';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Mapping des noms de pages
  const pageNames = {
    home: 'Accueil',
    about: 'Qui suis-je ?',
    pricing: 'Tarifs',
    appointment: 'Prendre rendez-vous',
    testimonials: 'Témoignages',
    contact: 'Contact',
    ethics: 'Charte éthique'
  };

  const pageDescriptions = {
    home: 'Page principale du site avec présentation et bienfaits',
    about: 'Présentation personnelle et parcours professionnel',
    pricing: 'Tarifs des prestations et séances',
    appointment: 'Interface de prise de rendez-vous Calendly',
    testimonials: 'Témoignages clients et formulaire de soumission',
    contact: 'Coordonnées et formulaire de contact',
    ethics: 'Charte éthique et déontologique'
  };

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    fetchPages();
  }, [router]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pages');
      setPages(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        router.replace('/admin/login');
      } else {
        setError('Erreur lors du chargement des pages');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement des pages...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Gestion des pages - Administration</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestion des pages</h1>
            <p className={styles.subtitle}>Modifiez le contenu de votre site web</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/admin" className={styles.backButton}>
              ← Retour au dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        <div className={styles.pagesGrid}>
          {Object.keys(pageNames).map(pageId => {
            const pageData = pages.find(p => p.pageId === pageId);
            const lastModified = pageData?.lastModified;

            return (
              <div key={pageId} className={styles.pageCard}>
                <div className={styles.pageHeader}>
                  <div className={styles.pageIcon}>
                    {getPageIcon(pageId)}
                  </div>
                  <div className={styles.pageInfo}>
                    <h3 className={styles.pageName}>{pageNames[pageId]}</h3>
                    <p className={styles.pageDescription}>
                      {pageDescriptions[pageId]}
                    </p>
                    <p className={styles.editorInfo}>
                      💡 Deux méthodes d'édition disponibles
                    </p>
                  </div>
                </div>

                <div className={styles.pageStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Dernière modification</span>
                    <span className={styles.statValue}>
                      {lastModified ? formatDate(lastModified) : 'Jamais modifiée'}
                    </span>
                  </div>
                </div>

                <div className={styles.pageActions}>
                  <Link
                    href={`/admin/pages/edit/${pageId}`}
                    className={styles.editButton}
                  >
                    📝 Éditer (Formulaires)
                  </Link>
                  <Link
                    href={`/admin/pages/visual/${pageId}`}
                    className={styles.visualEditButton}
                  >
                    ✏️ Éditeur Visuel
                  </Link>
                  <Link
                    href={getPageUrl(pageId)}
                    target="_blank"
                    className={styles.previewButton}
                  >
                    👁️ Aperçu
                  </Link>
                </div>

                <div className={styles.pageFooter}>
                  <span className={`${styles.statusBadge} ${styles.statusPublished}`}>
                    ✅ Publiée
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section d'aide */}
        <div className={styles.helpSection}>
          <h2>Comment ça marche ?</h2>
          <div className={styles.helpCards}>
            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>📝</div>
              <h3>Éditeur Formulaires</h3>
              <p>Parfait pour les modifications structurelles : ajouter des sections, réorganiser le contenu, configurer les paramètres avancés.</p>
              <div className={styles.helpTags}>
                <span>Ajout de sections</span>
                <span>Réorganisation</span>
                <span>Configuration</span>
              </div>
            </div>

            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>✏️</div>
              <h3>Éditeur Visuel</h3>
              <p>Idéal pour les modifications rapides : cliquez directement sur les textes et images pour les modifier en temps réel.</p>
              <div className={styles.helpTags}>
                <span>Modification rapide</span>
                <span>WYSIWYG</span>
                <span>Intuitive</span>
              </div>
            </div>

            <div className={styles.helpCard}>
              <div className={styles.helpIcon}>👁️</div>
              <h3>Aperçu</h3>
              <p>Visualisez exactement comment votre page apparaîtra sur votre site web avant de publier les modifications.</p>
              <div className={styles.helpTags}>
                <span>Prévisualisation</span>
                <span>Vérification</span>
                <span>Validation</span>
              </div>
            </div>
          </div>

          <div className={styles.helpTip}>
            <div className={styles.tipIcon}>💡</div>
            <div>
              <h4>Conseil d'utilisation</h4>
              <p>
                <strong>Éditeur Visuel</strong> pour vos modifications quotidiennes (textes, images) •
                <strong>Éditeur Formulaires</strong> pour la restructuration et les ajouts complexes
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Fonction utilitaire pour obtenir l'icône de la page
  function getPageIcon(pageId) {
    const icons = {
      home: '🏠',
      about: '👋',
      pricing: '💰',
      appointment: '📅',
      testimonials: '💬',
      contact: '📞',
      ethics: '📋'
    };
    return icons[pageId] || '📄';
  }

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