import { useState, useEffect } from 'react';
import './AdminNotificacionesFloristerias.css';

function AdminNotificacionesFloristerias() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('no-leidas');

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 5000);
    return () => clearInterval(interval);
  }, [filtro]);

  const fetchNotificaciones = async () => {
    try {
      const url = filtro === 'no-leidas' 
        ? 'http://localhost:5000/api/notificaciones-floristerias/no-leidas'
        : 'http://localhost:5000/api/notificaciones-floristerias';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data.notificaciones || []);
      }
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notificaciones-floristerias/${id}/leer`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchNotificaciones();
      }
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  const eliminarNotificacion = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta notificación?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/notificaciones-floristerias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchNotificaciones();
        alert('Notificación eliminada');
      }
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="notificaciones-floristerias-container">
        <h1>📬 Notificaciones de Floristería</h1>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div className="notificaciones-floristerias-container">
      <h1>📬 Notificaciones de Floristería</h1>

      <div className="filtros">
        <button 
          className={`filtro-btn ${filtro === 'no-leidas' ? 'active' : ''}`}
          onClick={() => setFiltro('no-leidas')}
        >
          🔴 No Leídas ({notificaciones.filter(n => !n.leida).length})
        </button>
        <button 
          className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          📋 Todas ({notificaciones.length})
        </button>
      </div>

      {notificaciones.length === 0 ? (
        <div className="no-notificaciones">
          <div className="empty-icon">📭</div>
          <p>No hay notificaciones {filtro === 'no-leidas' ? 'sin leer' : 'disponibles'}</p>
        </div>
      ) : (
        <div className="notificaciones-lista">
          {notificaciones.map((notificacion) => (
            <div 
              key={notificacion._id} 
              className={`notificacion-card ${!notificacion.leida ? 'no-leida' : 'leida'}`}
            >
              <div className="notificacion-header">
                <span className={`estado ${!notificacion.leida ? 'nuevo' : ''}`}>
                  {!notificacion.leida ? '🔴 Nuevo' : '✓ Leído'}
                </span>
                <span className="fecha">{formatDate(notificacion.createdAt)}</span>
              </div>

              <div className="notificacion-contenido">
                <div className="mensaje-principal">
                  <strong>{notificacion.nombreCliente}</strong> pidió el arreglo floral código{' '}
                  <strong>{notificacion.codigoArreglo}</strong> para{' '}
                  <strong>{notificacion.nombrePersonaFallecida}</strong>
                </div>

                <div className="detalles">
                  <div className="detalle-item">
                    <span className="label">Descripción:</span>
                    <span className="valor">{notificacion.descripcionArreglo}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Precio:</span>
                    <span className="valor precio">${notificacion.precio.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="notificacion-acciones">
                {!notificacion.leida && (
                  <button 
                    className="btn-leer"
                    onClick={() => marcarComoLeida(notificacion._id)}
                    title="Marcar como leído"
                  >
                    ✓ Marcar como leído
                  </button>
                )}
                <button 
                  className="btn-eliminar"
                  onClick={() => eliminarNotificacion(notificacion._id)}
                  title="Eliminar notificación"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="notificaciones-info">
        <p>💡 Las notificaciones se actualizan automáticamente cada 5 segundos</p>
      </div>
    </div>
  );
}

export default AdminNotificacionesFloristerias;
