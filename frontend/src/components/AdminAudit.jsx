import { useState, useEffect } from 'react';
import './AdminAudit.css';
import { API_BASE_URL } from '../constants/config';

function AdminAudit() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/audit/logs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error('Error al cargar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'ALL') return true;
    return (log.accion || '').toString().toUpperCase() === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action) => {
    const colors = {
      'LOGIN': '#4CAF50',
      'CREATE': '#2196F3',
      'UPDATE': '#FF9800',
      'DELETE': '#F44336'
    };
    return colors[(action || '').toString().toUpperCase()] || '#757575';
  };

  if (loading) {
    return (
      <div className="admin-audit">
        <div className="loading">Cargando auditoría...</div>
      </div>
    );
  }

  return (
    <div className="admin-audit">
      <div className="audit-header">
        <h2>📋 Auditoría del Sistema</h2>
        <div className="audit-filters">
          <button 
            className={filter === 'ALL' ? 'active' : ''} 
            onClick={() => setFilter('ALL')}
          >
            Todas
          </button>
          <button 
            className={filter === 'LOGIN' ? 'active' : ''} 
            onClick={() => setFilter('LOGIN')}
          >
            Inicios de sesión
          </button>
          <button 
            className={filter === 'CREATE' ? 'active' : ''} 
            onClick={() => setFilter('CREATE')}
          >
            Creaciones
          </button>
          <button 
            className={filter === 'UPDATE' ? 'active' : ''} 
            onClick={() => setFilter('UPDATE')}
          >
            Actualizaciones
          </button>
          <button 
            className={filter === 'DELETE' ? 'active' : ''} 
            onClick={() => setFilter('DELETE')}
          >
            Eliminaciones
          </button>
        </div>
      </div>

      <div className="audit-stats">
        <div className="stat-card">
          <h3>{auditLogs.filter(l => (l.accion || '').toString().toUpperCase() === 'LOGIN').length}</h3>
          <p>Inicios de sesión</p>
        </div>
        <div className="stat-card">
          <h3>{auditLogs.filter(l => (l.accion || '').toString().toUpperCase() === 'CREATE').length}</h3>
          <p>Registros creados</p>
        </div>
        <div className="stat-card">
          <h3>{auditLogs.filter(l => (l.accion || '').toString().toUpperCase() === 'UPDATE').length}</h3>
          <p>Actualizaciones</p>
        </div>
        <div className="stat-card">
          <h3>{auditLogs.filter(l => (l.accion || '').toString().toUpperCase() === 'DELETE').length}</h3>
          <p>Eliminaciones</p>
        </div>
      </div>

      <div className="audit-table-container">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Descripción</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No existen registros para esta categoría
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td>{formatDate(log.fecha || log.createdAt)}</td>
                  <td>{log.nombreUsuario ? `${log.nombreUsuario} (${log.rol || 'usuario'})` : 'Sistema'}</td>
                  <td>
                    <span 
                      className="action-badge" 
                      style={{ backgroundColor: getActionColor(log.accion) }}
                    >
                      {(log.accion || '').toString().toUpperCase()}
                    </span>
                  </td>
                  <td>{log.descripcion}</td>
                  <td className="ip-address">{log.ip || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAudit;
