import { useState } from 'react';
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

  const services = [
    {
      id: 'standard',
      name: 'Servicio Exequial Estándar',
      icon: '⚱️',
      color: '#c49a6c',
      intro: 'Sabemos los difícil que son aquellos momentos de pérdida de un ser querido y basados en ese sentimiento de empatía, queremos brindarle el mejor servicio para que únicamente tenga en su mente el dar el último adiós. Es por ello que Funerales Gonzalo Mendoza se encarga de todos los aspectos del servicio exequial para su comodidad y tranquilidad.',
      includes: [
        'Trámites Legales',
        'Salas de velación (A, B o C)',
        'Capillas Ardientes dentro y fuera de la ciudad',
        'Servicio Religioso',
        'Gestión para la adquisición del nicho',
        'Obituario Online',
        'Ofrendas Online',
        'Obituario biográfico en pantalla electrónica',
        'Servicio de carroza a campo santo',
        'Crédito directo a 3 y 6 meses sin intereses',
        'Tramitación exequial en el IESS, ISSPOL, ISSFA',
        'Filial de MEMORIAL INTERNATIONAL (Banco Solidario)',
        'Club de clase de la policía, Armoni, Resurrección'
      ],
      halls: ['Sala A', 'Sala B', 'Sala C'],
      capacity: '100 personas',
      extraServices: [
        '🅿️ Parqueadero privado',
        '🛋️ Sala de espera cómoda',
        '☕ Cafetería',
        '🛌 Área de descanso'
      ]
    },
    {
      id: 'vip',
      name: 'Servicio Exequial VIP Premium',
      icon: '👑',
      color: '#a77c4f',
      description: 'Moderna sala de velación',
      intro: 'Sabemos lo difícil que son aquellos momentos de pérdida de un ser querido y basados en ese sentimiento de empatía, queremos brindarle el mejor servicio para que únicamente tenga en su mente el dar el último adiós. Es por ello que Funerales Gonzalo Mendoza se encarga de todos los aspectos del servicio exequial VIP, en nuestras modernas salas de velación.',
      includes: [
        'Cofre de madera señorial',
        'Trámites legales (Registro Civil, Jefatura civil, entre otros)',
        'Traslado en Auto-Carroza a las salas de velación',
        'Servicio Religioso',
        'Acompañamiento musical ceremonia religiosa',
        'Tanatopraxia',
        'Obituario Online',
        'Ofrendas Online',
        'Libro recordatorio',
        'Formolización',
        'Servicio telefónico (Llamadas locales)',
        'CAMPO SANTO O CREMACIÓN'
      ],
      additional: [
        'Alquiler de bóveda en el cementerio municipal de Riobamba',
        'Cremación con la correspondiente tramitación y traslado'
      ],
      noChargeServices: [
        'Publicación en diario local 1/4 de página',
        'Acompañamiento con música instrumental (noche de velación)',
        'Música ambiental',
        '2 Fotos póster recordatorio a color',
        'Servicios de guardanía privada',
        'Gestión para la adquisición del nicho en el cementerio',
        'Salas virtuales con cámaras IP (Transmición vía internet)'
      ],
      halls: ['Sala VIP'],
      capacity: '500 personas',
      extraServices: [
        '🅿️ Parqueadero privado reservado',
        '🛋️ Salas de espera cómodas',
        '☕ Cafetería premium',
        '🛌 Cuarto de descanso privado',
        '🔬 Laboratorio de tanatopraxia'
      ]
    }
  ];

  if (selectedService) {
    const service = services.find(s => s.id === selectedService);
    return (
      <div className="service-detail">
        <button className="back-button" onClick={() => setSelectedService(null)}>
          ← Volver a Servicios
        </button>

        <div className="detail-header">
          <h1>{service.icon} {service.name}</h1>
          <p className="subtitle">🕊️ {service.description} 🕊️</p>
        </div>

        <div className="detail-container">
          <div className="detail-section intro">
            <h2>💝 Nuestro Compromiso</h2>
            <p>{service.intro}</p>
          </div>

          <div className="detail-section">
            <h2>🏛️ Salas de Velación</h2>
            <div className="halls-grid">
              {service.halls.map((hall, idx) => (
                <div key={idx} className="hall-card">
                  <div className="hall-icon">⛪</div>
                  <h3>{hall}</h3>
                  <p>Capacidad: {service.capacity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>✅ Incluye en este Servicio</h2>
            <div className="includes-grid">
              {service.includes.map((item, idx) => (
                <div key={idx} className="include-item">
                  <span className="check-icon">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {service.additional && service.additional.length > 0 && (
            <div className="detail-section">
              <h2>🔑 Servicios Adicionales</h2>
              <div className="includes-grid">
                {service.additional.map((item, idx) => (
                  <div key={idx} className="include-item additional">
                    <span className="check-icon">⭐</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.noChargeServices && service.noChargeServices.length > 0 && (
            <div className="detail-section">
              <h2>💎 Valores Agregados sin Costo</h2>
              <div className="includes-grid">
                {service.noChargeServices.map((item, idx) => (
                  <div key={idx} className="include-item premium">
                    <span className="check-icon">✨</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h2>🏢 Le Brindamos También</h2>
            <div className="extra-services">
              {service.extraServices.map((item, idx) => (
                <div key={idx} className="extra-item">
                  {item}
                </div>
              ))}
            </div>
          </div>

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
        {services.map((service) => (
          <div 
            key={service.id} 
            className="service-card"
            style={{ borderTopColor: service.color }}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="service-icon" style={{ color: service.color }}>
              {service.icon}
            </div>
            <h3>{service.name}</h3>
            <p className="service-preview">
              Haz clic para ver todos los detalles y servicios incluidos.
            </p>
            <button className="details-btn" style={{ backgroundColor: service.color }}>
              Ver Detalles →
            </button>
          </div>
        ))}
      </div>

      <div className="services-footer">
        <p>🕊️ En Funerales Gonzalo Mendoza tu confianza es nuestro compromiso 🕊️</p>
      </div>
    </div>
  );
}

export default Services;
