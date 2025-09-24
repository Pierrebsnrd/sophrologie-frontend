import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import api from "../../utils/api";
import { LoadingSpinner, Notification } from "../../components/ui";
import styles from "../../styles/pages/Login.module.css";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) router.replace("/admin");
  }, [router]);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    if (notification) setNotification(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (!credentials.email || !credentials.password) {
      setError("Veuillez remplir tous les champs.");
      showNotification("⚠️ Veuillez remplir tous les champs.", "error");
      return;
    }

    // PHASE 1 : Démarrer le chargement
    setLoading(true);
    setError("");
    setNotification(null);

    try {
      const response = await api.post("/admin/login", credentials);

      if (response.data.success) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("adminToken", token);

          // PHASE 2 : Notification de succès
          showNotification("Connexion réussie ! Redirection...", "success");

          // Petite pause pour voir la notification
          setTimeout(() => {
            router.replace("/admin");
          }, 1000);
        } else {
          setError("Token non reçu");
          showNotification(
            "❌ Erreur de sécurité. Contactez l'administrateur.",
            "error",
          );
        }
      } else {
        setError(response.data.error || "Erreur de connexion");
        showNotification(
          "❌ " + (response.data.error || "Identifiants incorrects"),
          "error",
        );
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Erreur de connexion. Veuillez vérifier vos identifiants.";
      setError(errorMessage);
      showNotification("❌ " + errorMessage, "error");
    } finally {
      // PHASE 3 : Arrêter le chargement
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion Admin - Stéphanie Habert Sophrologue</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Notification */}
      <Notification
        message={notification?.message}
        type={notification?.type}
        duration={4000}
        onClose={() => setNotification(null)}
      />

      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Administration</h1>
          <p className={styles.subtitle}>Accès réservé à l'administrateur</p>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
                className={styles.input}
              />
            </div>

            {/* Bouton avec LoadingSpinner */}
            <button
              type="submit"
              className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span>Connexion...</span>
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
