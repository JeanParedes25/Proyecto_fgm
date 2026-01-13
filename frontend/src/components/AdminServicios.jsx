import { useState, useEffect } from 'react';
import './AdminServicios.css';

function AdminServicios() {
  // FUNCIÓN PARA AGREGAR FOTOS
  const handleFotoChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotosParaSubir(prev => [...prev, {
          file: file,
          preview: reader.result,
          descripcion: ''
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDescripcionFoto = (index, descripcion) => {
    setFotosParaSubir(prev => {
      const nuevasFotos = [...prev];
      nuevasFotos[index].descripcion = descripcion;
      return nuevasFotos;
    });
  };

  const removeFotoParaSubir = (index) => {
    setFotosParaSubir(prev => prev.filter((_, i) => i !== index));
  };

  const removeFotoExistente = (index) => {
    setFotoExistentes(prev => prev.filter((_, i) => i !== index));
  };

  // FUNCIONES PARA ATAÚDES
  const handleAtaudChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAtaudesParaSubir(prev => [...prev, {
          file: file,
          preview: reader.result,
          nombre: '',
          descripcion: '',
          precio: 0
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAtaudDataChange = (index, field, value) => {
    setAtaudesParaSubir(prev => {
      const nuevos = [...prev];
      nuevos[index][field] = value;
      return nuevos;
    });
  };

  const removeAtaudParaSubir = (index) => {
    setAtaudesParaSubir(prev => prev.filter((_, i) => i !== index));
  };

  const removeAtaudExistente = (index) => {
    setAtaudesExistentes(prev => prev.filter((_, i) => i !== index));
  };

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fotosParaSubir, setFotosParaSubir] = useState([]);
  const [fotoExistentes, setFotoExistentes] = useState([]);
  const [ataudesParaSubir, setAtaudesParaSubir] = useState([]);
  const [ataudesExistentes, setAtaudesExistentes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    nombrePlan: '',
    icono: '',
    color: '',
    descripcion: '',
    descripcionPlan: '',
    introduccion: '',
    cantidadSalas: 0,
    precio: 0,
    includes: [],
    additional: [],
    noChargeServices: [],
    extraServices: [],
    brindamos: [],
    fotos: [],
    halls: [],
    capacity: '',
    ataudes: [],
    misaEnVivo: {
      disponible: false,
      precio: 0
    }
  });
  const [inputFields, setInputFields] = useState({
    includes: '',
    additional: '',
    noChargeServices: '',
    extraServices: '',
    brindamos: '',
    halls: ''
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/servicios');
      
      if (response.ok) {
        const data = await response.json();
        setServicios(data.servicios || []);
      }
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInputFieldChange = (e, fieldType) => {
    setInputFields(prev => ({
      ...prev,
      [fieldType]: e.target.value
    }));
  };

  const addToArray = (fieldType) => {
    const value = inputFields[fieldType].trim();
    if (value) {
      setFormData(prev => ({
        ...prev,
        [fieldType]: [...(prev[fieldType] || []), value]
      }));
      setInputFields(prev => ({
        ...prev,
        [fieldType]: ''
      }));
    }
  };

  const removeFromArray = (fieldType, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldType]: prev[fieldType].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Agregar campos básicos
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('nombrePlan', formData.nombrePlan);
      formDataToSend.append('icono', formData.icono);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('descripcionPlan', formData.descripcionPlan);
      formDataToSend.append('introduccion', formData.introduccion);
      formDataToSend.append('cantidadSalas', formData.cantidadSalas);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('misaEnVivo', JSON.stringify(formData.misaEnVivo));
      
      // Agregar arrays
      formDataToSend.append('includes', JSON.stringify(formData.includes));
      formDataToSend.append('additional', JSON.stringify(formData.additional));
      formDataToSend.append('noChargeServices', JSON.stringify(formData.noChargeServices));
      formDataToSend.append('extraServices', JSON.stringify(formData.extraServices));
      formDataToSend.append('brindamos', JSON.stringify(formData.brindamos));
      formDataToSend.append('halls', JSON.stringify(formData.halls));
      
      // Agregar fotos existentes
      if (fotoExistentes.length > 0) {
        formDataToSend.append('fotosExistentes', JSON.stringify(fotoExistentes));
      }
      
      // Agregar ataúdes existentes
      if (ataudesExistentes.length > 0) {
        formDataToSend.append('ataudesExistentes', JSON.stringify(ataudesExistentes));
      }
      
      // Agregar nuevas fotos
      let fotoIndex = 0;
      fotosParaSubir.forEach((foto) => {
        formDataToSend.append('fotos[]', foto.file);
        formDataToSend.append(`fotoMeta[${fotoIndex}][descripcion]`, foto.descripcion);
        formDataToSend.append(`fotoMeta[${fotoIndex}][tipo]`, 'foto');
        fotoIndex++;
      });

      // Agregar nuevos ataúdes
      let ataudIndex = 0;
      ataudesParaSubir.forEach((ataud) => {
        formDataToSend.append('fotos[]', ataud.file);
        formDataToSend.append(`ataudMeta[${ataudIndex}][nombre]`, ataud.nombre);
        formDataToSend.append(`ataudMeta[${ataudIndex}][descripcion]`, ataud.descripcion);
        formDataToSend.append(`ataudMeta[${ataudIndex}][precio]`, ataud.precio);
        formDataToSend.append(`ataudMeta[${ataudIndex}][tipo]`, 'ataud');
        ataudIndex++;
      });
      
      const url = editingId 
        ? `http://localhost:5000/api/servicios/${editingId}`
        : 'http://localhost:5000/api/servicios';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingId ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente');
        resetForm();
        fetchServicios();
      } else {
        const error = await response.json();
        alert(`Error: ${error.mensaje || 'No se pudo guardar el servicio'}`);
      }
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      alert('Error al guardar el servicio');
    }
  };

  const handleEdit = (servicio) => {
    setEditingId(servicio._id);
    setFormData({
      nombre: servicio.nombre,
      nombrePlan: servicio.nombrePlan || '',
      icono: servicio.icono,
      color: servicio.color,
      descripcion: servicio.descripcion || '',
      descripcionPlan: servicio.descripcionPlan || '',
      introduccion: servicio.introduccion,
      cantidadSalas: servicio.cantidadSalas || 0,
      precio: servicio.precio || 0,
      includes: servicio.includes || [],
      additional: servicio.additional || [],
      noChargeServices: servicio.noChargeServices || [],
      extraServices: servicio.extraServices || [],
      brindamos: servicio.brindamos || [],
      fotos: servicio.fotos || [],
      halls: servicio.halls || [],
      capacity: servicio.capacity || '',
      ataudes: servicio.ataudes || [],
      misaEnVivo: servicio.misaEnVivo || { disponible: false, precio: 0 }
    });
    setFotoExistentes(servicio.fotos || []);
    setFotosParaSubir([]);
    setAtaudesExistentes(servicio.ataudes || []);
    setAtaudesParaSubir([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este servicio?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/servicios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Servicio eliminado exitosamente');
        fetchServicios();
      } else {
        alert('Error al eliminar el servicio');
      }
    } catch (err) {
      console.error('Error al eliminar servicio:', err);
      alert('Error al eliminar el servicio');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      nombrePlan: '',
      icono: '',
      color: '',
      descripcion: '',
      descripcionPlan: '',
      introduccion: '',
      cantidadSalas: 0,
      precio: 0,
      includes: [],
      additional: [],
      noChargeServices: [],
      extraServices: [],
      brindamos: [],
      fotos: [],
      halls: [],
      capacity: '',
      ataudes: [],
      misaEnVivo: {
        disponible: false,
        precio: 0
      }
    });
    setInputFields({
      includes: '',
      additional: '',
      noChargeServices: '',
      extraServices: '',
      brindamos: '',
      halls: ''
    });
    setFotoExistentes([]);
    setFotosParaSubir([]);
    setAtaudesExistentes([]);
    setAtaudesParaSubir([]);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-servicios">
        <div className="loading">Cargando servicios...</div>
      </div>
    );
  }

  return (
    <div className="admin-servicios">
      <div className="servicios-header">
        <h2>🎁 Gestión de Servicios Exequiales</h2>
        <button 
          className="btn-nuevo"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Servicio'}
        </button>
      </div>

      {showForm && (
        <div className="servicio-form-container">
          <h3>{editingId ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}</h3>
          <form onSubmit={handleSubmit} className="servicio-form">
            {/* Datos Básicos */}
            <div className="form-section-title">📝 Datos Básicos del Servicio</div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Servicio *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Servicio Exequial Estándar"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nombrePlan">Nombre del Plan</label>
                <input
                  type="text"
                  id="nombrePlan"
                  name="nombrePlan"
                  value={formData.nombrePlan}
                  onChange={handleInputChange}
                  placeholder="Ej: Plan Premium"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="icono">Icono (emoji) *</label>
                <input
                  type="text"
                  id="icono"
                  name="icono"
                  value={formData.icono}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: ⚱️"
                  maxLength="2"
                />
              </div>
              <div className="form-group">
                <label htmlFor="color">Color (hex) *</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cantidadSalas">Cantidad de Salas</label>
                <input
                  type="number"
                  id="cantidadSalas"
                  name="cantidadSalas"
                  value={formData.cantidadSalas}
                  onChange={handleInputChange}
                  placeholder="Ej: 3"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="precio">Precio del Servicio ($) *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 150"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="descripcion">Descripción corta</label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción breve del servicio"
                />
              </div>
              <div className="form-group">
                <label htmlFor="capacity">Capacidad</label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Ej: 100 personas"
                />
              </div>
            </div>

            <div className="form-group full">
              <label htmlFor="introduccion">Introducción / Descripción general *</label>
              <textarea
                id="introduccion"
                name="introduccion"
                value={formData.introduccion}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Descripción detallada del servicio..."
              ></textarea>
            </div>

            <div className="form-group full">
              <label htmlFor="descripcionPlan">Descripción del Plan</label>
              <textarea
                id="descripcionPlan"
                name="descripcionPlan"
                value={formData.descripcionPlan}
                onChange={handleInputChange}
                rows="3"
                placeholder="Descripción especifica del plan..."
              ></textarea>
            </div>

            {/* Servicios Incluidos */}
            <div className="form-section-title">✅ El Servicio Incluye</div>
            <div className="form-group array-input full">
              <div className="array-input-group">
                <input
                  type="text"
                  value={inputFields.includes}
                  onChange={(e) => handleInputFieldChange(e, 'includes')}
                  placeholder="Ej: Trámites Legales"
                />
                <button type="button" onClick={() => addToArray('includes')}>Agregar</button>
              </div>
              <div className="array-items">
                {formData.includes.map((item, idx) => (
                  <span key={idx} className="array-item">
                    - {item}
                    <button type="button" onClick={() => removeFromArray('includes', idx)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Servicios Adicionales */}
            <div className="form-section-title">⭐ Servicios Adicionales</div>
            <div className="form-group array-input full">
              <div className="array-input-group">
                <input
                  type="text"
                  value={inputFields.additional}
                  onChange={(e) => handleInputFieldChange(e, 'additional')}
                  placeholder="Ej: Alquiler de bóveda"
                />
                <button type="button" onClick={() => addToArray('additional')}>Agregar</button>
              </div>
              <div className="array-items">
                {formData.additional.map((item, idx) => (
                  <span key={idx} className="array-item">
                    - {item}
                    <button type="button" onClick={() => removeFromArray('additional', idx)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Valores sin Costo */}
            <div className="form-section-title">💎 Valores Agregados sin Costo</div>
            <div className="form-group array-input full">
              <div className="array-input-group">
                <input
                  type="text"
                  value={inputFields.noChargeServices}
                  onChange={(e) => handleInputFieldChange(e, 'noChargeServices')}
                  placeholder="Ej: Publicación en diario local"
                />
                <button type="button" onClick={() => addToArray('noChargeServices')}>Agregar</button>
              </div>
              <div className="array-items">
                {formData.noChargeServices.map((item, idx) => (
                  <span key={idx} className="array-item">
                    - {item}
                    <button type="button" onClick={() => removeFromArray('noChargeServices', idx)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Le Brindamos También */}
            <div className="form-section-title">🏢 Le Brindamos También</div>
            <div className="form-group array-input full">
              <div className="array-input-group">
                <input
                  type="text"
                  value={inputFields.brindamos}
                  onChange={(e) => handleInputFieldChange(e, 'brindamos')}
                  placeholder="Ej: Parqueadero privado"
                />
                <button type="button" onClick={() => addToArray('brindamos')}>Agregar</button>
              </div>
              <div className="array-items">
                {formData.brindamos.map((item, idx) => (
                  <span key={idx} className="array-item">
                    - {item}
                    <button type="button" onClick={() => removeFromArray('brindamos', idx)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Fotos */}
            <div className="form-section-title">📸 Fotos del Servicio</div>
            
            <div className="form-group">
              <label htmlFor="fotos">Seleccionar Fotografías</label>
              <input
                type="file"
                id="fotos"
                accept="image/*"
                multiple
                onChange={handleFotoChange}
              />
              <small>Puedes seleccionar múltiples fotos</small>
              
              {/* Fotos existentes */}
              {fotoExistentes.length > 0 && (
                <div className="fotos-existentes">
                  <h4>Fotos Actuales ({fotoExistentes.length})</h4>
                  <div className="fotos-grid">
                    {fotoExistentes.map((foto, index) => (
                      <div key={`existente-${index}`} className="foto-item">
                        <img src={foto.url} alt={`Foto ${index + 1}`} />
                        <textarea
                          placeholder="Descripción de la foto"
                          value={foto.descripcion}
                          onChange={(e) => {
                            setFotoExistentes(prev => {
                              const nuevasFotos = [...prev];
                              nuevasFotos[index].descripcion = e.target.value;
                              return nuevasFotos;
                            });
                          }}
                          rows="2"
                        />
                        <button
                          type="button"
                          className="btn-remove-foto"
                          onClick={() => removeFotoExistente(index)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fotos nuevas para subir */}
              {fotosParaSubir.length > 0 && (
                <div className="fotos-nuevas">
                  <h4>Nuevas Fotos a Subir ({fotosParaSubir.length})</h4>
                  <div className="fotos-grid">
                    {fotosParaSubir.map((foto, index) => (
                      <div key={`nueva-${index}`} className="foto-item">
                        <img src={foto.preview} alt={`Nueva foto ${index + 1}`} />
                        <textarea
                          placeholder="Descripción de la foto"
                          value={foto.descripcion}
                          onChange={(e) => handleDescripcionFoto(index, e.target.value)}
                          rows="2"
                        />
                        <button
                          type="button"
                          className="btn-remove-foto"
                          onClick={() => removeFotoParaSubir(index)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ataúdes */}
            <div className="form-section-title">⚰️ Ataúdes Disponibles</div>
            
            <div className="form-group">
              <label htmlFor="ataudes">Seleccionar Fotos de Ataúdes</label>
              <input
                type="file"
                id="ataudes"
                accept="image/*"
                multiple
                onChange={handleAtaudChange}
              />
              <small>Selecciona fotos de ataúdes con sus respectivos datos</small>
              
              {/* Ataúdes existentes */}
              {ataudesExistentes.length > 0 && (
                <div className="fotos-existentes">
                  <h4>Ataúdes Actuales ({ataudesExistentes.length})</h4>
                  <div className="ataudes-grid">
                    {ataudesExistentes.map((ataud, index) => (
                      <div key={`ataud-existente-${index}`} className="ataud-item">
                        <img src={ataud.imagen} alt={ataud.nombre} />
                        <input
                          type="text"
                          placeholder="Nombre del ataúd"
                          value={ataud.nombre}
                          onChange={(e) => {
                            setAtaudesExistentes(prev => {
                              const nuevos = [...prev];
                              nuevos[index].nombre = e.target.value;
                              return nuevos;
                            });
                          }}
                        />
                        <textarea
                          placeholder="Descripción"
                          value={ataud.descripcion}
                          onChange={(e) => {
                            setAtaudesExistentes(prev => {
                              const nuevos = [...prev];
                              nuevos[index].descripcion = e.target.value;
                              return nuevos;
                            });
                          }}
                          rows="2"
                        />
                        <input
                          type="number"
                          placeholder="Precio ($)"
                          value={ataud.precio}
                          onChange={(e) => {
                            setAtaudesExistentes(prev => {
                              const nuevos = [...prev];
                              nuevos[index].precio = parseFloat(e.target.value) || 0;
                              return nuevos;
                            });
                          }}
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          className="btn-remove-foto"
                          onClick={() => removeAtaudExistente(index)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ataúdes nuevos para subir */}
              {ataudesParaSubir.length > 0 && (
                <div className="fotos-nuevas">
                  <h4>Nuevos Ataúdes a Subir ({ataudesParaSubir.length})</h4>
                  <div className="ataudes-grid">
                    {ataudesParaSubir.map((ataud, index) => (
                      <div key={`ataud-nuevo-${index}`} className="ataud-item">
                        <img src={ataud.preview} alt={`Nuevo ataúd ${index + 1}`} />
                        <input
                          type="text"
                          placeholder="Nombre del ataúd"
                          value={ataud.nombre}
                          onChange={(e) => handleAtaudDataChange(index, 'nombre', e.target.value)}
                        />
                        <textarea
                          placeholder="Descripción"
                          value={ataud.descripcion}
                          onChange={(e) => handleAtaudDataChange(index, 'descripcion', e.target.value)}
                          rows="2"
                        />
                        <input
                          type="number"
                          placeholder="Precio (Bs)"
                          value={ataud.precio}
                          onChange={(e) => handleAtaudDataChange(index, 'precio', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          className="btn-remove-foto"
                          onClick={() => removeAtaudParaSubir(index)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Misa en Vivo */}
            <div className="form-section-title">🕯️ Transmisión de Misa en Vivo</div>
            <div className="form-row">
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.misaEnVivo.disponible}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      misaEnVivo: {
                        ...prev.misaEnVivo,
                        disponible: e.target.checked
                      }
                    }))}
                  />
                  ¿Ofrecer transmisión de misa en vivo?
                </label>
              </div>
              {formData.misaEnVivo.disponible && (
                <div className="form-group">
                  <label htmlFor="misaPrecio">Precio de Misa ($)</label>
                  <input
                    type="number"
                    id="misaPrecio"
                    value={formData.misaEnVivo.precio}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      misaEnVivo: {
                        ...prev.misaEnVivo,
                        precio: parseFloat(e.target.value) || 0
                      }
                    }))}
                    placeholder="Ej: 50"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn">
              💾 {editingId ? 'Actualizar' : 'Crear'} Servicio
            </button>
          </form>
        </div>
      )}

      <div className="servicios-list">
        <h3>Servicios Registrados: {servicios.length}</h3>
        {servicios.length === 0 ? (
          <p className="no-servicios">No hay servicios registrados aún.</p>
        ) : (
          <div className="servicios-grid">
            {servicios.map((servicio) => (
              <div key={servicio._id} className="servicio-card">
                <div className="servicio-header">
                  <div className="servicio-icon" style={{ color: servicio.color }}>
                    {servicio.icono}
                  </div>
                  <h4>{servicio.nombre}</h4>
                </div>
                
                <p className="servicio-desc">{servicio.descripcion}</p>
                
                <p className="servicio-precio">💰 Precio: ${servicio.precio || 0}</p>

                <p className="servicio-intro">
                  {servicio.introduccion.substring(0, 100)}...
                </p>

                {servicio.includes && servicio.includes.length > 0 && (
                  <div className="servicio-info">
                    <strong>Incluye:</strong> {servicio.includes.length} items
                  </div>
                )}

                <div className="servicio-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(servicio)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(servicio._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminServicios;
