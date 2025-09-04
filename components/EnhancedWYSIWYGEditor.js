// components/EnhancedWYSIWYGEditor.js - Version complète et corrigée
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import TestimonialForm from './TestimonialForm';
import TestimonialCard from './TestimonialCard';
import Calendly from './Calendly';
import Map from './Map';
import api from '../utils/api';
import styles from '../styles/components/EnhancedWYSIWYGEditor.module.css';

const EnhancedWYSIWYGEditor = ({ pageId }) => {
  // États principaux
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // États pour les modes et modals
  const [currentMode, setCurrentMode] = useState('wysiwyg');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [versionComment, setVersionComment] = useState('');

  // États pour l'édition inline
  const [editingElement, setEditingElement] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Références
  const autoSaveIntervalRef = useRef(null);
  const lastAutoSaveRef = useRef(null);

  // Configuration des noms de pages
  const pageNames = {
    home: 'Accueil',
    about: 'Qui suis-je ?',
    pricing: 'Tarifs',
    appointment: 'Prendre rendez-vous',
    testimonials: 'Témoignages',
    contact: 'Contact',
    ethics: 'Charte éthique'
  };

  // Chargement des données de la page
  const fetchPageData = useCallback(async () => {
    if (!pageId) return;

    try {
      setLoading(true);
      const response = await api.get(`/admin/pages/${pageId}?includeVersions=true`);
      
      if (response.data.success) {
        const data = response.data.data;
        setPageData(data);
        setVersions(data.versions || []);
        setLastSaved(data.lastModified);
        setError(null);
      } else {
        setError('Erreur lors du chargement de la page');
      }
    } catch (err) {
      console.error('Erreur chargement page:', err);
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  // Système d'auto-sauvegarde
  useEffect(() => {
    if (!pageData || !hasUnsavedChanges) return;

    // Nettoyer l'intervalle précédent
    if (autoSaveIntervalRef.current) {
      clearTimeout(autoSaveIntervalRef.current);
    }

    // Planifier l'auto-sauvegarde dans 30 secondes
    autoSaveIntervalRef.current = setTimeout(async () => {
      if (hasUnsavedChanges && pageData) {
        await handleAutoSave();
      }
    }, 30000);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearTimeout(autoSaveIntervalRef.current);
      }
    };
  }, [hasUnsavedChanges, pageData]);

  // Auto-sauvegarde
  const handleAutoSave = useCallback(async () => {
    if (!pageData || saving || autoSaving) return;

    try {
      setAutoSaving(true);
      
      const draftData = {
        title: pageData.title,
        metaDescription: pageData.metaDescription,
        sections: pageData.sections
      };

      await api.post(`/admin/pages/${pageId}/draft`, draftData);
      
      setLastSaved(new Date());
      lastAutoSaveRef.current = new Date();
      console.log('✅ Auto-sauvegarde réussie');
    } catch (err) {
      console.error('❌ Erreur auto-sauvegarde:', err);
    } finally {
      setAutoSaving(false);
    }
  }, [pageData, pageId, saving, autoSaving]);

  // Sauvegarde manuelle
  const handleSave = useCallback(async (comment = '') => {
    if (!pageData || saving) return;

    try {
      setSaving(true);
      
      const updateData = {
        title: pageData.title,
        metaDescription: pageData.metaDescription,
        sections: pageData.sections,
        status: pageData.status || 'published'
      };

      const queryParams = comment ? `?comment=${encodeURIComponent(comment)}` : '';
      const response = await api.put(`/admin/pages/${pageId}${queryParams}`, updateData);

      if (response.data.success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        
        // Rafraîchir les versions
        await fetchVersions();
        
        console.log('✅ Sauvegarde réussie');
      }
    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      setError(err.response?.data?.message || 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }, [pageData, pageId, saving]);

  // Chargement des versions
  const fetchVersions = useCallback(async () => {
    try {
      const response = await api.get(`/admin/pages/${pageId}/versions`);
      if (response.data.success) {
        setVersions(response.data.data.versions);
      }
    } catch (err) {
      console.error('Erreur chargement versions:', err);
    }
  }, [pageId]);

  // Gestion du drag & drop
  const handleDragEnd = useCallback((result) => {
    if (!result.destination || !pageData) return;

    const sections = Array.from(pageData.sections);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    // Mettre à jour les indices d'ordre
    sections.forEach((section, index) => {
      section.order = index;
    });

    setPageData(prev => ({ ...prev, sections }));
    setHasUnsavedChanges(true);
  }, [pageData]);

  // Édition inline
  const startEditing = useCallback((sectionId, field, currentValue) => {
    setEditingElement(`${sectionId}-${field}`);
    setEditingValue(currentValue || '');
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingElement || !pageData) return;

    const [sectionId, field] = editingElement.split('-');
    
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return { ...section, [field]: editingValue };
        }
        return section;
      })
    }));

    setEditingElement(null);
    setEditingValue('');
    setHasUnsavedChanges(true);
  }, [editingElement, editingValue, pageData]);

  const cancelEdit = useCallback(() => {
    setEditingElement(null);
    setEditingValue('');
  }, []);

  // Restauration de version
  const handleRestoreVersion = useCallback(async () => {
    if (!selectedVersion) return;

    try {
      const response = await api.post(
        `/admin/pages/${pageId}/versions/${selectedVersion.versionNumber}/restore`,
        { comment: versionComment || `Restauration vers version ${selectedVersion.versionNumber}` }
      );

      if (response.data.success) {
        await fetchPageData();
        setShowVersionModal(false);
        setSelectedVersion(null);
        setVersionComment('');
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error('Erreur restauration:', err);
      setError(err.response?.data?.message || 'Erreur de restauration');
    }
  }, [selectedVersion, versionComment, pageId, fetchPageData]);

  // Rendu des sections WYSIWYG avec style fidèle au site public
  const renderWYSIWYGSection = useCallback((section, index) => {
    const isEditing = editingElement?.startsWith(section.id);

    // Section Hero
    if (section.type === 'hero') {
      return (
        <section className={`${styles.publicHero} ${isEditing ? styles.editingMode : ''}`}>
          {section.image?.url && (
            <Image
              src={section.image.url}
              alt={section.image.alt || section.title || 'Image hero'}
              fill
              priority
              className={styles.publicHeroImage}
            />
          )}
          <div className={styles.publicHeroOverlay}>
            {section.title && (
              <EditableText
                value={section.title}
                onEdit={(value) => startEditing(section.id, 'title', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-title`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicHeroTitle}
                placeholder="Titre principal..."
              />
            )}
            {section.subtitle && (
              <EditableText
                value={section.subtitle}
                onEdit={(value) => startEditing(section.id, 'subtitle', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-subtitle`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicHeroSubtitle}
                placeholder="Sous-titre..."
              />
            )}
          </div>
        </section>
      );
    }

    // Section Texte
    if (section.type === 'text') {
      const sectionClasses = `${styles.publicSection} ${
        section.settings?.backgroundColor === '#f0fdfa' ? styles.publicSectionAlt : ''
      }`;

      return (
        <section 
          className={sectionClasses}
          style={{
            textAlign: section.settings?.alignment || 'center',
            backgroundColor: section.settings?.backgroundColor,
            color: section.settings?.textColor
          }}
        >
          <div className={styles.publicSectionInner}>
            {section.title && (
              <EditableText
                value={section.title}
                onEdit={(value) => startEditing(section.id, 'title', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-title`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicSectionTitle}
                placeholder="Titre de section..."
              />
            )}
            {section.content && (
              <EditableText
                value={section.content}
                onEdit={(value) => startEditing(section.id, 'content', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-content`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicTextContent}
                placeholder="Contenu de la section..."
                multiline
              />
            )}
          </div>
        </section>
      );
    }

    // Section Grille de cartes
    if (section.type === 'card-grid') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            {section.title && (
              <EditableText
                value={section.title}
                onEdit={(value) => startEditing(section.id, 'title', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-title`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicSectionTitle}
                placeholder="Titre de section..."
              />
            )}
            {section.content && (
              <EditableText
                value={section.content}
                onEdit={(value) => startEditing(section.id, 'content', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-content`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicBenefitHighlight}
                placeholder="Description..."
              />
            )}
            {section.items && section.items.length > 0 && (
              <div className={styles.publicGrid}>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.publicCard}>
                    {item.image?.url && (
                      <div className={styles.publicCardImage}>
                        <Image
                          src={item.image.url}
                          alt={item.image.alt || item.title || ''}
                          width={300}
                          height={200}
                        />
                      </div>
                    )}
                    {item.title && <h3 className={styles.publicCardTitle}>{item.title}</h3>}
                    {item.content && <p className={styles.publicCardContent}>{item.content}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    // Section Tarifs - CORRECTION IMPORTANTE
    if (section.type === 'pricing-table') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            {section.title && (
              <EditableText
                value={section.title}
                onEdit={(value) => startEditing(section.id, 'title', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-title`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicSectionTitle}
                placeholder="Titre des tarifs..."
              />
            )}
            {section.content && (
              <EditableText
                value={section.content}
                onEdit={(value) => startEditing(section.id, 'content', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-content`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicIntro}
                placeholder="Introduction..."
              />
            )}
            {section.items && section.items.length > 0 && (
              <div className={styles.publicPricingList}>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.publicPricingItem}>
                    <div className={styles.publicPricingHeader}>
                      {item.title && <h3 className={styles.publicPricingTitle}>{item.title}</h3>}
                      {item.price && <span className={styles.publicPricingPrice}>{item.price}</span>}
                    </div>
                    {item.content && <p className={styles.publicPricingDescription}>{item.content}</p>}
                    {item.duration && <p className={styles.publicPricingDuration}>{item.duration}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    // Section CTA
    if (section.type === 'cta') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            {section.title && (
              <EditableText
                value={section.title}
                onEdit={(value) => startEditing(section.id, 'title', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-title`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicSectionTitle}
                placeholder="Titre CTA..."
              />
            )}
            {section.content && (
              <EditableText
                value={section.content}
                onEdit={(value) => startEditing(section.id, 'content', value)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                isEditing={editingElement === `${section.id}-content`}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                className={styles.publicCtaParagraph}
                placeholder="Description CTA..."
              />
            )}
            {section.buttons && section.buttons.length > 0 && (
              <div className={styles.publicCtaButtons}>
                {section.buttons.map((button, buttonIndex) => (
                  <Link key={buttonIndex} href={button.url || '#'}>
                    <span className={`${styles.publicButton} ${
                      button.style === 'secondary' ? styles.publicButtonSecondary : ''
                    }`}>
                      {button.text}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    // Section Image + Texte
    if (section.type === 'image-text') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicImageTextContainer}>
            {section.image?.url && (
              <div className={styles.publicImageContainer}>
                <Image
                  src={section.image.url}
                  alt={section.image.alt || section.title || ''}
                  width={300}
                  height={300}
                  className={styles.publicProfileImage}
                />
              </div>
            )}
            <div className={styles.publicTextContainer}>
              {section.title && (
                <EditableText
                  value={section.title}
                  onEdit={(value) => startEditing(section.id, 'title', value)}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  isEditing={editingElement === `${section.id}-title`}
                  editingValue={editingValue}
                  setEditingValue={setEditingValue}
                  className={styles.publicTitle}
                  placeholder="Titre..."
                />
              )}
              {section.content && (
                <EditableText
                  value={section.content}
                  onEdit={(value) => startEditing(section.id, 'content', value)}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                  isEditing={editingElement === `${section.id}-content`}
                  editingValue={editingValue}
                  setEditingValue={setEditingValue}
                  className={styles.publicTextContent}
                  placeholder="Contenu..."
                  multiline
                />
              )}
            </div>
          </div>
        </section>
      );
    }

    // Section Listes (pour charte éthique)
    if (section.type === 'list-sections') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            {section.sections && section.sections.map((listSection, listIndex) => (
              <div key={listIndex} className={styles.publicListSection}>
                <h3 className={styles.publicListSectionTitle}>{listSection.title}</h3>
                {listSection.items && (
                  <ul className={styles.publicEthicsList}>
                    {listSection.items.map((item, itemIndex) => (
                      <li key={itemIndex} className={styles.publicEthicsListItem}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    // Section Témoignages
    if (section.type === 'testimonial-list') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <div className={styles.publicTestimonialsGrid}>
              {/* Témoignages statiques */}
              {section.staticTestimonials && section.staticTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`static-${index}`}
                  message={testimonial.message}
                  author={testimonial.author}
                  date={testimonial.date}
                />
              ))}
            </div>
            <div className={styles.publicLoadMoreContainer}>
              <button className={styles.publicLoadMoreButton}>
                Voir plus de témoignages
              </button>
            </div>
          </div>
        </section>
      );
    }

    // Composants spéciaux
    if (section.type === 'contact-info') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <ContactInfo />
          </div>
        </section>
      );
    }

    if (section.type === 'testimonial-form') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <TestimonialForm />
          </div>
        </section>
      );
    }

    if (section.type === 'appointment-widget') {
      return <Calendly />;
    }

    if (section.type === 'contact-form-map') {
      return (
        <section className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <div className={styles.publicContactFormMapContainer}>
              <ContactForm />
              <Map />
            </div>
          </div>
        </section>
      );
    }

    // Section non supportée avec diagnostic
    return (
      <section className={styles.unsupportedSection}>
        <h3>⚠️ Section non supportée</h3>
        <p>Type: <code>{section.type}</code></p>
        <p>Cette section n'est pas encore implémentée dans l'éditeur visuel.</p>
        
        <details className={styles.debugInfo}>
          <summary>Informations de débogage</summary>
          <pre>{JSON.stringify(section, null, 2)}</pre>
        </details>
      </section>
    );
  }, [editingElement, editingValue, startEditing, saveEdit, cancelEdit]);

  // Composant pour l'édition de texte inline
  const EditableText = ({ 
    value, 
    onEdit, 
    onSave, 
    onCancel, 
    isEditing, 
    editingValue, 
    setEditingValue, 
    className, 
    placeholder,
    multiline = false
  }) => {
    if (isEditing) {
      return (
        <div className={styles.editingWrapper}>
          {multiline ? (
            <textarea
              className={styles.editingTextarea}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  onSave();
                } else if (e.key === 'Escape') {
                  onCancel();
                }
              }}
              placeholder={placeholder}
              autoFocus
            />
          ) : (
            <input
              type="text"
              className={styles.editingInput}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave();
                } else if (e.key === 'Escape') {
                  onCancel();
                }
              }}
              onBlur={onSave}
              placeholder={placeholder}
              autoFocus
            />
          )}
          <div className={styles.editingHint}>
            {multiline ? 'Ctrl+Entrée pour sauver, Échap pour annuler' : 'Entrée pour sauver, Échap pour annuler'}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`${styles.editableElement} ${className}`}
        onClick={() => onEdit(value)}
      >
        {value || <span className={styles.placeholder}>{placeholder}</span>}
        <span className={styles.editIcon}>✏️</span>
      </div>
    );
  };

  // Indicateur de statut
  const getStatusIndicator = useMemo(() => {
    if (saving) {
      return <div className={styles.savingIndicator}>💾 Sauvegarde...</div>;
    }
    if (autoSaving) {
      return <div className={styles.autoSavingIndicator}>💾 Auto-sauvegarde...</div>;
    }
    if (hasUnsavedChanges) {
      return <div className={styles.unsavedIndicator}>⚠️ Modifications non sauvées</div>;
    }
    if (lastSaved) {
      const timeSaved = new Date(lastSaved).toLocaleTimeString();
      return <div className={styles.savedIndicator}>✅ Sauvé à {timeSaved}</div>;
    }
    return null;
  }, [saving, autoSaving, hasUnsavedChanges, lastSaved]);

  // Rendu de l'erreur
  if (error) {
    return (
      <div className={styles.wysiwygEditor}>
        <div className={styles.errorBanner}>
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      </div>
    );
  }

  // Rendu du chargement
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement de l'éditeur...</p>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className={styles.wysiwygEditor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour
          </Link>
        </div>

        <div className={styles.toolbarCenter}>
          <h1 className={styles.pageTitle}>
            {pageNames[pageId] || pageId}
          </h1>
          {getStatusIndicator}
        </div>

        <div className={styles.toolbarRight}>
          <button
            className={`${styles.modeButton} ${currentMode === 'wysiwyg' ? styles.active : ''}`}
            onClick={() => setCurrentMode('wysiwyg')}
          >
            👁️ Visuel
          </button>

          <button
            className={`${styles.modeButton} ${currentMode === 'structure' ? styles.active : ''}`}
            onClick={() => setCurrentMode('structure')}
          >
            📋 Structure
          </button>

          <button
            className={styles.versionButton}
            onClick={() => setShowVersionModal(true)}
            disabled={!versions.length}
          >
            🕒 Historique ({versions.length})
          </button>

          <button
            className={styles.saveButton}
            onClick={() => handleSave()}
            disabled={saving || !hasUnsavedChanges}
          >
            💾 Sauver
          </button>
        </div>
      </div>

      {/* Contenu de l'éditeur */}
      <div className={styles.editorContent}>
        {currentMode === 'wysiwyg' && pageData && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className={styles.wysiwygContent}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.wysiwygSections}
                  >
                    {pageData.sections
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${styles.wysiwygSection} ${
                                snapshot.isDragging ? styles.dragging : ''
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={styles.sectionHandle}
                              >
                                ⋮⋮ Section {index + 1} - {section.type}
                              </div>
                              {renderWYSIWYGSection(section, index)}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        )}

        {currentMode === 'structure' && pageData && (
          <div className={styles.structureMode}>
            <div className={styles.structureHeader}>
              <h2>Structure de la page</h2>
              <p>Vue d'ensemble des sections et de leur organisation</p>
            </div>

            <div className={styles.structureList}>
              {pageData.sections
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((section, index) => (
                  <div key={section.id} className={styles.structureItem}>
                    <div className={styles.structureInfo}>
                      <div className={styles.structureOrder}>{index + 1}</div>
                      <div className={styles.structureDetails}>
                        <div className={styles.structureType}>{section.type}</div>
                        <h3 className={styles.structureTitle}>
                          {section.title || `Section ${section.type}`}
                        </h3>
                        <div className={styles.structureVisibility}>
                          {section.settings?.visible !== false ? '👁️ Visible' : '🚫 Masquée'}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.structurePreview}>
                      {section.type === 'hero' && (
                        <div className={styles.previewHero}>
                          <div className={styles.previewTag}>Hero</div>
                          <p>Titre: {section.title || 'Non défini'}</p>
                          {section.image?.url && <div className={styles.previewBadge}>Image</div>}
                        </div>
                      )}
                      
                      {section.type === 'text' && (
                        <div className={styles.previewText}>
                          <div className={styles.previewTag}>Texte</div>
                          <p>{section.title || 'Section de texte'}</p>
                          <small>{section.content?.substring(0, 100) || 'Pas de contenu'}...</small>
                        </div>
                      )}
                      
                      {section.type === 'card-grid' && (
                        <div className={styles.previewCards}>
                          <div className={styles.previewTag}>Cartes</div>
                          <p>{section.title || 'Grille de cartes'}</p>
                          <div className={styles.previewBadge}>{section.items?.length || 0} cartes</div>
                        </div>
                      )}
                      
                      {section.type === 'pricing-table' && (
                        <div className={styles.previewPricing}>
                          <div className={styles.previewTag}>Tarifs</div>
                          <p>{section.title || 'Tableau des tarifs'}</p>
                          <div className={styles.previewBadge}>{section.items?.length || 0} tarifs</div>
                        </div>
                      )}
                      
                      {section.type === 'cta' && (
                        <div className={styles.previewCta}>
                          <div className={styles.previewTag}>CTA</div>
                          <p>{section.title || 'Call to Action'}</p>
                          <div className={styles.previewBadge}>{section.buttons?.length || 0} boutons</div>
                        </div>
                      )}
                      
                      {!['hero', 'text', 'card-grid', 'pricing-table', 'cta'].includes(section.type) && (
                        <div className={styles.previewDefault}>
                          <div className={styles.previewTag}>{section.type}</div>
                          <p>{section.title || `Section ${section.type}`}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de gestion des versions */}
      {showVersionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.versionModal}>
            <div className={styles.modalHeader}>
              <h2>Historique des versions</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowVersionModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.versionModalBody}>
              <div className={styles.versionLayout}>
                <div className={styles.versionList}>
                  <h3>Versions disponibles</h3>
                  {versions.map((version) => (
                    <div
                      key={version.versionNumber}
                      className={`${styles.versionItem} ${
                        selectedVersion?.versionNumber === version.versionNumber ? styles.selected : ''
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <div className={styles.versionHeader}>
                        <div className={styles.versionInfo}>
                          <span className={styles.versionNumber}>v{version.versionNumber}</span>
                          <span className={styles.versionDate}>
                            {new Date(version.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className={styles.versionActions}>
                          <button className={styles.previewButton}>👁️</button>
                        </div>
                      </div>
                      
                      <div className={styles.versionDetails}>
                        <span className={styles.sectionsCount}>
                          {version.sectionsCount} sections
                        </span>
                        {version.comment?.includes('Auto-sauvegarde') && (
                          <span className={styles.autoSaveBadge}>AUTO</span>
                        )}
                      </div>
                      
                      <div className={styles.versionComment}>
                        {version.comment || 'Aucun commentaire'}
                      </div>
                      
                      {version.createdBy && (
                        <div className={styles.versionAuthor}>
                          Par {version.createdBy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.versionPreview}>
                  <h3>Aperçu de la version</h3>
                  {selectedVersion ? (
                    <div className={styles.miniPreview}>
                      <h4>Version {selectedVersion.versionNumber}</h4>
                      <p><strong>Titre:</strong> {selectedVersion.title}</p>
                      <p><strong>Créée le:</strong> {new Date(selectedVersion.createdAt).toLocaleString('fr-FR')}</p>
                      <p><strong>Commentaire:</strong> {selectedVersion.comment}</p>
                      
                      <div className={styles.sectionsList}>
                        <h5>Sections ({selectedVersion.sectionsCount || 0}):</h5>
                        {/* Simuler l'aperçu des sections */}
                        {Array.from({ length: selectedVersion.sectionsCount || 0 }, (_, i) => (
                          <div key={i} className={styles.miniSection}>
                            <span className={styles.sectionType}>Section {i + 1}</span>
                            <span className={styles.sectionTitle}>Contenu de la section</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>Sélectionnez une version pour voir l'aperçu</p>
                  )}
                </div>
              </div>

              {selectedVersion && (
                <div className={styles.restoreSection}>
                  <h3>Restaurer cette version</h3>
                  <textarea
                    className={styles.commentInput}
                    placeholder="Commentaire pour cette restauration (optionnel)"
                    value={versionComment}
                    onChange={(e) => setVersionComment(e.target.value)}
                  />
                  <div className={styles.restoreActions}>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => {
                        setSelectedVersion(null);
                        setVersionComment('');
                      }}
                    >
                      Annuler
                    </button>
                    <button 
                      className={styles.restoreButton}
                      onClick={handleRestoreVersion}
                    >
                      🔄 Restaurer la version {selectedVersion.versionNumber}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Panel d'aide */}
      <div className={styles.helpPanel}>
        <h3>💡 Guide d'utilisation</h3>
        <div className={styles.helpContent}>
          <div className={styles.helpSection}>
            <h4>🎯 Mode Visuel</h4>
            <ul>
              <li>Cliquez sur n'importe quel texte pour l'éditer</li>
              <li>Glissez-déposez les sections pour les réorganiser</li>
              <li>Les modifications sont automatiquement sauvées</li>
            </ul>
          </div>
          
          <div className={styles.helpSection}>
            <h4>📋 Mode Structure</h4>
            <ul>
              <li>Vue d'ensemble de l'organisation de la page</li>
              <li>Vérifiez la visibilité des sections</li>
              <li>Identifiez rapidement les types de contenu</li>
            </ul>
          </div>
          
          <div className={styles.helpSection}>
            <h4>🕒 Versions</h4>
            <ul>
              <li>Chaque sauvegarde crée une nouvelle version</li>
              <li>Restaurez une version antérieure si nécessaire</li>
              <li>L'historique est conservé automatiquement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWYSIWYGEditor;