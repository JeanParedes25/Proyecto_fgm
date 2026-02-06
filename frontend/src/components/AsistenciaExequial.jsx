import { useEffect, useState } from 'react';
import './AsistenciaExequial.css';

function AsistenciaExequial({ onVolver }) {
  const [seguro, setSeguro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeguro();
  }, []);

  const fetchSeguro = async () => {
    try {
      console.log('Intentando cargar seguro exequial...');
      const res = await fetch('http://localhost:5000/api/seguros/exequial');
      console.log('Respuesta recibida:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Datos recibidos:', data);
        setSeguro(data);
      } else {
        console.error('Error en la respuesta:', res.status, res.statusText);
        const errorText = await res.text();
        console.error('Mensaje de error:', errorText);
      }
    } catch (error) {
      console.error('Error al cargar información:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="asistencia-loading">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!seguro) {
    return (
      <div className="asistencia-error">
        <p>No se pudo cargar la información</p>
        <button onClick={onVolver} className="btn-volver">← Volver</button>
      </div>
    );
  }

  return (
    <div className="asistencia-exequial-container">
      <button onClick={onVolver} className="btn-volver-top">
        ← Volver
      </button>

      {/* Hero Section */}
      <div className="exequial-hero">
        <div className="hero-content">
          <div className="hero-icon">🛡️</div>
          <h1>{seguro.titulo}</h1>
          <h2>{seguro.subtitulo}</h2>
          <p className="hero-descripcion">{seguro.descripcion}</p>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <span className="placeholder-icon">🕊️</span>
            <p>Protegiendo a las familias ecuatorianas</p>
          </div>
        </div>
      </div>

      {/* Beneficios Section */}
      <div className="beneficios-section">
        <h2>✨ Beneficios de Nuestro Seguro</h2>
        <div className="beneficios-grid">
          {seguro.beneficios.map((beneficio, index) => (
            <div key={index} className="beneficio-card">
              <div className="beneficio-icon">✓</div>
              <p>{beneficio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Por qué elegirnos */}
      <div className="porque-section">
        <h2>💝 ¿Por Qué Elegirnos?</h2>
        <div className="porque-grid">
          <div className="porque-card">
            <h3>Protección Familiar</h3>
            <p>Cuida de los que más amas en los momentos más difíciles</p>
          </div>
          <div className="porque-card">
            <h3>Accesible</h3>
            <p>Desde $1 mensual, adaptable a tu economía</p>
          </div>
          <div className="porque-card">
            <h3>Cobertura Inmediata</h3>
            <p>Sin trámites complicados ni esperas</p>
          </div>
          <div className="porque-card">
            <h3>Empresa de Confianza</h3>
            <p>Años de experiencia sirviendo a la comunidad</p>
          </div>
        </div>
      </div>

      {/* Contacto Section */}
      <div className="contacto-section">
        <h2>📞 Contáctanos</h2>
        <p className="contacto-intro">Estamos aquí para responder todas tus preguntas</p>
        
        <div className="contacto-grid">
          <div className="contacto-item">
            <h4>Correo Electrónico</h4>
            <a href={`mailto:${seguro.contacto.correo}`}>{seguro.contacto.correo}</a>
          </div>

          <div className="contacto-item">
            <h4>Sitio Web</h4>
            <a href={`https://${seguro.contacto.web}`} target="_blank" rel="noopener noreferrer">
              {seguro.contacto.web}
            </a>
          </div>

          <div className="contacto-item">
            <h4>Dirección</h4>
            <p>{seguro.contacto.direccion}</p>
          </div>

          <div className="contacto-item">
            <h4>Teléfonos</h4>
            <div className="telefonos-lista">
              {seguro.contacto.telefonos.map((tel, idx) => (
                <a key={idx} href={`tel:${tel.replace(/\s/g, '')}`} className="telefono-link">
                  {tel}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para Proteger a tu Familia?</h2>
          <p>Contáctanos hoy mismo y conoce más sobre nuestros planes</p>
          <div className="cta-buttons">
            <a href={`tel:${seguro.contacto.telefonos[0].replace(/\s/g, '')}`} className="btn-cta-primary">
              📞 Llamar Ahora
            </a>
            <a href={`mailto:${seguro.contacto.correo}`} className="btn-cta-secondary">
              ✉️ Enviar Correo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsistenciaExequial;
