import { useState } from 'react';
import './Services.css';

function Services({ usuario, onBack }) {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'standard',
      name: 'Servicio Exequial Estándar',
      icon: '⚱️',
      color: '#c49a6c',
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
      includes: [
        'Financiamiento a 5 años',
        'Congelación del Precio',
        'Transferible',
        'Sin límite de edad',
        'Trámites legales',
        'Traslado en carroza',
        'Capilla ardiente',
        'Tanatopraxia',
        'Cofre',
        'Sala de velación premium',
        'Servicio religioso personalizado',
        'Libro recordatorio de lujo',
        'Servicios de Bar',
        'Servicio telefónico (Llamadas locales)',
        'Servicio personalizado 24/7',
        'Foto póster a color'
      ],
      halls: ['Sala A Premium', 'Sala B Premium', 'Sala C Premium'],
      capacity: '100 personas',
      extraServices: [
        '🅿️ Parqueadero privado reservado',
        '🛋️ Sala de espera VIP',
        '☕ Cafetería premium con servicio de bar',
        '🛌 Área de descanso privada',
        '📱 Servicio telefónico incluido',
        '🎵 Música ambiental personalizada'
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
          <p className="subtitle">🕊️ Despídete con dignidad y respeto 🕊️</p>
        </div>

        <div className="detail-container">
          <div className="detail-section intro">
            <h2>💝 Nuestro Compromiso</h2>
            <p>Sabemos lo difícil que son aquellos momentos de pérdida de un ser querido y basados en ese sentimiento de empatía, queremos brindarle el mejor servicio para que únicamente tenga en su mente el dar el último adiós. Es por ello que Funerales Gonzalo Mendoza se encarga de todos los aspectos del servicio exequial para su comodidad y tranquilidad.</p>
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

          <div className="detail-section">
            <h2>🏢 Servicios Adicionales en Nuestras Instalaciones</h2>
            <div className="extra-services">
              {service.extraServices.map((item, idx) => (
                <div key={idx} className="extra-item">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section cta">
            <h3>¿Deseas más información?</h3>
            <p>📞 Celular: 099 28 29 095 | 099 90 90 860</p>
            <p>📱 Oficina: 032 944 608</p>
            <p>📧 Email: israelmendoza18@hotmail.com</p>
            <button className="contact-btn">Contáctanos Ahora</button>
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
