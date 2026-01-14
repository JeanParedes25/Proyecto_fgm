import { useState, useEffect } from 'react';
import './ObituariosPublicos.css';

function ObituariosPublicos() {
  const [obituarios, setObituarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [obituarioSeleccionado, setObituarioSeleccionado] = useState(null);

  useEffect(() => {
    fetchObituarios();
  }, []);

  const fetchObituarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/obituarios');
      
      if (response.ok) {
        const data = await response.json();
        setObituarios(data.obituarios || []);
      }
    } catch (err) {
      console.error('Error al cargar obituarios:', err);
    } finally {
      setLoading(false);
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

  const abrirDetalle = (obituario) => {
    setObituarioSeleccionado(obituario);
  };

  const cerrarDetalle = () => {
    setObituarioSeleccionado(null);
  };

  if (loading) {
    return (
      <div className="obituarios-publicos">
        <div className="loading">Cargando obituarios...</div>
      </div>
    );
  }

  return (
    <div className="obituarios-publicos">
      <div className="obituarios-publicos-header">
        <h2>🕯️ Obituarios</h2>
        <p className="obituarios-subtitle">
          En memoria de aquellos que nos dejaron. Honramos su vida y legado.
        </p>
      </div>

      {obituarios.length === 0 ? (
        <div className="no-obituarios">
          <p>📰 No hay obituarios publicados en este momento</p>
        </div>
      ) : (
        <div className="obituarios-publicos-grid">
          {obituarios.map(obituario => (
            <div key={obituario.id} className="obituario-publico-card" onClick={() => abrirDetalle(obituario)}>
              <div className="obituario-publico-image">
                <img 
                  src={obituario.imagen_url || '/placeholder.jpg'} 
                  alt={obituario.nombre_completo}
                />
                <div className="obituario-overlay">
                  <span>Ver más</span>
                </div>
              </div>
              <div className="obituario-publico-info">
                <h3>{obituario.nombre_completo}</h3>
                <p className="obituario-fecha">
                  <span className="fecha-icon">🕊️</span>
                  {formatDate(obituario.fecha_fallecimiento)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {obituarioSeleccionado && (
        <div className="obituario-modal" onClick={cerrarDetalle}>
          <div className="obituario-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarDetalle}>✕</button>
            
            <div className="modal-body">
              <div className="modal-image">
                <img 
                  src={obituarioSeleccionado.imagen_url || '/placeholder.jpg'} 
                  alt={obituarioSeleccionado.nombre_completo}
                />
              </div>
              
              <div className="modal-info">
                <h2>{obituarioSeleccionado.nombre_completo}</h2>
                
                <div className="modal-fecha">
                  <span className="fecha-icon">🕊️</span>
                  <strong>Fecha de fallecimiento:</strong> {formatDate(obituarioSeleccionado.fecha_fallecimiento)}
                </div>

                <div className="modal-mensaje">
                  <h3>💐 En su memoria</h3>
                  <p>{obituarioSeleccionado.mensaje_recordatorio}</p>
                </div>

                <div className="modal-arte">
                  <h3>⛪ Parte Mortuorio</h3>
                  <p>{obituarioSeleccionado.arte_mortuorio}</p>
                </div>

                <div className="modal-footer">
                  <p className="descanse-paz">🕯️ Que descanse en paz 🕯️</p>
                  <p className="contacto-info">
                    Para más información contactar: <br/>
                    📞 099 28 29 095 | 099 90 90 860
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ObituariosPublicos;
