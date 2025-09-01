import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import TestimonialForm from './TestimonialForm';
import TestimonialCard from './TestimonialCard';
import Calendly from './Calendly';
import Map from './Map';
import api from '../utils/api';
import styles from '../styles/components/VisualEditor.module.css';

// Composant d'édition en ligne pour le texte
const InlineTextEditor = ({ value, onSave, placeholder, multiline = false, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline) {
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    onSave(editValue);
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
    <div
      className={`${styles.editableText} ${className}`}
      onClick={() => setIsEditing(true)}
      title="Cliquer pour éditer"
    >
      {value || <span className={styles.placeholder}>{placeholder}</span>}
      <span className={styles.editIcon}>✏️</span>
    </div>
  );
};

// Composant d'édition en ligne pour les images
const InlineImageEditor = ({ value, onSave, alt, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const fileInputRef = useRef(null);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simuler l'upload - remplacer par votre logique d'upload
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

// Composant pour éditer une liste d'éléments (cartes, tarifs, etc.)
const InlineListEditor = ({ items = [], onSave, type = 'card' }) => {
  const [editingItems, setEditingItems] = useState(items);
  const [isEditing, setIsEditing] = useState(false);

  const addItem = () => {
    const newItem = type === 'pricing' 
      ? { title: '', price: '', content: '' }
      : { title: '', content: '' };
    
    setEditingItems([...editingItems, newItem]);
    setIsEditing(true);
  };

  const updateItem = (index, field, value) => {
    const updated = [...editingItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditingItems(updated);
  };

  const removeItem = (index) => {
    const updated = editingItems.filter((_, i) => i !== index);
    setEditingItems(updated);
  };

  const handleSave = () => {
    onSave(editingItems);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingItems(items);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.listEditor}>
        <div className={styles.listEditorHeader}>
          <h3>Éditer les éléments</h3>
          <div className={styles.listEditorActions}>
            <button onClick={addItem} className={styles.addItemButton}>
              ➕ Ajouter
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              💾 Sauvegarder
            </button>
            <button onClick={handleCancel} className={styles.cancelButton}>
              ❌ Annuler
            </button>
          </div>
        </div>
        
        <div className={styles.listItems}>
          {editingItems.map((item, index) => (
            <div key={index} className={styles.listItem}>
              <div className={styles.listItemHeader}>
                <span>Élément {index + 1}</span>
                <button 
                  onClick={() => removeItem(index)}
                  className={styles.removeItemButton}
                >
                  🗑️
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Titre"
                value={item.title || ''}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className={styles.itemInput}
              />
              
              {type === 'pricing' && (
                <input
                  type="text"
                  placeholder="Prix (ex: 70€)"
                  value={item.price || ''}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                  className={styles.itemInput}
                />
              )}
              
              <textarea
                placeholder="Contenu/Description"
                value={item.content || ''}
                onChange={(e) => updateItem(index, 'content', e.target.value)}
                className={styles.itemTextarea}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editableList}>
      <div className={styles.listOverlay} onClick={() => setIsEditing(true)}>
        <span className={styles.listEditIcon}>
          ✏️ Éditer les éléments ({items.length})
        </span>
      </div>
    </div>
  );
};

// Composant principal du rendu visuel avec édition
const VisualEditor = ({ pageId }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, [pageId]);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/pages/${pageId}`);
      setPageContent(response.data.data);
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionId, field, value) => {
    const updatedSections = pageContent.sections.map(section =>
      section.id === sectionId
        ? { ...section, [field]: value }
        : section
    );

    const updatedPage = {
      ...pageContent,
      sections: updatedSections
    };

    setPageContent(updatedPage);
    await saveContent(updatedPage);
  };

  const saveContent = async (content) => {
    try {
      setSaving(true);
      await api.put(`/admin/pages/${pageId}`, content);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (section) => {
    const sectionProps = {
      className: isEditMode ? styles.editableSection : '',
      'data-section-id': section.id
    };

    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className={`${styles.hero} ${isEditMode ? styles.editable : ''}`}>
            <InlineImageEditor
              value={section.image?.url}
              alt={section.image?.alt}
              onSave={(url) => updateSection(section.id, 'image', { 
                url, 
                alt: section.image?.alt || section.title 
              })}
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <InlineTextEditor
                value={section.title}
                onSave={(value) => updateSection(section.id, 'title', value)}
                placeholder="Titre principal"
                className={styles.heroTitle}
              />
              {section.subtitle !== undefined && (
                <InlineTextEditor
                  value={section.subtitle}
                  onSave={(value) => updateSection(section.id, 'subtitle', value)}
                  placeholder="Sous-titre"
                  className={styles.heroSubtitle}
                />
              )}
            </div>
          </section>
        );

      case 'text':
        return (
          <section 
            key={section.id} 
            className={`${styles.section} ${isEditMode ? styles.editable : ''}`}
            style={{ backgroundColor: section.settings?.backgroundColor }}
          >
            <div className={styles.sectionInner}>
              {section.title && (
                <InlineTextEditor
                  value={section.title}
                  onSave={(value) => updateSection(section.id, 'title', value)}
                  placeholder="Titre de section"
                  className={styles.sectionTitle}
                />
              )}
              <InlineTextEditor
                value={section.content}
                onSave={(value) => updateSection(section.id, 'content', value)}
                placeholder="Contenu de la section"
                multiline={true}
                className={styles.textContent}
              />
            </div>
          </section>
        );

      case 'card-grid':
        return (
          <section key={section.id} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
            <div className={styles.sectionInner}>
              <InlineTextEditor
                value={section.title}
                onSave={(value) => updateSection(section.id, 'title', value)}
                placeholder="Titre de section"
                className={styles.sectionTitle}
              />
              <InlineTextEditor
                value={section.content}
                onSave={(value) => updateSection(section.id, 'content', value)}
                placeholder="Description"
                className={styles.benefitHighlight}
              />
              <div className={styles.grid}>
                {section.items?.map((item, index) => (
                  <div key={index} className={styles.card}>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                ))}
                {isEditMode && (
                  <InlineListEditor
                    items={section.items || []}
                    onSave={(items) => updateSection(section.id, 'items', items)}
                    type="card"
                  />
                )}
              </div>
            </div>
          </section>
        );

      case 'pricing-table':
        return (
          <section key={section.id} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
            <div className={styles.sectionInner}>
              <InlineTextEditor
                value={section.title}
                onSave={(value) => updateSection(section.id, 'title', value)}
                placeholder="Titre de section"
                className={styles.sectionTitle}
              />
              <div className={styles.pricingList}>
                {section.items?.map((item, index) => (
                  <div key={index} className={styles.pricingItem}>
                    <div className={styles.pricingHeader}>
                      <h3>{item.title}</h3>
                      <span className={styles.pricingPrice}>{item.price}</span>
                    </div>
                    <p>{item.content}</p>
                  </div>
                ))}
                {isEditMode && (
                  <InlineListEditor
                    items={section.items || []}
                    onSave={(items) => updateSection(section.id, 'items', items)}
                    type="pricing"
                  />
                )}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={section.id} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
            <div className={styles.sectionInner}>
              {section.title && (
                <InlineTextEditor
                  value={section.title}
                  onSave={(value) => updateSection(section.id, 'title', value)}
                  placeholder="Titre CTA"
                  className={styles.sectionTitle}
                />
              )}
              {section.content && (
                <InlineTextEditor
                  value={section.content}
                  onSave={(value) => updateSection(section.id, 'content', value)}
                  placeholder="Description CTA"
                  className={styles.ctaParagraph}
                />
              )}
              <div className={styles.ctaButtons}>
                {section.buttons?.map((button, index) => (
                  <Link key={index} href={button.url || '#'}>
                    <button className={`${styles.button} ${button.style === 'secondary' ? styles.buttonSecondary : ''}`}>
                      {button.text}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section key={section.id} className={styles.section}>
            <div className={styles.sectionInner}>
              <p>Section {section.type} - Rendu standard</p>
            </div>
          </section>
        );
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className={styles.errorContainer}>
        <p>Erreur de chargement du contenu</p>
      </div>
    );
  }

  return (
    <div className={styles.visualEditor}>
      {/* Barre d'outils */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.modeButton} ${isEditMode ? styles.active : ''}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? '👁️ Aperçu' : '✏️ Éditer'}
          </button>
          <span className={styles.pageTitle}>{pageContent.title}</span>
        </div>
        <div className={styles.toolbarRight}>
          {saving && <span className={styles.savingIndicator}>💾 Sauvegarde...</span>}
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour
          </Link>
        </div>
      </div>

      {/* Contenu éditable */}
      <div className={`${styles.content} ${isEditMode ? styles.editMode : ''}`}>
        {pageContent.sections
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(renderSection)}
      </div>

      {/* Instructions d'aide */}
      {isEditMode && (
        <div className={styles.helpPanel}>
          <h3>💡 Comment utiliser l'éditeur visuel</h3>
          <ul>
            <li><strong>Textes :</strong> Cliquez sur n'importe quel texte pour l'éditer</li>
            <li><strong>Images :</strong> Survolez une image et cliquez pour la remplacer</li>
            <li><strong>Listes :</strong> Cliquez sur "Éditer les éléments" pour modifier cartes/tarifs</li>
            <li><strong>Sauvegarde :</strong> Automatique à chaque modification</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;