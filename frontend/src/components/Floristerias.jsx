import { useState, useEffect } from 'react';
import './Floristerias.css';
import { API_BASE_URL, buildWhatsAppUrl } from '../constants/config';
import { useEmpresa } from '../hooks/useEmpresa';

function Floristerias({ usuario, onBack }) {
  const [flores, setFlores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [floraSeleccionada, setFloraSeleccionada] = useState(null);
  const [cuentasBancarias, setCuentasBancarias] = useState([]);
  const [nombrePersonaFallecida, setNombrePersonaFallecida] = useState('');
  const [cantidadArreglos, setCantidadArreglos] = useState(1);
  const [mostrarFormPedido, setMostrarFormPedido] = useState(false);
  const [mostrarCuentas, setMostrarCuentas] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [creandoPedido, setCreandoPedido] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState(null);
  const { empresa } = useEmpresa();

  useEffect(() => {
    fetchFlores();
  }, []);

  const fetchFlores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/floristerias`, {
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
      const response = await fetch(`${API_BASE_URL}/api/cuentas-bancarias`, {
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
    setCantidadArreglos(1);
  };

  const cerrarDetalle = () => {
    setFloraSeleccionada(null);
    setMostrarFormPedido(false);
    setMostrarCuentas(false);
    setPedidoConfirmado(false);
    setNombrePersonaFallecida('');
    setCantidadArreglos(1);
    setPedidoCreado(null);
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

    // Validar cantidad
    if (!cantidadArreglos || cantidadArreglos < 1) {
      alert('Por favor selecciona una cantidad válida (mínimo 1)');
      return;
    }

    setCreandoPedido(true);
    try {
      const precioUnitario = floraSeleccionada.precio;
      const total = precioUnitario * cantidadArreglos;

      const response = await fetch(`${API_BASE_URL}/api/pedidos-floristerias`, {
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
          precioUnitario: precioUnitario,
          cantidad: cantidadArreglos,
          total: total
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPedidoCreado(data.pedido);
        setMostrarCuentas(false);
        setPedidoConfirmado(true);
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

  // Abrir WhatsApp con número de empresa
  const abrirWhatsApp = () => {
    const baseUrl = buildWhatsAppUrl(empresa?.telefonos?.[0]);
    if (!baseUrl) return;
    const total = (pedidoCreado?.total || floraSeleccionada?.precio * cantidadArreglos).toFixed(2);
    const mensaje = encodeURIComponent(
      `Hola, acabo de realizar un pedido de flores en ${empresa?.nombreEmpresa || 'nuestra empresa'}. ` +
      `Arreglo: ${floraSeleccionada?.codigo || 'N/A'}. ` +
      `Cantidad: ${cantidadArreglos}. ` +
      `Precio unitario: $${floraSeleccionada?.precio?.toFixed(2) || '0'}. ` +
      `Total: $${total}. ` +
      `Destinatario: ${nombrePersonaFallecida}. ` +
      `He realizado la transferencia/depósito. Por favor confirmen la recepción del comprobante.`
    );
    window.open(`${baseUrl}?text=${mensaje}`, '_blank');
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
    // Pantalla final - Pedido confirmado
    if (pedidoConfirmado) {
      return (
        <div className="flor-modal-view">
          <button className="back-button" onClick={cerrarDetalle}>
            ← Volver a Floristerías
          </button>
          <div className="pedido-confirmado">
            <div className="confirmacion-icono">✅</div>
            <h2>¡Pedido Realizado!</h2>
            <p>Tu pedido ha sido registrado exitosamente. Ahora debes completar el pago.</p>
            
            <div className="resumen-pedido">
              <h3>Resumen del Pedido</h3>
              <div className="resumen-item">
                <span>Arreglo:</span>
                <strong>{floraSeleccionada.codigo}</strong>
              </div>
              <div className="resumen-item">
                <span>Descripción:</span>
                <strong>{floraSeleccionada.descripcion}</strong>
              </div>
              <div className="resumen-item">
                <span>Cantidad:</span>
                <strong>{cantidadArreglos}</strong>
              </div>
              <div className="resumen-item">
                <span>Precio Unitario:</span>
                <strong>${floraSeleccionada.precio.toFixed(2)}</strong>
              </div>
              <div className="resumen-item">
                <span>Destinatario:</span>
                <strong>{nombrePersonaFallecida}</strong>
              </div>
              <div className="resumen-item">
                <span>Total a Pagar:</span>
                <strong className="monto-destaque">${(pedidoCreado?.total || floraSeleccionada.precio * cantidadArreglos).toFixed(2)}</strong>
              </div>
            </div>

            <div className="instrucciones-pago">
              <div className="instruccion-paso">
                <span className="numero-paso">1</span>
                <p><strong>Realiza el depósito o transferencia</strong> a una de las cuentas mostradas anteriormente</p>
              </div>
              <div className="instruccion-paso">
                <span className="numero-paso">2</span>
                <p><strong>Toma foto del comprobante</strong> de tu transferencia</p>
              </div>
              <div className="instruccion-paso">
                <span className="numero-paso">3</span>
                <p><strong>Envía el comprobante por WhatsApp</strong> al número del negocio</p>
              </div>
            </div>

            <button className="btn-whatsapp" onClick={abrirWhatsApp}>
              📲 Enviar Comprobante por WhatsApp
            </button>

            <button className="btn-primary" onClick={cerrarDetalle}>
              Volver a Floristerías
            </button>
          </div>
        </div>
      );
    }

    // Pantalla 2 - Mostrar cuentas bancarias
    if (mostrarCuentas) {
      return (
        <div className="flor-modal-view">
          <button className="back-button" onClick={() => setMostrarCuentas(false)}>
            ← Volver
          </button>
          <div className="cuentas-panel">
            <h2>💳 Cuentas Bancarias para el Pago</h2>
            <p className="pago-instruccion">
              📝 Para realizar tu pedido, debes hacer un depósito o transferencia a una de nuestras cuentas:
            </p>
            
            <div className="cuentas-lista">
              {cuentasBancarias.length === 0 ? (
                <p className="no-cuentas">No hay cuentas bancarias disponibles</p>
              ) : (
                cuentasBancarias.map((cuenta) => (
                  <div key={cuenta._id} className="cuenta-card">
                    <div className="cuenta-header">
                      <h4>{cuenta.banco}</h4>
                      <span className="tipo-cuenta">{cuenta.tipoCuenta}</span>
                    </div>
                    <div className="cuenta-body">
                      <div className="info-item">
                        <label>Número de Cuenta:</label>
                        <p className="numero-cuenta">{cuenta.numeroCuenta}</p>
                      </div>
                      <div className="info-item">
                        <label>Titular:</label>
                        <p>{cuenta.nombreTitular}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pago-info">
              <h3>Detalle del Pago:</h3>
              <div className="pago-detalle">
                <div className="pago-linea">
                  <span>Precio Unitario:</span>
                  <strong>${floraSeleccionada.precio.toFixed(2)}</strong>
                </div>
                <div className="pago-linea">
                  <span>Cantidad:</span>
                  <strong>{cantidadArreglos}</strong>
                </div>
              </div>
              <div className="monto-total">
                <strong>Total a Transferir: ${(floraSeleccionada.precio * cantidadArreglos).toFixed(2)}</strong>
              </div>
              <p className="concepto">Concepto: Arreglo floral {floraSeleccionada.codigo} x {cantidadArreglos}</p>
            </div>

            <div className="mensaje-whatsapp">
              <p>📱 <strong>Después de realizar el pago,</strong> presiona el botón de abajo para enviar el comprobante por WhatsApp</p>
            </div>

            <button 
              className="btn-confirm" 
              onClick={crearPedido} 
              disabled={creandoPedido}
            >
              {creandoPedido ? 'Creando pedido...' : '✓ Crear Pedido (Ir a WhatsApp)'}
            </button>
          </div>
        </div>
      );
    }

    // Pantalla 1 - Ingreso de datos del fallecido
    if (mostrarFormPedido) {
      return (
        <div className="flor-modal-view">
          <button className="back-button" onClick={() => setMostrarFormPedido(false)}>
            ← Volver
          </button>
          <div className="form-pedido">
            <h2>📋 Datos del Pedido</h2>
            <p className="form-subtitulo">Completa los datos para proceder con tu pedido</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!nombrePersonaFallecida.trim()) {
                alert('Por favor ingresa el nombre de la persona fallecida');
                return;
              }
              if (!cantidadArreglos || cantidadArreglos < 1) {
                alert('Por favor selecciona una cantidad válida');
                return;
              }
              fetchCuentasBancarias();
              setMostrarCuentas(true);
            }}>
              <div className="form-group">
                <label htmlFor="nombreFallecido">
                  Nombre de la persona fallecida *
                </label>
                <input
                  type="text"
                  id="nombreFallecido"
                  value={nombrePersonaFallecida}
                  onChange={(e) => setNombrePersonaFallecida(e.target.value)}
                  placeholder="Ej: Juan Pérez García"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cantidad">
                  Cantidad de arreglos *
                </label>
                <input
                  type="number"
                  id="cantidad"
                  min="1"
                  step="1"
                  value={cantidadArreglos}
                  onChange={(e) => {
                    const valor = parseInt(e.target.value);
                    if (!isNaN(valor) && valor >= 1) {
                      setCantidadArreglos(valor);
                    }
                  }}
                  placeholder="Ej: 1"
                  required
                />
              </div>

              <div className="resumen-arreglo">
                <h3>Información del Arreglo</h3>
                <div className="resumen-item">
                  <span>Código:</span>
                  <strong>{floraSeleccionada.codigo}</strong>
                </div>
                <div className="resumen-item">
                  <span>Descripción:</span>
                  <strong>{floraSeleccionada.descripcion}</strong>
                </div>
                <div className="resumen-item">
                  <span>Precio Unitario:</span>
                  <strong className="precio-fuerte">${floraSeleccionada.precio.toFixed(2)}</strong>
                </div>
                <div className="resumen-item" style={{ borderTop: '2px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                  <span>Total:</span>
                  <strong className="total-fuerte">${(floraSeleccionada.precio * cantidadArreglos).toFixed(2)}</strong>
                </div>
              </div>

              <button type="submit" className="btn-continue">
                Ver Cuentas Bancarias →
              </button>
            </form>
          </div>
        </div>
      );
    }

    // Pantalla detalle del arreglo
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
                <label>Precio Unitario:</label>
                <p className="price">${floraSeleccionada.precio.toFixed(2)}</p>
              </div>
            </div>

            <div className="detail-section cta">
              <div className="cantidad-selector">
                <label htmlFor="cantidadDetalle">Cantidad:</label>
                <input
                  type="number"
                  id="cantidadDetalle"
                  min="1"
                  step="1"
                  value={cantidadArreglos}
                  onChange={(e) => {
                    const valor = parseInt(e.target.value);
                    if (!isNaN(valor) && valor >= 1) {
                      setCantidadArreglos(valor);
                    }
                  }}
                  style={{
                    width: '80px',
                    padding: '8px',
                    marginLeft: '10px',
                    fontSize: '16px',
                    border: '2px solid #d4809d',
                    borderRadius: '5px'
                  }}
                />
              </div>
              <div className="botones-accion" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => setMostrarFormPedido(true)}
                  style={{ flex: '1' }}
                >
                  💳 Hacer Pedido
                </button>
              </div>
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
        <p>🌹 En {empresa?.nombreEmpresa || 'nuestra empresa'} cuidamos cada detalle 🌹</p>
      </div>
    </div>
  );
}

export default Floristerias;
