import { useState, useEffect } from 'react';
import './AdminAudit.css';

function AdminAudit() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/audit/logs', {
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
    if (filter === 'all') return true;
    return log.action === filter;
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
      'login': '#4CAF50',
      'logout': '#9E9E9E',
      'create': '#2196F3',
      'update': '#FF9800',
      'delete': '#F44336'
    };
    return colors[action] || '#757575';
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
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={filter === 'login' ? 'active' : ''} 
            onClick={() => setFilter('login')}
          >
            Inicios de sesión
          </button>
          <button 
            className={filter === 'create' ? 'active' : ''} 
            onClick={() => setFilter('create')}
          >
            Creaciones
          </button>
          <button 
            className={filter === 'update' ? 'active' : ''} 
            onClick={() => setFilter('update')}
          >
            Actualizaciones
          </button>
          <button 
            className={filter === 'delete' ? 'active' : ''} 
            onClick={() => setFilter('delete')}
          >
            Eliminaciones
          </button>
        </div>
      </div>

      <div className="audit-stats">
        <div className="stat-card">
          <h3>{auditLogs.filter(l => l.action === 'login').length}</h3>
          <p>Inicios de sesión</p>
        </div>
        <div className="stat-card">
          <h3>{auditLogs.filter(l => l.action === 'create').length}</h3>
          <p>Registros creados</p>
        </div>
        <div className="stat-card">
          <h3>{auditLogs.filter(l => l.action === 'update').length}</h3>
          <p>Actualizaciones</p>
        </div>
        <div className="stat-card">
          <h3>{auditLogs.filter(l => l.action === 'delete').length}</h3>
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
                  No hay registros de auditoría
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td>{formatDate(log.timestamp)}</td>
                  <td>{log.userName || log.userEmail}</td>
                  <td>
                    <span 
                      className="action-badge" 
                      style={{ backgroundColor: getActionColor(log.action) }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td>{log.description}</td>
                  <td className="ip-address">{log.ipAddress || 'N/A'}</td>
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
