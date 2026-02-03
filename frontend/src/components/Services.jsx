import { useState, useEffect } from 'react';
import './Services.css';
import { API_BASE_URL, buildWhatsAppUrl } from '../constants/config';
import { useEmpresa } from '../hooks/useEmpresa';

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
  const { empresa } = useEmpresa();

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/servicios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data.servicios || []);
      } else if (response.status === 401) {
        console.warn('No autorizado para ver servicios');
        setServices([]);
      }
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedService) {
    const service = services.find(s => s._id === selectedService);
    return (
      <div className="service-detail">
        <button className="back-button" onClick={() => setSelectedService(null)}>
          ← Volver a Servicios
        </button>

        <div className="detail-header">
          <h1>{service?.nombre}</h1>
          <p className="subtitle">{service?.descripcion || 'Sin descripción'}</p>
        </div>

        <div className="detail-container">
          <div className="detail-section">
            <h2>Información del Servicio</h2>
            <div className="servicio-info">
              <div><strong>Estado:</strong> {service?.activo ? 'Activo' : 'Inactivo'}</div>
              <div><strong>Precio:</strong> {service?.precio ? `$${service.precio}` : 'No especificado'}</div>
            </div>
          </div>

          {service?.fotos && service.fotos.length > 0 && (
            <div className="detail-section">
              <h2>📸 Galería</h2>
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
            {empresa && empresa.telefonos && (
              <p>📞 Teléfonos: {empresa.telefonos.join(' | ')}</p>
            )}
            {empresa && (
              <>
                <p>📧 Email: {empresa.correo}</p>
              </>
            )}
            <button 
              className="contact-btn"
              onClick={() => {
                const url = buildWhatsAppUrl(empresa?.telefonos?.[0]);
                if (url) window.open(url, '_blank');
              }}
            >
              📱 Contáctanos Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  // Vista simplificada: lista de servicios del administrador (solo lectura)

  return (
    <div className="services-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Panel
      </button>

      <div className="services-header">
        <h1>🕊️ Servicios</h1>
        <p className="welcome-message">¡Bienvenido, {usuario.nombre}! 💝</p>
        <p className="description">Servicios creados por el administrador.</p>
      </div>

      <div className="services-grid">
        {services.length === 0 ? (
          <div className="no-services-message">
            <div className="construction-icon">🚧</div>
            <h2>Sin servicios disponibles</h2>
            <p>El administrador aún no ha creado servicios.</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service._id} className="service-card" onClick={() => setSelectedService(service._id)}>
              <div className="service-icon">
                <img
                  src={(service.fotos && service.fotos[0]?.url) || '/placeholder.jpg'}
                  alt={service.nombre}
                  style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 6 }}
                />
              </div>
              <h3>{service.nombre}</h3>
              <p className="service-preview">{service.descripcion || 'Sin descripción'}</p>
              <div className="servicio-info" style={{ marginTop: 8 }}>
                <div><strong>Estado:</strong> {service.activo ? 'Activo' : 'Inactivo'}</div>
                <div><strong>Precio:</strong> {service.precio ? `$${service.precio}` : 'No especificado'}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="services-footer">
        <p>🕊️ En {empresa?.nombreEmpresa || 'nuestra empresa'} tu confianza es nuestro compromiso 🕊️</p>
      </div>
    </div>
  );
}

export default Services;
