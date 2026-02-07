import { useEffect, useState } from 'react';
import './AsistenciaExequial.css';
import { WHATSAPP_NUMBER, API_BASE_URL } from '../constants/config';

function AsistenciaExequial({ onVolver }) {
  const [seguro, setSeguro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeguro();
  }, []);

  const fetchSeguro = async () => {
    try {
      console.log('Intentando cargar seguro exequial...');
      const res = await fetch(`${API_BASE_URL}/api/seguros/exequial`);
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

  const contactarWhatsApp = () => {
    const mensaje = `Hola, me interesa información sobre el ${seguro.titulo}.%0A%0A` +
      `Información del seguro:%0A` +
      `• ${seguro.subtitulo}%0A` +
      `• ${seguro.descripcion}%0A%0A` +
      `Quisiera conocer más detalles sobre los beneficios y cobertura.`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank');
  };

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
            <h4>📞 Teléfonos</h4>
            <div className="telefonos-categoria">
              <p className="telefono-tipo">Celular:</p>
              <div className="telefonos-lista">
                <a href="tel:+593992829095" className="telefono-link">099 28 29 095</a>
                <span className="separador-telefono">|</span>
                <a href="tel:+593999090860" className="telefono-link">099 90 90 860</a>
              </div>
            </div>
            <div className="telefonos-categoria">
              <p className="telefono-tipo">Oficina:</p>
              <div className="telefonos-lista">
                <a href="tel:+59332944608" className="telefono-link">032 944 608</a>
              </div>
            </div>
          </div>

          <div className="contacto-item">
            <h4>📧 Email</h4>
            <a href="mailto:israelmendoza18@hotmail.com" className="email-link">israelmendoza18@hotmail.com</a>
          </div>

          <div className="contacto-item contacto-imagen-item">
            <img 
              src={`${process.env.PUBLIC_URL}/previsor.png`}
              alt="Seguro Previsor" 
              className="contacto-imagen-institucional"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para Proteger a tu Familia?</h2>
          <p>Contáctanos hoy mismo y conoce más sobre nuestros planes</p>
          <div className="cta-buttons">
            <button onClick={contactarWhatsApp} className="btn-cta-primary">
              📲 Contáctanos por WhatsApp
            </button>
            <a href={`tel:${seguro.contacto.telefonos[0].replace(/\s/g, '')}`} className="btn-cta-secondary">
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
