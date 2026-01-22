import { useEffect, useMemo, useState } from 'react';
import './AdminServicios.css';

function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    activo: true
  });
  const [nuevasFotos, setNuevasFotos] = useState([]); // {file, descripcion, preview}
  const [fotosExistentes, setFotosExistentes] = useState([]); // [{url, descripcion}]

  const token = useMemo(() => localStorage.getItem('token') || '', []);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/servicios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServicios(Array.isArray(data.servicios) ? data.servicios : []);
      }
    } catch (e) {
      console.error('Error obteniendo servicios', e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', activo: true });
    setNuevasFotos([]);
    setFotosExistentes([]);
    setEditingId(null);
    setShowForm(false);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    if (form.descripcion) formData.append('descripcion', form.descripcion);
    if (form.precio !== '' && form.precio !== null) formData.append('precio', String(form.precio));
    formData.append('activo', String(!!form.activo));

    if (editingId && fotosExistentes.length > 0) {
      formData.append('fotosExistentes', JSON.stringify(fotosExistentes));
    }

    nuevasFotos.forEach((nf, index) => {
      formData.append('fotos[]', nf.file);
      formData.append(`fotoMeta[${index}][descripcion]`, nf.descripcion || '');
    });

    const url = editingId
      ? `http://localhost:5000/api/servicios/${editingId}`
      : 'http://localhost:5000/api/servicios';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.mensaje || 'No se pudo guardar el servicio');
        return;
      }
      alert(editingId ? 'Servicio actualizado' : 'Servicio creado');
      resetForm();
      fetchServicios();
    } catch (e) {
      console.error('Error guardando servicio', e);
      alert('Error guardando el servicio');
    }
  };

  const onEdit = (s) => {
    setEditingId(s._id);
    setForm({
      nombre: s.nombre || '',
      descripcion: s.descripcion || '',
      precio: s.precio ?? '',
      activo: s.activo !== false
    });
    setFotosExistentes(Array.isArray(s.fotos) ? s.fotos : []);
    setNuevasFotos([]);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/servicios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        alert('No se pudo eliminar');
        return;
      }
      fetchServicios();
    } catch (e) {
      console.error('Error eliminando servicio', e);
      alert('Error eliminando servicio');
    }
  };

  return (
    <div className="admin-servicios">
      <div className="servicios-header">
        <h2>🎁 Gestión de Servicios Exequiales</h2>
        <button className="btn-nuevo" onClick={() => { resetForm(); setShowForm(true); }}>
          ➕ Nuevo Servicio
        </button>
      </div>

      {showForm && (
        <div className="servicio-form-container">
          <h3>{editingId ? '✏️ Editar Servicio' : '🆕 Crear Servicio'}</h3>
          <form className="servicio-form" onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del servicio *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Precio (opcional)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-group full">
              <label>Descripción corta</label>
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Resumen del servicio"
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                Servicio activo
              </label>
            </div>

            <div className="form-section-title">Imágenes (.jpg / .png)</div>
            <div className="form-row">
              <div className="form-group full">
                <input type="file" accept=".jpg,.jpeg,.png" multiple onChange={onSelectFotos} />
              </div>
            </div>

            {fotosExistentes.length > 0 && (
              <div className="form-group full">
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
              <div className="form-group full">
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

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="submit-btn">{editingId ? 'Guardar cambios' : 'Crear servicio'}</button>
              <button type="button" className="delete-btn" onClick={resetForm}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="servicios-list">
        <h3>Servicios creados</h3>
        {loading ? (
          <div className="loading">Cargando servicios...</div>
        ) : servicios.length === 0 ? (
          <div className="no-servicios">No hay servicios registrados.</div>
        ) : (
          <div className="servicios-grid">
            {servicios.map((s) => (
              <div key={s._id} className="servicio-card">
                <div className="servicio-header">
                  <div className="servicio-icon">{s.icono || '🕊️'}</div>
                  <h4>{s.nombre}</h4>
                  <span className="transport-badge" style={{ background: s.activo ? '#27ae60' : '#7f8c8d' }}>
                    {s.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="servicio-desc">{s.descripcion || 'Sin descripción'}</div>
                <div className="servicio-info">
                  <div><strong>Precio:</strong> {s.precio ? `$${s.precio}` : 'No especificado'}</div>
                  <div><strong>Imágenes:</strong> {Array.isArray(s.fotos) ? s.fotos.length : 0}</div>
                </div>
                {Array.isArray(s.fotos) && s.fotos.length > 0 && (
                  <div className="servicio-fotos">
                    {s.fotos.map((foto, idx) => (
                      <img key={idx} src={foto.url} alt={`${s.nombre} ${idx + 1}`} title={foto.descripcion} onError={(e) => e.target.style.display = 'none'} />
                    ))}
                  </div>
                )}
                <div className="servicio-actions">
                  <button className="edit-btn" onClick={() => onEdit(s)}>Editar</button>
                  <button className="delete-btn" onClick={() => onDelete(s._id)}>Eliminar</button>
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
