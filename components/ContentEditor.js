import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../utils/api';
import styles from '../styles/components/ContentEditor.module.css';

// Composants d'édition pour chaque type de section
const SectionEditor = ({ section, onUpdate, onDelete, onDuplicate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState({ ...section });
  const fileInputRef = useRef(null);

  const handleSave = () => {
    onUpdate(section.id, editedSection);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSection({ ...section });
    setIsEditing(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Ici vous pouvez implémenter l'upload vers votre service (Cloudinary, S3, etc.)
    // Pour l'instant, on simule avec un URL local
    const imageUrl = URL.createObjectURL(file);
    setEditedSection(prev => ({
      ...prev,
      image: { ...prev.image, url: imageUrl }
    }));
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre principal</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sous-titre</label>
              <textarea
                value={editedSection.subtitle || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, subtitle: e.target.value }))}
                className={styles.textarea}
                rows={2}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image de fond</label>
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className={styles.fileInput}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadButton}
                >
                  {editedSection.image?.url ? 'Changer l\'image' : 'Ajouter une image'}
                </button>
                {editedSection.image?.url && (
                  <div className={styles.imagePreview}>
                    <img src={editedSection.image.url} alt="Aperçu" />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Texte alternatif de l'image</label>
              <input
                type="text"
                value={editedSection.image?.alt || ''}
                onChange={(e) => setEditedSection(prev => ({
                  ...prev,
                  image: { ...prev.image, alt: e.target.value }
                }))}
                className={styles.input}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenu</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, content: e.target.value }))}
                className={styles.textarea}
                rows={6}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Alignement</label>
              <select
                value={editedSection.settings?.alignment || 'left'}
                onChange={(e) => setEditedSection(prev => ({
                  ...prev,
                  settings: { ...prev.settings, alignment: e.target.value }
                }))}
                className={styles.select}
              >
                <option value="left">Gauche</option>
                <option value="center">Centre</option>
                <option value="right">Droite</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Couleur de fond</label>
              <select
                value={editedSection.settings?.backgroundColor || ''}
                onChange={(e) => setEditedSection(prev => ({
                  ...prev,
                  settings: { ...prev.settings, backgroundColor: e.target.value }
                }))}
                className={styles.select}
              >
                <option value="">Par défaut</option>
                <option value="#f0fdfa">Vert clair</option>
                <option value="#fef7f0">Beige clair</option>
                <option value="#f0f7ff">Bleu clair</option>
              </select>
            </div>
          </div>
        );

      case 'image-text':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenu</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, content: e.target.value }))}
                className={styles.textarea}
                rows={6}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image</label>
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className={styles.fileInput}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadButton}
                >
                  {editedSection.image?.url ? 'Changer l\'image' : 'Ajouter une image'}
                </button>
                {editedSection.image?.url && (
                  <div className={styles.imagePreview}>
                    <img src={editedSection.image.url} alt="Aperçu" />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Texte alternatif de l'image</label>
              <input
                type="text"
                value={editedSection.image?.alt || ''}
                onChange={(e) => setEditedSection(prev => ({
                  ...prev,
                  image: { ...prev.image, alt: e.target.value }
                }))}
                className={styles.input}
              />
            </div>
          </div>
        );

      case 'card-grid':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre de la section</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, content: e.target.value }))}
                className={styles.textarea}
                rows={3}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Cartes</label>
              {(editedSection.items || []).map((item, index) => (
                <div key={index} className={styles.cardEditor}>
                  <div className={styles.cardHeader}>
                    <h4>Carte {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = editedSection.items.filter((_, i) => i !== index);
                        setEditedSection(prev => ({ ...prev, items: newItems }));
                      }}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Titre de la carte"
                    value={item.title || ''}
                    onChange={(e) => {
                      const newItems = [...editedSection.items];
                      newItems[index] = { ...item, title: e.target.value };
                      setEditedSection(prev => ({ ...prev, items: newItems }));
                    }}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Contenu de la carte"
                    value={item.content || ''}
                    onChange={(e) => {
                      const newItems = [...editedSection.items];
                      newItems[index] = { ...item, content: e.target.value };
                      setEditedSection(prev => ({ ...prev, items: newItems }));
                    }}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(editedSection.items || []), { title: '', content: '' }];
                  setEditedSection(prev => ({ ...prev, items: newItems }));
                }}
                className={styles.addButton}
              >
                Ajouter une carte
              </button>
            </div>
          </div>
        );

      case 'pricing-table':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre de la section</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tarifs</label>
              {(editedSection.items || []).map((item, index) => (
                <div key={index} className={styles.pricingEditor}>
                  <div className={styles.cardHeader}>
                    <h4>Tarif {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = editedSection.items.filter((_, i) => i !== index);
                        setEditedSection(prev => ({ ...prev, items: newItems }));
                      }}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de la prestation"
                    value={item.title || ''}
                    onChange={(e) => {
                      const newItems = [...editedSection.items];
                      newItems[index] = { ...item, title: e.target.value };
                      setEditedSection(prev => ({ ...prev, items: newItems }));
                    }}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Prix (ex: 70 €)"
                    value={item.price || ''}
                    onChange={(e) => {
                      const newItems = [...editedSection.items];
                      newItems[index] = { ...item, price: e.target.value };
                      setEditedSection(prev => ({ ...prev, items: newItems }));
                    }}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Description de la prestation"
                    value={item.content || ''}
                    onChange={(e) => {
                      const newItems = [...editedSection.items];
                      newItems[index] = { ...item, content: e.target.value };
                      setEditedSection(prev => ({ ...prev, items: newItems }));
                    }}
                    className={styles.textarea}
                    rows={2}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(editedSection.items || []), { title: '', price: '', content: '' }];
                  setEditedSection(prev => ({ ...prev, items: newItems }));
                }}
                className={styles.addButton}
              >
                Ajouter un tarif
              </button>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, content: e.target.value }))}
                className={styles.textarea}
                rows={2}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Boutons</label>
              {(editedSection.buttons || []).map((button, index) => (
                <div key={index} className={styles.buttonEditor}>
                  <input
                    type="text"
                    placeholder="Texte du bouton"
                    value={button.text || ''}
                    onChange={(e) => {
                      const newButtons = [...editedSection.buttons];
                      newButtons[index] = { ...button, text: e.target.value };
                      setEditedSection(prev => ({ ...prev, buttons: newButtons }));
                    }}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Lien (ex: /rdv)"
                    value={button.url || ''}
                    onChange={(e) => {
                      const newButtons = [...editedSection.buttons];
                      newButtons[index] = { ...button, url: e.target.value };
                      setEditedSection(prev => ({ ...prev, buttons: newButtons }));
                    }}
                    className={styles.input}
                  />
                  <select
                    value={button.style || 'primary'}
                    onChange={(e) => {
                      const newButtons = [...editedSection.buttons];
                      newButtons[index] = { ...button, style: e.target.value };
                      setEditedSection(prev => ({ ...prev, buttons: newButtons }));
                    }}
                    className={styles.select}
                  >
                    <option value="primary">Primaire</option>
                    <option value="secondary">Secondaire</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const newButtons = editedSection.buttons.filter((_, i) => i !== index);
                      setEditedSection(prev => ({ ...prev, buttons: newButtons }));
                    }}
                    className={styles.deleteButton}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newButtons = [...(editedSection.buttons || []), { text: '', url: '', style: 'primary' }];
                  setEditedSection(prev => ({ ...prev, buttons: newButtons }));
                }}
                className={styles.addButton}
              >
                Ajouter un bouton
              </button>
            </div>
          </div>
        );

      case 'list-sections':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Sections de liste</label>
              {(editedSection.sections || []).map((listSection, index) => (
                <div key={index} className={styles.cardEditor}>
                  <div className={styles.cardHeader}>
                    <h4>Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newSections = editedSection.sections.filter((_, i) => i !== index);
                        setEditedSection(prev => ({ ...prev, sections: newSections }));
                      }}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Titre de la section"
                    value={listSection.title || ''}
                    onChange={(e) => {
                      const newSections = [...editedSection.sections];
                      newSections[index] = { ...listSection, title: e.target.value };
                      setEditedSection(prev => ({ ...prev, sections: newSections }));
                    }}
                    className={styles.input}
                  />
                  <div className={styles.itemsList}>
                    <label>Éléments de la liste:</label>
                    {(listSection.items || []).map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.listItemEditor}>
                        <input
                          type="text"
                          placeholder="Élément de liste"
                          value={item || ''}
                          onChange={(e) => {
                            const newSections = [...editedSection.sections];
                            const newItems = [...listSection.items];
                            newItems[itemIndex] = e.target.value;
                            newSections[index] = { ...listSection, items: newItems };
                            setEditedSection(prev => ({ ...prev, sections: newSections }));
                          }}
                          className={styles.input}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSections = [...editedSection.sections];
                            const newItems = listSection.items.filter((_, i) => i !== itemIndex);
                            newSections[index] = { ...listSection, items: newItems };
                            setEditedSection(prev => ({ ...prev, sections: newSections }));
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
                        const newSections = [...editedSection.sections];
                        const newItems = [...(listSection.items || []), ''];
                        newSections[index] = { ...listSection, items: newItems };
                        setEditedSection(prev => ({ ...prev, sections: newSections }));
                      }}
                      className={styles.addButton}
                    >
                      Ajouter un élément
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newSections = [...(editedSection.sections || []), { title: '', items: [''] }];
                  setEditedSection(prev => ({ ...prev, sections: newSections }));
                }}
                className={styles.addButton}
              >
                Ajouter une section de liste
              </button>
            </div>
          </div>
        );

      case 'testimonial-list':
        return (
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Configuration des témoignages</label>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={editedSection.fetchFromApi || false}
                    onChange={(e) => setEditedSection(prev => ({ 
                      ...prev, 
                      fetchFromApi: e.target.checked 
                    }))}
                  />
                  Charger les témoignages depuis l'API
                </label>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Témoignages statiques</label>
              {(editedSection.staticTestimonials || []).map((testimonial, index) => (
                <div key={index} className={styles.cardEditor}>
                  <div className={styles.cardHeader}>
                    <h4>Témoignage {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newTestimonials = editedSection.staticTestimonials.filter((_, i) => i !== index);
                        setEditedSection(prev => ({ ...prev, staticTestimonials: newTestimonials }));
                      }}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de l'auteur"
                    value={testimonial.author || ''}
                    onChange={(e) => {
                      const newTestimonials = [...editedSection.staticTestimonials];
                      newTestimonials[index] = { ...testimonial, author: e.target.value };
                      setEditedSection(prev => ({ ...prev, staticTestimonials: newTestimonials }));
                    }}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Date (JJ/MM/AAAA)"
                    value={testimonial.date || ''}
                    onChange={(e) => {
                      const newTestimonials = [...editedSection.staticTestimonials];
                      newTestimonials[index] = { ...testimonial, date: e.target.value };
                      setEditedSection(prev => ({ ...prev, staticTestimonials: newTestimonials }));
                    }}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Message du témoignage"
                    value={testimonial.message || ''}
                    onChange={(e) => {
                      const newTestimonials = [...editedSection.staticTestimonials];
                      newTestimonials[index] = { ...testimonial, message: e.target.value };
                      setEditedSection(prev => ({ ...prev, staticTestimonials: newTestimonials }));
                    }}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newTestimonials = [...(editedSection.staticTestimonials || []), { 
                    author: '', 
                    date: '', 
                    message: '' 
                  }];
                  setEditedSection(prev => ({ ...prev, staticTestimonials: newTestimonials }));
                }}
                className={styles.addButton}
              >
                Ajouter un témoignage statique
              </button>
            </div>
          </div>
        );

      case 'contact-info':
      case 'testimonial-form':
      case 'appointment-widget':
      case 'contact-form-map':
        return (
          <div className={styles.editorForm}>
            <div className={styles.infoBox}>
              <h4>🔧 Section de composant</h4>
              <p>Cette section utilise un composant pré-défini et ne nécessite pas de configuration particulière.</p>
              <p><strong>Type:</strong> {section.type}</p>
            </div>
            <div className={styles.formGroup}>
              <label>Titre (optionnel)</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => setEditedSection(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
                placeholder="Titre de la section"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.editorForm}>
            <div className={styles.errorBox}>
              <h4>⚠️ Type de section non supporté</h4>
              <p>Le type <code>{section.type}</code> n'est pas encore implémenté dans l'éditeur.</p>
            </div>
          </div>
        );
    }
  };

  if (!isEditing) {
    return (
      <div className={styles.sectionPreview}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionInfo}>
            <h3>{section.title || `Section ${section.type}`}</h3>
            <span className={styles.sectionType}>{section.type}</span>
          </div>
          <div className={styles.sectionActions}>
            <button onClick={() => setIsEditing(true)} className={styles.editButton}>
              ✏️ Modifier
            </button>
            <button onClick={() => onDuplicate(section.id)} className={styles.duplicateButton}>
              📋 Dupliquer
            </button>
            <button onClick={() => onDelete(section.id)} className={styles.deleteButton}>
              🗑️ Supprimer
            </button>
          </div>
        </div>
        <div className={styles.sectionPreviewContent}>
          {section.type === 'hero' && (
            <div>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
              {section.image?.url && <p>🖼️ Image: {section.image.url}</p>}
            </div>
          )}
          {section.type === 'text' && (
            <div>
              <h3>{section.title}</h3>
              <p>{section.content?.substring(0, 200)}...</p>
            </div>
          )}
          {section.type === 'image-text' && (
            <div>
              <h3>{section.title}</h3>
              <p>{section.content?.substring(0, 150)}...</p>
              {section.image?.url && <p>🖼️ Image incluse</p>}
            </div>
          )}
          {section.type === 'card-grid' && (
            <div>
              <h3>{section.title}</h3>
              <p>{section.items?.length || 0} cartes</p>
            </div>
          )}
          {section.type === 'pricing-table' && (
            <div>
              <h3>{section.title}</h3>
              <p>{section.items?.length || 0} tarifs</p>
            </div>
          )}
          {section.type === 'cta' && (
            <div>
              <h3>{section.title}</h3>
              <p>{section.buttons?.length || 0} boutons</p>
            </div>
          )}
          {section.type === 'list-sections' && (
            <div>
              <h3>Sections de liste</h3>
              <p>{section.sections?.length || 0} sections</p>
            </div>
          )}
          {section.type === 'testimonial-list' && (
            <div>
              <h3>Liste de témoignages</h3>
              <p>{section.staticTestimonials?.length || 0} témoignages statiques</p>
              <p>API: {section.fetchFromApi ? 'Activée' : 'Désactivée'}</p>
            </div>
          )}
          {['contact-info', 'testimonial-form', 'appointment-widget', 'contact-form-map'].includes(section.type) && (
            <div>
              <h3>Composant: {section.type}</h3>
              <p>Section automatique - Pas de configuration nécessaire</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sectionEditor}>
      <div className={styles.editorHeader}>
        <h3>Modifier {section.type}</h3>
        <div className={styles.editorActions}>
          <button onClick={handleCancel} className={styles.cancelButton}>
            Annuler
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Sauvegarder
          </button>
        </div>
      </div>
      {renderEditor()}
    </div>
  );
};

