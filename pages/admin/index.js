import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('rdv');
  const [rdvs, setRdvs] = useState([]);
  const [temoignages, setTemoignages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingRdv, setUpdatingRdv] = useState(null);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rdvRes, temoignageRes, contactRes] = await Promise.all([
        api.get('/admin/rdv'),
        api.get('/admin/temoignages'),
        api.get('/admin/contact-messages'),
      ]);
      setRdvs(rdvRes.data);
      setTemoignages(temoignageRes.data);
      setContactMessages(contactRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // RDV
  const updateRdvStatus = async (id, status) => {
    setUpdatingRdv(id);
    try {
      await api.patch(`/admin/rdv/${id}/status`, { status });
      await fetchData();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingRdv(null);
    }
  };

  // Témoignage
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

  // Contact
  async function handleReply(msg) {
    window.location.href = `mailto:${msg.email}?subject=Réponse à votre message`;
    try {
      await api.patch(`/admin/contact-messages/${msg._id}/answered`);
      await fetchData();
    } catch (err) {
      setError('Erreur lors du changement de statut du message');
    }
  }

  // Suppression Contact
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

  // Suppression Témoignage
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

  // Logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    router.replace('/admin/login');
  };

  // Helpers
  const formatDate = (date) => new Date(date).toLocaleString('fr-FR');
  const getStatusColor = (status) => {
    if (status === 'pending') return '#f39c12';
    if (status === 'confirmed' || status === 'validated') return '#27ae60';
    if (status === 'cancelled' || status === 'rejected') return '#e74c3c';
    return '#7f8c8d';
  };
  const getStatusTextRdv = (status) => {
    if (status === 'pending') return 'En attente';
    if (status === 'confirmed') return 'Confirmé';
    if (status === 'cancelled') return 'Annulé';
    return status;
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
        <title>Page administrateur</title>
      </Head>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard Admin</h1>
          <button onClick={logout} style={styles.logoutButton}>
            Déconnexion
          </button>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        {/* Onglets */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === 'rdv' ? styles.activeTabButton : {}),
            }}
            onClick={() => setActiveTab('rdv')}
          >
            Rendez-vous
          </button>
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
            Contact
          </button>
        </div>

        {/* Contenu Onglet */}
        <div>
          {activeTab === 'rdv' && (
            <div style={styles.rdvList}>
              <h2 style={styles.sectionTitle}>Rendez-vous ({rdvs.length})</h2>
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <h3>{rdvs.filter(rdv => rdv.status === 'pending').length}</h3>
                  <p>En attente</p>
                </div>
                <div style={styles.statCard}>
                  <h3>{rdvs.filter(rdv => rdv.status === 'confirmed').length}</h3>
                  <p>Confirmés</p>
                </div>
                <div style={styles.statCard}>
                  <h3>{rdvs.filter(rdv => rdv.status === 'cancelled').length}</h3>
                  <p>Annulés</p>
                </div>
              </div>
              {rdvs.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Aucun rendez-vous pour le moment</p>
                </div>
              ) : (
                <div style={styles.rdvGrid}>
                  {rdvs.map((rdv) => (
                    <div key={rdv._id} style={styles.rdvCard}>
                      <div style={styles.rdvHeader}>
                        <div>
                          <h3 style={styles.rdvName}>{rdv.name}</h3>
                          <p style={styles.createdAt}>
                            Demandé le {formatDate(rdv.createdAt)}
                          </p>
                        </div>
                        <div style={styles.statusActions}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: getStatusColor(rdv.status)
                            }}
                          >
                            {getStatusTextRdv(rdv.status)}
                          </span>
                          {rdv.status === 'pending' && (
                            <div style={styles.actions}>
                              <button
                                onClick={() => updateRdvStatus(rdv._id, 'confirmed')}
                                disabled={updatingRdv === rdv._id}
                                style={{ ...styles.actionButton, ...styles.confirmButton }}
                              >
                                {updatingRdv === rdv._id ? '...' : '✅ Confirmer'}
                              </button>
                              <button
                                onClick={() => updateRdvStatus(rdv._id, 'cancelled')}
                                disabled={updatingRdv === rdv._id}
                                style={{ ...styles.actionButton, ...styles.cancelButton }}
                              >
                                {updatingRdv === rdv._id ? '...' : '❌ Annuler'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={styles.rdvInfo}>
                        <p><strong>Email:</strong> {rdv.email}</p>
                        {rdv.phone && <p><strong>Téléphone:</strong> {rdv.phone}</p>}
                        <p><strong>Date:</strong> {formatDate(rdv.date)}</p>
                        {rdv.message && <p><strong>Message:</strong> {rdv.message}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'temoignage' && (
            <div style={styles.rdvList}>
              <h2 style={styles.sectionTitle}>Témoignages ({temoignages.length})</h2>
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <h3>{temoignages.filter(t => t.status === 'pending').length}</h3>
                  <p>En attente</p>
                </div>
                <div style={styles.statCard}>
                  <h3>{temoignages.filter(t => t.status === 'validated').length}</h3>
                  <p>Validés</p>
                </div>
                <div style={styles.statCard}>
                  <h3>{temoignages.filter(t => t.status === 'rejected').length}</h3>
                  <p>Rejetés</p>
                </div>
              </div>
              {temoignages.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Aucun témoignage pour le moment</p>
                </div>
              ) : (
                <div style={styles.rdvGrid}>
                  {temoignages.map((t) => (
                    <div key={t._id} style={styles.rdvCard}>
                      <div style={styles.rdvHeader}>
                        <div>
                          <h3 style={styles.rdvName}>{t.name}</h3>
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
                      <div style={styles.rdvInfo}>
                        <p><strong>Message:</strong> {t.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={styles.rdvList}>
              <h2 style={styles.sectionTitle}>Messages de contact ({contactMessages.length})</h2>
              <div style={styles.stats}>
                <div style={styles.statCard}>
                  <h3>{contactMessages.length}</h3>
                  <p>Total</p>
                </div>
                <div style={styles.statCard}>
                  <h3>{contactMessages.filter(m => m.answered).length}</h3>
                  <p>Répondus</p>
                </div>
                <div style={styles.statCard}>
                  <h3>{contactMessages.filter(m => !m.answered).length}</h3>
                  <p>Non répondus</p>
                </div>
              </div>
              {contactMessages.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Aucun message de contact pour le moment</p>
                </div>
              ) : (
                <div style={styles.rdvGrid}>
                  {contactMessages.map((msg) => (
                    <div key={msg._id} style={styles.rdvCard}>
                      <div style={styles.rdvHeader}>
                        <div>
                          <h3 style={styles.rdvName}>{msg.name}</h3>
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
                              color: '#fff',
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
                      <div style={styles.rdvInfo}>
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

        {/* Modale suppression contact */}
        {showDeleteModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer ce message ?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  style={{
                    ...styles.cancelButton,
                    backgroundColor: '#f3f3f3',
                    color: '#2c3e50',
                    border: '1px solid #ccc',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(44,62,80,0.07)',
                  }}
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

        {/* Modale suppression témoignage */}
        {showDeleteTemoignageModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer ce témoignage ?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  style={styles.cancelButton}
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

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0,
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  },
  tabButton: {
    padding: '12px 32px',
    backgroundColor: '#f3f3f3',
    color: '#2c3e50',
    border: '1px solid #ccc',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  activeTabButton: {
    backgroundColor: '#fff',
    color: '#2980b9',
    borderBottom: '2px solid #2980b9',
    boxShadow: '0 -2px 10px rgba(44,62,80,0.07)',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  rdvList: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  rdvGrid: {
    display: 'grid',
    gap: '20px',
  },
  rdvCard: {
    border: '1px solid #e1e8ed',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#fefefe',
  },
  rdvHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  rdvName: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    margin: 0,
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginRight: '10px',
  },
  statusActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  rdvInfo: {
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  createdAt: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'opacity 0.3s ease',
  },
  confirmButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#f3f3f3',
    color: '#2c3e50',
    border: '1px solid #ccc',
    padding: '8px 18px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    marginLeft: '10px',
    boxShadow: '0 2px 6px rgba(44,62,80,0.07)',
    transition: 'background 0.3s',
  },
  replyButton: {
    padding: '8px 18px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginLeft: '10px',
    transition: 'background 0.3s',
  },
  deleteButton: {
    padding: '8px 18px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginLeft: '10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    transition: 'background 0.3s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '10px',
    padding: '30px',
    minWidth: '300px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#7f8c8d',
  },
  errorMessage: {
    padding: '15px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    marginBottom: '20px',
  },
};