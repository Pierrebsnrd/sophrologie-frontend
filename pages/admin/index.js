import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [rdvs, setRdvs] = useState([]);
  const [temoignages, setTemoignages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]); // <-- Ajout
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
    try {
      const [rdvRes, temoignageRes, contactRes] = await Promise.all([
        api.get('/admin/rdv'),
        api.get('/admin/temoignages'),
        api.get('/admin/contact-messages'), // <-- Ajout
      ]);
      setRdvs(rdvRes.data);
      setTemoignages(temoignageRes.data);
      setContactMessages(contactRes.data); // <-- Ajout
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const updateRdvStatus = async (rdvId, newStatus) => {
    setUpdatingRdv(rdvId);
    try {
      await api.patch(`/admin/rdv/${rdvId}/status`, { status: newStatus });
      setRdvs(prev => prev.map(rdv =>
        rdv._id === rdvId ? { ...rdv, status: newStatus } : rdv
      ));
    } catch {
      setError('Erreur lors de la mise à jour du rendez-vous');
    } finally {
      setUpdatingRdv(null);
    }
  };

  const updateTemoignageStatus = async (temoignageId, newStatus) => {
    setUpdatingTemoignage(temoignageId);
    try {
      await api.patch(`/admin/temoignages/${temoignageId}/status`, { status: newStatus });
      setTemoignages(prev => prev.map(t =>
        t._id === temoignageId ? { ...t, status: newStatus } : t
      ));
    } catch {
      setError('Erreur lors de la mise à jour du témoignage');
    } finally {
      setUpdatingTemoignage(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'validated': return '#27ae60';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusTextRdv = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusTextTemoignage = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Ouvre la modale
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Supprime après confirmation
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

  // Ouvre la modale de suppression témoignage
  const confirmDeleteTemoignage = (id) => {
    setDeleteTemoignageId(id);
    setShowDeleteTemoignageModal(true);
  };

  // Supprime le témoignage après confirmation
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

        {/* Stats RDV */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3>{rdvs.filter(rdv => rdv.status === 'pending').length}</h3>
            <p>RDV En attente</p>
          </div>
          <div style={styles.statCard}>
            <h3>{rdvs.filter(rdv => rdv.status === 'confirmed').length}</h3>
            <p>RDV Confirmés</p>
          </div>
          <div style={styles.statCard}>
            <h3>{rdvs.filter(rdv => rdv.status === 'cancelled').length}</h3>
            <p>RDV Annulés</p>
          </div>
        </div>

        {/* Liste RDV */}
        <div style={styles.rdvList}>
          <h2 style={styles.sectionTitle}>Rendez-vous ({rdvs.length})</h2>

          {rdvs.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Aucun rendez-vous pour le moment</p>
            </div>
          ) : (
            <div style={styles.rdvGrid}>
              {rdvs.map((rdv) => (
                <div key={rdv._id} style={styles.rdvCard}>
                  <div style={styles.rdvHeader}>
                    <h3 style={styles.rdvName}>{rdv.name}</h3>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(rdv.status)
                      }}
                    >
                      {getStatusTextRdv(rdv.status)}
                    </span>
                  </div>

                  <div style={styles.rdvInfo}>
                    <p><strong>Email:</strong> {rdv.email}</p>
                    {rdv.phone && <p><strong>Téléphone:</strong> {rdv.phone}</p>}
                    <p><strong>Date:</strong> {formatDate(rdv.date)}</p>
                    {rdv.message && <p><strong>Message:</strong> {rdv.message}</p>}
                    <p style={styles.createdAt}>
                      Demandé le {formatDate(rdv.createdAt)}
                    </p>
                  </div>

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
              ))}
            </div>
          )}
        </div>

        {/* Liste Témoignages */}
        <div style={{ ...styles.rdvList, marginTop: '40px' }}>
          <h2 style={styles.sectionTitle}>Témoignages ({temoignages.length})</h2>

          {temoignages.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Aucun témoignage pour le moment</p>
            </div>
          ) : (
            <div style={styles.rdvGrid}>
              {temoignages.map((t) => (
                <div key={t._id} style={styles.rdvCard}>
                  <div style={styles.rdvHeader}>
                    <h3 style={styles.rdvName}>{t.author || t.name}</h3>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(t.status)
                      }}
                    >
                      {getStatusTextTemoignage(t.status)}
                    </span>
                    <button
                      style={styles.deleteButton}
                      onClick={() => confirmDeleteTemoignage(t._id)}
                    >
                      Supprimer
                    </button>
                  </div>

                  <div style={styles.rdvInfo}>
                    <p><strong>Message:</strong> {t.message}</p>
                    <p style={styles.createdAt}>
                      Posté le {formatDate(t.createdAt)}
                    </p>
                  </div>

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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liste Messages de contact */}
        <div style={{ ...styles.rdvList, marginTop: '40px' }}>
          <h2 style={styles.sectionTitle}>Messages de contact ({contactMessages.length})</h2>
          {contactMessages.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Aucun message de contact pour le moment</p>
            </div>
          ) : (
            <div style={styles.rdvGrid}>
              {contactMessages.map((msg) => (
                <div key={msg._id} style={styles.rdvCard}>
                  <div style={styles.rdvHeader}>
                    <h3 style={styles.rdvName}>{msg.name}</h3>
                    <div>
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
                    <p style={styles.createdAt}>
                      Reçu le {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modale de confirmation */}
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

        {/* Modale de confirmation suppression témoignage */}
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
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
};

// Ajoute la fonction handleReply (exemple simple) :
async function handleReply(msg) {
  // Ouvre le mail
  window.location.href = `mailto:${msg.email}?subject=Réponse à votre message`;

  // Met à jour le statut en BDD
  try {
    await api.patch(`/admin/contact-messages/${msg._id}/answered`);
    setContactMessages(prev =>
      prev.map(m => m._id === msg._id ? { ...m, answered: true } : m)
    );
  } catch (err) {
    setError('Erreur lors du changement de statut du message');
  }
}