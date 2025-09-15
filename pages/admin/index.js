import React, { useState, useEffect } from "react";
import styles from "../../styles/pages/Index.module.css";
import Head from "next/head";
import { useRouter } from "next/router";
import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import Notification from "../../components/Notification";

export default function AdminDashboard() {
  // States
  const [activeTab, setActiveTab] = useState("temoignage");
  const [temoignages, setTemoignages] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTemoignage, setUpdatingTemoignage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteTemoignageModal, setShowDeleteTemoignageModal] = useState(false);
  const [deleteTemoignageId, setDeleteTemoignageId] = useState(null);
  
  // États pour les notifications
  const [notification, setNotification] = useState(null);

  const pendingTemoignagesCount = temoignages.filter((t) => t.status === "pending").length;
  const unansweredMessagesCount = contactMessages.filter((m) => !m.answered).length;

  // Pagination states
  const [currentPageTemoignages, setCurrentPageTemoignages] = useState(1);
  const [totalPagesTemoignages, setTotalPagesTemoignages] = useState(1);
  const [currentPageMessages, setCurrentPageMessages] = useState(1);
  const [totalPagesMessages, setTotalPagesMessages] = useState(1);

  // Profile & Password states
  const [adminProfile, setAdminProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const router = useRouter();

  // Fonction pour afficher les notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    fetchData();
    fetchAdminProfile();
  }, [router]);

  const fetchData = async (temoignagePage = 1, messagePage = 1) => {
    setLoading(true);
    setError("");
    try {
      const [temoignageRes, contactRes] = await Promise.all([
        api.get(`/admin/temoignages?page=${temoignagePage}&limit=10`),
        api.get(`/admin/contact-messages?page=${messagePage}&limit=10`),
      ]);

      if (temoignageRes.data.success) {
        setTemoignages(temoignageRes.data.data.temoignages || []);
        setTotalPagesTemoignages(temoignageRes.data.data.pagination?.totalPages || 1);
        setCurrentPageTemoignages(temoignageRes.data.data.pagination?.currentPage || 1);
      } else {
        setTemoignages(Array.isArray(temoignageRes.data) ? temoignageRes.data : []);
      }

      if (contactRes.data.success) {
        setContactMessages(contactRes.data.data.messages || []);
        setTotalPagesMessages(contactRes.data.data.pagination?.totalPages || 1);
        setCurrentPageMessages(contactRes.data.data.pagination?.currentPage || 1);
      } else {
        setContactMessages(Array.isArray(contactRes.data) ? contactRes.data : []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
      } else {
        setError("Erreur lors du chargement des données: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await api.get("/admin/profile");
      if (response.data.success) {
        setAdminProfile(response.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
      }
    }
  };

  const handleTemoignagePage = (page) => {
    fetchData(page, currentPageMessages);
  };

  const handleMessagePage = (page) => {
    fetchData(currentPageTemoignages, page);
  };

  const updateTemoignageStatus = async (id, status) => {
    setUpdatingTemoignage(id);
    try {
      await api.patch(`/admin/temoignages/${id}/status`, { status });
      await fetchData(currentPageTemoignages, currentPageMessages);
      
      // Notification de succès
      const statusText = status === 'validated' ? 'approuvé' : 'rejeté';
      showNotification(`Témoignage ${statusText} avec succès !`, 'success');
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
      showNotification("Erreur lors de la mise à jour", 'error');
    } finally {
      setUpdatingTemoignage(null);
    }
  };

  const handleReply = async (msg) => {
    const subject = encodeURIComponent(`Réponse à votre message`);
    const body = encodeURIComponent(
      `Bonjour ${msg.name},\n\nCordialement,\nStéphanie Habert\nSophrologue\n06 11 42 17 65`,
    );

    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;

    try {
      await api.patch(`/admin/contact-messages/${msg._id}/answered`);
      await fetchData(currentPageTemoignages, currentPageMessages);
      showNotification("Message marqué comme répondu", 'info');
    } catch (err) {
      setError("Erreur lors du changement de statut du message");
      showNotification("Erreur lors de la mise à jour", 'error');
    }
  };

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
      showNotification("Message supprimé", 'info');
    } catch (err) {
      setError("Erreur lors de la suppression du message");
      showNotification("Erreur lors de la suppression", 'error');
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
      showNotification("Témoignage supprimé", 'info');
    } catch (err) {
      setError("Erreur lors de la suppression du témoignage");
      showNotification("Erreur lors de la suppression", 'error');
      setShowDeleteTemoignageModal(false);
      setDeleteTemoignageId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setPasswordLoading(true);
    setPasswordError("");
    try {
      await api.patch("/admin/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Mot de passe changé avec succès");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const formatDate = (date) => new Date(date).toLocaleString("fr-FR");

  const getStatusBadgeClass = (status) => {
    if (status === "pending") return styles.statusPending;
    if (status === "validated") return styles.statusApproved;
    if (status === "rejected") return styles.statusRejected;
    return styles.statusBadge;
  };

  const getStatusTextTemoignage = (status) => {
    if (status === "pending") return "En attente";
    if (status === "validated") return "Validé";
    if (status === "rejected") return "Rejeté";
    return status;
  };

  const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
      <div className={styles.paginationContainer}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={styles.paginationButton}
        >
          Précédent
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={styles.paginationButton}
        >
          Suivant
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Chargement du dashboard..." color="primary" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Dashboard Admin - Stéphanie Habert Sophrologue</title>
      </Head>

      {/* Notifications */}
      <Notification
        message={notification?.message}
        type={notification?.type}
        duration={4000}
        onClose={() => setNotification(null)}
      />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Dashboard Admin</h1>
            <p className={styles.subtitle}>Gestion des témoignages et messages</p>
            {adminProfile && (
              <p className={styles.profileInfo}>
                Connecté en tant que: <strong>{adminProfile.email}</strong>
                {adminProfile.lastLogin && (
                  <span className={styles.lastLogin}>
                    • Dernière connexion: {formatDate(adminProfile.lastLogin)}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className={styles.headerActions}>
            <button onClick={logout} className={styles.logoutButton}>
              Déconnexion
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* INFO BOX */}
        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Gestion des rendez-vous</h3>
          <p className={styles.infoText}>
            Consultez votre tableau de bord Resalib pour voir vos réservations.
          </p>
          <a
            href="https://www.resalib.fr/bo/home"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resalibLink}
          >
            Ouvrir Resalib →
          </a>
        </div>

        {/* TABS NAVIGATION */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "temoignage" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("temoignage")}
          >
            Témoignages
            {pendingTemoignagesCount > 0 && (
              <span className={styles.tabBadge}>{pendingTemoignagesCount}</span>
            )}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "contact" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Messages de contact
            {unansweredMessagesCount > 0 && (
              <span className={styles.tabBadge}>{unansweredMessagesCount}</span>
            )}
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.activeTabButton : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Mon Profil
          </button>
        </div>

        {/* TAB CONTENT */}
        <div>
          {/* TÉMOIGNAGES TAB */}
          {activeTab === "temoignage" && (
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>Témoignages ({temoignages.length})</h2>
              
              {/* STATS */}
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>
                    {temoignages.filter((t) => t.status === "pending").length}
                  </h3>
                  <p className={styles.statLabel}>En attente</p>
                </div>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>
                    {temoignages.filter((t) => t.status === "validated").length}
                  </h3>
                  <p className={styles.statLabel}>Validés</p>
                </div>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>
                    {temoignages.filter((t) => t.status === "rejected").length}
                  </h3>
                  <p className={styles.statLabel}>Rejetés</p>
                </div>
              </div>

              {temoignages.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Aucun témoignage pour le moment</p>
                </div>
              ) : (
                <>
                  <div className={styles.itemsGrid}>
                    {temoignages.map((t) => (
                      <div key={t._id} className={styles.item}>
                        <div className={styles.itemHeader}>
                          <div>
                            <h3 className={styles.itemTitle}>{t.name}</h3>
                            <p className={styles.itemMeta}>Posté le {formatDate(t.createdAt)}</p>
                          </div>
                          <div className={styles.itemActions}>
                            <span className={`${styles.statusBadge} ${getStatusBadgeClass(t.status)}`}>
                              {getStatusTextTemoignage(t.status)}
                            </span>
                            {t.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateTemoignageStatus(t._id, "validated")}
                                  disabled={updatingTemoignage === t._id}
                                  className={`${styles.actionButton} ${styles.approveButton}`}
                                >
                                  {updatingTemoignage === t._id ? "..." : "Valider"}
                                </button>
                                <button
                                  onClick={() => updateTemoignageStatus(t._id, "rejected")}
                                  disabled={updatingTemoignage === t._id}
                                  className={`${styles.actionButton} ${styles.rejectButton}`}
                                >
                                  {updatingTemoignage === t._id ? "..." : "Rejeter"}
                                </button>
                              </>
                            )}
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => confirmDeleteTemoignage(t._id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <div className={styles.itemInfo}>
                          <p><strong>Message:</strong> {t.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <PaginationComponent
                    currentPage={currentPageTemoignages}
                    totalPages={totalPagesTemoignages}
                    onPageChange={handleTemoignagePage}
                  />
                </>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "contact" && (
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>Messages de contact ({contactMessages.length})</h2>
              
              {/* STATS */}
              <div className={styles.stats}>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>{contactMessages.length}</h3>
                  <p className={styles.statLabel}>Total</p>
                </div>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>
                    {contactMessages.filter((m) => m.answered).length}
                  </h3>
                  <p className={styles.statLabel}>Répondus</p>
                </div>
                <div className={styles.statCard}>
                  <h3 className={styles.statNumber}>
                    {contactMessages.filter((m) => !m.answered).length}
                  </h3>
                  <p className={styles.statLabel}>À traiter</p>
                </div>
              </div>

              {contactMessages.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Aucun message de contact pour le moment</p>
                </div>
              ) : (
                <>
                  <div className={styles.itemsGrid}>
                    {contactMessages.map((msg) => (
                      <div key={msg._id} className={styles.item}>
                        <div className={styles.itemHeader}>
                          <div>
                            <h3 className={styles.itemTitle}>{msg.name}</h3>
                            <p className={styles.itemMeta}>Reçu le {formatDate(msg.createdAt)}</p>
                          </div>
                          <div className={styles.itemActions}>
                            <span className={`${styles.statusBadge} ${msg.answered ? styles.statusApproved : styles.statusPending}`}>
                              {msg.answered ? "Répondu" : "À traiter"}
                            </span>
                            <button
                              className={`${styles.actionButton} ${styles.replyButton}`}
                              disabled={msg.answered}
                              onClick={() => handleReply(msg)}
                            >
                              {msg.answered ? "Répondu" : "Répondre"}
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.deleteButton}`}
                              onClick={() => confirmDelete(msg._id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        <div className={styles.itemInfo}>
                          <p><strong>Email:</strong> <a href={`mailto:${msg.email}`}>{msg.email}</a></p>
                          <p><strong>Téléphone:</strong> <a href={`tel:${msg.phone}`}>{msg.phone}</a></p>
                          <p><strong>Message:</strong> {msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <PaginationComponent
                    currentPage={currentPageMessages}
                    totalPages={totalPagesMessages}
                    onPageChange={handleMessagePage}
                  />
                </>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>Mon Profil</h2>
              {adminProfile ? (
                <div className={styles.profileContainer}>
                  <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                      <div className={styles.profileAvatar}>
                        {adminProfile.email?.[0]?.toUpperCase() || "A"}
                      </div>
                      <div>
                        <h3 className={styles.profileEmail}>{adminProfile.email}</h3>
                        <p className={styles.profileRole}>Administrateur</p>
                      </div>
                    </div>
                    <div className={styles.profileStats}>
                      <div className={styles.profileStatItem}>
                        <strong>Membre depuis:</strong>
                        <span>
                          {adminProfile.createdAt ? formatDate(adminProfile.createdAt) : "Date non disponible"}
                        </span>
                      </div>
                      <div className={styles.profileStatItem}>
                        <strong>Dernière connexion:</strong>
                        <span>
                          {adminProfile.lastLogin ? formatDate(adminProfile.lastLogin) : "Jamais connecté"}
                        </span>
                      </div>
                      <div className={styles.profileStatItem}>
                        <strong>Nombre de connexions:</strong>
                        <span>{adminProfile.loginCount || 0}</span>
                      </div>
                    </div>
                    <div className={styles.profileActions}>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className={styles.changePasswordButton}
                      >
                        Changer le mot de passe
                      </button>
                      <button onClick={fetchAdminProfile} className={styles.refreshButton}>
                        Actualiser les informations
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Chargement du profil...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODALS */}
        {showPasswordModal && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${styles.passwordModal}`}>
              <div className={styles.modalIcon}>
                <div className={styles.securityIcon}>🔒</div>
              </div>
              <h3 className={styles.modalTitle}>Changer le mot de passe</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={styles.formInput}
                    required
                    disabled={passwordLoading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={styles.formInput}
                    required
                    minLength={8}
                    disabled={passwordLoading}
                  />
                  <small className={styles.formHint}>Minimum 8 caractères</small>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={styles.formInput}
                    required
                    disabled={passwordLoading}
                  />
                </div>
                {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
                {passwordSuccess && <div className={styles.passwordSuccess}>{passwordSuccess}</div>}
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.modalCancelButton}
                    onClick={closePasswordModal}
                    disabled={passwordLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={styles.confirmButton}
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <LoadingSpinner size="small" color="white" />
                        <span>Changement...</span>
                      </>
                    ) : (
                      "Changer le mot de passe"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <div className={styles.dangerIcon}>⚠️</div>
              </div>
              <h3 className={styles.modalTitle}>Supprimer le message</h3>
              <p className={styles.modalDescription}>
                Cette action est irréversible. Le message sera définitivement supprimé 
                de la base de données.
              </p>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalCancelButton}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton} ${styles.modalDeleteButton}`} 
                  onClick={handleDeleteConfirmed}
                >
                  <span>🗑️</span>
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteTemoignageModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                <div className={styles.dangerIcon}>⚠️</div>
              </div>
              <h3 className={styles.modalTitle}>Supprimer le témoignage</h3>
              <p className={styles.modalDescription}>
                Cette action est irréversible. Le témoignage sera définitivement supprimé 
                et ne pourra plus être récupéré.
              </p>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalCancelButton}
                  onClick={() => setShowDeleteTemoignageModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton} ${styles.modalDeleteButton}`} 
                  onClick={handleDeleteTemoignageConfirmed}
                >
                  <span>🗑️</span>
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}