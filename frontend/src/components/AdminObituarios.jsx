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
  const [imagenFile, setImagenFile] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('nombreCompleto', formData.nombreCompleto);
    formDataToSend.append('mensajeRecordatorio', formData.mensajeRecordatorio);
    formDataToSend.append('arteMortuorio', formData.arteMortuorio);
    formDataToSend.append('fechaFallecimiento', formData.fechaFallecimiento);
    
    if (imagenFile) {
      formDataToSend.append('imagen', imagenFile);
    }

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
    setPreviewImagen(obituario.imagen_url);
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
    setImagenFile(null);
    setPreviewImagen(null);
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
              <label htmlFor="imagen">Fotografía *</label>
              <input
                type="file"
                id="imagen"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingId}
              />
              {previewImagen && (
                <div className="preview-image">
                  <img src={previewImagen} alt="Vista previa" />
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
              <label htmlFor="arteMortuorio">Arte Mortuorio *</label>
              <input
                type="text"
                id="arteMortuorio"
                name="arteMortuorio"
                value={formData.arteMortuorio}
                onChange={handleInputChange}
                required
                placeholder="Ej: Capilla Ardiente en Funerales Gonzalo Mendoza"
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
                <div className="obituario-image">
                  <img 
                    src={obituario.imagen_url || '/placeholder.jpg'} 
                    alt={obituario.nombre_completo}
                  />
                </div>
                <div className="obituario-content">
                  <h4>{obituario.nombre_completo}</h4>
                  <p className="fecha">📅 {formatDate(obituario.fecha_fallecimiento)}</p>
                  <p className="mensaje">{obituario.mensaje_recordatorio}</p>
                  <p className="arte"><strong>Arte Mortuorio:</strong> {obituario.arte_mortuorio}</p>
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
