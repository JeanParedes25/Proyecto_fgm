import { useState, useEffect } from 'react';
import './ObituariosPublicos.css';
import { API_BASE_URL } from '../constants/config';
import { useEmpresa } from '../hooks/useEmpresa';

function ObituariosPublicos() {
  const [obituarios, setObituarios] = useState([]);
  const [obituariosFiltrados, setObituariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [obituarioSeleccionado, setObituarioSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const { empresa } = useEmpresa();

  useEffect(() => {
    fetchObituarios();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setObituariosFiltrados(obituarios);
    } else {
      const filtrados = obituarios.filter(obit =>
        obit.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
      );
      setObituariosFiltrados(filtrados);
    }
  }, [busqueda, obituarios]);

  const fetchObituarios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/obituarios`);
      
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
        <div className="buscador-obituarios">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
          {busqueda && (
            <button 
              className="btn-limpiar-busqueda"
              onClick={() => setBusqueda('')}
            >
              ✕
            </button>
          )}
        </div>
        {busqueda && (
          <p className="resultados-busqueda">
            {obituariosFiltrados.length} resultado{obituariosFiltrados.length !== 1 ? 's' : ''} encontrado{obituariosFiltrados.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {obituariosFiltrados.length === 0 ? (
        <div className="no-obituarios">
          <p>{busqueda ? '🔍 No se encontraron resultados para tu búsqueda' : '📰 No hay obituarios publicados en este momento'}</p>
        </div>
      ) : (
        <div className="obituarios-publicos-grid">
          {obituariosFiltrados.map(obituario => (
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

                {obituarioSeleccionado.youtube_url && (
                  <div className="modal-video">
                    <h3>🎥 Video Conmemorativo</h3>
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="315"
                        src={obituarioSeleccionado.youtube_url.replace('watch?v=', 'embed/')}
                        title="Video conmemorativo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                <div className="modal-arte">
                  <h3>⛪ Parte Mortuorio</h3>
                  <p>{obituarioSeleccionado.arte_mortuorio}</p>
                </div>

                <div className="modal-footer">
                  <p className="descanse-paz">🕯️ Que descanse en paz 🕯️</p>
                  <p className="contacto-info">
                    Para más información contactar: <br/>
                    📞 {empresa?.telefonos?.join(' | ') || 'Información no disponible'}
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
