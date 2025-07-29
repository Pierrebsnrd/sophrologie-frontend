import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../utils/api';

export default function AdminDashboard() {
  // States
  const [activeTab, setActiveTab] = useState('temoignage');
  const [temoignages, setTemoignages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTemoignage, setUpdatingTemoignage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteTemoignageModal, setShowDeleteTemoignageModal] = useState(false);
  const [deleteTemoignageId, setDeleteTemoignageId] = useState(null);
  const pendingTemoignagesCount = temoignages.filter(t => t.status === 'pending').length;
  const unansweredMessagesCount = contactMessages.filter(m => !m.answered).length;


  // Pagination states
  const [currentPageTemoignages, setCurrentPageTemoignages] = useState(1);
  const [totalPagesTemoignages, setTotalPagesTemoignages] = useState(1);
  const [currentPageMessages, setCurrentPageMessages] = useState(1);
  const [totalPagesMessages, setTotalPagesMessages] = useState(1);

  // Profile & Password states
  const [adminProfile, setAdminProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    fetchData();
    fetchAdminProfile();
  }, [router]);

  // Fonction fetchData corrigée avec meilleure gestion d'erreurs
  const fetchData = async (temoignagePage = 1, messagePage = 1) => {
    setLoading(true);
    setError('');

    try {
      const [temoignageRes, contactRes] = await Promise.all([
        api.get(`/admin/temoignages?page=${temoignagePage}&limit=10`),
        api.get(`/admin/contact-messages?page=${messagePage}&limit=10`),
      ]);

      console.log('Temoignage response:', temoignageRes.data);
      console.log('Contact response:', contactRes.data);

      // Gestion des témoignages
      if (temoignageRes.data.success) {
        setTemoignages(temoignageRes.data.data.temoignages || []);
        setTotalPagesTemoignages(temoignageRes.data.data.pagination?.totalPages || 1);
        setCurrentPageTemoignages(temoignageRes.data.data.pagination?.currentPage || 1);
      } else {
        // Fallback si pas de structure success
        setTemoignages(Array.isArray(temoignageRes.data) ? temoignageRes.data : []);
      }

      // Gestion des messages de contact
      if (contactRes.data.success) {
        setContactMessages(contactRes.data.data.messages || []);
        setTotalPagesMessages(contactRes.data.data.pagination?.totalPages || 1);
        setCurrentPageMessages(contactRes.data.data.pagination?.currentPage || 1);
      } else {
        // Fallback si pas de structure success
        setContactMessages(Array.isArray(contactRes.data) ? contactRes.data : []);
      }

    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        // Token expiré, rediriger vers login
        localStorage.removeItem('adminToken');
        router.replace('/admin/login');
      } else {
        setError('Erreur lors du chargement des données: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Récupération du profil admin corrigée
  const fetchAdminProfile = async () => {
    try {
      console.log('Calling URL:', '/admin/profile');
      const response = await api.get('/admin/profile');
      console.log('Profile response:', response.data);

      if (response.data.success) {
        setAdminProfile(response.data.data);
      } else {
        console.warn('Profile response without success flag:', response.data);
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        router.replace('/admin/login');
      }
    }
  };
  // Fonctions de navigation pour la pagination
  const handleTemoignagePage = (page) => {
    fetchData(page, currentPageMessages);
  };

  const handleMessagePage = (page) => {
    fetchData(currentPageTemoignages, page);
  };

  // Fonctions Témoignage
  const updateTemoignageStatus = async (id, status) => {
    setUpdatingTemoignage(id);
    try {
      await api.patch(`/admin/temoignages/${id}/status`, { status });
      await fetchData(currentPageTemoignages, currentPageMessages);
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingTemoignage(null);
    }
  };

  // Fonctions Contact
  async function handleReply(msg) {
    window.location.href = `mailto:${msg.email}?subject=Réponse à votre message`;
    try {
      await api.patch(`/admin/contact-messages/${msg._id}/answered`);
      await fetchData(currentPageTemoignages, currentPageMessages);
    } catch (err) {
      setError('Erreur lors du changement de statut du message');
    }
  }

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/admin/contact-messages/${deleteId}`);
      await fetchData(currentPageTemoignages, currentPageMessages);
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      setError('Erreur lors de la suppression du message');
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const confirmDeleteTemoignage = (id) => {
    setDeleteTemoignageId(id);
    setShowDeleteTemoignageModal(true);
  };

  const handleDeleteTemoignageConfirmed = async () => {
    try {
      await api.delete(`/admin/temoignages/${deleteTemoignageId}`);
      await fetchData(currentPageTemoignages, currentPageMessages);
      setShowDeleteTemoignageModal(false);
      setDeleteTemoignageId(null);
    } catch (err) {
      setError('Erreur lors de la suppression du témoignage');
      setShowDeleteTemoignageModal(false);
      setDeleteTemoignageId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.replace('/admin/login');
  };

  // Gestion du changement de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      await api.patch('/admin/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordSuccess('Mot de passe changé avec succès');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Fermer la modal après 2 secondes
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (err) {
      setPasswordError(
        err.response?.data?.message || 'Erreur lors du changement de mot de passe'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  // Helpers
  const formatDate = (date) => new Date(date).toLocaleString('fr-FR');
  const getStatusColor = (status) => {
    if (status === 'pending') return '#f39c12';
    if (status === 'validated') return '#27ae60';
    if (status === 'rejected') return '#e74c3c';
    return '#7f8c8d';
  };
  const getStatusTextTemoignage = (status) => {
    if (status === 'pending') return 'En attente';
    if (status === 'validated') return 'Validé';
    if (status === 'rejected') return 'Rejeté';
    return status;
  };

  // Composant de pagination réutilisable
  const PaginationComponent = ({ currentPage, totalPages, onPageChange, type }) => {
    if (totalPages <= 1) return null;

    return (
      <div style={styles.pagination}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          style={{
            ...styles.paginationButton,
            opacity: currentPage <= 1 ? 0.5 : 1,
            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Précédent
        </button>
        <span style={styles.paginationInfo}>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          style={{
            ...styles.paginationButton,
            opacity: currentPage >= totalPages ? 0.5 : 1,
            cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Suivant
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Dashboard Admin - Stéphanie Habert Sophrologue</title>
      </Head>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard Admin</h1>
            <p style={styles.subtitle}>Gestion des témoignages et messages</p>
            {adminProfile && (
              <p style={styles.profileInfo}>
                Connecté en tant que: <strong>{adminProfile.email}</strong>
                {adminProfile.lastLogin && (
                  <span style={styles.lastLogin}>
                    • Dernière connexion: {formatDate(adminProfile.lastLogin)}
                  </span>
                )}
              </p>
            )}
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={() => setShowPasswordModal(true)}
              style={styles.profileButton}
            >
              Changer le mot de passe
            </button>
            <button onClick={logout} style={styles.logoutButton}>
              Déconnexion
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        {/* Message informatif sur Calendly */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📅 Gestion des rendez-vous</h3>
          <p style={styles.infoText}>
            Consultez votre tableau de bord Calendly pour voir vos réservations.
          </p>
          <a
            href="https://calendly.com/app/scheduled_events"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.calendlyLink}
          >
            Ouvrir Calendly →
          </a>
        </div>

        {/* Onglets */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'temoignage' ? styles.activeTabButton : {}),
              position: 'relative'
            }}
            onClick={() => setActiveTab('temoignage')}
          >
            Témoignages
            {pendingTemoignagesCount > 0 && (
              <span style={styles.tabBadge}>{pendingTemoignagesCount}</span>
            )}
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'contact' ? styles.activeTabButton : {}),
              position: 'relative'
            }}
            onClick={() => setActiveTab('contact')}
          >
            Messages de contact
            {unansweredMessagesCount > 0 && (
              <span style={styles.tabBadge}>{unansweredMessagesCount}</span>
            )}
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'profile' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab('profile')}
          >
            Mon Profil
          </button>
        </div>


        {/* Contenu des onglets */}
        <div>
          {activeTab === 'temoignage' && (
            <div style={styles.sectionContainer}>
              <h2 style={styles.sectionTitle}>Témoignages ({temoignages.length})</h2>
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <h3 style={styles.statNumber}>{temoignages.filter(t => t.status === 'pending').length}</h3>
                  <p style={styles.statLabel}>En attente</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statNumber}>{temoignages.filter(t => t.status === 'validated').length}</h3>
                  <p style={styles.statLabel}>Validés</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statNumber}>{temoignages.filter(t => t.status === 'rejected').length}</h3>
                  <p style={styles.statLabel}>Rejetés</p>
                </div>
              </div>

              {temoignages.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Aucun témoignage pour le moment</p>
                </div>
              ) : (
                <>
                  <div style={styles.itemGrid}>
                    {temoignages.map((t) => (
                      <div key={t._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <div>
                            <h3 style={styles.itemName}>{t.name}</h3>
                            <p style={styles.createdAt}>
                              Posté le {formatDate(t.createdAt)}
                            </p>
                          </div>
                          <div style={styles.statusActions}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                backgroundColor: getStatusColor(t.status)
                              }}
                            >
                              {getStatusTextTemoignage(t.status)}
                            </span>
                            {t.status === 'pending' && (
                              <div style={styles.actions}>
                                <button
                                  onClick={() => updateTemoignageStatus(t._id, 'validated')}
                                  disabled={updatingTemoignage === t._id}
                                  style={{ ...styles.actionButton, ...styles.confirmButton }}
                                >
                                  {updatingTemoignage === t._id ? '...' : '✅ Valider'}
                                </button>
                                <button
                                  onClick={() => updateTemoignageStatus(t._id, 'rejected')}
                                  disabled={updatingTemoignage === t._id}
                                  style={{ ...styles.actionButton, ...styles.cancelButton }}
                                >
                                  {updatingTemoignage === t._id ? '...' : '❌ Rejeter'}
                                </button>
                              </div>
                            )}
                            <button
                              style={styles.deleteButton}
                              onClick={() => confirmDeleteTemoignage(t._id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <div style={styles.itemInfo}>
                          <p><strong>Message:</strong> {t.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <PaginationComponent
                    currentPage={currentPageTemoignages}
                    totalPages={totalPagesTemoignages}
                    onPageChange={handleTemoignagePage}
                    type="temoignages"
                  />
                </>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={styles.sectionContainer}>
              <h2 style={styles.sectionTitle}>Messages de contact ({contactMessages.length})</h2>
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <h3 style={styles.statNumber}>{contactMessages.length}</h3>
                  <p style={styles.statLabel}>Total</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statNumber}>{contactMessages.filter(m => m.answered).length}</h3>
                  <p style={styles.statLabel}>Répondus</p>
                </div>
                <div style={styles.statCard}>
                  <h3 style={styles.statNumber}>{contactMessages.filter(m => !m.answered).length}</h3>
                  <p style={styles.statLabel}>À traiter</p>
                </div>
              </div>

              {contactMessages.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Aucun message de contact pour le moment</p>
                </div>
              ) : (
                <>
                  <div style={styles.itemGrid}>
                    {contactMessages.map((msg) => (
                      <div key={msg._id} style={styles.itemCard}>
                        <div style={styles.itemHeader}>
                          <div>
                            <h3 style={styles.itemName}>{msg.name}</h3>
                            <p style={styles.createdAt}>
                              Reçu le {formatDate(msg.createdAt)}
                            </p>
                          </div>
                          <div style={styles.statusActions}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                backgroundColor: msg.answered ? '#27ae60' : '#f39c12'
                              }}
                            >
                              {msg.answered ? 'Répondu' : 'À traiter'}
                            </span>
                            <button
                              style={{
                                ...styles.replyButton,
                                backgroundColor: msg.answered ? '#27ae60' : '#f39c12',
                                opacity: msg.answered ? 0.7 : 1,
                              }}
                              disabled={msg.answered}
                              onClick={() => handleReply(msg)}
                            >
                              {msg.answered ? 'Répondu' : 'Répondre'}
                            </button>
                            <button
                              style={styles.deleteButton}
                              onClick={() => confirmDelete(msg._id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <div style={styles.itemInfo}>
                          <p><strong>Email:</strong> {msg.email}</p>
                          <p><strong>Message:</strong> {msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <PaginationComponent
                    currentPage={currentPageMessages}
                    totalPages={totalPagesMessages}
                    onPageChange={handleMessagePage}
                    type="messages"
                  />
                </>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={styles.sectionContainer}>
              <h2 style={styles.sectionTitle}>Mon Profil</h2>

              {adminProfile ? (
                <div style={styles.profileContainer}>
                  <div style={styles.profileCard}>
                    <div style={styles.profileHeader}>
                      <div style={styles.profileAvatar}>
                        {adminProfile.email?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <h3 style={styles.profileEmail}>{adminProfile.email}</h3>
                        <p style={styles.profileRole}>Administrateur</p>
                      </div>
                    </div>

                    <div style={styles.profileStats}>
                      <div style={styles.profileStatItem}>
                        <strong>Membre depuis:</strong>
                        <span>{adminProfile.createdAt ? formatDate(adminProfile.createdAt) : 'N/A'}</span>
                      </div>
                      <div style={styles.profileStatItem}>
                        <strong>Dernière connexion:</strong>
                        <span>{adminProfile.lastLogin ? formatDate(adminProfile.lastLogin) : 'N/A'}</span>
                      </div>
                      <div style={styles.profileStatItem}>
                        <strong>Nombre de connexions:</strong>
                        <span>{adminProfile.loginCount || 0}</span>
                      </div>
                    </div>

                    <div style={styles.profileActions}>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        style={styles.changePasswordButton}
                      >
                        🔒 Changer le mot de passe
                      </button>
                      <button
                        onClick={fetchAdminProfile}
                        style={styles.refreshButton}
                      >
                        🔄 Actualiser les informations
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <p>Chargement du profil...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de changement de mot de passe */}
        {showPasswordModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, minWidth: '400px' }}>
              <h3 style={styles.modalTitle}>Changer le mot de passe</h3>

              <form onSubmit={handlePasswordSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    style={styles.formInput}
                    required
                    disabled={passwordLoading}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    style={styles.formInput}
                    required
                    minLength={8}
                    disabled={passwordLoading}
                  />
                  <small style={styles.formHint}>Minimum 8 caractères</small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    style={styles.formInput}
                    required
                    disabled={passwordLoading}
                  />
                </div>

                {passwordError && (
                  <div style={styles.passwordError}>
                    ❌ {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div style={styles.passwordSuccess}>
                    ✅ {passwordSuccess}
                  </div>
                )}

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    style={styles.modalCancelButton}
                    onClick={closePasswordModal}
                    disabled={passwordLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...styles.confirmButton,
                      opacity: passwordLoading ? 0.7 : 1
                    }}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Changement...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modales */}
        {showDeleteModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer ce message ?</p>
              <div style={styles.modalActions}>
                <button
                  style={styles.modalCancelButton}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button style={styles.deleteButton} onClick={handleDeleteConfirmed}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteTemoignageModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer ce témoignage ?</p>
              <div style={styles.modalActions}>
                <button
                  style={styles.modalCancelButton}
                  onClick={() => setShowDeleteTemoignageModal(false)}
                >
                  Annuler
                </button>
                <button style={styles.deleteButton} onClick={handleDeleteTemoignageConfirmed}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #48bb78',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '25px 30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(72, 187, 120, 0.1)',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  profileInfo: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '8px 0 0 0',
  },
  lastLogin: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    marginLeft: '8px',
  },
  profileButton: {
    padding: '10px 20px',
    backgroundColor: '#48bb78',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  title: {
    fontSize: '2.2rem',
    color: '#2d5a3d',
    margin: 0,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    margin: '5px 0 0 0',
  },
  logoutButton: {
    padding: '12px 24px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  infoBox: {
    backgroundColor: '#e6fffa',
    border: '1px solid #48bb78',
    borderRadius: '12px',
    padding: '20px 25px',
    marginBottom: '30px',
  },
  infoTitle: {
    color: '#2d5a3d',
    fontSize: '1.2rem',
    margin: '0 0 10px 0',
    fontWeight: '600',
  },
  infoText: {
    color: '#4a5568',
    margin: '0 0 15px 0',
    lineHeight: '1.5',
  },
  calendlyLink: {
    color: '#48bb78',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
  },
  tabs: {
    display: 'flex',
    gap: '5px',
    marginBottom: '30px',
  },
  tabButton: {
    padding: '15px 30px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '10px 10px 0 0',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  activeTabButton: {
    backgroundColor: '#fff',
    color: '#2d5a3d',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    color: '#2d5a3d',
    marginBottom: '25px',
    fontWeight: '600',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fafbfc',
    padding: '25px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  statNumber: {
    fontSize: '2rem',
    color: '#2d5a3d',
    margin: '0 0 5px 0',
    fontWeight: '700',
  },
  statLabel: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.95rem',
  },
  itemGrid: {
    display: 'grid',
    gap: '20px',
    marginBottom: '30px',
  },
  itemCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fafbfc',
    transition: 'all 0.2s ease',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    gap: '15px',
  },
  itemName: {
    fontSize: '1.2rem',
    color: '#2d5a3d',
    margin: 0,
    fontWeight: '600',
  },
  createdAt: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '5px 0 0 0',
    fontStyle: 'italic',
  },
  statusActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  confirmButton: {
    backgroundColor: '#48bb78',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
  },
  replyButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#fff',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: '#e74c3c',
    color: '#fff',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  itemInfo: {
    lineHeight: '1.6',
    color: '#4a5568',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    padding: '20px 0',
  },
  paginationButton: {
    padding: '10px 20px',
    backgroundColor: '#48bb78',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  paginationInfo: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '15px',
    padding: '30px',
    minWidth: '300px',
    maxWidth: '90vw',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  modalCancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
    fontSize: '1.1rem',
  },
  errorMessage: {
    padding: '15px 20px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '1rem',
  },
  // Profile styles
  profileContainer: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  profileCard: {
    backgroundColor: '#fafbfc',
    border: '1px solid #e2e8f0',
    borderRadius: '15px',
    padding: '30px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '20px',
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#48bb78',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: '1.5rem',
    color: '#2d5a3d',
    margin: '0 0 5px 0',
    fontWeight: '600',
  },
  profileRole: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  profileStats: {
    display: 'grid',
    gap: '15px',
    marginBottom: '30px',
  },
  profileStatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '1rem',
  },
  profileActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  changePasswordButton: {
    padding: '12px 24px',
    backgroundColor: '#48bb78',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  refreshButton: {
    padding: '12px 24px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  // Form styles
  modalTitle: {
    fontSize: '1.3rem',
    color: '#2d5a3d',
    marginBottom: '20px',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  formLabel: {
    display: 'block',
    fontSize: '1rem',
    color: '#374151',
    marginBottom: '8px',
    fontWeight: '500',
  },
  formInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  formHint: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '5px',
    display: 'block',
  },
  passwordError: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '0.95rem',
  },
  passwordSuccess: {
    padding: '12px 16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '0.95rem',
  },
  tabBadge: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 8px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    lineHeight: '1',
    display: 'inline-block',
    minWidth: '18px',
    textAlign: 'center',
  }
};