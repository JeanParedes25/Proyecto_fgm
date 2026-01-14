import { useState, useEffect } from 'react';
import './AdminObituarios.css';

function AdminObituarios() {
  const [obituarios, setObituarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    mensajeRecordatorio: '',
    arteMortuorio: '',
    fechaFallecimiento: ''
  });
  const [fotos, setFotos] = useState([]);
  const [fotosParaSubir, setFotosParaSubir] = useState([]);

  useEffect(() => {
    fetchObituarios();
  }, []);

  const fetchObituarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/obituarios', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setObituarios(data.obituarios || []);
      }
    } catch (err) {
      console.error('Error al cargar obituarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('nombreCompleto', formData.nombreCompleto);
    formDataToSend.append('mensajeRecordatorio', formData.mensajeRecordatorio);
    formDataToSend.append('arteMortuorio', formData.arteMortuorio);
    formDataToSend.append('fechaFallecimiento', formData.fechaFallecimiento);
    
    // Agregar fotos existentes
    if (fotos.length > 0) {
      formDataToSend.append('fotosExistentes', JSON.stringify(fotos));
    }
    
    // Agregar nuevas fotos
    fotosParaSubir.forEach((foto, index) => {
      formDataToSend.append(`fotos[${index}][file]`, foto.file);
      formDataToSend.append(`fotos[${index}][descripcion]`, foto.descripcion);
    });

    try {
      const url = editingId 
        ? `http://localhost:5000/api/obituarios/${editingId}`
        : 'http://localhost:5000/api/obituarios';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingId ? 'Obituario actualizado exitosamente' : 'Obituario creado exitosamente');
        resetForm();
        fetchObituarios();
      } else {
        const error = await response.json();
        alert(`Error: ${error.mensaje || 'No se pudo guardar el obituario'}`);
      }
    } catch (err) {
      console.error('Error al guardar obituario:', err);
      alert('Error al guardar el obituario');
    }
  };

  const handleEdit = (obituario) => {
    setEditingId(obituario.id);
    setFormData({
      nombreCompleto: obituario.nombre_completo,
      mensajeRecordatorio: obituario.mensaje_recordatorio,
      arteMortuorio: obituario.arte_mortuorio,
      fechaFallecimiento: obituario.fecha_fallecimiento.split('T')[0]
    });
    setFotos(obituario.fotos || []);
    setFotosParaSubir([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este obituario?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/obituarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Obituario eliminado exitosamente');
        fetchObituarios();
      } else {
        alert('Error al eliminar el obituario');
      }
    } catch (err) {
      console.error('Error al eliminar obituario:', err);
      alert('Error al eliminar el obituario');
    }
  };

  const resetForm = () => {
    setFormData({
      nombreCompleto: '',
      mensajeRecordatorio: '',
      arteMortuorio: '',
      fechaFallecimiento: ''
    });
    setFotos([]);
    setFotosParaSubir([]);
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-obituarios">
        <div className="loading">Cargando obituarios...</div>
      </div>
    );
  }

  return (
    <div className="admin-obituarios">
      <div className="obituarios-header">
        <h2>🕯️ Gestión de Obituarios</h2>
        <button 
          className="btn-nuevo"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nuevo Obituario'}
        </button>
      </div>

      {showForm && (
        <div className="obituario-form-container">
          <h3>{editingId ? '✏️ Editar Obituario' : '➕ Nuevo Obituario'}</h3>
          <form onSubmit={handleSubmit} className="obituario-form">
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombre Completo *</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                required
                placeholder="Ej: Juan Carlos Pérez González"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaFallecimiento">Fecha de Fallecimiento *</label>
              <input
                type="date"
                id="fechaFallecimiento"
                name="fechaFallecimiento"
                value={formData.fechaFallecimiento}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imagen">Fotografías</label>
              <input
                type="file"
                id="imagen"
                accept="image/*"
                multiple
                onChange={handleFotoChange}
              />
              <small>Puedes seleccionar múltiples fotos a la vez</small>
              
              {/* Fotos existentes */}
              {fotos.length > 0 && (
                <div className="fotos-existentes">
                  <h4>Fotos Actuales ({fotos.length})</h4>
                  <div className="fotos-grid">
                    {fotos.map((foto, index) => (
                      <div key={`existente-${index}`} className="foto-item">
                        <img src={foto.url} alt={`Foto ${index + 1}`} />
                        <textarea
                          placeholder="Descripción de la foto"
                          value={foto.descripcion}
                          onChange={(e) => {
                            setFotos(prev => {
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

            <div className="form-group">
              <label htmlFor="mensajeRecordatorio">Mensaje Recordatorio *</label>
              <textarea
                id="mensajeRecordatorio"
                name="mensajeRecordatorio"
                value={formData.mensajeRecordatorio}
                onChange={handleInputChange}
                required
                rows="6"
                placeholder="Ej: Recordamos tus ojos llenos de alegría y bondad, tu sonrisa cariñosa que nos da la fuerza para seguir adelante..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="arteMortuorio">Parte Mortuorio *</label>
              <input
                type="text"
                id="arteMortuorio"
                name="arteMortuorio"
                value={formData.arteMortuorio}
                onChange={handleInputChange}
                required
                placeholder="Ej: PARTE MORTUORIO ENTREGÓ SU ALMA AL CREADOR QUIEN EN VIDA"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? '💾 Actualizar' : '➕ Crear Obituario'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="obituarios-list">
        <h3>📋 Obituarios Publicados ({obituarios.length})</h3>
        
        {obituarios.length === 0 ? (
          <div className="no-data">
            <p>No hay obituarios publicados</p>
            <p>Haz clic en "Nuevo Obituario" para crear uno</p>
          </div>
        ) : (
          <div className="obituarios-grid">
            {obituarios.map(obituario => (
              <div key={obituario.id} className="obituario-card">
                <div className="obituario-images">
                  {obituario.fotos && obituario.fotos.length > 0 ? (
                    <div className="fotos-grid-view">
                      {obituario.fotos.map((foto, idx) => (
                        <div key={idx} className="foto-view">
                          <img src={foto.url} alt={`Foto ${idx + 1}`} />
                          {foto.descripcion && (
                            <p className="foto-descripcion">{foto.descripcion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : obituario.imagen_url ? (
                    <div className="obituario-image">
                      <img 
                        src={obituario.imagen_url} 
                        alt={obituario.nombre_completo}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="obituario-content">
                  <h4>{obituario.nombre_completo}</h4>
                  <p className="fecha">📅 {formatDate(obituario.fecha_fallecimiento)}</p>
                  <p className="mensaje">{obituario.mensaje_recordatorio}</p>
                  <p className="arte"><strong>Parte Mortuorio:</strong> {obituario.arte_mortuorio}</p>
                  <p className="fecha-publicacion">
                    <small>Publicado: {formatDate(obituario.created_at)}</small>
                  </p>
                </div>
                <div className="obituario-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(obituario)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(obituario.id)}
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

export default AdminObituarios;
