import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import api from '../utils/api';
import styles from '../styles/components/ContentEditor.module.css';

// Composants d'édition pour chaque type de section
const SectionEditor = ({ section, onUpdate, onDelete, onDuplicate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState({ ...section });
  const fileInputRef = useRef(null);

  // Synchroniser les modifications quand la section change
  useEffect(() => {
    setEditedSection({ ...section });
  }, [section]);

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

    // Simuler l'upload - remplacer par votre service d'upload réel
    const imageUrl = URL.createObjectURL(file);
    setEditedSection(prev => ({
      ...prev,
      image: { 
        url: imageUrl, 
        alt: prev.image?.alt || prev.title || 'Image' 
      }
    }));
  };

  const updateSectionField = (field, value) => {
    setEditedSection(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parentField, field, value) => {
    setEditedSection(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [field]: value }
    }));
  };

  const updateArrayItem = (arrayField, index, field, value) => {
    setEditedSection(prev => {
      const newArray = [...(prev[arrayField] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayField]: newArray };
    });
  };

  const addArrayItem = (arrayField, defaultItem) => {
    setEditedSection(prev => ({
      ...prev,
      [arrayField]: [...(prev[arrayField] || []), defaultItem]
    }));
  };

  const removeArrayItem = (arrayField, index) => {
    setEditedSection(prev => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index)
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
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de votre hero"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sous-titre</label>
              <textarea
                value={editedSection.subtitle || ''}
                onChange={(e) => updateSectionField('subtitle', e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Sous-titre descriptif"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image de fond</label>
              <div className={styles.imageUpload}>
                <input
                  type="text"
                  value={editedSection.image?.url || ''}
                  onChange={(e) => updateNestedField('image', 'url', e.target.value)}
                  className={styles.input}
                  placeholder="URL de l'image (ou utilisez le bouton ci-dessous)"
                />
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
                  {editedSection.image?.url ? 'Changer l\'image' : 'Choisir une image'}
                </button>
                {editedSection.image?.url && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={editedSection.image.url} 
                      alt="Aperçu" 
                      style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Texte alternatif de l'image</label>
              <input
                type="text"
                value={editedSection.image?.alt || ''}
                onChange={(e) => updateNestedField('image', 'alt', e.target.value)}
                className={styles.input}
                placeholder="Description de l'image pour l'accessibilité"
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
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de la section"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenu</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => updateSectionField('content', e.target.value)}
                className={styles.textarea}
                rows={8}
                placeholder="Contenu de votre section. Utilisez des retours à la ligne pour séparer les paragraphes."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Alignement</label>
              <select
                value={editedSection.settings?.alignment || 'left'}
                onChange={(e) => updateNestedField('settings', 'alignment', e.target.value)}
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
                value={editedSection.settings?.backgroundColor || ''}
                onChange={(e) => updateNestedField('settings', 'backgroundColor', e.target.value)}
                className={styles.select}
              >
                <option value="">Par défaut</option>
                <option value="#f0fdfa">Vert clair</option>
                <option value="#fef7f0">Beige clair</option>
                <option value="#f0f7ff">Bleu clair</option>
                <option value="#faf5ff">Violet clair</option>
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
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de la section"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contenu</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => updateSectionField('content', e.target.value)}
                className={styles.textarea}
                rows={8}
                placeholder="Contenu textuel"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image</label>
              <div className={styles.imageUpload}>
                <input
                  type="text"
                  value={editedSection.image?.url || ''}
                  onChange={(e) => updateNestedField('image', 'url', e.target.value)}
                  className={styles.input}
                  placeholder="URL de l'image"
                />
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
                  {editedSection.image?.url ? 'Changer l\'image' : 'Choisir une image'}
                </button>
                {editedSection.image?.url && (
                  <div className={styles.imagePreview}>
                    <img 
                      src={editedSection.image.url} 
                      alt="Aperçu"
                      style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Position de l'image</label>
              <select
                value={editedSection.settings?.imagePosition || 'left'}
                onChange={(e) => updateNestedField('settings', 'imagePosition', e.target.value)}
                className={styles.select}
              >
                <option value="left">À gauche</option>
                <option value="right">À droite</option>
                <option value="top">Au-dessus</option>
                <option value="bottom">En-dessous</option>
              </select>
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
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre principal de la grille"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => updateSectionField('content', e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Description introductive"
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
                      onClick={() => removeArrayItem('items', index)}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Titre de la carte"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Contenu de la carte"
                    value={item.content || ''}
                    onChange={(e) => updateArrayItem('items', index, 'content', e.target.value)}
                    className={styles.textarea}
                    rows={4}
                  />
                  <input
                    type="text"
                    placeholder="URL de l'image (optionnel)"
                    value={item.image?.url || ''}
                    onChange={(e) => {
                      const newItems = [...(editedSection.items || [])];
                      newItems[index] = { 
                        ...newItems[index], 
                        image: { 
                          url: e.target.value, 
                          alt: newItems[index]?.image?.alt || newItems[index]?.title || 'Image'
                        }
                      };
                      updateSectionField('items', newItems);
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
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre de la section</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de vos tarifs"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => updateSectionField('content', e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Introduction aux tarifs"
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
                      onClick={() => removeArrayItem('items', index)}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de la prestation"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Prix (ex: 70€, Gratuit, Sur devis)"
                    value={item.price || ''}
                    onChange={(e) => updateArrayItem('items', index, 'price', e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Description de la prestation"
                    value={item.content || ''}
                    onChange={(e) => updateArrayItem('items', index, 'content', e.target.value)}
                    className={styles.textarea}
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Durée (ex: 1h, 30 min)"
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
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre du call-to-action"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editedSection.content || ''}
                onChange={(e) => updateSectionField('content', e.target.value)}
                className={styles.textarea}
                rows={3}
                placeholder="Texte d'accompagnement"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Boutons d'action</label>
              {(editedSection.buttons || []).map((button, index) => (
                <div key={index} className={styles.buttonEditor}>
                  <input
                    type="text"
                    placeholder="Texte du bouton"
                    value={button.text || ''}
                    onChange={(e) => updateArrayItem('buttons', index, 'text', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Lien (ex: /rdv, mailto:email@example.com, tel:+33123456789)"
                    value={button.url || ''}
                    onChange={(e) => updateArrayItem('buttons', index, 'url', e.target.value)}
                    className={styles.input}
                  />
                  <select
                    value={button.style || 'primary'}
                    onChange={(e) => updateArrayItem('buttons', index, 'style', e.target.value)}
                    className={styles.select}
                  >
                    <option value="primary">Bouton principal (vert)</option>
                    <option value="secondary">Bouton secondaire (gris)</option>
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
          <div className={styles.editorForm}>
            <div className={styles.formGroup}>
              <label>Titre principal</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre de la section"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sous-sections avec listes</label>
              {(editedSection.sections || []).map((listSection, index) => (
                <div key={index} className={styles.cardEditor}>
                  <div className={styles.cardHeader}>
                    <h4>Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sections', index)}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Titre de la sous-section"
                    value={listSection.title || ''}
                    onChange={(e) => {
                      const newSections = [...(editedSection.sections || [])];
                      newSections[index] = { ...listSection, title: e.target.value };
                      updateSectionField('sections', newSections);
                    }}
                    className={styles.input}
                  />
                  <div className={styles.itemsList}>
                    <label>Éléments de la liste :</label>
                    {(listSection.items || []).map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.listItemEditor}>
                        <input
                          type="text"
                          placeholder="Élément de liste"
                          value={item || ''}
                          onChange={(e) => {
                            const newSections = [...(editedSection.sections || [])];
                            const newItems = [...(listSection.items || [])];
                            newItems[itemIndex] = e.target.value;
                            newSections[index] = { ...listSection, items: newItems };
                            updateSectionField('sections', newSections);
                          }}
                          className={styles.input}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSections = [...(editedSection.sections || [])];
                            const newItems = (listSection.items || []).filter((_, i) => i !== itemIndex);
                            newSections[index] = { ...listSection, items: newItems };
                            updateSectionField('sections', newSections);
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
                        const newSections = [...(editedSection.sections || [])];
                        const newItems = [...(listSection.items || []), ''];
                        newSections[index] = { ...listSection, items: newItems };
                        updateSectionField('sections', newSections);
                      }}
                      className={styles.addButton}
                    >
                      ➕ Ajouter un élément
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('sections', { title: '', items: [''] })}
                className={styles.addButton}
              >
                ➕ Ajouter une sous-section
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
                    onChange={(e) => updateSectionField('fetchFromApi', e.target.checked)}
                  />
                  Afficher les témoignages depuis la base de données
                </label>
              </div>
              <small className={styles.helpText}>
                Si coché, les témoignages validés depuis l'interface admin seront affichés automatiquement.
              </small>
            </div>
            <div className={styles.formGroup}>
              <label>Témoignages statiques (toujours affichés)</label>
              {(editedSection.staticTestimonials || []).map((testimonial, index) => (
                <div key={index} className={styles.cardEditor}>
                  <div className={styles.cardHeader}>
                    <h4>Témoignage {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('staticTestimonials', index)}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de l'auteur"
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
                    placeholder="Message du témoignage"
                    value={testimonial.message || ''}
                    onChange={(e) => updateArrayItem('staticTestimonials', index, 'message', e.target.value)}
                    className={styles.textarea}
                    rows={4}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('staticTestimonials', { author: '', date: '', message: '' })}
                className={styles.addButton}
              >
                ➕ Ajouter un témoignage statique
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
              <p><strong>Description:</strong> {getSectionDescription(section.type)}</p>
            </div>
            <div className={styles.formGroup}>
              <label>Titre (optionnel)</label>
              <input
                type="text"
                value={editedSection.title || ''}
                onChange={(e) => updateSectionField('title', e.target.value)}
                className={styles.input}
                placeholder="Titre personnalisé pour cette section"
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
              <p>Veuillez contacter le développeur pour ajouter ce type de section.</p>
            </div>
          </div>
        );
    }
  };

  const getSectionDescription = (type) => {
    const descriptions = {
      'contact-info': 'Affiche les informations de contact (téléphone, email, adresse, réseaux sociaux)',
      'testimonial-form': 'Formulaire permettant aux visiteurs de laisser un témoignage',
      'appointment-widget': 'Widget Calendly pour la prise de rendez-vous',
      'contact-form-map': 'Combine le formulaire de contact avec la carte de localisation'
    };
    return descriptions[type] || 'Composant personnalisé';
  };

  const getSectionPreview = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div>
            <h2 style={{ color: '#2d5a3d', marginBottom: '10px' }}>{section.title || 'Titre du hero'}</h2>
            {section.subtitle && <p style={{ color: '#64748b', marginBottom: '10px' }}>{section.subtitle}</p>}
            {section.image?.url && <p style={{ color: '#48bb78' }}>🖼️ Image: {section.image.url.substring(0, 50)}...</p>}
          </div>
        );

      case 'text':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>{section.title || 'Section de texte'}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.content ? `${section.content.substring(0, 150)}...` : 'Aucun contenu'}
            </p>
            {section.settings?.backgroundColor && (
              <p style={{ color: '#48bb78', fontSize: '12px' }}>
                Couleur de fond: {section.settings.backgroundColor}
              </p>
            )}
          </div>
        );

      case 'image-text':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>{section.title || 'Image + Texte'}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.content ? `${section.content.substring(0, 100)}...` : 'Aucun contenu'}
            </p>
            {section.image?.url && <p style={{ color: '#48bb78', fontSize: '12px' }}>🖼️ Image incluse</p>}
          </div>
        );

      case 'card-grid':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>{section.title || 'Grille de cartes'}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.items?.length || 0} carte(s) configurée(s)
            </p>
          </div>
        );

      case 'pricing-table':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>{section.title || 'Tableau des tarifs'}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.items?.length || 0} tarif(s) configuré(s)
            </p>
          </div>
        );

      case 'cta':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>{section.title || 'Call-to-Action'}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.buttons?.length || 0} bouton(s) configuré(s)
            </p>
          </div>
        );

      case 'list-sections':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>Sections de liste</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.sections?.length || 0} sous-section(s)
            </p>
          </div>
        );

      case 'testimonial-list':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>Liste de témoignages</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {section.staticTestimonials?.length || 0} témoignage(s) statique(s)
            </p>
            <p style={{ color: '#48bb78', fontSize: '12px' }}>
              API: {section.fetchFromApi ? 'Activée' : 'Désactivée'}
            </p>
          </div>
        );

      case 'contact-info':
      case 'testimonial-form':
      case 'appointment-widget':
      case 'contact-form-map':
        return (
          <div>
            <h3 style={{ color: '#2d5a3d', marginBottom: '8px' }}>Composant: {section.type}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {getSectionDescription(section.type)}
            </p>
          </div>
        );

      default:
        return (
          <div>
            <h3 style={{ color: '#dc2626', marginBottom: '8px' }}>⚠️ Type non supporté: {section.type}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Ce type de section n'est pas encore implémenté.
            </p>
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
          {getSectionPreview()}
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
            ❌ Annuler
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            💾 Sauvegarder
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
      if (response.data && response.data.data) {
        setPageContent(response.data.data);
      } else {
        // Créer une structure de base si aucune donnée
        setPageContent({
          title: `Page ${pageId}`,
          sections: []
        });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        console.error('Erreur lors du chargement:', err);
        setError('Erreur lors du chargement du contenu: ' + (err.response?.data?.message || err.message));
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

  const savePageContent = async () => {
    if (!pageContent) return;
    
    try {
      setSaving(true);
      setError('');
      await api.put(`/admin/pages/${pageId}`, pageContent);
      alert('✅ Contenu sauvegardé avec succès !');
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError('Erreur lors de la sauvegarde: ' + (err.response?.data?.message || err.message));
      alert('❌ Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
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

    // Ajouter des propriétés par défaut selon le type
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
        newSection.items = [{ title: 'Nouvelle carte', content: 'Description de la carte', image: { url: '', alt: '' } }];
        break;
      
      case 'pricing-table':
        newSection.items = [{ title: 'Nouvelle prestation', price: '0€', content: 'Description de la prestation', duration: '1h' }];
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
      
      default:
        // Pas de propriétés supplémentaires pour les autres types
        break;
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
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette section ?\n\nCette action est irréversible.')) {
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
        ...JSON.parse(JSON.stringify(section)), // Deep copy
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: section.title ? `${section.title} (copie)` : 'Section (copie)',
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement du contenu de la page...</p>
      </div>
    );
  }

  if (error && !pageContent) {
    return (
      <div className={styles.errorContainer}>
        <h2>❌ Erreur de chargement</h2>
        <p>{error}</p>
        <button onClick={fetchPageContent} className={styles.retryButton}>
          🔄 Réessayer
        </button>
      </div>
    );
  }

  const sortedSections = pageContent.sections
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className={styles.contentEditor}>
      <div className={styles.editorHeader}>
        <div>
          <h1>✏️ Édition : {pageContent.title}</h1>
          <p className={styles.pageInfo}>
            {pageContent.sections.length} section(s) • Page ID: {pageId}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={savePageContent} 
            disabled={saving}
            className={styles.savePageButton}
          >
            {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder la page'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          ❌ {error}
        </div>
      )}

      <div className={styles.editorControls}>
        <h3>➕ Ajouter une section</h3>
        <p className={styles.controlsSubtitle}>
          Choisissez le type de contenu que vous souhaitez ajouter à votre page
        </p>
        <div className={styles.sectionButtons}>
          <button onClick={() => addSection('hero')} className={styles.addSectionButton}>
            🖼️ Hero<br/><small>Bannière principale</small>
          </button>
          <button onClick={() => addSection('text')} className={styles.addSectionButton}>
            📝 Texte<br/><small>Paragraphe simple</small>
          </button>
          <button onClick={() => addSection('image-text')} className={styles.addSectionButton}>
            🖼️ Image + Texte<br/><small>Contenu mixte</small>
          </button>
          <button onClick={() => addSection('card-grid')} className={styles.addSectionButton}>
            🃏 Grille de cartes<br/><small>Plusieurs éléments</small>
          </button>
          <button onClick={() => addSection('pricing-table')} className={styles.addSectionButton}>
            💰 Tarifs<br/><small>Liste des prix</small>
          </button>
          <button onClick={() => addSection('cta')} className={styles.addSectionButton}>
            🎯 Call-to-Action<br/><small>Boutons d'action</small>
          </button>
          <button onClick={() => addSection('list-sections')} className={styles.addSectionButton}>
            📋 Listes<br/><small>Éléments à puces</small>
          </button>
          <button onClick={() => addSection('testimonial-list')} className={styles.addSectionButton}>
            💬 Témoignages<br/><small>Avis clients</small>
          </button>
          <button onClick={() => addSection('contact-info')} className={styles.addSectionButton}>
            📞 Contact<br/><small>Coordonnées</small>
          </button>
          <button onClick={() => addSection('testimonial-form')} className={styles.addSectionButton}>
            📝 Form. témoignage<br/><small>Collecter avis</small>
          </button>
          <button onClick={() => addSection('appointment-widget')} className={styles.addSectionButton}>
            📅 Prise RDV<br/><small>Widget Calendly</small>
          </button>
          <button onClick={() => addSection('contact-form-map')} className={styles.addSectionButton}>
            🗺️ Contact + Carte<br/><small>Form + localisation</small>
          </button>
        </div>
      </div>

      <div className={styles.sectionsHeader}>
        <h3>📝 Sections de la page ({sortedSections.length})</h3>
        <p className={styles.sectionsSubtitle}>
          Glissez-déposez pour réorganiser • Cliquez sur "Modifier" pour éditer
        </p>
      </div>

      {sortedSections.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <h3>📄 Aucune section</h3>
            <p>Cette page est vide. Commencez par ajouter une section ci-dessus.</p>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={styles.sectionsContainer}>
                {sortedSections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${styles.sectionItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                      >
                        <div {...provided.dragHandleProps} className={styles.dragHandle} title="Glisser pour réorganiser">
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
      )}

      <div className={styles.editorFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerInfo}>
            <p><strong>💡 Conseils d'utilisation :</strong></p>
            <ul>
              <li>Sauvegardez régulièrement vos modifications</li>
              <li>Utilisez la section "Hero" en première position pour un impact visuel</li>
              <li>Alternez les types de sections pour un contenu dynamique</li>
              <li>Testez l'affichage sur différents appareils</li>
            </ul>
          </div>
          <div className={styles.footerActions}>
            <button 
              onClick={savePageContent} 
              disabled={saving}
              className={styles.savePageButton}
            >
              {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder la page'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;