import { useState, useEffect } from 'react';
import './Services.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se enviaría a un backend
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    }, 3000);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="09X XXXX XXX"
          />
        </div>
        <div className="form-group">
          <label htmlFor="asunto">Asunto *</label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>
      </div>

      <div className="form-group full">
        <label htmlFor="mensaje">Mensaje *</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          required
          rows="6"
          placeholder="Cuéntanos más sobre lo que necesitas..."
        ></textarea>
      </div>

      <button type="submit" className="submit-btn">
        📧 Enviar Mensaje
      </button>

      {submitted && (
        <div className="success-message">
          ✅ ¡Gracias por su mensaje! Nos pondremos en contacto pronto.
        </div>
      )}
    </form>
  );
}

function Services({ usuario, onBack }) {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/servicios');
      if (response.ok) {
        const data = await response.json();
        setServices(data.servicios || []);
      }
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="services-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Panel
        </button>
        <div style={{ textAlign: 'center', padding: '40px', color: '#c49a6c' }}>
          Cargando servicios...
        </div>
      </div>
    );
  }

  if (selectedService) {
    const service = services.find(s => s._id === selectedService);
    
    // Vista especial para Servicio de Transporte
    if (service && service.isTransport) {
      return (
        <div className="service-detail">
          <button className="back-button" onClick={() => setSelectedService(null)}>
            ← Volver a Servicios
          </button>

          <div className="detail-header">
            <h1>{service.icono} {service.nombre}</h1>
            <p className="subtitle">🕊️ {service.descripcion} 🕊️</p>
          </div>

          <div className="detail-container">
            <div className="detail-section intro">
              <h2>🚗 Nuestro Servicio</h2>
              <p>{service.introduccion}</p>
            </div>

            <div className="detail-section">
              <h2>🚙 Carrozas Fúnebres</h2>
              <div className="transport-info">
                <p>Contamos con modernas unidades de transporte para brindarle el mejor servicio en los momentos más importantes.</p>
                <div className="transport-features">
                  <div className="feature-item">
                    <span className="feature-icon">✨</span>
                    <span>Auto-carrozas modernas y elegantes</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏥</span>
                    <span>Traslado desde centros hospitalarios del IESS</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⛪</span>
                    <span>Acompañamiento al cementerio</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🏢</span>
                    <span>Traslado a nuestra funeraria</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section cta">
              <h3>¿Deseas más información?</h3>
              <p>📞 Celular: 099 28 29 095 | 099 90 90 860</p>
              <p>📱 Oficina: 032 944 608</p>
              <p>📧 Email: israelmendoza18@hotmail.com</p>
              <button className="contact-btn">Contáctanos Ahora</button>
            </div>

            <div className="detail-section contact-form-section">
              <h2>📞 Comuníquese con Nosotros</h2>
              <p className="contact-intro">
                Puede comunicarse con nosotros para solicitar información, o presupuestar el servicio exequial que requiera. Será para nosotros un gusto atenderlo, por favor llene el siguiente formulario.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      );
    }

    // Vista normal para servicios exequiales
    return (
      <div className="service-detail">
        <button className="back-button" onClick={() => setSelectedService(null)}>
          ← Volver a Servicios
        </button>

        <div className="detail-header">
          <h1>{service.icono} {service.nombre}</h1>
          <p className="subtitle">🕊️ {service.descripcion} 🕊️</p>
        </div>

        <div className="detail-container">
          <div className="detail-section intro">
            <h2>💝 Nuestro Compromiso</h2>
            <p>{service.introduccion}</p>
          </div>

          {service.nombrePlan && (
            <div className="detail-section plan-info">
              <h2>💎 Plan: {service.nombrePlan}</h2>
              {service.descripcionPlan && (
                <div className="plan-description">
                  {service.descripcionPlan.split('\n').map((line, idx) => (
                    <p key={idx}>- {line.trim()}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {service.cantidadSalas && (
            <div className="detail-section">
              <h2>🏛️ Salas de Velación</h2>
              <p style={{ fontSize: '18px', color: '#c49a6c', fontWeight: 'bold' }}>
                Contamos con {service.cantidadSalas} sala{service.cantidadSalas > 1 ? 's' : ''} de velación
              </p>
              <div className="halls-grid">
                {service.halls && service.halls.map((hall, idx) => (
                  <div key={idx} className="hall-card">
                    <div className="hall-icon">⛪</div>
                    <h3>{hall}</h3>
                    <p>Capacidad: {service.capacity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.includes && service.includes.length > 0 && (
            <div className="detail-section">
              <h2>✅ El servicio Incluye</h2>
              <div className="bullet-list">
                {service.includes.map((item, idx) => (
                  <p key={idx}>- {item}</p>
                ))}
              </div>
            </div>
          )}

          {service.additional && service.additional.length > 0 && (
            <div className="detail-section">
              <h2>🔑 Servicios Adicionales</h2>
              <div className="bullet-list">
                {service.additional.map((item, idx) => (
                  <p key={idx}>- {item}</p>
                ))}
              </div>
            </div>
          )}

          {service.noChargeServices && service.noChargeServices.length > 0 && (
            <div className="detail-section">
              <h2>💎 Valores Agregados sin Costo</h2>
              <div className="bullet-list">
                {service.noChargeServices.map((item, idx) => (
                  <p key={idx}>- {item}</p>
                ))}
              </div>
            </div>
          )}

          {service.brindamos && service.brindamos.length > 0 && (
            <div className="detail-section">
              <h2>⭐ Le Brindamos También</h2>
              <div className="bullet-list">
                {service.brindamos.map((item, idx) => (
                  <p key={idx}>- {item}</p>
                ))}
              </div>
            </div>
          )}

          {service.extraServices && service.extraServices.length > 0 && (
            <div className="detail-section">
              <h2>🎁 Servicios Adicionales</h2>
              <div className="extra-services">
                {service.extraServices.map((item, idx) => (
                  <div key={idx} className="extra-item">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.fotos && service.fotos.length > 0 && (
            <div className="detail-section">
              <h2>📸 Galería de Nuestras Instalaciones</h2>
              <div className="photos-gallery">
                {service.fotos.map((foto, idx) => (
                  <div key={idx} className="photo-item">
                    <img src={foto.url} alt={`Foto ${idx + 1}`} />
                    <p className="photo-caption">{foto.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section cta">
            <h3>¿Desea más información?</h3>
            <p>📞 Celular: 099 28 29 095 | 099 90 90 860</p>
            <p>📱 Oficina: 032 944 608</p>
            <p>📧 Email: israelmendoza18@hotmail.com</p>
            <button className="contact-btn">Contáctanos Ahora</button>
          </div>

          <div className="detail-section contact-form-section">
            <h2>📞 Comuníquese con Nosotros</h2>
            <p className="contact-intro">
              Puede comunicarse con nosotros para solicitar información, o presupuestar el servicio exequial que requiera. Será para nosotros un gusto atenderlo, por favor llene el siguiente formulario.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="services-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Panel
      </button>

      <div className="services-header">
        <h1>🕊️ Nuestros Servicios Exequiales 🕊️</h1>
        <p className="welcome-message">
          ¡Bienvenido, {usuario.nombre}! 💝
        </p>
        <p className="description">
          Te presentamos nuestras opciones de servicios funerarios diseñados para brindar dignidad y respeto en los momentos más importantes.
        </p>
      </div>

      <div className="services-grid">
        {services.length === 0 ? (
          <div className="no-services-message">
            <div className="construction-icon">🚧</div>
            <h2>Sección en Desarrollo</h2>
            <p>Los servicios exequiales estarán disponibles próximamente.</p>
            <p className="subtitle">El administrador está preparando la información de nuestros servicios.</p>
            <p className="contact-info">
              Por favor, contáctanos si tienes alguna consulta:<br/>
              📞 Celular: 099 28 29 095 | 099 90 90 860<br/>
              📱 Oficina: 032 944 608
            </p>
          </div>
        ) : (
          services.map((service) => (
            <div 
              key={service._id} 
              className="service-card"
              style={{ borderTopColor: service.color }}
              onClick={() => setSelectedService(service._id)}
            >
              <div className="service-icon" style={{ color: service.color }}>
                {service.icono}
              </div>
              <h3>{service.nombre}</h3>
              <p className="service-preview">
                Haz clic para ver todos los detalles y servicios incluidos.
              </p>
              <button className="details-btn" style={{ backgroundColor: service.color }}>
                Ver Detalles →
              </button>
            </div>
          ))
        )}
      </div>

      <div className="services-footer">
        <p>🕊️ En Funerales Gonzalo Mendoza tu confianza es nuestro compromiso 🕊️</p>
      </div>
    </div>
  );
}

export default Services;
