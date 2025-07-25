import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../utils/api';

export default function AdminDashboard() {
  // States simplifiés - plus de RDV
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    fetchData();
  }, [router]);

  // Fonction fetchData simplifiée - sans RDV
  const fetchData = async () => {
    setLoading(true);
    try {
      const [temoignageRes, contactRes] = await Promise.all([
        api.get('/admin/temoignages'),
        api.get('/admin/contact-messages'),
      ]);
      setTemoignages(temoignageRes.data);
      setContactMessages(contactRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions Témoignage (conservées)
  const updateTemoignageStatus = async (id, status) => {
    setUpdatingTemoignage(id);
    try {
      await api.patch(`/admin/temoignages/${id}/status`, { status });
      await fetchData();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingTemoignage(null);
    }
  };

  // Fonctions Contact (conservées)
  async function handleReply(msg) {
    window.location.href = `mailto:${msg.email}?subject=Réponse à votre message`;
    try {
      await api.patch(`/admin/contact-messages/${msg._id}/answered`);
      await fetchData();
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
      await fetchData();
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
      await fetchData();
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

  // Helpers (conservés)
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
          </div>
          <button onClick={logout} style={styles.logoutButton}>
            Déconnexion
          </button>
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

        {/* Onglets simplifiés */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'temoignage' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab('temoignage')}
          >
            Témoignages
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'contact' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab('contact')}
          >
            Messages de contact
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
              )}
            </div>
          )}
        </div>

        {/* Modales (conservées) */}
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

// Styles optimisés et modernisés
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
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
};