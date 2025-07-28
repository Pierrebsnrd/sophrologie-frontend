import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'; // 👈 Ajout ici
import api from '../../utils/api';
import styles from '../../styles/login.module.css';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) router.replace('/admin');
  }, [router]);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await api.post('/admin/login', credentials);
    
    if (response.data.success) {
      const token = response.data.data.tokens?.accessToken;
      if (token) {
        localStorage.setItem('adminToken', token);
        router.replace('/admin');
      } else {
        setError('Token non reçu');
      }
    } else {
      setError(response.data.message || 'Erreur de connexion');
    }
  } catch (err) {
    console.error('Erreur de connexion:', err);
    setError(
      err.response?.data?.message ||
      'Erreur de connexion. Veuillez vérifier vos identifiants.'
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Connexion administrateur</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Administration</h2>
          <p className={styles.subtitle}>Connexion à l'espace administrateur</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={styles.input}
                placeholder="Adresse email"
                value={credentials.email}
                onChange={handleChange}
                disabled={loading}
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={styles.input}
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className={styles.errorBox}>
                <div className={styles.errorIcon}>⚠️</div>
                <div>
                  <h3 className={styles.errorTitle}>Erreur de connexion</h3>
                  <p className={styles.errorMessage}>{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <div className={styles.loadingWrapper}>
                  <div className={styles.spinner} />
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
