import React, { useState, useEffect } from 'react';
import './AdminNotificaciones.css';

function AdminNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // todas, no-leidas, floristeria, plan, etc.

  useEffect(() => {
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, [filtro]);

  const fetchNotificaciones = async () => {
    try {
      const url = filtro === 'no-leidas'
        ? 'http://localhost:5000/api/notificaciones/no-leidas'
        : 'http://localhost:5000/api/notificaciones';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        let notifs = data.notificaciones || [];
        
        // Filtrar por tipo si no es "todas" ni "no-leidas"
        if (filtro !== 'todas' && filtro !== 'no-leidas') {
          notifs = notifs.filter(n => n.tipo === filtro);
        }
        
        setNotificaciones(notifs);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setLoading(false);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notificaciones/${id}/leer`, {
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

  const marcarTodasComoLeidas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notificaciones/marcar-todas-leidas', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchNotificaciones();
      }
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  const eliminarNotificacion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta notificación?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/notificaciones/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchNotificaciones();
        }
      } catch (err) {
        console.error('Error al eliminar notificación:', err);
      }
    }
  };

  const limpiarLeidas = async () => {
    if (window.confirm('¿Eliminar todas las notificaciones leídas?')) {
      try {
        const response = await fetch('http://localhost:5000/api/notificaciones/limpiar/leidas', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchNotificaciones();
        }
      } catch (err) {
        console.error('Error al limpiar notificaciones:', err);
      }
    }
  };

  const getIconoPorTipo = (tipo) => {
    const iconos = {
      'floristeria': '🌹',
      'plan': '📋',
      'seguro': '🛡️',
      'servicio': '⚙️',
      'obituario': '🕯️',
      'cliente': '👤',
      'general': '📬'
    };
    return iconos[tipo] || '📬';
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  if (loading) {
    return (
      <div className="notificaciones-container">
        <h1>📬 Notificaciones</h1>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div className="notificaciones-container">
      <div className="notificaciones-header">
        <h1>📬 Notificaciones {notificacionesNoLeidas > 0 && <span className="badge-contador">({notificacionesNoLeidas})</span>}</h1>
        
        <div className="notificaciones-acciones">
          {notificacionesNoLeidas > 0 && (
            <button onClick={marcarTodasComoLeidas} className="btn-marcar-todas">
              ✓ Marcar todas como leídas
            </button>
          )}
          <button onClick={limpiarLeidas} className="btn-limpiar">
            🗑️ Limpiar leídas
          </button>
        </div>
      </div>

      <div className="notificaciones-filtros">
        <button 
          className={filtro === 'todas' ? 'active' : ''} 
          onClick={() => setFiltro('todas')}
        >
          Todas
        </button>
        <button 
          className={filtro === 'no-leidas' ? 'active' : ''} 
          onClick={() => setFiltro('no-leidas')}
        >
          No leídas {notificacionesNoLeidas > 0 && `(${notificacionesNoLeidas})`}
        </button>
        <button 
          className={filtro === 'floristeria' ? 'active' : ''} 
          onClick={() => setFiltro('floristeria')}
        >
          🌹 Floristerías
        </button>
        <button 
          className={filtro === 'plan' ? 'active' : ''} 
          onClick={() => setFiltro('plan')}
        >
          📋 Planes
        </button>
        <button 
          className={filtro === 'servicio' ? 'active' : ''} 
          onClick={() => setFiltro('servicio')}
        >
          ⚙️ Servicios
        </button>
      </div>

      {notificaciones.length === 0 ? (
        <div className="no-notificaciones">
          <p>📭 No hay notificaciones {filtro !== 'todas' ? `de tipo ${filtro}` : ''}</p>
        </div>
      ) : (
        <div className="notificaciones-lista">
          {notificaciones.map(notif => (
            <div 
              key={notif._id} 
              className={`notificacion-card ${!notif.leida ? 'no-leida' : ''}`}
            >
              <div className="notificacion-icono">
                {getIconoPorTipo(notif.tipo)}
              </div>
              
              <div className="notificacion-contenido">
                <div className="notificacion-titulo">
                  {notif.titulo}
                  {!notif.leida && <span className="badge-nueva">NUEVA</span>}
                </div>
                <div className="notificacion-mensaje">{notif.mensaje}</div>
                
                {notif.datos && Object.keys(notif.datos).length > 0 && (
                  <div className="notificacion-datos">
                    {notif.datos.nombreCliente && <span>👤 {notif.datos.nombreCliente}</span>}
                    {notif.datos.precio && <span>💰 ${notif.datos.precio}</span>}
                    {notif.datos.emailCliente && <span>✉️ {notif.datos.emailCliente}</span>}
                    {notif.datos.telefonoCliente && <span>📞 {notif.datos.telefonoCliente}</span>}
                  </div>
                )}
                
                <div className="notificacion-fecha">{formatearFecha(notif.createdAt)}</div>
              </div>

              <div className="notificacion-acciones">
                {!notif.leida && (
                  <button 
                    onClick={() => marcarComoLeida(notif._id)}
                    className="btn-marcar"
                    title="Marcar como leída"
                  >
                    ✓
                  </button>
                )}
                <button 
                  onClick={() => eliminarNotificacion(notif._id)}
                  className="btn-eliminar"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminNotificaciones;
