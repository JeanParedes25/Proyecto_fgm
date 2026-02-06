import { useEffect, useState } from 'react';
import './AsistenciaPrepago.css';
import { WHATSAPP_NUMBER } from '../constants/config';

function AsistenciaPrepago({ onVolver }) {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [planExpandido, setPlanExpandido] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    beneficios: [],
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
  const [nuevoBeneficio, setNuevoBeneficio] = useState('');
  const [nuevaSala, setNuevaSala] = useState('');

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const esAdmin = usuario?.rol === 'admin';
    setIsAdmin(esAdmin);
    fetchPlanes(esAdmin);
  }, []);

  const fetchPlanes = async (esAdmin) => {
    try {
      const endpoint = esAdmin 
        ? 'http://localhost:5000/api/asistencia-prepago/admin/todos'
        : 'http://localhost:5000/api/asistencia-prepago/activos';
      
      const headers = esAdmin 
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await fetch(endpoint, { headers });
      if (res.ok) {
        const data = await res.json();
        setPlanes(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error al cargar planes de asistencia prepago:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      precio: '',
      descripcion: '',
      beneficios: [],
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
    setNuevoBeneficio('');
    setNuevaSala('');
    setEditingId(null);
    setShowForm(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId
      ? `http://localhost:5000/api/asistencia-prepago/${editingId}`
      : 'http://localhost:5000/api/asistencia-prepago';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const datosEnvio = {
        ...form,
        precio: form.precio ? parseFloat(form.precio) : undefined,
        obituariosDomiciliarios: {
          ...form.obituariosDomiciliarios,
          cantidad: parseInt(form.obituariosDomiciliarios.cantidad) || 0
        }
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosEnvio)
      });

      if (res.ok) {
        alert(editingId ? 'Plan actualizado' : 'Plan creado');
        resetForm();
        fetchPlanes(isAdmin);
      } else {
        const error = await res.json();
        alert('Error: ' + (error.mensaje || error.message || 'Error desconocido'));
      }
    } catch (e) {
      console.error('Error al guardar plan:', e);
      alert('Error al guardar plan: ' + e.message);
    }
  };

  const editarPlan = (plan) => {
    setEditingId(plan._id);
    setForm({
      nombre: plan.nombre || '',
      precio: plan.precio !== undefined ? String(plan.precio) : '',
      descripcion: plan.descripcion || '',
      beneficios: plan.beneficios || [],
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarPlan = async (id) => {
    if (!window.confirm('¿Eliminar este plan?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/asistencia-prepago/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Plan eliminado');
        fetchPlanes(isAdmin);
      }
    } catch (e) {
      console.error(e);
      alert('Error al eliminar');
    }
  };

  const toggleDestacado = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/asistencia-prepago/${id}/destacado`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPlanes(isAdmin);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const agregarBeneficio = () => {
    if (nuevoBeneficio.trim()) {
      setForm(prev => ({
        ...prev,
        beneficios: [...prev.beneficios, nuevoBeneficio.trim()]
      }));
      setNuevoBeneficio('');
    }
  };

  const eliminarBeneficio = (index) => {
    setForm(prev => ({
      ...prev,
      beneficios: prev.beneficios.filter((_, i) => i !== index)
    }));
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

  const togglePlan = (planId) => {
    setPlanExpandido(planExpandido === planId ? null : planId);
  };

  const contactarWhatsApp = (plan) => {
    const telefono = WHATSAPP_NUMBER;
    const mensaje = `Hola, estoy interesado en el plan de Asistencia Prepago ${plan.nombre}, quisiera más información.`;
    const url = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="prepago-loading">
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="asistencia-prepago-container">
      <button onClick={onVolver} className="btn-volver-prepago">
        ← Volver
      </button>

      <div className="prepago-content">
        <div className="prepago-icon-large">💳</div>
        <h1>Asistencia Prepago</h1>
        <h2>Planifica tu futuro con tranquilidad</h2>
        
        {/* Botón Admin: + Agregar nuevo plan */}
        {isAdmin && (
          <button
            className="btn-nuevo-plan-prepago"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Agregar Nuevo Plan'}
          </button>
        )}

        {/* Formulario Admin */}
        {isAdmin && showForm && (
          <form onSubmit={onSubmit} className="form-plan-prepago">
            <h3>{editingId ? 'Editar Plan' : 'Crear Nuevo Plan'}</h3>

            {/* Información Básica */}
            <div className="form-section-prepago">
              <h4>Información Básica</h4>
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
                Precio (opcional)
                <input
                  type="number"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="Ej: 150.00"
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows="4"
                  placeholder="Describe los detalles del plan..."
                />
              </label>

              <div className="checkboxes-row">
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

            {/* Beneficios */}
            <div className="form-section-prepago">
              <h4>Beneficios</h4>
              <div className="beneficios-input-group">
                <input
                  type="text"
                  value={nuevoBeneficio}
                  onChange={(e) => setNuevoBeneficio(e.target.value)}
                  placeholder="Añadir beneficio"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarBeneficio())}
                />
                <button type="button" onClick={agregarBeneficio} className="btn-agregar-beneficio">
                  + Agregar
                </button>
              </div>
              <div className="beneficios-list">
                {form.beneficios.map((beneficio, idx) => (
                  <div key={idx} className="beneficio-item">
                    <span>{beneficio}</span>
                    <button type="button" onClick={() => eliminarBeneficio(idx)} className="btn-eliminar-beneficio">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Acondicionamiento de la sala */}
            <div className="form-section-prepago">
              <h4>Acondicionamiento de la sala</h4>
              <div className="beneficios-input-group">
                <input
                  type="text"
                  value={nuevaSala}
                  onChange={(e) => setNuevaSala(e.target.value)}
                  placeholder="Nombre de la sala"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarSala())}
                />
                <button type="button" onClick={agregarSala} className="btn-agregar-beneficio">
                  + Agregar
                </button>
              </div>
              <div className="beneficios-list">
                {form.salasIncluidas.map((sala, idx) => (
                  <div key={idx} className="beneficio-item">
                    <span>{sala}</span>
                    <button type="button" onClick={() => eliminarSala(idx)} className="btn-eliminar-beneficio">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedimientos */}
            <div className="form-section-prepago">
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
                  placeholder="Describe otros procedimientos"
                />
              </label>
            </div>

            {/* Transporte */}
            <div className="form-section-prepago">
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
                  rows="3"
                  placeholder="Describe los detalles del transporte"
                />
              </label>
            </div>

            {/* Arreglo Floral */}
            <div className="form-section-prepago">
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
                    placeholder="Describe el arreglo floral"
                  />
                </label>
              )}
            </div>

            {/* Trámites Legales */}
            <div className="form-section-prepago">
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
                    placeholder="Describe los trámites legales"
                  />
                </label>
              )}
            </div>

            {/* Medios de Comunicación */}
            <div className="form-section-prepago">
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
                    placeholder="Describe los medios de comunicación"
                  />
                </label>
              )}
            </div>

            {/* Obituarios Domiciliarios */}
            <div className="form-section-prepago">
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
                    placeholder="Cantidad de obituarios"
                  />
                </label>
              )}
            </div>

            {/* Cafetería */}
            <div className="form-section-prepago">
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
                  placeholder="Describe los servicios de cafetería"
                />
              </label>
            </div>

            {/* Insumos de Sala */}
            <div className="form-section-prepago">
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
                    placeholder="Describe los insumos de sala"
                  />
                </label>
              )}
            </div>

            {/* Servicios Religiosos */}
            <div className="form-section-prepago">
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
                    placeholder="Describe los servicios religiosos"
                  />
                </label>
              )}
            </div>

            {/* Medios Digitales */}
            <div className="form-section-prepago">
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
                  placeholder="Describe otros medios digitales"
                />
              </label>
            </div>

            {/* Infraestructura */}
            <div className="form-section-prepago">
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
                    placeholder="Describe la infraestructura"
                  />
                </label>
              )}
            </div>

            {/* Equipo de la Funeraria */}
            <div className="form-section-prepago">
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
                    placeholder="Describe el equipo de la funeraria"
                  />
                </label>
              )}
            </div>

            {/* Botones de acción */}
            <div className="form-actions-prepago">
              <button type="submit" className="btn-submit-prepago">
                {editingId ? 'Actualizar Plan' : 'Crear Plan'}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel-prepago">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Listado de Planes */}
        {planes.length === 0 ? (
          <div className="prepago-message">
            <p>
              {isAdmin 
                ? 'No hay planes creados aún. Haz clic en "+ Agregar Nuevo Plan" para crear uno.'
                : 'Estamos trabajando para brindarte la mejor información sobre nuestros servicios de asistencia prepago.'}
            </p>
            {!isAdmin && (
              <div className="prepago-coming-soon">
                <span className="coming-icon">🚀</span>
                <p>Próximamente disponible</p>
              </div>
            )}
          </div>
        ) : (
          <div className="planes-prepago-grid">
            {planes.map(plan => {
              const expandido = planExpandido === plan._id;
              const nombrePlan = plan.nombre || '';
              const tituloPlan = nombrePlan.toUpperCase().startsWith('PLAN ')
                ? nombrePlan
                : `PLAN ${nombrePlan}`.trim();
              
              return (
                <div key={plan._id} className={`plan-prepago-card ${!plan.activo ? 'plan-inactivo' : ''} ${expandido ? 'expandido' : ''}`}>
                  
                  {/* Vista compacta */}
                  {!isAdmin && (
                    <div className="plan-prepago-compact-header" onClick={() => togglePlan(plan._id)}>
                      <div className="plan-prepago-header-layout">
                        <div className="plan-prepago-imagen-container">
                          <img src={`${process.env.PUBLIC_URL}/logo_fgm.png`} alt="Asistencia Prepago" className="plan-prepago-imagen" />
                        </div>
                        <div className="plan-prepago-info">
                          <div className="plan-prepago-header">
                            <h3>{tituloPlan}</h3>
                            {plan.destacado && <span className="badge-destacado-compact">★ Destacado</span>}
                          </div>
                          
                          {plan.descripcion && (
                            <p className="plan-descripcion-breve">
                              {plan.descripcion.length > 100 
                                ? plan.descripcion.substring(0, 100) + '...' 
                                : plan.descripcion}
                            </p>
                          )}
                          
                          <button 
                            type="button"
                            className="btn-ver-mas-prepago"
                          >
                            {expandido ? 'Ocultar' : 'Ver más detalles'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vista completa para admin o cuando está expandido */}
                  {(isAdmin || expandido) && (
                    <div className={`plan-prepago-detalles ${!isAdmin ? 'usuario-expandido' : ''}`}>
                      {isAdmin && (
                        <>
                          <div className="plan-prepago-header">
                            <h3>{plan.nombre}</h3>
                            <div className="badges-container">
                              {plan.destacado && <span className="badge-destacado">⭐ Destacado</span>}
                              {!plan.activo && <span className="badge-inactivo">❌ Inactivo</span>}
                            </div>
                          </div>
                          
                          <div className="plan-prepago-precio">
                            {plan.precio ? `$${plan.precio.toFixed(2)}` : 'Consultar precio'}
                          </div>
                        </>
                      )}

                      {plan.descripcion && (
                        <div className="plan-prepago-descripcion">
                          <h4>Descripción</h4>
                          <p>{plan.descripcion}</p>
                        </div>
                      )}

                      {plan.beneficios && plan.beneficios.length > 0 && (
                        <div className="plan-prepago-beneficios">
                          <h4>Beneficios:</h4>
                          <ul>
                            {plan.beneficios.map((beneficio, idx) => (
                              <li key={idx}>✓ {beneficio}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {plan.salasIncluidas && plan.salasIncluidas.length > 0 && (
                        <div className="plan-prepago-salas">
                          <h4>Acondicionamiento de la sala:</h4>
                          <ul>
                            {plan.salasIncluidas.map((sala, idx) => (
                              <li key={idx}>✓ {sala}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(plan.procedimientos?.formolizacion || plan.procedimientos?.tanatopraxia || plan.procedimientos?.otros) && (
                        <div className="plan-prepago-seccion">
                          <h4>🔬 Procedimientos</h4>
                          <ul>
                            {plan.procedimientos.formolizacion && <li>✓ Formolización</li>}
                            {plan.procedimientos.tanatopraxia && <li>✓ Tanatopraxia</li>}
                            {plan.procedimientos.otros && <li>✓ {plan.procedimientos.otros}</li>}
                          </ul>
                        </div>
                      )}

                      {plan.transporte?.autocarroza && (
                        <div className="plan-prepago-seccion">
                          <h4>🚗 Transporte</h4>
                          <p>✓ Autocarroza incluida</p>
                          {plan.transporte.detalles && <p className="detalles-texto">{plan.transporte.detalles}</p>}
                        </div>
                      )}

                      {plan.arregloFloral?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>💐 Arreglo Floral</h4>
                          <p>✓ Incluido</p>
                          {plan.arregloFloral.descripcion && <p className="detalles-texto">{plan.arregloFloral.descripcion}</p>}
                        </div>
                      )}

                      {plan.tramitesLegales?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>📄 Trámites Legales</h4>
                          <p>✓ Incluido</p>
                          {plan.tramitesLegales.descripcion && <p className="detalles-texto">{plan.tramitesLegales.descripcion}</p>}
                        </div>
                      )}

                      {plan.mediosComunicacion?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>📰 Medios de Comunicación</h4>
                          <p>✓ Incluido</p>
                          {plan.mediosComunicacion.descripcion && <p className="detalles-texto">{plan.mediosComunicacion.descripcion}</p>}
                        </div>
                      )}

                      {plan.obituariosDomiciliarios?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>📰 Obituarios Domiciliarios</h4>
                          <p>✓ {plan.obituariosDomiciliarios.cantidad} obituarios incluidos</p>
                        </div>
                      )}

                      {(plan.cafeteria?.bebidas || plan.cafeteria?.vasosTermicos) && (
                        <div className="plan-prepago-seccion">
                          <h4>☕ Cafetería</h4>
                          <ul>
                            {plan.cafeteria.bebidas && <li>✓ Bebidas</li>}
                            {plan.cafeteria.vasosTermicos && <li>✓ Vasos térmicos</li>}
                          </ul>
                          {plan.cafeteria.descripcion && <p className="detalles-texto">{plan.cafeteria.descripcion}</p>}
                        </div>
                      )}

                      {plan.insumosSala?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>🛋️ Insumos de Sala</h4>
                          <p>✓ Incluido</p>
                          {plan.insumosSala.descripcion && <p className="detalles-texto">{plan.insumosSala.descripcion}</p>}
                        </div>
                      )}

                      {plan.serviciosReligiosos?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>⛪ Servicios Religiosos</h4>
                          <p>✓ Incluido</p>
                          {plan.serviciosReligiosos.descripcion && <p className="detalles-texto">{plan.serviciosReligiosos.descripcion}</p>}
                        </div>
                      )}

                      {(plan.mediosDigitales?.videoHomenaje || plan.mediosDigitales?.facebookLive || plan.mediosDigitales?.otros) && (
                        <div className="plan-prepago-seccion">
                          <h4>📱 Medios Digitales</h4>
                          <ul>
                            {plan.mediosDigitales.videoHomenaje && <li>✓ Video homenaje</li>}
                            {plan.mediosDigitales.facebookLive && <li>✓ Facebook Live</li>}
                            {plan.mediosDigitales.otros && <li>✓ {plan.mediosDigitales.otros}</li>}
                          </ul>
                        </div>
                      )}

                      {plan.infraestructura?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>🏢 Infraestructura</h4>
                          <p>✓ Incluido</p>
                          {plan.infraestructura.descripcion && <p className="detalles-texto">{plan.infraestructura.descripcion}</p>}
                        </div>
                      )}

                      {plan.equipoFuneraria?.incluido && (
                        <div className="plan-prepago-seccion">
                          <h4>👥 Equipo de la Funeraria</h4>
                          <p>✓ Personal profesional incluido</p>
                          {plan.equipoFuneraria.descripcion && <p className="detalles-texto">{plan.equipoFuneraria.descripcion}</p>}
                        </div>
                      )}

                      {/* Botón WhatsApp para usuarios cuando está expandido */}
                      {!isAdmin && expandido && (
                        <div className="plan-prepago-footer">
                          <p className="contacto-mensaje-prepago">¿Le interesa este plan? Contáctenos para más información</p>
                          <button 
                            type="button"
                            className="btn-whatsapp-prepago"
                            onClick={(e) => {
                              e.stopPropagation();
                              contactarWhatsApp(plan);
                            }}
                          >
                            📲 Contactar por WhatsApp
                          </button>
                        </div>
                      )}

                      {/* Botones Admin: Editar y Eliminar */}
                      {isAdmin && (
                        <div className="plan-actions-prepago">
                          <button onClick={() => editarPlan(plan)} className="btn-edit-prepago">
                            Editar
                          </button>
                          <button 
                            onClick={() => toggleDestacado(plan._id)} 
                            className={`btn-toggle-prepago ${plan.destacado ? 'destacado' : ''}`}
                            title={plan.destacado ? 'Quitar destacado' : 'Marcar como destacado'}
                          >
                            {plan.destacado ? '⭐' : '☆'}
                          </button>
                          <button onClick={() => eliminarPlan(plan._id)} className="btn-delete-prepago">
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AsistenciaPrepago;
