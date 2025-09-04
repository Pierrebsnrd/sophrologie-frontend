import { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import TestimonialForm from './TestimonialForm';
import Calendly from './Calendly';
import Map from './Map';
import api from '../utils/api';
import styles from '../styles/components/SymplifiedVisualEditor.module.css';

// Hook pour la sauvegarde automatique
const useAutoSave = (pageId, pageContent, delay = 10000) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
  const timeoutRef = useRef();
  const lastContentRef = useRef();

  const autoSave = useCallback(async (content) => {
    if (!content || JSON.stringify(content) === JSON.stringify(lastContentRef.current)) {
      return;
    }

    setAutoSaveStatus('saving');
    try {
      await api.put(`/admin/pages/${pageId}`, content);
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      lastContentRef.current = content;
      
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur sauvegarde automatique:', error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  }, [pageId]);

  useEffect(() => {
    if (pageContent && pageContent.sections) {
      clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        autoSave(pageContent);
      }, delay);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [pageContent, autoSave, delay]);

  return { lastSaved, autoSaveStatus };
};

// Composant d'édition en ligne pour le texte
const InlineEditor = ({ value, onSave, placeholder, multiline = false, className = '', tag = 'span' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
    if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const TagName = tag;

  if (isEditing) {
    return (
      <div className={styles.editingWrapper}>
        {multiline ? (
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${styles.editingTextarea} ${className}`}
            placeholder={placeholder}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${styles.editingInput} ${className}`}
            placeholder={placeholder}
          />
        )}
        <div className={styles.editingHint}>
          {multiline ? 'Ctrl+Enter pour sauvegarder, Esc pour annuler' : 'Enter pour sauvegarder, Esc pour annuler'}
        </div>
      </div>
    );
  }

  return (
    <TagName
      className={`${styles.editableElement} ${className}`}
      onClick={() => setIsEditing(true)}
      title="Cliquer pour éditer"
    >
      {value || <span className={styles.placeholder}>{placeholder}</span>}
      <span className={styles.editIcon}>✏️</span>
    </TagName>
  );
};

// Composant d'édition d'image
const ImageEditor = ({ value, onSave, alt, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditValue(imageUrl);
      onSave(imageUrl);
      setIsEditing(false);
    }
  };

  return (
    <div className={`${styles.editableImage} ${className}`}>
      {value ? (
        <div className={styles.imageWrapper}>
          <Image
            src={value}
            alt={alt || ''}
            fill
            className={styles.image}
          />
          <div className={styles.imageOverlay} onClick={() => setIsEditing(true)}>
            <span className={styles.imageEditIcon}>📷 Changer l'image</span>
          </div>
        </div>
      ) : (
        <div className={styles.imagePlaceholder} onClick={() => setIsEditing(true)}>
          <span>📷 Ajouter une image</span>
        </div>
      )}
      
      {isEditing && (
        <div className={styles.imageEditModal}>
          <div className={styles.imageEditContent}>
            <h3>Modifier l'image</h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="URL de l'image"
              className={styles.imageUrlInput}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className={styles.fileInput}
              style={{ display: 'none' }}
            />
            <div className={styles.imageEditActions}>
              <button onClick={() => fileInputRef.current?.click()}>
                📁 Choisir un fichier
              </button>
              <button onClick={handleSave}>Sauvegarder</button>
              <button onClick={() => setIsEditing(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal simplifié
const SimplifiedVisualEditor = ({ pageId }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);

  // Sauvegarde automatique
  const { lastSaved, autoSaveStatus } = useAutoSave(pageId, pageContent);

  useEffect(() => {
    if (pageId) {
      fetchPageContent();
    }
  }, [pageId]);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!pageId) {
        throw new Error('PageId manquant');
      }
      
      const response = await api.get(`/admin/pages/${pageId}`);
      
      if (response.data && response.data.success && response.data.data) {
        setPageContent(response.data.data);
        console.log('✅ Page chargée:', response.data.data.title);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('❌ Erreur chargement:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (sectionId, field, value) => {
    if (!pageContent) return;

    const updatedSections = pageContent.sections.map(section => {
      if (section.id === sectionId) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...section,
            [parent]: { ...section[parent], [child]: value }
          };
        } else {
          return { ...section, [field]: value };
        }
      }
      return section;
    });

    setPageContent({
      ...pageContent,
      sections: updatedSections
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newSections = Array.from(pageContent.sections);
    const [reorderedItem] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedItem);

    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    setPageContent({
      ...pageContent,
      sections: updatedSections
    });
  };

  const renderSection = (section, index) => {
    const key = section.id || `section-${section.order}`;

    switch (section.type) {
      case 'hero':
        return (
          <div key={key} className={`${styles.section} ${styles.heroSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Hero</span>
            </div>
            <ImageEditor
              value={section.image?.url}
              alt={section.image?.alt}
              onSave={(url) => updateSection(section.id, 'image.url', url)}
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <InlineEditor
                value={section.title}
                onSave={(value) => updateSection(section.id, 'title', value)}
                placeholder="Titre principal"
                className={styles.heroTitle}
                tag="h1"
              />
              {section.subtitle !== undefined && (
                <InlineEditor
                  value={section.subtitle}
                  onSave={(value) => updateSection(section.id, 'subtitle', value)}
                  placeholder="Sous-titre"
                  className={styles.heroSubtitle}
                  tag="p"
                />
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div 
            key={key} 
            className={`${styles.section} ${styles.textSection}`}
            style={{ 
              backgroundColor: section.settings?.backgroundColor,
              textAlign: section.settings?.alignment || 'left'
            }}
          >
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Texte</span>
            </div>
            <div className={styles.sectionInner}>
              <InlineEditor
                value={section.title}
                onSave={(value) => updateSection(section.id, 'title', value)}
                placeholder="Titre de section"
                className={styles.sectionTitle}
                tag="h2"
              />
              <InlineEditor
                value={section.content}
                onSave={(value) => updateSection(section.id, 'content', value)}
                placeholder="Contenu de la section"
                multiline={true}
                className={styles.textContent}
                tag="div"
              />
            </div>
          </div>
        );

      case 'image-text':
        return (
          <div key={key} className={`${styles.section} ${styles.imageTextSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Image + Texte</span>
            </div>
            <div className={styles.imageTextContainer}>
              <div className={styles.imageContainer}>
                <ImageEditor
                  value={section.image?.url}
                  alt={section.image?.alt}
                  onSave={(url) => updateSection(section.id, 'image.url', url)}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.textContainer}>
                <InlineEditor
                  value={section.title}
                  onSave={(value) => updateSection(section.id, 'title', value)}
                  placeholder="Titre de section"
                  className={styles.title}
                  tag="h2"
                />
                <InlineEditor
                  value={section.content}
                  onSave={(value) => updateSection(section.id, 'content', value)}
                  placeholder="Contenu textuel"
                  multiline={true}
                  className={styles.textContent}
                  tag="div"
                />
              </div>
            </div>
          </div>
        );

      case 'card-grid':
        return (
          <div key={key} className={`${styles.section} ${styles.cardGridSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Grille de cartes</span>
            </div>
            <div className={styles.sectionInner}>
              <InlineEditor
                value={section.title}
                onSave={(value) => updateSection(section.id, 'title', value)}
                placeholder="Titre de section"
                className={styles.sectionTitle}
                tag="h2"
              />
              <InlineEditor
                value={section.content}
                onSave={(value) => updateSection(section.id, 'content', value)}
                placeholder="Description"
                className={styles.benefitHighlight}
                tag="p"
              />
              <div className={styles.grid}>
                {section.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.card}>
                    {item.image?.url && (
                      <div className={styles.cardImage}>
                        <Image
                          src={item.image.url}
                          alt={item.image.alt || item.title || ''}
                          width={300}
                          height={200}
                        />
                      </div>
                    )}
                    <InlineEditor
                      value={item.title}
                      onSave={(value) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex] = { ...item, title: value };
                        updateSection(section.id, 'items', updatedItems);
                      }}
                      placeholder="Titre de la carte"
                      tag="h3"
                    />
                    <InlineEditor
                      value={item.content}
                      onSave={(value) => {
                        const updatedItems = [...section.items];
                        updatedItems[itemIndex] = { ...item, content: value };
                        updateSection(section.id, 'items', updatedItems);
                      }}
                      placeholder="Description de la carte"
                      multiline={true}
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // Composants non éditables
      case 'contact-info':
        return (
          <div key={key} className={`${styles.section} ${styles.staticSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Informations de contact (automatique)</span>
            </div>
            <ContactInfo />
          </div>
        );

      case 'testimonial-form':
        return (
          <div key={key} className={`${styles.section} ${styles.staticSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Formulaire témoignage (automatique)</span>
            </div>
            <TestimonialForm />
          </div>
        );

      case 'appointment-widget':
        return (
          <div key={key} className={`${styles.section} ${styles.staticSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Widget rendez-vous (automatique)</span>
            </div>
            <Calendly />
          </div>
        );

      case 'contact-form-map':
        return (
          <div key={key} className={`${styles.section} ${styles.staticSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Contact + Carte (automatique)</span>
            </div>
            <div className={styles.contactFormMapContainer}>
              <ContactForm />
              <Map />
            </div>
          </div>
        );

      default:
        return (
          <div key={key} className={`${styles.section} ${styles.unsupportedSection}`}>
            <div className={styles.sectionControls}>
              <span className={styles.sectionType}>Section non supportée: {section.type}</span>
            </div>
            <p>Cette section n'est pas encore éditable</p>
          </div>
        );
    }
  };

  const renderSaveStatus = () => {
    if (autoSaveStatus === 'saving') {
      return <span className={styles.savingIndicator}>💾 Sauvegarde...</span>;
    }
    
    if (autoSaveStatus === 'saved') {
      return (
        <span className={styles.savedIndicator}>
          ✅ Sauvegardé {lastSaved && `(${lastSaved.toLocaleTimeString()})`}
        </span>
      );
    }
    
    if (autoSaveStatus === 'error') {
      return <span className={styles.errorIndicator}>❌ Erreur sauvegarde</span>;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement de l'éditeur...</p>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className={styles.errorContainer}>
        <h2>❌ Erreur</h2>
        <p>{error || 'Impossible de charger le contenu'}</p>
        <button onClick={fetchPageContent} className={styles.retryButton}>
          🔄 Réessayer
        </button>
      </div>
    );
  }

  const sortedSections = pageContent.sections
    .filter(section => section.settings?.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className={styles.editor}>
      {/* Toolbar simplifié */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <h1 className={styles.pageTitle}>{pageContent.title}</h1>
        </div>
        
        <div className={styles.toolbarCenter}>
          {renderSaveStatus()}
        </div>
        
        <div className={styles.toolbarRight}>
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour
          </Link>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>❌ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Mode édition directe */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className={styles.sectionsContainer}
            >
              {sortedSections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={styles.draggableSection}
                    >
                      {renderSection(section, index)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Panel d'aide minimal */}
      <div className={styles.helpPanel}>
        <h3>💡 Édition directe</h3>
        <ul>
          <li>Cliquez sur les textes pour les modifier</li>
          <li>Cliquez sur les images pour les changer</li>
          <li>Glissez-déposez pour réorganiser</li>
          <li>Sauvegarde automatique toutes les 10 secondes</li>
        </ul>
      </div>
    </div>
  );
};

export default SimplifiedVisualEditor;