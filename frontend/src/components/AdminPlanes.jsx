import { useEffect, useMemo, useState } from 'react';
import './AdminPlanes.css';

function AdminPlanes() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    tipoCofre: '',
    duracionVelacion: '',
    salasIncluidas: [],
    procedimientos: {
      formolizacion: false,
      tanatopraxia: false,
      otros: ''
    },
    transporte: {
      autocarroza: false,
      detalles: ''
    },
    arregloFloral: {
      incluido: false,
      descripcion: ''
    },
    tramitesLegales: {
      incluido: false,
      descripcion: ''
    },
    mediosComunicacion: {
      incluido: false,
      descripcion: ''
    },
    obituariosDomiciliarios: {
      incluido: false,
      cantidad: 0
    },
    cafeteria: {
      bebidas: false,
      vasosTermicos: false,
      descripcion: ''
    },
    insumosSala: {
      incluido: false,
      descripcion: ''
    },
    serviciosReligiosos: {
      incluido: false,
      descripcion: ''
    },
    mediosDigitales: {
      videoHomenaje: false,
      facebookLive: false,
      otros: ''
    },
    infraestructura: {
      incluido: false,
      descripcion: ''
    },
    equipoFuneraria: {
      incluido: false,
      descripcion: ''
    },
    activo: true,
    destacado: false
  });

  const [nuevaSala, setNuevaSala] = useState('');

  const token = useMemo(() => localStorage.getItem('token') || '', []);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/planes/admin/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPlanes(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error obteniendo planes', e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      precio: '',
      tipoCofre: '',
      duracionVelacion: '',
      salasIncluidas: [],
      procedimientos: {
        formolizacion: false,
        tanatopraxia: false,
        otros: ''
      },
      transporte: {
        autocarroza: false,
        detalles: ''
      },
      arregloFloral: {
        incluido: false,
        descripcion: ''
      },
      tramitesLegales: {
        incluido: false,
        descripcion: ''
      },
      mediosComunicacion: {
        incluido: false,
        descripcion: ''
      },
      obituariosDomiciliarios: {
        incluido: false,
        cantidad: 0
      },
      cafeteria: {
        bebidas: false,
        vasosTermicos: false,
        descripcion: ''
      },
      insumosSala: {
        incluido: false,
        descripcion: ''
      },
      serviciosReligiosos: {
        incluido: false,
        descripcion: ''
      },
      mediosDigitales: {
        videoHomenaje: false,
        facebookLive: false,
        otros: ''
      },
      infraestructura: {
        incluido: false,
        descripcion: ''
      },
      equipoFuneraria: {
        incluido: false,
        descripcion: ''
      },
      activo: true,
      destacado: false
    });
    setNuevaSala('');
    setEditingId(null);
    setShowForm(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId
      ? `http://localhost:5000/api/planes/${editingId}`
      : 'http://localhost:5000/api/planes';
    const method = editingId ? 'PUT' : 'POST';

    try {
      // Validar y convertir precio a Number
      const datosEnvio = {
        ...form,
        precio: parseFloat(form.precio) || 0,
        obituariosDomiciliarios: {
          ...form.obituariosDomiciliarios,
          cantidad: parseInt(form.obituariosDomiciliarios.cantidad) || 0
        }
      };

      console.log('Enviando datos al backend:', JSON.stringify(datosEnvio, null, 2));

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosEnvio)
      });

      console.log('Respuesta del servidor - Status:', res.status);
      console.log('Content-Type:', res.headers.get('content-type'));

      if (res.ok) {
        alert(editingId ? 'Plan actualizado' : 'Plan creado');
        resetForm();
        fetchPlanes();
      } else {
        let error;
        const contentType = res.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          error = await res.json();
          console.error('Error JSON del servidor:', error);
          alert('Error: ' + (error.mensaje || error.message || JSON.stringify(error)));
        } else {
          const text = await res.text();
          console.error('Error no-JSON del servidor:', text);
          alert('Error: Respuesta inválida del servidor. Verifica la consola del navegador.');
        }
      }
    } catch (e) {
      console.error('Error al guardar plan:', e);
      alert('Error al guardar plan: ' + (e.message || e));
    }
  };

  const editarPlan = (plan) => {
    setEditingId(plan._id);
    setForm({
      nombre: plan.nombre || '',
      precio: plan.precio !== undefined ? String(plan.precio) : '',
      tipoCofre: plan.tipoCofre || '',
      duracionVelacion: plan.duracionVelacion || '',
      salasIncluidas: plan.salasIncluidas || [],
      procedimientos: plan.procedimientos || {
        formolizacion: false,
        tanatopraxia: false,
        otros: ''
      },
      transporte: plan.transporte || {
        autocarroza: false,
        detalles: ''
      },
      arregloFloral: plan.arregloFloral || {
        incluido: false,
        descripcion: ''
      },
      tramitesLegales: plan.tramitesLegales || {
        incluido: false,
        descripcion: ''
      },
      mediosComunicacion: plan.mediosComunicacion || {
        incluido: false,
        descripcion: ''
      },
      obituariosDomiciliarios: plan.obituariosDomiciliarios || {
        incluido: false,
        cantidad: 0
      },
      cafeteria: plan.cafeteria || {
        bebidas: false,
        vasosTermicos: false,
        descripcion: ''
      },
      insumosSala: plan.insumosSala || {
        incluido: false,
        descripcion: ''
      },
      serviciosReligiosos: plan.serviciosReligiosos || {
        incluido: false,
        descripcion: ''
      },
      mediosDigitales: plan.mediosDigitales || {
        videoHomenaje: false,
        facebookLive: false,
        otros: ''
      },
      infraestructura: plan.infraestructura || {
        incluido: false,
        descripcion: ''
      },
      equipoFuneraria: plan.equipoFuneraria || {
        incluido: false,
        descripcion: ''
      },
      activo: plan.activo !== undefined ? plan.activo : true,
      destacado: plan.destacado || false
    });
    setShowForm(true);
  };

  const eliminarPlan = async (id) => {
    if (!window.confirm('¿Eliminar este plan?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/planes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Plan eliminado');
        fetchPlanes();
      }
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  };

  const toggleDestacado = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/planes/${id}/destacado`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPlanes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const agregarSala = () => {
    if (nuevaSala.trim()) {
      setForm(prev => ({
        ...prev,
        salasIncluidas: [...prev.salasIncluidas, nuevaSala.trim()]
      }));
      setNuevaSala('');
    }
  };

  const eliminarSala = (index) => {
    setForm(prev => ({
      ...prev,
      salasIncluidas: prev.salasIncluidas.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div className="loading">Cargando planes...</div>;

  return (
    <div className="admin-planes-container">
      <h2>Gestión de Planes Funerarios</h2>

      <button
        className="btn-nuevo-plan"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancelar' : '+ Nuevo Plan'}
      </button>

      {showForm && (
        <form onSubmit={onSubmit} className="form-plan">
          <h3>{editingId ? 'Editar Plan' : 'Crear Nuevo Plan'}</h3>

          {/* Información básica */}
          <div className="form-section">
            <h4>Información Básica</h4>
            <div className="form-row">
              <label>
                Nombre del Plan *
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </label>
              <label>
                Precio *
                <input
                  type="number"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Tipo de Cofre *
                <input
                  type="text"
                  value={form.tipoCofre}
                  onChange={(e) => setForm({ ...form, tipoCofre: e.target.value })}
                  required
                />
              </label>
              <label>
                Duración de Velación *
                <input
                  type="text"
                  value={form.duracionVelacion}
                  onChange={(e) => setForm({ ...form, duracionVelacion: e.target.value })}
                  placeholder="Ej: 24 horas"
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                />
                Plan Destacado
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                Plan Activo
              </label>
            </div>
          </div>

          {/* Salas incluidas */}
          <div className="form-section">
            <h4>Salas Incluidas</h4>
            <div className="salas-input-group">
              <input
                type="text"
                value={nuevaSala}
                onChange={(e) => setNuevaSala(e.target.value)}
                placeholder="Nombre de la sala"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarSala())}
              />
              <button type="button" onClick={agregarSala} className="btn-agregar-sala">
                + Agregar
              </button>
            </div>
            <div className="salas-list">
              {form.salasIncluidas.map((sala, idx) => (
                <div key={idx} className="sala-item">
                  <span>{sala}</span>
                  <button type="button" onClick={() => eliminarSala(idx)} className="btn-eliminar-sala">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Procedimientos */}
          <div className="form-section">
            <h4>Procedimientos</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.procedimientos.formolizacion}
                onChange={(e) => setForm({
                  ...form,
                  procedimientos: { ...form.procedimientos, formolizacion: e.target.checked }
                })}
              />
              Formolización
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.procedimientos.tanatopraxia}
                onChange={(e) => setForm({
                  ...form,
                  procedimientos: { ...form.procedimientos, tanatopraxia: e.target.checked }
                })}
              />
              Tanatopraxia
            </label>
            <label>
              Otros procedimientos
              <input
                type="text"
                value={form.procedimientos.otros}
                onChange={(e) => setForm({
                  ...form,
                  procedimientos: { ...form.procedimientos, otros: e.target.value }
                })}
              />
            </label>
          </div>

          {/* Transporte */}
          <div className="form-section">
            <h4>Transporte</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.transporte.autocarroza}
                onChange={(e) => setForm({
                  ...form,
                  transporte: { ...form.transporte, autocarroza: e.target.checked }
                })}
              />
              Autocarroza incluida
            </label>
            <label>
              Detalles del transporte
              <textarea
                value={form.transporte.detalles}
                onChange={(e) => setForm({
                  ...form,
                  transporte: { ...form.transporte, detalles: e.target.value }
                })}
              />
            </label>
          </div>

          {/* Arreglo Floral */}
          <div className="form-section">
            <h4>Arreglo Floral</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.arregloFloral.incluido}
                onChange={(e) => setForm({
                  ...form,
                  arregloFloral: { ...form.arregloFloral, incluido: e.target.checked }
                })}
              />
              Incluir arreglo floral
            </label>
            {form.arregloFloral.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.arregloFloral.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    arregloFloral: { ...form.arregloFloral, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          {/* Trámites Legales */}
          <div className="form-section">
            <h4>Trámites Legales</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.tramitesLegales.incluido}
                onChange={(e) => setForm({
                  ...form,
                  tramitesLegales: { ...form.tramitesLegales, incluido: e.target.checked }
                })}
              />
              Incluir trámites legales
            </label>
            {form.tramitesLegales.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.tramitesLegales.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    tramitesLegales: { ...form.tramitesLegales, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          {/* Medios de Comunicación */}
          <div className="form-section">
            <h4>Medios de Comunicación</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.mediosComunicacion.incluido}
                onChange={(e) => setForm({
                  ...form,
                  mediosComunicacion: { ...form.mediosComunicacion, incluido: e.target.checked }
                })}
              />
              Incluir medios de comunicación
            </label>
            {form.mediosComunicacion.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.mediosComunicacion.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    mediosComunicacion: { ...form.mediosComunicacion, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          {/* Obituarios Domiciliarios */}
          <div className="form-section">
            <h4>Obituarios Domiciliarios</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.obituariosDomiciliarios.incluido}
                onChange={(e) => setForm({
                  ...form,
                  obituariosDomiciliarios: { ...form.obituariosDomiciliarios, incluido: e.target.checked }
                })}
              />
              Incluir obituarios domiciliarios
            </label>
            {form.obituariosDomiciliarios.incluido && (
              <label>
                Cantidad
                <input
                  type="number"
                  min="0"
                  value={form.obituariosDomiciliarios.cantidad}
                  onChange={(e) => setForm({
                    ...form,
                    obituariosDomiciliarios: { ...form.obituariosDomiciliarios, cantidad: parseInt(e.target.value) || 0 }
                  })}
                />
              </label>
            )}
          </div>

          {/* Cafetería */}
          <div className="form-section">
            <h4>Cafetería</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.cafeteria.bebidas}
                onChange={(e) => setForm({
                  ...form,
                  cafeteria: { ...form.cafeteria, bebidas: e.target.checked }
                })}
              />
              Bebidas incluidas
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.cafeteria.vasosTermicos}
                onChange={(e) => setForm({
                  ...form,
                  cafeteria: { ...form.cafeteria, vasosTermicos: e.target.checked }
                })}
              />
              Vasos térmicos
            </label>
            <label>
              Descripción
              <input
                type="text"
                value={form.cafeteria.descripcion}
                onChange={(e) => setForm({
                  ...form,
                  cafeteria: { ...form.cafeteria, descripcion: e.target.value }
                })}
              />
            </label>
          </div>

          {/* Insumos de Sala */}
          <div className="form-section">
            <h4>Insumos de Sala</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.insumosSala.incluido}
                onChange={(e) => setForm({
                  ...form,
                  insumosSala: { ...form.insumosSala, incluido: e.target.checked }
                })}
              />
              Incluir insumos de sala
            </label>
            {form.insumosSala.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.insumosSala.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    insumosSala: { ...form.insumosSala, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          {/* Servicios Religiosos */}
          <div className="form-section">
            <h4>Servicios Religiosos (Opcional)</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.serviciosReligiosos.incluido}
                onChange={(e) => setForm({
                  ...form,
                  serviciosReligiosos: { ...form.serviciosReligiosos, incluido: e.target.checked }
                })}
              />
              Incluir servicios religiosos
            </label>
            {form.serviciosReligiosos.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.serviciosReligiosos.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    serviciosReligiosos: { ...form.serviciosReligiosos, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          {/* Medios Digitales */}
          <div className="form-section">
            <h4>Medios Digitales</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.mediosDigitales.videoHomenaje}
                onChange={(e) => setForm({
                  ...form,
                  mediosDigitales: { ...form.mediosDigitales, videoHomenaje: e.target.checked }
                })}
              />
              Video homenaje
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.mediosDigitales.facebookLive}
                onChange={(e) => setForm({
                  ...form,
                  mediosDigitales: { ...form.mediosDigitales, facebookLive: e.target.checked }
                })}
              />
              Facebook Live
            </label>
            <label>
              Otros medios digitales
              <input
                type="text"
                value={form.mediosDigitales.otros}
                onChange={(e) => setForm({
                  ...form,
                  mediosDigitales: { ...form.mediosDigitales, otros: e.target.value }
                })}
              />
            </label>
          </div>

          {/* Infraestructura */}
          <div className="form-section">
            <h4>Infraestructura</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.infraestructura.incluido}
                onChange={(e) => setForm({
                  ...form,
                  infraestructura: { ...form.infraestructura, incluido: e.target.checked }
                })}
              />
              Incluir infraestructura
            </label>
            {form.infraestructura.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.infraestructura.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    infraestructura: { ...form.infraestructura, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          {/* Equipo de la Funeraria */}
          <div className="form-section">
            <h4>Equipo de la Funeraria</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.equipoFuneraria.incluido}
                onChange={(e) => setForm({
                  ...form,
                  equipoFuneraria: { ...form.equipoFuneraria, incluido: e.target.checked }
                })}
              />
              Incluir equipo de la funeraria
            </label>
            {form.equipoFuneraria.incluido && (
              <label>
                Descripción
                <input
                  type="text"
                  value={form.equipoFuneraria.descripcion}
                  onChange={(e) => setForm({
                    ...form,
                    equipoFuneraria: { ...form.equipoFuneraria, descripcion: e.target.value }
                  })}
                />
              </label>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">
              {editingId ? 'Actualizar Plan' : 'Crear Plan'}
            </button>
            <button type="button" onClick={resetForm} className="btn-cancelar">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="planes-list">
        <h3>Planes Existentes ({planes.length})</h3>
        {planes.length === 0 ? (
          <p className="no-planes">No hay planes creados</p>
        ) : (
          <div className="planes-grid">
            {planes.map((plan) => (
              <div key={plan._id} className={`plan-card ${!plan.activo ? 'inactivo' : ''} ${plan.destacado ? 'destacado' : ''}`}>
                <div className="plan-header">
                  <h4>{plan.nombre}</h4>
                  <div className="plan-precio">${parseFloat(plan.precio || 0).toFixed(2)}</div>
                </div>
                
                <div className="plan-details">
                  <p><strong>Cofre:</strong> {plan.tipoCofre}</p>
                  <p><strong>Duración:</strong> {plan.duracionVelacion}</p>
                  
                  {plan.salasIncluidas && plan.salasIncluidas.length > 0 && (
                    <div className="plan-salas">
                      <strong>Salas:</strong>
                      <ul>
                        {plan.salasIncluidas.map((sala, idx) => (
                          <li key={idx}>{sala}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="plan-servicios">
                    <strong>Servicios incluidos:</strong>
                    <ul>
                      {plan.procedimientos?.formolizacion && <li>✓ Formolización</li>}
                      {plan.procedimientos?.tanatopraxia && <li>✓ Tanatopraxia</li>}
                      {plan.transporte?.autocarroza && <li>✓ Autocarroza</li>}
                      {plan.arregloFloral?.incluido && <li>✓ Arreglo floral</li>}
                      {plan.tramitesLegales?.incluido && <li>✓ Trámites legales</li>}
                      {plan.mediosComunicacion?.incluido && <li>✓ Medios de comunicación</li>}
                      {plan.obituariosDomiciliarios?.incluido && <li>✓ Obituarios domiciliarios</li>}
                      {plan.cafeteria?.bebidas && <li>✓ Cafetería</li>}
                      {plan.insumosSala?.incluido && <li>✓ Insumos de sala</li>}
                      {plan.serviciosReligiosos?.incluido && <li>✓ Servicios religiosos</li>}
                      {plan.mediosDigitales?.videoHomenaje && <li>✓ Video homenaje</li>}
                      {plan.mediosDigitales?.facebookLive && <li>✓ Facebook Live</li>}
                      {plan.infraestructura?.incluido && <li>✓ Infraestructura</li>}
                      {plan.equipoFuneraria?.incluido && <li>✓ Equipo de la funeraria</li>}
                    </ul>
                  </div>

                  <div className="plan-badges">
                    {plan.destacado && <span className="badge badge-destacado">★ Destacado</span>}
                    {!plan.activo && <span className="badge badge-inactivo">Inactivo</span>}
                  </div>
                </div>

                <div className="plan-actions">
                  <button onClick={() => editarPlan(plan)} className="btn-editar">
                    Editar
                  </button>
                  <button onClick={() => toggleDestacado(plan._id)} className="btn-destacar">
                    {plan.destacado ? '★ Quitar' : '☆ Destacar'}
                  </button>
                  <button onClick={() => eliminarPlan(plan._id)} className="btn-eliminar">
                    Eliminar
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

export default AdminPlanes;
