// components/EnhancedWYSIWYGEditor.js - Version complète avec mode structure

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import TestimonialForm from './TestimonialForm';
import TestimonialCard from './TestimonialCard';
import Resalib from './Resalib';
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
  const [showHelpPanel, setShowHelpPanel] = useState(false);

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

  // Configuration des types de sections
  const sectionTypeLabels = {
    hero: 'Section Hero',
    text: 'Section Texte',
    image: 'Section Image',
    'card-grid': 'Grille de cartes',
    cta: 'Appel à l\'action',
    list: 'Liste',
    'contact-info': 'Informations contact',
    'testimonial-form': 'Formulaire témoignages',
    'pricing-table': 'Table des tarifs',
    'image-text': 'Image + Texte',
    'testimonial-list': 'Liste témoignages',
    'appointment-widget': 'Widget RDV',
    'contact-form-map': 'Formulaire + Carte',
    'list-sections': 'Sections de liste'
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

    if (autoSaveIntervalRef.current) {
      clearTimeout(autoSaveIntervalRef.current);
    }

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

  // Rendu d'un aperçu de section pour le mode structure
  const renderSectionPreview = useCallback((section) => {
    switch (section.type) {
      case 'hero':
        return (
          <div className={styles.previewHero}>
            <span className={styles.previewTag}>Hero</span>
            <p><strong>{section.title || 'Titre manquant'}</strong></p>
            {section.subtitle && <p>{section.subtitle}</p>}
            {section.image?.url && <span className={styles.previewBadge}>Avec image</span>}
          </div>
        );

      case 'text':
        return (
          <div className={styles.previewText}>
            <span className={styles.previewTag}>Texte</span>
            <p><strong>{section.title || 'Titre manquant'}</strong></p>
            {section.content && (
              <small>{section.content.substring(0, 100)}...</small>
            )}
          </div>
        );

      case 'card-grid':
        return (
          <div className={styles.previewCards}>
            <span className={styles.previewTag}>Grille</span>
            <p><strong>{section.title || 'Titre manquant'}</strong></p>
            <span className={styles.previewBadge}>{section.items?.length || 0} cartes</span>
          </div>
        );

      case 'pricing-table':
        return (
          <div className={styles.previewPricing}>
            <span className={styles.previewTag}>Tarifs</span>
            <p><strong>{section.title || 'Titre manquant'}</strong></p>
            <span className={styles.previewBadge}>{section.items?.length || 0} tarifs</span>
          </div>
        );

      case 'cta':
        return (
          <div className={styles.previewCta}>
            <span className={styles.previewTag}>CTA</span>
            <p><strong>{section.title || 'Titre manquant'}</strong></p>
            <span className={styles.previewBadge}>{section.buttons?.length || 0} boutons</span>
          </div>
        );

      default:
        return (
          <div className={styles.previewDefault}>
            <span className={styles.previewTag}>{sectionTypeLabels[section.type] || section.type}</span>
            <p><strong>{section.title || 'Section sans titre'}</strong></p>
          </div>
        );
    }
  }, []);

  // Rendu du mode structure
  const renderStructureMode = useCallback(() => {
    if (!pageData || !pageData.sections) {
      return (
        <div className={styles.emptyState}>
          <h2>Aucune section trouvée</h2>
          <p>Cette page ne contient pas encore de sections à afficher.</p>
        </div>
      );
    }

    const sortedSections = [...pageData.sections].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
      <div className={styles.structureMode}>
        <div className={styles.structureHeader}>
          <h2>Structure de la page : {pageNames[pageId]}</h2>
          <p>Vue d'ensemble de l'organisation des sections de votre page</p>
        </div>

        <div className={styles.structureList}>
          {sortedSections.map((section, index) => (
            <div key={section.id} className={styles.structureItem}>
              <div className={styles.structureInfo}>
                <div className={styles.structureOrder}>
                  {index + 1}
                </div>
                
                <div className={styles.structureDetails}>
                  <span className={styles.structureType}>
                    {sectionTypeLabels[section.type] || section.type}
                  </span>
                  <h3 className={styles.structureTitle}>
                    {section.title || 'Section sans titre'}
                  </h3>
                  <span className={styles.structureVisibility}>
                    {section.settings?.visible !== false ? 'Visible' : 'Masquée'}
                  </span>
                </div>
              </div>

              <div className={styles.structurePreview}>
                {renderSectionPreview(section)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [pageData, pageId, pageNames, renderSectionPreview]);

  // Rendu des sections WYSIWYG avec style fidèle au site public
  const renderWYSIWYGSection = useCallback((section, index) => {
    const isEditing = editingElement?.startsWith(section.id);

    // Section Hero
    if (section.type === 'hero') {
      return (
        <section 
          key={section.id} 
          className={`${styles.publicHero} ${isEditing ? styles.editingMode : ''}`}
        >
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
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
          key={section.id}
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Section Grille de cartes
    if (section.type === 'card-grid') {
      return (
        <section key={section.id} className={styles.publicSection}>
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Section Tarifs
    if (section.type === 'pricing-table') {
      return (
        <section key={section.id} className={styles.publicSection}>
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Section CTA
    if (section.type === 'cta') {
      return (
        <section key={section.id} className={styles.publicSection}>
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Section Image + Texte
    if (section.type === 'image-text') {
      return (
        <section key={section.id} className={styles.publicSection}>
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Autres types de sections...
    if (section.type === 'list-sections') {
      return (
        <section key={section.id} className={styles.publicSection}>
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
          
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Composants spéciaux
    if (section.type === 'contact-info') {
      return (
        <section key={section.id} className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <ContactInfo />
          </div>
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    if (section.type === 'testimonial-form') {
      return (
        <section key={section.id} className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <TestimonialForm />
          </div>
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    if (section.type === 'appointment-widget') {
      return (
        <div key={section.id}>
          <Resalib />
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </div>
      );
    }

    if (section.type === 'contact-form-map') {
      return (
        <section key={section.id} className={styles.publicSection}>
          <div className={styles.publicSectionInner}>
            <div className={styles.publicContactFormMapContainer}>
              <ContactForm />
              <Map />
            </div>
          </div>
          <div className={styles.sectionIndicator}>
            <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
          </div>
        </section>
      );
    }

    // Section non supportée
    return (
      <section key={section.id} className={styles.unsupportedSection}>
        <h3>⚠️ Section non supportée</h3>
        <p>Type: <code>{section.type}</code></p>
        <p>Cette section n'est pas encore implémentée dans l'éditeur visuel.</p>
        
        <div className={styles.sectionIndicator}>
          <span className={styles.sectionLabel}>Section {index + 1}: {section.type}</span>
        </div>
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
      {/* Toolbar complète */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour
          </Link>
          
          <button
            className={`${styles.modeButton} ${currentMode === 'wysiwyg' ? styles.active : ''}`}
            onClick={() => setCurrentMode('wysiwyg')}
          >
            🎨 Visuel
          </button>
          
          <button
            className={`${styles.modeButton} ${currentMode === 'structure' ? styles.active : ''}`}
            onClick={() => setCurrentMode('structure')}
          >
            📋 Structure
          </button>
        </div>

        <div className={styles.toolbarCenter}>
          <h1 className={styles.pageTitle}>
            {pageNames[pageId] || pageId}
          </h1>
          {getStatusIndicator}
        </div>

        <div className={styles.toolbarRight}>
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

          <button
            className={styles.helpButton}
            onClick={() => setShowHelpPanel(!showHelpPanel)}
          >
            ❓ Aide
          </button>
        </div>
      </div>

      {/* Contenu de l'éditeur selon le mode */}
      <div className={styles.editorContent}>
        {currentMode === 'wysiwyg' ? (
          <div className={styles.wysiwygContent}>
            {pageData && pageData.sections
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, index) => renderWYSIWYGSection(section, index))
            }
          </div>
        ) : (
          renderStructureMode()
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

      {/* Panel d'aide en modal */}
      {showHelpPanel && (
        <div className={styles.helpPanelOverlay} onClick={() => setShowHelpPanel(false)}>
          <div className={styles.helpPanelModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.helpPanelHeader}>
              <h3>💡 Guide d'utilisation</h3>
              <button onClick={() => setShowHelpPanel(false)}>✕</button>
            </div>
            <div className={styles.helpPanelContent}>
              <div className={styles.helpSection}>
                <h4>🎨 Modes d'édition</h4>
                <ul>
                  <li><strong>WYSIWYG</strong> : Édition visuelle directe</li>
                  <li><strong>Structure</strong> : Vue d'ensemble des sections</li>
                  <li>Basculez entre les modes selon vos besoins</li>
                </ul>
              </div>
              
              <div className={styles.helpSection}>
                <h4>🎯 Édition directe</h4>
                <ul>
                  <li>Cliquez sur n'importe quel texte pour l'éditer</li>
                  <li>Appuyez sur Entrée pour sauver</li>
                  <li>Échap pour annuler</li>
                  <li>Ctrl+Entrée pour les textes longs</li>
                </ul>
              </div>
              
              <div className={styles.helpSection}>
                <h4>💾 Sauvegarde</h4>
                <ul>
                  <li>Auto-sauvegarde toutes les 30 secondes</li>
                  <li>Bouton "Sauver" pour sauver immédiatement</li>
                  <li>L'historique conserve toutes les versions</li>
                </ul>
              </div>
              
              <div className={styles.helpSection}>
                <h4>🕒 Historique</h4>
                <ul>
                  <li>Consultez les versions précédentes</li>
                  <li>Restaurez une version si besoin</li>
                  <li>Ajoutez un commentaire à chaque restauration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWYSIWYGEditor;