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
  const [editingItems, setEditingItems] = useState([...items]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditingItems([...items]);
  }, [items]);

  const addItem = () => {
    const newItem = type === 'pricing' 
      ? { title: '', price: '', content: '', duration: '' }
      : { title: '', content: '', image: { url: '', alt: '' } };
    
    setEditingItems([...editingItems, newItem]);
    setIsEditing(true);
  };

  const updateItem = (index, field, value) => {
    const updated = [...editingItems];
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      updated[index] = {
        ...updated[index],
        [parentField]: { ...updated[index][parentField], [childField]: value }
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
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
    setEditingItems([...items]);
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
                <>
                  <input
                    type="text"
                    placeholder="Prix (ex: 70€)"
                    value={item.price || ''}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className={styles.itemInput}
                  />
                  <input
                    type="text"
                    placeholder="Durée (ex: 1h)"
                    value={item.duration || ''}
                    onChange={(e) => updateItem(index, 'duration', e.target.value)}
                    className={styles.itemInput}
                  />
                </>
              )}
              
              <textarea
                placeholder="Contenu/Description"
                value={item.content || ''}
                onChange={(e) => updateItem(index, 'content', e.target.value)}
                className={styles.itemTextarea}
                rows={3}
              />

              {type === 'card' && (
                <input
                  type="text"
                  placeholder="URL de l'image (optionnel)"
                  value={item.image?.url || ''}
                  onChange={(e) => updateItem(index, 'image.url', e.target.value)}
                  className={styles.itemInput}
                />
              )}
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
      if (response.data && response.data.data) {
        setPageContent(response.data.data);
      } else {
        // Créer une structure de base
        setPageContent({
          title: `Page ${pageId}`,
          sections: []
        });
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        // Créer une structure de base en cas d'erreur
        setPageContent({
          title: `Page ${pageId}`,
          sections: []
        });
      }
    } finally {
      setLoading(false);
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
    await saveContent(updatedPage);
  };

  const saveContent = async (content) => {
    try {
      setSaving(true);
      await api.put(`/admin/pages/${pageId}`, content);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('❌ Erreur lors de la sauvegarde. Vos modifications ont été perdues.');
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (section) => {
    const key = section.id || `section-${section.order}`;

    switch (section.type) {
      case 'hero':
        return (
          <section key={key} className={`${styles.hero} ${isEditMode ? styles.editable : ''}`}>
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
            className={`${styles.section} ${isEditMode ? styles.editable : ''}`}
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
          <section key={key} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
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
          <section key={key} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
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
          <section key={key} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
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
          <section key={key} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
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
                {isEditMode && section.buttons && (
                  <div className={styles.editButtonsHint}>
                    <small>💡 Utilisez l'éditeur de formulaires pour modifier les boutons</small>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'list-sections':
        return (
          <section key={key} className={`${styles.section} ${isEditMode ? styles.editable : ''}`}>
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
              {isEditMode && (
                <div className={styles.editHint}>
                  <small>💡 Utilisez l'éditeur de formulaires pour modifier cette section</small>
                </div>
              )}
            </div>
          </section>
        );

      case 'testimonial-list':
        return (
          <TestimonialListSection key={key} section={section} />
        );

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
                <h3>⚠️ Section non supportée</h3>
                <p>Type: <code>{section.type}</code></p>
                <p>Cette section n'est pas encore implémentée dans l'éditeur visuel.</p>
                {isEditMode && (
                  <small>💡 Utilisez l'éditeur de formulaires pour configurer cette section</small>
                )}
              </div>
            </div>
          </section>
        );
    }
  };

  // Composant pour la liste de témoignages (séparé pour la logique)
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
                {showAll ? 'Masquer les anciens témoignages' : 'Afficher tous les témoignages'}
              </button>
            </div>
          )}

          {isEditMode && (
            <div className={styles.editHint}>
              <small>💡 Utilisez l'éditeur de formulaires pour configurer les témoignages</small>
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
        <p>Chargement de l'éditeur visuel...</p>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className={styles.errorContainer}>
        <h2>❌ Erreur</h2>
        <p>Impossible de charger le contenu de la page</p>
        <button onClick={fetchPageContent} className={styles.retryButton}>
          🔄 Réessayer
        </button>
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
            {isEditMode ? '👁️ Aperçu' : '✏️ Mode édition'}
          </button>
          <span className={styles.pageTitle}>
            📝 {pageContent.title} ({pageContent.sections.length} sections)
          </span>
        </div>
        <div className={styles.toolbarRight}>
          {saving && (
            <span className={styles.savingIndicator}>💾 Sauvegarde automatique...</span>
          )}
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour aux pages
          </Link>
        </div>
      </div>

      {/* Contenu éditable */}
      <div className={`${styles.content} ${isEditMode ? styles.editMode : ''}`}>
        {pageContent.sections && pageContent.sections.length > 0 ? (
          pageContent.sections
            .filter(section => section.settings?.visible !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(renderSection)
        ) : (
          <div className={styles.emptyState}>
            <h2>📄 Page vide</h2>
            <p>Cette page ne contient aucune section.</p>
            <p>Utilisez l'éditeur de formulaires pour ajouter du contenu.</p>
            <Link href={`/admin/pages/edit/${pageId}`} className={styles.addContentButton}>
              ➕ Ajouter du contenu
            </Link>
          </div>
        )}
      </div>

      {/* Instructions d'aide */}
      {isEditMode && pageContent.sections && pageContent.sections.length > 0 && (
        <div className={styles.helpPanel}>
          <h3>💡 Éditeur visuel</h3>
          <ul>
            <li><strong>Textes :</strong> Cliquez directement sur le texte pour l'éditer</li>
            <li><strong>Images :</strong> Survolez l'image et cliquez pour la changer</li>
            <li><strong>Listes complexes :</strong> Utilisez l'éditeur de formulaires</li>
            <li><strong>Sauvegarde :</strong> Automatique à chaque modification</li>
          </ul>
          <div className={styles.helpLinks}>
            <Link href={`/admin/pages/edit/${pageId}`} className={styles.helpLink}>
              🔧 Éditeur de formulaires
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualEditor;