import { useState, useEffect } from 'react';
import './AdminPedidos.css';
import { API_BASE_URL } from '../constants/config';

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/pedidos-floristerias/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPedidos(data.pedidos || []);
      }
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/pedidos-floristerias/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        alert(`Pedido ${nuevoEstado === 'confirmado' ? 'confirmado' : 'cancelado'} exitosamente`);
        fetchPedidos();
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        alert(`Error: ${errorData.mensaje || 'No se pudo actualizar el pedido'}`);
      }
    } catch (err) {
      console.error('Error al actualizar pedido:', err);
      alert('Error de conexión al servidor');
    }
  };

  const pedidosFiltrados = filtroEstado === 'todos'
    ? pedidos
    : filtroEstado === 'cancelado'
      ? pedidos.filter(p => p.estado === 'cancelado_admin' || p.estado === 'cancelado_usuario')
      : pedidos.filter(p => p.estado === filtroEstado);

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { texto: 'Pendiente', clase: 'estado-pendiente', icono: '⏳' },
      'confirmado': { texto: 'Confirmado', clase: 'estado-confirmado', icono: '✅' },
      'cancelado_admin': { texto: 'Cancelado por Admin', clase: 'estado-cancelado', icono: '❌' },
      'cancelado_usuario': { texto: 'Cancelado por Usuario', clase: 'estado-cancelado', icono: '❌' }
    };
    return estados[estado] || estados['pendiente'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-pedidos">
        <div className="loading">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="admin-pedidos">
      <div className="pedidos-header">
        <h2>🌹 Gestión de Pedidos de Flores</h2>
        <div className="filtros-estado">
          <button 
            className={filtroEstado === 'todos' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setFiltroEstado('todos')}
          >
            Todos ({pedidos.length})
          </button>
          <button 
            className={filtroEstado === 'pendiente' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setFiltroEstado('pendiente')}
          >
            ⏳ Pendientes ({pedidos.filter(p => p.estado === 'pendiente').length})
          </button>
          <button 
            className={filtroEstado === 'confirmado' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setFiltroEstado('confirmado')}
          >
            ✅ Confirmados ({pedidos.filter(p => p.estado === 'confirmado').length})
          </button>
          <button 
            className={filtroEstado === 'cancelado' ? 'filtro-btn active' : 'filtro-btn'}
            onClick={() => setFiltroEstado('cancelado')}
          >
            ❌ Cancelados ({pedidos.filter(p => p.estado === 'cancelado_admin' || p.estado === 'cancelado_usuario').length})
          </button>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="no-pedidos-admin">
          <p>No hay pedidos {filtroEstado !== 'todos' ? `en estado "${filtroEstado}"` : ''}</p>
        </div>
      ) : (
        <div className="pedidos-grid">
          {pedidosFiltrados.map((pedido) => {
            const estadoInfo = getEstadoBadge(pedido.estado);
            return (
              <div key={pedido._id} className="pedido-admin-card">
                <div className="pedido-admin-header">
                  <div>
                    <h3>Pedido #{pedido._id.slice(-6)}</h3>
                    <span className={`estado-badge ${estadoInfo.clase}`}>
                      {estadoInfo.icono} {estadoInfo.texto}
                    </span>
                  </div>
                  <div className="pedido-fecha">
                    {formatDate(pedido.createdAt)}
                  </div>
                </div>

                <div className="pedido-admin-body">
                  <div className="cliente-info">
                    <h4>👤 Cliente</h4>
                    <p><strong>Nombre:</strong> {pedido.nombreCliente}</p>
                    <p><strong>Email:</strong> {pedido.emailCliente || 'No proporcionado'}</p>
                    <p><strong>Teléfono:</strong> {pedido.telefonoCliente || 'No proporcionado'}</p>
                  </div>

                  <div className="pedido-detalles">
                    <h4>🌹 Detalles del Pedido</h4>
                    <p><strong>Arreglo:</strong> {pedido.codigoArreglo}</p>
                    {pedido.descripcionArreglo && (
                      <p><strong>Descripción:</strong> {pedido.descripcionArreglo}</p>
                    )}
                    <p><strong>Para:</strong> {pedido.nombrePersonaFallecida}</p>
                    <p><strong>Cantidad:</strong> {pedido.cantidad || 1}</p>
                    <p><strong>Precio Unitario:</strong> ${parseFloat(pedido.precioUnitario || pedido.precio || 0).toFixed(2)}</p>
                    <p className="precio-admin"><strong>Total:</strong> ${parseFloat(pedido.total || pedido.precio || 0).toFixed(2)}</p>
                  </div>
                </div>

                {pedido.estado === 'pendiente' && (
                  <div className="pedido-admin-actions">
                    <button 
                      className="btn-confirmar"
                      onClick={() => {
                        if (window.confirm('¿Confirmar este pedido?')) {
                          actualizarEstado(pedido._id, 'confirmado');
                        }
                      }}
                    >
                      ✅ Confirmar
                    </button>
                    <button 
                      className="btn-cancelar"
                      onClick={() => {
                        if (window.confirm('¿Cancelar este pedido?')) {
                          actualizarEstado(pedido._id, 'cancelado_admin');
                        }
                      }}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                )}

                {pedido.estado === 'confirmado' && (
                  <div className="pedido-nota-admin confirmado">
                    ✅ Este pedido ha sido confirmado
                  </div>
                )}

                {pedido.estado === 'cancelado_admin' && (
                  <div className="pedido-nota-admin cancelado">
                    ❌ Este pedido fue cancelado por el administrador
                  </div>
                )}

                {pedido.estado === 'cancelado_usuario' && (
                  <div className="pedido-nota-admin cancelado">
                    ❌ Este pedido fue cancelado por el usuario
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;
