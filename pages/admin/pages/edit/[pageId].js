import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import VisualEditor from '../../../../components/VisualEditor';
import DynamicPageRenderer from '../../../../components/DynamicPageRenderer';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import styles from '../../../../styles/pages/AdminPages.module.css';

export default function EditPageVisual() {
  const router = useRouter();
  const { pageId } = router.query;
  const [pageTitle, setPageTitle] = useState('');
  const [viewMode, setViewMode] = useState('visual'); // 'visual' or 'preview'
  const [refreshKey, setRefreshKey] = useState(0);

  const pageNames = {
    home: 'Accueil',
    about: 'Qui suis-je ?',
    pricing: 'Tarifs',
    appointment: 'Prendre rendez-vous',
    testimonials: 'Témoignages',
    contact: 'Contact',
    ethics: 'Charte éthique'
  };

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    if (pageId && pageNames[pageId]) {
      setPageTitle(pageNames[pageId]);
    } else if (pageId && !pageNames[pageId]) {
      // Page ID non valide, rediriger
      router.replace('/admin/pages');
    }
  }, [router, pageId]);

  // Fonction pour rafraîchir la prévisualisation après sauvegarde
  const handleContentSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!pageId || !pageNames[pageId]) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h1>Page non trouvée</h1>
          <p>La page que vous essayez de modifier n'existe pas.</p>
          <Link href="/admin/pages" className={styles.backButton}>
            ← Retour aux pages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Édition Visuelle - {pageTitle} - Administration</title>
      </Head>

      {/* Mode édition visuelle */}
      {viewMode === 'visual' && (
        <VisualEditor pageId={pageId} />
      )}

      {/* Mode prévisualisation complète */}
      {viewMode === 'preview' && (
        <div className={styles.previewContainer}>
          {/* Barre de contrôle pour la prévisualisation */}
          <div className={styles.previewControls}>
            <div className={styles.previewInfo}>
              <span className={styles.previewLabel}>👁️ Prévisualisation complète : {pageTitle}</span>
            </div>
            <div className={styles.previewActions}>
              <button 
                className={styles.toggleButton}
                onClick={() => setViewMode('visual')}
              >
                ✏️ Retour à l'édition
              </button>
              <Link 
                href={getPageUrl(pageId)}
                target="_blank"
                className={styles.previewButton}
              >
                🌐 Voir sur le site
              </Link>
              <Link 
                href="/admin/pages"
                className={styles.backButton}
              >
                ← Retour aux pages
              </Link>
            </div>
          </div>

          {/* Rendu de la page avec Header et Footer */}
          <div className={styles.previewWrapper}>
            <Header />
            <DynamicPageRenderer 
              key={refreshKey} 
              pageId={pageId}
              fallbackContent={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h2>Contenu en cours de chargement...</h2>
                  <p>Si cette page reste vide, vérifiez que vous avez bien configuré au moins une section.</p>
                </div>
              }
            />
            <Footer />
          </div>
        </div>
      )}

      <style jsx>{`
        .previewContainer {
          background: #f8fafc;
          min-height: 100vh;
        }
        
        .previewControls {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          padding: 15px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .previewInfo {
          display: flex;
          align-items: center;
        }
        
        .previewLabel {
          font-size: 16px;
          font-weight: 600;
          color: #1e40af;
        }
        
        .previewActions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .toggleButton {
          background: #48bb78;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .toggleButton:hover {
          background: #38a169;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        }
        
        .previewButton {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .previewButton:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
        
        .backButton {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .backButton:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }
        
        .previewWrapper {
          background: white;
          margin-top: 70px;
          min-height: calc(100vh - 70px);
        }
        
        @media (max-width: 768px) {
          .previewControls {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }
          
          .previewActions {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .previewWrapper {
            margin-top: 120px;
            min-height: calc(100vh - 120px);
          }
        }
      `}</style>
    </>
  );

  // Fonction utilitaire pour obtenir l'URL de la page
  function getPageUrl(pageId) {
    const urls = {
      home: '/',
      about: '/qui-suis-je',
      pricing: '/tarifs',
      appointment: '/rdv',
      testimonials: '/temoignages',
      contact: '/contact',
      ethics: '/charte'
    };
    return urls[pageId] || '/';
  }
}

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
const VisualEditors = ({ pageId }) => {
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