const ContentEditor = ({ pageId }) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPageContent();
  }, [pageId]);

  const fetchPageContent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/pages/${pageId}`);
      setPageContent(response.data.data);
    } catch (err) {
      setError('Erreur lors du chargement du contenu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePageContent = async () => {
    try {
      setSaving(true);
      await api.put(`/admin/pages/${pageId}`, pageContent);
      alert('Contenu sauvegardé avec succès !');
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      order: pageContent.sections.length,
      settings: { visible: true }
    };

    // Ajouter des propriétés par défaut selon le type
    if (type === 'card-grid') {
      newSection.items = [{ title: '', content: '' }];
    } else if (type === 'pricing-table') {
      newSection.items = [{ title: '', price: '', content: '' }];
    } else if (type === 'cta') {
      newSection.buttons = [{ text: '', url: '', style: 'primary' }];
    } else if (type === 'list-sections') {
      newSection.sections = [{ title: '', items: [''] }];
    } else if (type === 'testimonial-list') {
      newSection.staticTestimonials = [];
      newSection.fetchFromApi = true;
    } else if (type === 'image-text') {
      newSection.image = { url: '', alt: '' };
    } else if (type === 'hero') {
      newSection.image = { url: '', alt: '' };
      newSection.subtitle = '';
    }

    setPageContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId, updatedSection) => {
    setPageContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updatedSection } : section
      )
    }));
  };

  const deleteSection = (sectionId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) {
      setPageContent(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }));
    }
  };

  const duplicateSection = (sectionId) => {
    const section = pageContent.sections.find(s => s.id === sectionId);
    if (section) {
      const duplicated = {
        ...section,
        id: Date.now().toString(),
        title: section.title + ' (copie)',
        order: section.order + 1
      };
      
      setPageContent(prev => ({
        ...prev,
        sections: [...prev.sections, duplicated]
      }));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sections = Array.from(pageContent.sections);
    const [reorderedItem] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour l'ordre
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index
    }));

    setPageContent(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!pageContent) return <div className={styles.error}>Aucun contenu trouvé</div>;

  return (
    <div className={styles.contentEditor}>
      <div className={styles.editorHeader}>
        <h1>Éditer : {pageContent.title}</h1>
        <button 
          onClick={savePageContent} 
          disabled={saving}
          className={styles.savePageButton}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder la page'}
        </button>
      </div>

      <div className={styles.editorControls}>
        <h3>Ajouter une section</h3>
        <div className={styles.sectionButtons}>
          <button onClick={() => addSection('hero')} className={styles.addSectionButton}>
            🖼️ Hero
          </button>
          <button onClick={() => addSection('text')} className={styles.addSectionButton}>
            📝 Texte
          </button>
          <button onClick={() => addSection('image-text')} className={styles.addSectionButton}>
            🖼️ Image + Texte
          </button>
          <button onClick={() => addSection('card-grid')} className={styles.addSectionButton}>
            🃏 Grille de cartes
          </button>
          <button onClick={() => addSection('pricing-table')} className={styles.addSectionButton}>
            💰 Tableau des tarifs
          </button>
          <button onClick={() => addSection('cta')} className={styles.addSectionButton}>
            🎯 Call-to-Action
          </button>
          <button onClick={() => addSection('list-sections')} className={styles.addSectionButton}>
            📋 Sections de liste
          </button>
          <button onClick={() => addSection('testimonial-list')} className={styles.addSectionButton}>
            💬 Liste témoignages
          </button>
          <button onClick={() => addSection('contact-info')} className={styles.addSectionButton}>
            📞 Infos contact
          </button>
          <button onClick={() => addSection('testimonial-form')} className={styles.addSectionButton}>
            📝 Formulaire témoignage
          </button>
          <button onClick={() => addSection('appointment-widget')} className={styles.addSectionButton}>
            📅 Widget RDV
          </button>
          <button onClick={() => addSection('contact-form-map')} className={styles.addSectionButton}>
            🗺️ Contact + Carte
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className={styles.sectionsContainer}>
              {pageContent.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={styles.sectionItem}
                      >
                        <div {...provided.dragHandleProps} className={styles.dragHandle}>
                          ⋮⋮
                        </div>
                        <SectionEditor
                          section={section}
                          onUpdate={updateSection}
                          onDelete={deleteSection}
                          onDuplicate={duplicateSection}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ContentEditor;