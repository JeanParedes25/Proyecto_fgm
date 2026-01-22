import { useState, useEffect } from 'react';
import './AdminFloristerias.css';

function AdminFloristerias() {
  const [flores, setFlores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    precio: ''
  });
  const [nuevasFotos, setNuevasFotos] = useState([]); // {file, descripcion, preview}
  const [fotosExistentes, setFotosExistentes] = useState([]); // [{url, descripcion}]

  useEffect(() => {
    fetchFlores();
  }, []);

  const fetchFlores = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/floristerias', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFlores(data.flores || []);
      }
    } catch (err) {
      console.error('Error al cargar flores:', err);
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

  const onSelectFotos = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext)) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevasFotos((prev) => [
          ...prev,
          { file, descripcion: '', preview: reader.result }
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeNuevaFoto = (idx) => {
    setNuevasFotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeFotoExistente = (idx) => {
    setFotosExistentes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.codigo || !formData.precio) {
      alert('Faltan campos requeridos: código y precio');
      return;
    }

    if (!editingId && nuevasFotos.length === 0) {
      alert('Debes subir al menos una imagen al crear una flor');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('codigo', formData.codigo);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('precio', formData.precio);

    if (editingId && fotosExistentes.length > 0) {
      formDataToSend.append('fotosExistentes', JSON.stringify(fotosExistentes));
    }

    nuevasFotos.forEach((nf, index) => {
      formDataToSend.append('fotos[]', nf.file);
      formDataToSend.append(`fotoMeta[${index}][descripcion]`, nf.descripcion || '');
    });

    try {
      const url = editingId
        ? `http://localhost:5000/api/floristerias/${editingId}`
        : 'http://localhost:5000/api/floristerias';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingId ? 'Flor actualizada exitosamente' : 'Flor creada exitosamente');
        resetForm();
        fetchFlores();
      } else {
        const error = await response.json();
        alert(`Error: ${error.mensaje || 'No se pudo guardar la flor'}`);
      }
    } catch (err) {
      console.error('Error al guardar flor:', err);
      alert('Error al guardar la flor');
    }
  };

  const handleEdit = (flor) => {
    setEditingId(flor._id);
    setFormData({
      codigo: flor.codigo,
      descripcion: flor.descripcion || '',
      precio: flor.precio
    });
    // Manejar ambas estructuras: fotos (nueva) e image (antigua)
    let fotos = [];
    if (Array.isArray(flor.fotos) && flor.fotos.length > 0) {
      fotos = flor.fotos;
    } else if (flor.image) {
      fotos = [{ url: flor.image, descripcion: flor.descripcion || '' }];
    }
    setFotosExistentes(fotos);
    setNuevasFotos([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta flor?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/floristerias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Flor eliminada exitosamente');
        fetchFlores();
      } else {
        alert('Error al eliminar la flor');
      }
    } catch (err) {
      console.error('Error al eliminar flor:', err);
      alert('Error al eliminar la flor');
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      descripcion: '',
      precio: ''
    });
    setNuevasFotos([]);
    setFotosExistentes([]);
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
      <div className="admin-floristerias">
        <div className="loading">Cargando flores...</div>
      </div>
    );
  }

  return (
    <div className="admin-floristerias">
      <div className="floristerias-header">
        <h2>🌹 Gestión de Floristerías</h2>
        <button
          className="btn-nuevo"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancelar' : '➕ Nueva Flor'}
        </button>
      </div>

      {showForm && (
        <div className="flor-form-container">
          <h3>{editingId ? '✏️ Editar Flor' : '➕ Nueva Flor'}</h3>
          <form onSubmit={handleSubmit} className="flor-form">
            <div className="form-group">
              <label htmlFor="codigo">Código *</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                required
                placeholder="Ej: FLR-001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                placeholder="Descripción de la flor o arreglo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imagen">Fotografías (.jpg / .png)</label>
              <input
                type="file"
                id="imagen"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={onSelectFotos}
              />
              <small>Solo se permiten archivos .jpg o .png</small>
            </div>

            {fotosExistentes.length > 0 && (
              <div className="form-group">
                <label>Fotos existentes</label>
                <div className="fotos-preview">
                  {fotosExistentes.map((f, idx) => (
                    <div key={idx} className="foto-item">
                      <img src={f.url} alt={`Foto existente ${idx + 1}`} onError={(e) => e.target.src = '/placeholder.png'} />
                      <input
                        type="text"
                        placeholder="Descripción"
                        value={f.descripcion || ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFotosExistentes((prev) => prev.map((x, i) => i === idx ? { ...x, descripcion: v } : x));
                        }}
                      />
                      <button type="button" onClick={() => removeFotoExistente(idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nuevasFotos.length > 0 && (
              <div className="form-group">
                <label>Nuevas fotos</label>
                <div className="fotos-preview">
                  {nuevasFotos.map((f, idx) => (
                    <div key={idx} className="foto-item">
                      <img src={f.preview} alt={`Nueva foto ${idx + 1}`} />
                      <input
                        type="text"
                        placeholder="Descripción"
                        value={f.descripcion}
                        onChange={(e) => {
                          const v = e.target.value;
                          setNuevasFotos((prev) => prev.map((x, i) => i === idx ? { ...x, descripcion: v } : x));
                        }}
                      />
                      <button type="button" onClick={() => removeNuevaFoto(idx)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? '💾 Actualizar' : '➕ Crear Flor'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flores-list">
        <h3>🌸 Flores Publicadas ({flores.length})</h3>

        {flores.length === 0 ? (
          <div className="no-data">
            <p>No hay flores publicadas</p>
            <p>Haz clic en "Nueva Flor" para crear una</p>
          </div>
        ) : (
          <div className="flores-grid">
            {flores.map(flor => (
              <div key={flor._id} className="flor-card">
                <div className="flor-images">
                  {Array.isArray(flor.fotos) && flor.fotos.length > 0 ? (
                    flor.fotos.map((foto, idx) => (
                      <img key={idx} src={foto.url} alt={`${flor.codigo} ${idx + 1}`} title={foto.descripcion} onError={(e) => e.target.style.display = 'none'} />
                    ))
                  ) : flor.image ? (
                    <img src={flor.image} alt={flor.codigo} onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <div className="no-image">Sin imágenes</div>
                  )}
                </div>
                <div className="flor-content">
                  <h4>{flor.codigo}</h4>
                  <p className="precio"><strong>Precio:</strong> ${parseFloat(flor.precio).toFixed(2)}</p>
                  {flor.descripcion && (
                    <p className="descripcion">{flor.descripcion}</p>
                  )}
                  <p className="fotos-count"><strong>Imágenes:</strong> {Array.isArray(flor.fotos) ? flor.fotos.length : (flor.image ? 1 : 0)}</p>
                </div>
                <div className="flor-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(flor)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(flor._id)}
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

export default AdminFloristerias;
