import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

// Modal de configuration avancée
const SectionConfigModal = ({ section, isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState({ ...section });
  const [activeTab, setActiveTab] = useState('content');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setConfig({ ...section });
    }
  }, [isOpen, section]);

  if (!isOpen) return null;

  const updateConfig = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateArrayItem = (arrayField, index, field, value) => {
    setConfig(prev => {
      const newArray = [...(prev[arrayField] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayField]: newArray };
    });
  };

  const addArrayItem = (arrayField, defaultItem) => {
    setConfig(prev => ({
      ...prev,
      [arrayField]: [...(prev[arrayField] || []), defaultItem]
    }));
  };

  const removeArrayItem = (arrayField, index) => {
    setConfig(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateConfig('image.url', imageUrl);
    }
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const renderContentTab = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre principal</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de votre hero"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sous-titre</label>
              <textarea
                value={config.subtitle || ''}
                onChange={(e) => updateConfig('subtitle', e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Sous-titre descriptif"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image de fond</label>
              <input
                type="text"
                value={config.image?.url || ''}
                onChange={(e) => updateConfig('image.url', e.target.value)}
                className={styles.input}
                placeholder="URL de l'image"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className={styles.fileInput}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadButton}
              >
                📁 Choisir une image
              </button>
              {config.image?.url && (
                <div className={styles.imagePreview}>
                  <img src={config.image.url} alt="Aperçu" style={{ maxWidth: '200px', height: 'auto' }} />
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Texte alternatif</label>
              <input
                type="text"
                value={config.image?.alt || ''}
                onChange={(e) => updateConfig('image.alt', e.target.value)}
                className={styles.input}
                placeholder="Description pour l'accessibilité"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de la section"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenu</label>
              <textarea
                value={config.content || ''}
                onChange={(e) => updateConfig('content', e.target.value)}
                className={styles.textarea}
                rows={8}
                placeholder="Contenu de votre section"
              />
            </div>
          </div>
        );

      case 'image-text':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenu</label>
              <textarea
                value={config.content || ''}
                onChange={(e) => updateConfig('content', e.target.value)}
                className={styles.textarea}
                rows={6}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image</label>
              <input
                type="text"
                value={config.image?.url || ''}
                onChange={(e) => updateConfig('image.url', e.target.value)}
                className={styles.input}
                placeholder="URL de l'image"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className={styles.fileInput}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.uploadButton}
              >
                📁 Choisir une image
              </button>
            </div>
          </div>
        );

      case 'card-grid':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre de section</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={config.content || ''}
                onChange={(e) => updateConfig('content', e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Cartes</label>
              {(config.items || []).map((item, index) => (
                <div key={index} className={styles.itemEditor}>
                  <div className={styles.itemHeader}>
                    <h4>Carte {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('items', index)}
                      className={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Titre"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Contenu"
                    value={item.content || ''}
                    onChange={(e) => updateArrayItem('items', index, 'content', e.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="URL image (optionnel)"
                    value={item.image?.url || ''}
                    onChange={(e) => {
                      const newItems = [...(config.items || [])];
                      newItems[index] = { 
                        ...newItems[index], 
                        image: { url: e.target.value, alt: newItems[index]?.title || '' }
                      };
                      updateConfig('items', newItems);
                    }}
                    className={styles.input}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('items', { title: '', content: '', image: { url: '', alt: '' } })}
                className={styles.addButton}
              >
                ➕ Ajouter une carte
              </button>
            </div>
          </div>
        );

      case 'pricing-table':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tarifs</label>
              {(config.items || []).map((item, index) => (
                <div key={index} className={styles.itemEditor}>
                  <div className={styles.itemHeader}>
                    <h4>Tarif {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('items', index)}
                      className={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nom prestation"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Prix (ex: 70€)"
                    value={item.price || ''}
                    onChange={(e) => updateArrayItem('items', index, 'price', e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Description"
                    value={item.content || ''}
                    onChange={(e) => updateArrayItem('items', index, 'content', e.target.value)}
                    className={styles.textarea}
                    rows={2}
                  />
                  <input
                    type="text"
                    placeholder="Durée (ex: 1h)"
                    value={item.duration || ''}
                    onChange={(e) => updateArrayItem('items', index, 'duration', e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('items', { title: '', price: '', content: '', duration: '' })}
                className={styles.addButton}
              >
                ➕ Ajouter un tarif
              </button>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={config.content || ''}
                onChange={(e) => updateConfig('content', e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Boutons</label>
              {(config.buttons || []).map((button, index) => (
                <div key={index} className={styles.buttonEditor}>
                  <input
                    type="text"
                    placeholder="Texte"
                    value={button.text || ''}
                    onChange={(e) => updateArrayItem('buttons', index, 'text', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Lien"
                    value={button.url || ''}
                    onChange={(e) => updateArrayItem('buttons', index, 'url', e.target.value)}
                    className={styles.input}
                  />
                  <select
                    value={button.style || 'primary'}
                    onChange={(e) => updateArrayItem('buttons', index, 'style', e.target.value)}
                    className={styles.select}
                  >
                    <option value="primary">Principal</option>
                    <option value="secondary">Secondaire</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('buttons', index)}
                    className={styles.deleteButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('buttons', { text: '', url: '', style: 'primary' })}
                className={styles.addButton}
              >
                ➕ Ajouter un bouton
              </button>
            </div>
          </div>
        );

      case 'list-sections':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label>Titre principal</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sous-sections</label>
              {(config.sections || []).map((listSection, index) => (
                <div key={index} className={styles.itemEditor}>
                  <div className={styles.itemHeader}>
                    <h4>Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sections', index)}
                      className={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Titre sous-section"
                    value={listSection.title || ''}
                    onChange={(e) => {
                      const newSections = [...(config.sections || [])];
                      newSections[index] = { ...listSection, title: e.target.value };
                      updateConfig('sections', newSections);
                    }}
                    className={styles.input}
                  />
                  <div className={styles.listItems}>
                    {(listSection.items || []).map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.listItem}>
                        <input
                          type="text"
                          placeholder="Élément"
                          value={item || ''}
                          onChange={(e) => {
                            const newSections = [...(config.sections || [])];
                            const newItems = [...(listSection.items || [])];
                            newItems[itemIndex] = e.target.value;
                            newSections[index] = { ...listSection, items: newItems };
                            updateConfig('sections', newSections);
                          }}
                          className={styles.input}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSections = [...(config.sections || [])];
                            const newItems = (listSection.items || []).filter((_, i) => i !== itemIndex);
                            newSections[index] = { ...listSection, items: newItems };
                            updateConfig('sections', newSections);
                          }}
                          className={styles.deleteButton}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newSections = [...(config.sections || [])];
                        const newItems = [...(listSection.items || []), ''];
                        newSections[index] = { ...listSection, items: newItems };
                        updateConfig('sections', newSections);
                      }}
                      className={styles.addButton}
                    >
                      ➕ Ajouter élément
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('sections', { title: '', items: [''] })}
                className={styles.addButton}
              >
                ➕ Ajouter sous-section
              </button>
            </div>
          </div>
        );

      case 'testimonial-list':
        return (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={config.fetchFromApi || false}
                    onChange={(e) => updateConfig('fetchFromApi', e.target.checked)}
                  />
                  Afficher témoignages depuis la base de données
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Témoignages statiques</label>
              {(config.staticTestimonials || []).map((testimonial, index) => (
                <div key={index} className={styles.itemEditor}>
                  <div className={styles.itemHeader}>
                    <h4>Témoignage {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('staticTestimonials', index)}
                      className={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nom auteur"
                    value={testimonial.author || ''}
                    onChange={(e) => updateArrayItem('staticTestimonials', index, 'author', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Date (JJ/MM/AAAA)"
                    value={testimonial.date || ''}
                    onChange={(e) => updateArrayItem('staticTestimonials', index, 'date', e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Message"
                    value={testimonial.message || ''}
                    onChange={(e) => updateArrayItem('staticTestimonials', index, 'message', e.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('staticTestimonials', { author: '', date: '', message: '' })}
                className={styles.addButton}
              >
                ➕ Ajouter témoignage
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.tabContent}>
            <p>Configuration basique pour ce type de section.</p>
            <div className={styles.formGroup}>
              <label>Titre (optionnel)</label>
              <input
                type="text"
                value={config.title || ''}
                onChange={(e) => updateConfig('title', e.target.value)}
                className={styles.input}
                placeholder="Titre personnalisé"
              />
            </div>
          </div>
        );
    }
  };

  const renderStyleTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.formGroup}>
        <label>Alignement du texte</label>
        <select
          value={config.settings?.alignment || 'left'}
          onChange={(e) => updateConfig('settings.alignment', e.target.value)}
          className={styles.select}
        >
          <option value="left">Gauche</option>
          <option value="center">Centre</option>
          <option value="right">Droite</option>
          <option value="justify">Justifié</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Couleur de fond</label>
        <select
          value={config.settings?.backgroundColor || ''}
          onChange={(e) => updateConfig('settings.backgroundColor', e.target.value)}
          className={styles.select}
        >
          <option value="">Par défaut</option>
          <option value="#f0fdfa">Vert clair</option>
          <option value="#fef7f0">Beige clair</option>
          <option value="#f0f7ff">Bleu clair</option>
          <option value="#faf5ff">Violet clair</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={config.settings?.visible !== false}
              onChange={(e) => updateConfig('settings.visible', e.target.checked)}
            />
            Section visible sur le site
          </label>
        </div>
      </div>
      {config.type === 'image-text' && (
        <div className={styles.formGroup}>
          <label>Position de l'image</label>
          <select
            value={config.settings?.imagePosition || 'left'}
            onChange={(e) => updateConfig('settings.imagePosition', e.target.value)}
            className={styles.select}
          >
            <option value="left">À gauche</option>
            <option value="right">À droite</option>
            <option value="top">Au-dessus</option>
            <option value="bottom">En-dessous</option>
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>⚙️ Configuration - {section.type}</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>
        
        <div className={styles.modalTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
            onClick={() => setActiveTab('content')}
          >
            📝 Contenu
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'style' ? styles.active : ''}`}
            onClick={() => setActiveTab('style')}
          >
            🎨 Style
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === 'content' ? renderContentTab() : renderStyleTab()}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Annuler
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            💾 Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant d'édition en ligne pour le texte
const InlineTextEditor = ({ value, onSave, placeholder, multiline = false, className = '' }) => {
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

// Section Editor Card avec tous les contrôles
const SectionEditorCard = ({ section, onUpdate, onDelete, onDuplicate, onConfigure, provided }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={styles.sectionCard}
    >
      <div {...provided.dragHandleProps} className={styles.dragHandle}>
        <span className={styles.dragIcon}>⋮⋮</span>
      </div>
      
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionInfo}>
            <h3 className={styles.sectionTitle}>{section.title || `Section ${section.type}`}</h3>
            <span className={styles.sectionType}>{section.type}</span>
          </div>
          <div className={styles.sectionActions}>
            <button 
              onClick={() => onConfigure(section)}
              className={styles.configureButton}
              title="Configuration avancée"
            >
              ⚙️
            </button>
            <button 
              onClick={() => onDuplicate(section.id)}
              className={styles.duplicateButton}
              title="Dupliquer"
            >
              📋
            </button>
            <button 
              onClick={() => onDelete(section.id)}
              className={styles.deleteButton}
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div className={styles.sectionPreview}>
          {renderSectionPreview(section)}
        </div>
      </div>
    </div>
  );
};

const renderSectionPreview = (section) => {
  switch (section.type) {
    case 'hero':
      return (
        <div className={styles.heroPreview}>
          {section.image?.url && <div className={styles.imageIndicator}>🖼️ Image de fond</div>}
          <h4>{section.title || 'Titre du hero'}</h4>
          {section.subtitle && <p>{section.subtitle.substring(0, 100)}...</p>}
        </div>
      );
    case 'text':
      return (
        <div className={styles.textPreview}>
          <h4>{section.title || 'Section de texte'}</h4>
          <p>{section.content ? `${section.content.substring(0, 150)}...` : 'Aucun contenu'}</p>
        </div>
      );
    case 'image-text':
      return (
        <div className={styles.imageTextPreview}>
          <h4>{section.title || 'Image + Texte'}</h4>
          {section.image?.url && <span className={styles.badge}>🖼️ Image</span>}
          <p>{section.content ? `${section.content.substring(0, 100)}...` : 'Aucun contenu'}</p>
        </div>
      );
    case 'card-grid':
      return (
        <div className={styles.cardGridPreview}>
          <h4>{section.title || 'Grille de cartes'}</h4>
          <span className={styles.badge}>{section.items?.length || 0} carte(s)</span>
        </div>
      );
    case 'pricing-table':
      return (
        <div className={styles.pricingPreview}>
          <h4>{section.title || 'Tableau des tarifs'}</h4>
          <span className={styles.badge}>{section.items?.length || 0} tarif(s)</span>
        </div>
      );
    case 'cta':
      return (
        <div className={styles.ctaPreview}>
          <h4>{section.title || 'Call-to-Action'}</h4>
          <span className={styles.badge}>{section.buttons?.length || 0} bouton(s)</span>
        </div>
      );
    case 'list-sections':
      return (
        <div className={styles.listPreview}>
          <h4>Sections de liste</h4>
          <span className={styles.badge}>{section.sections?.length || 0} sous-section(s)</span>
        </div>
      );
    case 'testimonial-list':
      return (
        <div className={styles.testimonialPreview}>
          <h4>Liste de témoignages</h4>
          <span className={styles.badge}>
            {section.staticTestimonials?.length || 0} statique(s)
            {section.fetchFromApi && ' + API'}
          </span>
        </div>
      );
    default:
      return (
        <div className={styles.defaultPreview}>
          <h4>Composant: {section.type}</h4>
          <p>Section automatique</p>
        </div>
      );
  }
};

// Composant principal unifié
const VisualEditor = ({ pageId }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('edit'); // 'edit' ou 'preview'
  const [configModal, setConfigModal] = useState({ isOpen: false, section: null });
  const [showAddMenu, setShowAddMenu] = useState(false);

useEffect(() => {
  console.log('🔍 Debug EnhancedVisualEditor:', {
    pageId,
    token: localStorage.getItem('adminToken') ? 'présent' : 'manquant',
    apiBaseURL: api.defaults.baseURL
  });
  
  if (pageId) {
    fetchPageContent();
  }
}, [pageId]);

const fetchPageContent = async () => {
  try {
    setLoading(true);
    setError('');
    
    // 1. Vérifier l'authentification
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.log('❌ Token manquant, redirection');
      router.replace('/admin/login');
      return;
    }
    
    // 2. Vérifier que pageId existe
    if (!pageId) {
      throw new Error('PageId manquant');
    }
    
    console.log('🔍 Chargement de la page:', pageId);
    
    const response = await api.get(`/admin/pages/${pageId}`);
    
    // 3. Valider la structure de réponse
    if (response?.data?.success && response.data?.data) {
      setPageContent(response.data.data);
      setHasUnsavedChanges(false);
      console.log('✅ Page chargée:', response.data.data.title);
    } else {
      throw new Error('Format de réponse API invalide');
    }
    
  } catch (err) {
    console.error('❌ Erreur fetchPageContent:', err);
    
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      router.replace('/admin/login');
      return;
    }
    
    if (err.response?.status === 404) {
      setError(`Page "${pageId}" non trouvée`);
    } else {
      setError(`Erreur de chargement: ${err.message || 'Erreur inconnue'}`);
    }
  } finally {
    setLoading(false);
  }
};

  const savePageContent = async (content = pageContent) => {
    if (!content) return;
    
    try {
      setSaving(true);
      setError('');
      await api.put(`/admin/pages/${pageId}`, content);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError('Erreur lors de la sauvegarde: ' + (err.message || 'Erreur inconnue'));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateSection = async (sectionId, field, value) => {
    if (!pageContent) return;

    const updatedSections = pageContent.sections.map(section => {
      if (section.id === sectionId) {
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          return {
            ...section,
            [parentField]: { ...section[parentField], [childField]: value }
          };
        } else {
          return { ...section, [field]: value };
        }
      }
      return section;
    });

    const updatedPage = {
      ...pageContent,
      sections: updatedSections
    };

    setPageContent(updatedPage);
    await savePageContent(updatedPage);
  };

  const addSection = (type) => {
    const newSection = {
      id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: '',
      content: '',
      order: pageContent.sections.length,
      settings: { 
        visible: true,
        alignment: 'left'
      }
    };

    // Propriétés par défaut selon le type
    switch (type) {
      case 'hero':
        newSection.subtitle = '';
        newSection.image = { url: '', alt: '' };
        break;
      case 'image-text':
        newSection.image = { url: '', alt: '' };
        newSection.settings.imagePosition = 'left';
        break;
      case 'card-grid':
        newSection.items = [{ title: 'Nouvelle carte', content: 'Description', image: { url: '', alt: '' } }];
        break;
      case 'pricing-table':
        newSection.items = [{ title: 'Nouvelle prestation', price: '0€', content: 'Description', duration: '1h' }];
        break;
      case 'cta':
        newSection.buttons = [{ text: 'Nouveau bouton', url: '#', style: 'primary' }];
        break;
      case 'list-sections':
        newSection.sections = [{ title: 'Nouvelle section', items: ['Premier élément'] }];
        break;
      case 'testimonial-list':
        newSection.staticTestimonials = [];
        newSection.fetchFromApi = true;
        break;
    }

    const updatedPage = {
      ...pageContent,
      sections: [...pageContent.sections, newSection]
    };

    setPageContent(updatedPage);
    savePageContent(updatedPage);
    setShowAddMenu(false);
  };

  const updateSectionFull = (sectionId, updatedSection) => {
    const updatedSections = pageContent.sections.map(section =>
      section.id === sectionId ? { ...section, ...updatedSection } : section
    );

    const updatedPage = {
      ...pageContent,
      sections: updatedSections
    };

    setPageContent(updatedPage);
    savePageContent(updatedPage);
  };

  const deleteSection = (sectionId) => {
    if (confirm('⚠️ Supprimer cette section définitivement ?')) {
      const updatedPage = {
        ...pageContent,
        sections: pageContent.sections.filter(section => section.id !== sectionId)
      };
      setPageContent(updatedPage);
      savePageContent(updatedPage);
    }
  };

  const duplicateSection = (sectionId) => {
    const section = pageContent.sections.find(s => s.id === sectionId);
    if (section) {
      const duplicated = {
        ...JSON.parse(JSON.stringify(section)),
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: section.title ? `${section.title} (copie)` : 'Section (copie)',
        order: section.order + 1
      };
      
      const updatedPage = {
        ...pageContent,
        sections: [...pageContent.sections, duplicated]
      };
      setPageContent(updatedPage);
      savePageContent(updatedPage);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sections = Array.from(pageContent.sections);
    const [reorderedItem] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedItem);

    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index
    }));

    const updatedPage = {
      ...pageContent,
      sections: updatedSections
    };

    setPageContent(updatedPage);
    savePageContent(updatedPage);
  };

  const openConfigModal = (section) => {
    setConfigModal({ isOpen: true, section });
  };

  const closeConfigModal = () => {
    setConfigModal({ isOpen: false, section: null });
  };

  const saveConfigModal = (updatedSection) => {
    updateSectionFull(configModal.section.id, updatedSection);
  };

  const renderSection = (section) => {
    const key = section.id || `section-${section.order}`;

    switch (section.type) {
      case 'hero':
        return (
          <section key={key} className={styles.hero}>
            <InlineImageEditor
              value={section.image?.url}
              alt={section.image?.alt}
              onSave={(url) => updateSection(section.id, 'image.url', url)}
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
            key={key} 
            className={styles.section}
            style={{ 
              backgroundColor: section.settings?.backgroundColor,
              textAlign: section.settings?.alignment || 'left'
            }}
          >
            <div className={styles.sectionInner}>
              {section.title !== undefined && (
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

      case 'image-text':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.imageTextContainer}>
              <div className={styles.imageContainer}>
                <InlineImageEditor
                  value={section.image?.url}
                  alt={section.image?.alt}
                  onSave={(url) => updateSection(section.id, 'image.url', url)}
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.textContainer}>
                <InlineTextEditor
                  value={section.title}
                  onSave={(value) => updateSection(section.id, 'title', value)}
                  placeholder="Titre de section"
                  className={styles.title}
                />
                <InlineTextEditor
                  value={section.content}
                  onSave={(value) => updateSection(section.id, 'content', value)}
                  placeholder="Contenu textuel"
                  multiline={true}
                  className={styles.textContent}
                />
              </div>
            </div>
          </section>
        );

      case 'card-grid':
        return (
          <section key={key} className={styles.section}>
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
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'pricing-table':
        return (
          <section key={key} className={styles.section}>
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
                      <h3 className={styles.pricingTitle}>{item.title}</h3>
                      <span className={styles.pricingPrice}>{item.price}</span>
                    </div>
                    <p className={styles.pricingDescription}>{item.content}</p>
                    {item.duration && (
                      <p className={styles.pricingDuration}>Durée: {item.duration}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={key} className={styles.section}>
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

      case 'list-sections':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              {section.sections?.map((listSection, index) => (
                <div key={index} className={styles.listSection}>
                  <h3 className={styles.listSectionTitle}>{listSection.title}</h3>
                  {listSection.items && (
                    <ul className={styles.ethicsList}>
                      {listSection.items.map((item, itemIndex) => (
                        <li key={itemIndex} className={styles.ethicsListItem}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'testimonial-list':
        return <TestimonialListSection key={key} section={section} />;

      case 'contact-info':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <ContactInfo />
            </div>
          </section>
        );

      case 'testimonial-form':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <TestimonialForm />
            </div>
          </section>
        );

      case 'appointment-widget':
        return <Calendly key={key} />;

      case 'contact-form-map':
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <div className={styles.contactFormMapContainer}>
                <ContactForm />
                <Map />
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section key={key} className={styles.section}>
            <div className={styles.sectionInner}>
              <div className={styles.unsupportedSection}>
                <h3>⚠️ Section: {section.type}</h3>
                <p>Composant automatique</p>
              </div>
            </div>
          </section>
        );
    }
  };

  // Composant pour la liste de témoignages
  const TestimonialListSection = ({ section }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
      if (section.fetchFromApi) {
        fetchTestimonials();
      } else {
        setLoading(false);
      }
    }, [section.fetchFromApi]);

    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/temoignage');
        if (response.data.success) {
          setTestimonials(response.data.data.temoignages || []);
        }
      } catch (error) {
        console.error('Erreur chargement témoignages:', error);
      } finally {
        setLoading(false);
      }
    };

    const staticTestimonials = section.staticTestimonials || [];
    const allTestimonials = [...staticTestimonials, ...testimonials];
    const sortedTestimonials = allTestimonials.sort((a, b) => 
      new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
    const visibleTestimonials = showAll ? sortedTestimonials : sortedTestimonials.slice(0, 4);

    return (
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          {section.title && (
            <h2 className={styles.sectionTitle}>{section.title}</h2>
          )}
          <div className={styles.testimonialsGrid}>
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial._id || `static-${index}`}
                message={testimonial.message}
                author={testimonial.name || testimonial.author}
                date={testimonial.createdAt || testimonial.date}
              />
            ))}
          </div>
          
          {sortedTestimonials.length > 4 && (
            <div className={styles.loadMoreContainer}>
              <button 
                className={styles.loadMoreButton} 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Masquer' : 'Afficher tous'}
              </button>
            </div>
          )}
        </div>
      </section>
    );
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
        <p>Impossible de charger le contenu</p>
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
    <div className={styles.visualEditor}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.modeButton} ${viewMode === 'edit' ? styles.active : ''}`}
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
          >
            {viewMode === 'edit' ? '👁️ Aperçu' : '✏️ Mode édition'}
          </button>
          <span className={styles.pageTitle}>
            📝 {pageContent.title} ({pageContent.sections.length} sections)
          </span>
        </div>
        <div className={styles.toolbarRight}>
          {saving && (
            <span className={styles.savingIndicator}>💾 Sauvegarde...</span>
          )}
          {error && (
            <span className={styles.errorIndicator}>❌ {error}</span>
          )}
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour
          </Link>
        </div>
      </div>

      {/* Mode édition */}
      {viewMode === 'edit' && (
        <div className={styles.editorMode}>
          {/* Add Section Menu */}
          <div className={styles.addSectionBar}>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={styles.addSectionToggle}
            >
              ➕ Ajouter une section
            </button>
            {showAddMenu && (
              <div className={styles.addSectionMenu}>
                <button onClick={() => addSection('hero')}>🖼️ Hero</button>
                <button onClick={() => addSection('text')}>📝 Texte</button>
                <button onClick={() => addSection('image-text')}>🖼️ Image+Texte</button>
                <button onClick={() => addSection('card-grid')}>🃏 Cartes</button>
                <button onClick={() => addSection('pricing-table')}>💰 Tarifs</button>
                <button onClick={() => addSection('cta')}>🎯 CTA</button>
                <button onClick={() => addSection('list-sections')}>📋 Listes</button>
                <button onClick={() => addSection('testimonial-list')}>💬 Témoignages</button>
                <button onClick={() => addSection('contact-info')}>📞 Contact</button>
                <button onClick={() => addSection('testimonial-form')}>📝 Form. témoignage</button>
                <button onClick={() => addSection('appointment-widget')}>📅 RDV</button>
                <button onClick={() => addSection('contact-form-map')}>🗺️ Contact+Carte</button>
              </div>
            )}
          </div>

          {/* Sections Manager */}
          <div className={styles.sectionsManager}>
            <h3>🔧 Gestion des sections</h3>
            {pageContent.sections.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Aucune section. Ajoutez-en une ci-dessus.</p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={styles.sectionsList}>
                      {pageContent.sections
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <SectionEditorCard
                                section={section}
                                onUpdate={updateSectionFull}
                                onDelete={deleteSection}
                                onDuplicate={duplicateSection}
                                onConfigure={openConfigModal}
                                provided={provided}
                              />
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      )}

      {/* Mode aperçu */}
      {viewMode === 'preview' && (
        <div className={styles.previewMode}>
          {sortedSections.length > 0 ? (
            sortedSections.map(renderSection)
          ) : (
            <div className={styles.emptyPreview}>
              <h2>📄 Page vide</h2>
              <p>Passez en mode édition pour ajouter du contenu.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de configuration */}
      <SectionConfigModal
        section={configModal.section}
        isOpen={configModal.isOpen}
        onClose={closeConfigModal}
        onSave={saveConfigModal}
      />

      {/* Instructions d'aide */}
      {viewMode === 'preview' && (
        <div className={styles.helpPanel}>
          <h3>💡 Éditeur visuel unifié</h3>
          <ul>
            <li><strong>Édition directe :</strong> Cliquez sur les textes/images</li>
            <li><strong>Configuration :</strong> Utilisez le mode édition (⚙️)</li>
            <li><strong>Organisation :</strong> Glissez-déposez les sections</li>
            <li><strong>Sauvegarde :</strong> Automatique</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;