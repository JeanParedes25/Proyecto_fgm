import { useState, useEffect } from 'react';
import './AdminCuentasBancarias.css';

function AdminCuentasBancarias() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    banco: '',
    numeroCuenta: '',
    tipoCuenta: 'Ahorros',
    nombreTitular: ''
  });

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cuentas-bancarias/todas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCuentas(data.cuentas || []);
      }
    } catch (err) {
      console.error('Error al cargar cuentas:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.banco || !formData.numeroCuenta || !formData.tipoCuenta || !formData.nombreTitular) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/cuentas-bancarias/${editingId}`
        : 'http://localhost:5000/api/cuentas-bancarias';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingId ? 'Cuenta actualizada exitosamente' : 'Cuenta creada exitosamente');
        resetForm();
        fetchCuentas();
      } else {
        const error = await response.json();
        alert(`Error: ${error.mensaje || 'No se pudo guardar la cuenta'}`);
      }
    } catch (err) {
      console.error('Error al guardar cuenta:', err);
      alert('Error al guardar la cuenta');
    }
  };

  const handleEdit = (cuenta) => {
    setEditingId(cuenta._id);
    setFormData({
      banco: cuenta.banco,
      numeroCuenta: cuenta.numeroCuenta,
      tipoCuenta: cuenta.tipoCuenta,
      nombreTitular: cuenta.nombreTitular
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de desactivar esta cuenta?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cuentas-bancarias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Cuenta desactivada exitosamente');
        fetchCuentas();
      } else {
        alert('Error al desactivar la cuenta');
      }
    } catch (err) {
      console.error('Error al desactivar cuenta:', err);
      alert('Error al desactivar la cuenta');
    }
  };

  const resetForm = () => {
    setFormData({
      banco: '',
      numeroCuenta: '',
      tipoCuenta: 'Ahorros',
      nombreTitular: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="cuentas-bancarias-container">
        <h1>🏦 Gestión de Cuentas Bancarias</h1>
        <p>Cargando cuentas...</p>
      </div>
    );
  }

  const cuentasActivas = cuentas.filter(c => c.activa);
  const cuentasInactivas = cuentas.filter(c => !c.activa);

  return (
    <div className="cuentas-bancarias-container">
      <div className="cuentas-header">
        <h1>🏦 Gestión de Cuentas Bancarias</h1>
        <button 
          className="btn-nueva-cuenta"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancelar' : '➕ Nueva Cuenta'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Editar Cuenta' : 'Nueva Cuenta Bancaria'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="banco">Banco *</label>
              <select
                id="banco"
                name="banco"
                value={formData.banco}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona un banco</option>
                <option value="Banco Pichincha">Banco Pichincha</option>
                <option value="Banco Internacional">Banco Internacional</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numeroCuenta">Número de Cuenta *</label>
              <input
                type="text"
                id="numeroCuenta"
                name="numeroCuenta"
                value={formData.numeroCuenta}
                onChange={handleInputChange}
                placeholder="Ej: 1234567890"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoCuenta">Tipo de Cuenta *</label>
              <select
                id="tipoCuenta"
                name="tipoCuenta"
                value={formData.tipoCuenta}
                onChange={handleInputChange}
                required
              >
                <option value="Ahorros">Ahorros</option>
                <option value="Corriente">Corriente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nombreTitular">Nombre del Titular *</label>
              <input
                type="text"
                id="nombreTitular"
                name="nombreTitular"
                value={formData.nombreTitular}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <button type="submit" className="btn-guardar">
              {editingId ? '💾 Actualizar' : '💾 Guardar'}
            </button>
          </form>
        </div>
      )}

      <div className="cuentas-section">
        <h2>Cuentas Activas ({cuentasActivas.length})</h2>
        {cuentasActivas.length === 0 ? (
          <div className="empty-state">
            <p>No hay cuentas activas. Crea una nueva.</p>
          </div>
        ) : (
          <div className="cuentas-grid">
            {cuentasActivas.map((cuenta) => (
              <div key={cuenta._id} className="cuenta-card">
                <div className="cuenta-header-card">
                  <h3>{cuenta.banco}</h3>
                  <span className="estado-activa">✓ Activa</span>
                </div>
                <div className="cuenta-details">
                  <div className="detail-item">
                    <span className="label">Número de Cuenta:</span>
                    <span className="valor">{cuenta.numeroCuenta}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Tipo:</span>
                    <span className="valor">{cuenta.tipoCuenta}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Titular:</span>
                    <span className="valor">{cuenta.nombreTitular}</span>
                  </div>
                </div>
                <div className="cuenta-acciones">
                  <button 
                    className="btn-editar"
                    onClick={() => handleEdit(cuenta)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-eliminar"
                    onClick={() => handleDelete(cuenta._id)}
                  >
                    🗑️ Desactivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cuentasInactivas.length > 0 && (
        <div className="cuentas-section inactivas">
          <h2>Cuentas Inactivas ({cuentasInactivas.length})</h2>
          <div className="cuentas-grid">
            {cuentasInactivas.map((cuenta) => (
              <div key={cuenta._id} className="cuenta-card inactiva">
                <div className="cuenta-header-card">
                  <h3>{cuenta.banco}</h3>
                  <span className="estado-inactiva">✕ Inactiva</span>
                </div>
                <div className="cuenta-details">
                  <div className="detail-item">
                    <span className="label">Número de Cuenta:</span>
                    <span className="valor">{cuenta.numeroCuenta}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Tipo:</span>
                    <span className="valor">{cuenta.tipoCuenta}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Titular:</span>
                    <span className="valor">{cuenta.nombreTitular}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCuentasBancarias;
