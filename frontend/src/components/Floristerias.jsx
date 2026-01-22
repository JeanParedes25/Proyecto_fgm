import { useState, useEffect } from 'react';
import './Floristerias.css';

function Floristerias({ usuario, onBack }) {
  const [flores, setFlores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [floraSeleccionada, setFloraSeleccionada] = useState(null);
  const [cuentasBancarias, setCuentasBancarias] = useState([]);
  const [nombrePersonaFallecida, setNombrePersonaFallecida] = useState('');
  const [mostrarFormPedido, setMostrarFormPedido] = useState(false);
  const [creandoPedido, setCreandoPedido] = useState(false);
  const [mostrarCuentas, setMostrarCuentas] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

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

  const fetchCuentasBancarias = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cuentas-bancarias', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCuentasBancarias(data.cuentas || []);
      }
    } catch (err) {
      console.error('Error al cargar cuentas bancarias:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const abrirDetalle = (flor) => {
    setFloraSeleccionada(flor);
    setMostrarFormPedido(false);
    setMostrarCuentas(false);
    setPedidoConfirmado(false);
    setNombrePersonaFallecida('');
  };

  const cerrarDetalle = () => {
    setFloraSeleccionada(null);
    setMostrarFormPedido(false);
    setMostrarCuentas(false);
    setPedidoConfirmado(false);
    setNombrePersonaFallecida('');
  };

  const iniciarPedido = () => {
    setMostrarFormPedido(true);
  };

  const handleNombreFallecidoChange = (e) => {
    setNombrePersonaFallecida(e.target.value);
  };

  const validarYContinuar = (e) => {
    e.preventDefault();
    if (!nombrePersonaFallecida.trim()) {
      alert('Por favor ingresa el nombre de la persona fallecida');
      return;
    }
    fetchCuentasBancarias();
    setMostrarCuentas(true);
  };

  const crearPedido = async () => {
    if (!floraSeleccionada) return;

    setCreandoPedido(true);
    try {
      const response = await fetch('http://localhost:5000/api/pedidos-floristerias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          codigoArreglo: floraSeleccionada.codigo,
          arregloId: floraSeleccionada._id,
          descripcionArreglo: floraSeleccionada.descripcion,
          nombrePersonaFallecida: nombrePersonaFallecida,
          precio: floraSeleccionada.precio
        })
      });

      if (response.ok) {
        setPedidoConfirmado(true);
        setMostrarCuentas(false);
        setMostrarFormPedido(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.mensaje || 'No se pudo crear el pedido'}`);
      }
    } catch (err) {
      console.error('Error al crear pedido:', err);
      alert('Error al crear el pedido');
    } finally {
      setCreandoPedido(false);
    }
  };

  if (loading) {
    return (
      <div className="floristerias-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Panel
        </button>
        <div style={{ textAlign: 'center', padding: '40px', color: '#d4809d' }}>
          Cargando floristerías...
        </div>
      </div>
    );
  }

  if (floraSeleccionada) {
    if (pedidoConfirmado) {
      return (
        <div className="flor-modal-view">
          <button className="back-button" onClick={cerrarDetalle}>
            ← Volver a Floristerías
          </button>
          <div className="pedido-confirmado">
            <div className="confirmacion-icono">✅</div>
            <h2>¡Pedido Confirmado!</h2>
            <p>Tu pedido ha sido registrado exitosamente.</p>
            <div className="resumen-pedido">
              <h3>Resumen del Pedido</h3>
              <div className="resumen-item">
                <span>Código:</span>
                <strong>{floraSeleccionada.codigo}</strong>
              </div>
              <div className="resumen-item">
                <span>Descripción:</span>
                <strong>{floraSeleccionada.descripcion}</strong>
              </div>
              <div className="resumen-item">
                <span>Destinatario:</span>
                <strong>{nombrePersonaFallecida}</strong>
              </div>
              <div className="resumen-item">
                <span>Precio:</span>
                <strong>${floraSeleccionada.precio.toFixed(2)}</strong>
              </div>
            </div>
            <p className="instrucciones">
              El administrador recibirá tu pedido y se comunicará contigo pronto con los detalles de entrega.
            </p>
            <button className="btn-primary" onClick={cerrarDetalle}>
              Volver a Floristerías
            </button>
          </div>
        </div>
      );
    }

    if (mostrarCuentas) {
      return (
        <div className="flor-modal-view">
          <button className="back-button" onClick={() => setMostrarCuentas(false)}>
            ← Volver
          </button>
          <div className="cuentas-panel">
            <h2>💳 Cuentas Bancarias para el Pago</h2>
            <div className="cuentas-lista">
              {cuentasBancarias.length === 0 ? (
                <p>No hay cuentas bancarias disponibles</p>
              ) : (
                cuentasBancarias.map((cuenta) => (
                  <div key={cuenta._id} className="cuenta-card">
                    <div className="cuenta-info">
                      <h4>{cuenta.banco}</h4>
                      <p><strong>Número de Cuenta:</strong> {cuenta.numeroCuenta}</p>
                      <p><strong>Tipo de Cuenta:</strong> {cuenta.tipoCuenta}</p>
                      <p><strong>Titular:</strong> {cuenta.nombreTitular}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pago-info">
              <h3>Información del Pago</h3>
              <p>Selecciona una de las cuentas bancarias anteriores para realizar el depósito de:</p>
              <div className="monto-total">
                <strong>${floraSeleccionada.precio.toFixed(2)}</strong>
              </div>
              <p>Una vez realizado el pago, confirma tu pedido a continuación:</p>
            </div>
            <button 
              className="btn-confirm" 
              onClick={crearPedido} 
              disabled={creandoPedido}
            >
              {creandoPedido ? 'Confirmando...' : '✓ Confirmar Pedido'}
            </button>
          </div>
        </div>
      );
    }

    if (mostrarFormPedido) {
      return (
        <div className="flor-modal-view">
          <button className="back-button" onClick={() => setMostrarFormPedido(false)}>
            ← Volver
          </button>
          <div className="form-pedido">
            <h2>📋 Datos del Pedido</h2>
            <form onSubmit={validarYContinuar}>
              <div className="form-group">
                <label htmlFor="nombreFallecido">
                  Nombre de la persona fallecida a quien va destinado el arreglo *
                </label>
                <input
                  type="text"
                  id="nombreFallecido"
                  value={nombrePersonaFallecida}
                  onChange={handleNombreFallecidoChange}
                  placeholder="Ej: Juan Pérez García"
                  required
                />
              </div>
              <button type="submit" className="btn-continue">
                Continuar al Pago →
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="flor-modal-view">
        <button className="back-button" onClick={cerrarDetalle}>
          ← Volver a Floristerías
        </button>

        <div className="detail-header">
          <h1>{floraSeleccionada.codigo}</h1>
          <p className="subtitle">${floraSeleccionada.precio.toFixed(2)}</p>
        </div>

        <div className="flor-detail-container">
          {/* Mostrar fotos nuevas (fotos[]) o imagen antigua (image) */}
          {Array.isArray(floraSeleccionada.fotos) && floraSeleccionada.fotos.length > 0 ? (
            <div className="flor-detail-galeria">
              {floraSeleccionada.fotos.map((foto, idx) => (
                <div key={idx} className="flor-detail-image">
                  <img src={foto.url} alt={`${floraSeleccionada.codigo} ${idx + 1}`} />
                  {foto.descripcion && (
                    <p className="foto-desc">{foto.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          ) : floraSeleccionada.image ? (
            <div className="flor-detail-image">
              <img src={floraSeleccionada.image} alt={floraSeleccionada.codigo} />
            </div>
          ) : (
            <div className="flor-detail-image">
              <div className="no-image-detail">Sin imagen</div>
            </div>
          )}

          <div className="flor-detail-content">
            <div className="detail-section">
              <h2>Información</h2>
              <div className="info-group">
                <label>Código:</label>
                <p>{floraSeleccionada.codigo}</p>
              </div>
              {floraSeleccionada.descripcion && (
                <div className="info-group">
                  <label>Descripción:</label>
                  <p>{floraSeleccionada.descripcion}</p>
                </div>
              )}
              <div className="info-group">
                <label>Precio:</label>
                <p className="price">${floraSeleccionada.precio.toFixed(2)}</p>
              </div>
            </div>

            <div className="detail-section cta">
              <button className="btn-primary" onClick={iniciarPedido}>
                💳 Pagar ${floraSeleccionada.precio.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="floristerias-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Panel
      </button>

      <div className="floristerias-header">
        <h1>🌹 Nuestros Arreglos Florales 🌹</h1>
        <p className="welcome-message">
          ¡Bienvenido, {usuario.nombre}! 💐
        </p>
        <p className="description">
          Te presentamos nuestros hermosos arreglos florales para los momentos más especiales.
        </p>
      </div>

      <div className="flores-grid">
        {flores.length === 0 ? (
          <div className="no-flores-message">
            <div className="construction-icon">🌾</div>
            <h2>Sección en Desarrollo</h2>
            <p>Los arreglos florales estarán disponibles próximamente.</p>
            <p className="subtitle">El administrador está preparando la información de nuestros arreglos.</p>
          </div>
        ) : (
          flores.map((flor) => (
            <div
              key={flor._id}
              className="flor-card"
              onClick={() => abrirDetalle(flor)}
            >
              <div className="flor-card-image">
                {Array.isArray(flor.fotos) && flor.fotos.length > 0 ? (
                  <img src={flor.fotos[0].url} alt={flor.codigo} />
                ) : flor.image ? (
                  <img src={flor.image} alt={flor.codigo} />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="flor-card-content">
                <h3>{flor.codigo}</h3>
                <p className="precio">${flor.precio.toFixed(2)}</p>
                {flor.descripcion && (
                  <p className="descripcion">{flor.descripcion}</p>
                )}
              </div>
              <button className="view-btn">
                Ver Detalles →
              </button>
            </div>
          ))
        )}
      </div>

      <div className="floristerias-footer">
        <p>🌹 En Funerales Gonzalo Mendoza cuidamos cada detalle 🌹</p>
      </div>
    </div>
  );
}

export default Floristerias;
