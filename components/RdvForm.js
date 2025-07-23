import React, { useState } from 'react';
import api from '../utils/api';
import styles from '../styles/RdvForm.module.css'; // ✅ Import correct du CSS module
import Image from 'next/image';

export default function RdvForms() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/rdv', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', date: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = today.toISOString().slice(0, 16);

  return (

    <div className={styles.pageContainer}>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <Image
          src="/bannieres/rdv.jpg"
          alt="Bureau"
          fill
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Prendre rendez-vous</h1>
        </div>
      </section>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Prendre rendez-vous</h1>
        <p className={styles.subtitle}>
          Remplissez le formulaire ci-dessous pour demander un rendez-vous.
          Nous vous confirmerons rapidement la disponibilité.
        </p>

        {success && (
          <div className={styles.successMessage}>
            ✅ Votre demande a été envoyée avec succès ! Vous recevrez un email de confirmation.
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nom complet *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@exemple.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Date et heure souhaitées *</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={minDate}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Message (optionnel)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Précisez vos besoins ou questions..."
              rows={4}
              className={styles.input}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
          </button>
        </form>
      </div>
    </div>
  );
}
