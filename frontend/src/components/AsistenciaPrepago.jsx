import { useEffect, useState } from 'react';
import './AsistenciaPrepago.css';

function AsistenciaPrepago({ onVolver }) {
  const [seguro, setSeguro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeguro();
  }, []);

  const fetchSeguro = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/seguros/prepago');
      if (res.ok) {
        const data = await res.json();
        setSeguro(data);
      }
    } catch (error) {
      console.error('Error al cargar información:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="prepago-loading">
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="asistencia-prepago-container">
      <button onClick={onVolver} className="btn-volver-prepago">
        ← Volver
      </button>

      <div className="prepago-content">
        <div className="prepago-icon-large">💳</div>
        <h1>{seguro?.titulo || 'Asistencia Prepago'}</h1>
        <h2>{seguro?.subtitulo || 'Información próximamente disponible'}</h2>
        
        <div className="prepago-message">
          <p>{seguro?.descripcion || 'Estamos trabajando para brindarte la mejor información sobre nuestros servicios de asistencia prepago.'}</p>
        </div>

        {seguro?.contacto && (
          <div className="prepago-contacto">
            <h3>Mientras tanto, contáctanos:</h3>
            <div className="prepago-contacto-items">
              <a href={`tel:${seguro.contacto.telefonos[0]?.replace(/\s/g, '')}`} className="prepago-btn">
                📞 {seguro.contacto.telefonos[0]}
              </a>
              <a href={`mailto:${seguro.contacto.correo}`} className="prepago-btn">
                ✉️ {seguro.contacto.correo}
              </a>
            </div>
          </div>
        )}

        <div className="prepago-coming-soon">
          <span className="coming-icon">🚀</span>
          <p>Próximamente disponible</p>
        </div>
      </div>
    </div>
  );
}

export default AsistenciaPrepago;
