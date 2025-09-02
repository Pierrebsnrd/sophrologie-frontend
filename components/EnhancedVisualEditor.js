import { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Image from 'next/image';
import Link from 'next/link';
import api from '../utils/api';
import styles from '../styles/components/EnhancedVisualEditor.module.css';
import VisualEditor from '../components/VisualEditor'; // Votre composant VisualEditor existant

// Modal de gestion des versions
const VersionHistoryModal = ({ pageId, isOpen, onClose, onRestoreVersion }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoreComment, setRestoreComment] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    if (isOpen && pageId) {
      fetchVersionHistory();
    }
  }, [isOpen, pageId]);

  const fetchVersionHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/pages/${pageId}/history`);
      setVersions(response.data.data.history || []);
    } catch (error) {
      console.error('Erreur récupération historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    try {
      await api.post(`/admin/pages/${pageId}/restore/${selectedVersion.versionNumber}`, {
        comment: restoreComment
      });
      onRestoreVersion(selectedVersion.versionNumber);
      onClose();
    } catch (error) {
      console.error('Erreur restauration:', error);
      alert('Erreur lors de la restauration de la version');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.versionModal}>
        <div className={styles.modalHeader}>
          <h2>📚 Historique des versions</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>
        
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Chargement de l'historique...</p>
            </div>
          ) : (
            <div className={styles.versionList}>
              {versions.map((version) => (
                <div 
                  key={version.versionNumber} 
                  className={`${styles.versionItem} ${selectedVersion?.versionNumber === version.versionNumber ? styles.selected : ''}`}
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
                    <span className={styles.sectionsCount}>
                      {version.sectionsCount} section{version.sectionsCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.versionComment}>
                    {version.comment || 'Aucun commentaire'}
                  </div>
                  
                  {version.createdBy && (
                    <div className={styles.versionAuthor}>
                      Par: {version.createdBy.email || 'Système'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedVersion && (
          <div className={styles.restoreSection}>
            <h3>Restaurer la version {selectedVersion.versionNumber}</h3>
            <textarea
              value={restoreComment}
              onChange={(e) => setRestoreComment(e.target.value)}
              placeholder="Commentaire pour cette restauration (optionnel)"
              className={styles.commentInput}
            />
            <div className={styles.restoreActions}>
              <button onClick={() => setSelectedVersion(null)} className={styles.cancelButton}>
                Annuler
              </button>
              <button onClick={handleRestore} className={styles.restoreButton}>
                🔄 Restaurer cette version
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal de sauvegarde avec commentaire
const SaveVersionModal = ({ isOpen, onClose, onSave }) => {
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(comment);
    setSaving(false);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.saveModal}>
        <div className={styles.modalHeader}>
          <h2>💾 Créer une version</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>
        
        <div className={styles.modalBody}>
          <p>Créer une nouvelle version permet de sauvegarder l'état actuel et de pouvoir y revenir plus tard.</p>
          
          <div className={styles.formGroup}>
            <label htmlFor="version-comment">Commentaire (recommandé)</label>
            <textarea
              id="version-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez les changements effectués..."
              className={styles.commentInput}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton} disabled={saving}>
            Annuler
          </button>
          <button onClick={handleSave} className={styles.saveButton} disabled={saving}>
            {saving ? 'Sauvegarde...' : '💾 Créer la version'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook personnalisé pour la sauvegarde automatique
const useAutoSave = (pageId, pageContent, delay = 30000) => {
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
      await api.post(`/admin/pages/${pageId}/autosave`, content);
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      lastContentRef.current = content;
      
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Erreur sauvegarde automatique:', error);
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 5000);
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

// Composant principal de l'éditeur visuel amélioré
const EnhancedVisualEditor = ({ pageId }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('edit');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSaveVersion, setShowSaveVersion] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sauvegarde automatique
  const { lastSaved, autoSaveStatus } = useAutoSave(pageId, pageContent);

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

  // Détecter les changements non sauvegardés
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchPageContent = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Vérifier que pageId existe
    if (!pageId) {
      throw new Error('PageId manquant');
    }
    
    console.log('🔍 Récupération de la page:', pageId);
    
    const response = await api.get(`/admin/pages/${pageId}`);
    
    if (response.data && response.data.success && response.data.data) {
      setPageContent(response.data.data);
      setHasUnsavedChanges(false);
      console.log('✅ Page chargée:', response.data.data.title);
    } else {
      throw new Error('Format de réponse invalide');
    }
  } catch (err) {
    console.error('❌ Erreur chargement:', err);
    
    // Gestion spécifique des erreurs
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      return;
    }
    
    if (err.response?.status === 404) {
      setError(`Page "${pageId}" non trouvée`);
    } else if (err.response?.status === 403) {
      setError('Accès refusé - Vérifiez vos permissions');
    } else if (err.code === 'NETWORK_ERROR') {
      setError('Erreur réseau - Vérifiez votre connexion');
    } else {
      setError(`Erreur de chargement: ${err.message || 'Erreur inconnue'}`);
    }
  } finally {
    setLoading(false);
  }
};

  const savePageContent = async (content = pageContent, createVersion = false, versionComment = '') => {
    if (!content) return;
    
    try {
      setSaving(true);
      setError('');
      
      await api.put(`/admin/pages/${pageId}`, {
        ...content,
        createVersion,
        versionComment
      });
      
      setHasUnsavedChanges(false);
      console.log('✅ Page sauvegardée avec succès');
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError('Erreur lors de la sauvegarde: ' + (err.message || 'Erreur inconnue'));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWithVersion = async (comment) => {
    await savePageContent(pageContent, true, comment);
  };

  const handleRestoreVersion = async (versionNumber) => {
    await fetchPageContent();
    alert(`Version ${versionNumber} restaurée avec succès`);
  };

  const updateContent = (newContent) => {
    setPageContent(newContent);
    setHasUnsavedChanges(true);
  };

  // Rendu du statut de sauvegarde
  const renderSaveStatus = () => {
    if (saving) {
      return <span className={styles.savingIndicator}>💾 Sauvegarde...</span>;
    }
    
    if (autoSaveStatus === 'saving') {
      return <span className={styles.autoSavingIndicator}>🔄 Sauvegarde automatique...</span>;
    }
    
    if (autoSaveStatus === 'saved') {
      return (
        <span className={styles.savedIndicator}>
          ✅ Auto-sauvé {lastSaved && `(${lastSaved.toLocaleTimeString()})`}
        </span>
      );
    }
    
    if (autoSaveStatus === 'error') {
      return <span className={styles.errorIndicator}>❌ Erreur sauvegarde auto</span>;
    }
    
    if (hasUnsavedChanges) {
      return <span className={styles.unsavedIndicator}>⚠️ Modifications non sauvegardées</span>;
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

  const pageNames = {
    home: 'Accueil',
    about: 'Qui suis-je ?',
    pricing: 'Tarifs',
    appointment: 'Prendre rendez-vous',
    testimonials: 'Témoignages',
    contact: 'Contact',
    ethics: 'Charte éthique'
  };

  return (
    <div className={styles.enhancedEditor}>
      {/* Toolbar améliorée */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.modeButton} ${viewMode === 'edit' ? styles.active : ''}`}
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
          >
            {viewMode === 'edit' ? '👁️ Aperçu' : '✏️ Édition'}
          </button>
          <span className={styles.pageTitle}>
            📝 {pageNames[pageId] || pageId} 
            {pageContent?.currentVersion && ` (v${pageContent.currentVersion})`}
          </span>
        </div>
        
        <div className={styles.toolbarCenter}>
          {renderSaveStatus()}
        </div>
        
        <div className={styles.toolbarRight}>
          <button
            onClick={() => setShowVersionHistory(true)}
            className={styles.historyButton}
            title="Voir l'historique des versions"
          >
            📚 Historique
          </button>
          
          <button
            onClick={() => setShowSaveVersion(true)}
            className={styles.versionButton}
            title="Créer une version"
            disabled={!hasUnsavedChanges}
          >
            💾 Créer version
          </button>
          
          <button
            onClick={() => savePageContent()}
            className={styles.saveButton}
            disabled={saving || !hasUnsavedChanges}
            title="Sauvegarder les modifications"
          >
            {saving ? '⏳' : '💾'} Sauvegarder
          </button>
          
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

      {/* Contenu de l'éditeur */}
      <div className={styles.editorContent}>
        {pageContent ? (
          <ExistingVisualEditorContent 
            pageContent={pageContent}
            onUpdate={updateContent}
            viewMode={viewMode}
          />
        ) : (
          <div className={styles.errorContainer}>
            <h2>❌ Erreur</h2>
            <p>Impossible de charger le contenu</p>
            <button onClick={fetchPageContent} className={styles.retryButton}>
              🔄 Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <VersionHistoryModal
        pageId={pageId}
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        onRestoreVersion={handleRestoreVersion}
      />
      
      <SaveVersionModal
        isOpen={showSaveVersion}
        onClose={() => setShowSaveVersion(false)}
        onSave={handleSaveWithVersion}
      />

      {/* Panel d'aide amélioré */}
      {viewMode === 'edit' && (
        <div className={styles.helpPanel}>
          <h3>💡 Guide de l'éditeur</h3>
          <div className={styles.helpSections}>
            <div className={styles.helpSection}>
              <h4>🔧 Édition</h4>
              <ul>
                <li>Cliquez sur les textes pour les modifier</li>
                <li>Utilisez ⚙️ pour la configuration avancée</li>
                <li>Glissez-déposez pour réorganiser</li>
              </ul>
            </div>
            
            <div className={styles.helpSection}>
              <h4>💾 Sauvegarde</h4>
              <ul>
                <li><strong>Auto:</strong> Toutes les 30 secondes</li>
                <li><strong>Manuelle:</strong> Bouton "Sauvegarder"</li>
                <li><strong>Version:</strong> Crée un point de restauration</li>
              </ul>
            </div>
            
            <div className={styles.helpSection}>
              <h4>📚 Versions</h4>
              <ul>
                <li>Historique des 20 dernières versions</li>
                <li>Restauration en un clic</li>
                <li>Commentaires pour traçabilité</li>
              </ul>
            </div>
          </div>
          
                      <div className={styles.shortcuts}>
            <h4>⌨️ Raccourcis</h4>
            <p><kbd>Ctrl+S</kbd> Sauvegarder</p>
            <p><kbd>Ctrl+Z</kbd> Annuler</p>
            <p><kbd>Ctrl+H</kbd> Historique</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant wrapper qui utilise le VisualEditor existant
const ExistingVisualEditorContent = ({ pageContent, onUpdate, viewMode }) => {
  const [sections, setSections] = useState(pageContent.sections || []);

  useEffect(() => {
    setSections(pageContent.sections || []);
  }, [pageContent.sections]);

  const handleSectionUpdate = (sectionId, field, value) => {
    const updatedSections = sections.map(section => {
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

    setSections(updatedSections);
    onUpdate({
      ...pageContent,
      sections: updatedSections
    });
  };

  const addSection = (type) => {
    const newSection = {
      id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: '',
      content: '',
      order: sections.length,
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

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    onUpdate({
      ...pageContent,
      sections: updatedSections
    });
  };

  const deleteSection = (sectionId) => {
    if (confirm('⚠️ Supprimer cette section définitivement ?')) {
      const updatedSections = sections.filter(section => section.id !== sectionId);
      setSections(updatedSections);
      onUpdate({
        ...pageContent,
        sections: updatedSections
      });
    }
  };

  const duplicateSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const duplicated = {
        ...JSON.parse(JSON.stringify(section)),
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: section.title ? `${section.title} (copie)` : 'Section (copie)',
        order: section.order + 1
      };
      
      const updatedSections = [...sections, duplicated];
      setSections(updatedSections);
      onUpdate({
        ...pageContent,
        sections: updatedSections
      });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedItem] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedItem);

    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    setSections(updatedSections);
    onUpdate({
      ...pageContent,
      sections: updatedSections
    });
  };

  // Ici vous intégreriez votre composant VisualEditor existant
  // en lui passant les props nécessaires
  return (
    <div className={styles.existingEditorWrapper}>
      {/* Votre composant VisualEditor existant avec les nouvelles fonctionnalités */}
      <VisualEditor
        pageContent={{ ...pageContent, sections }}
        onSectionUpdate={handleSectionUpdate}
        onAddSection={addSection}
        onDeleteSection={deleteSection}
        onDuplicateSection={duplicateSection}
        onDragEnd={handleDragEnd}
        viewMode={viewMode}
      />
    </div>
  );
};

export default EnhancedVisualEditor;