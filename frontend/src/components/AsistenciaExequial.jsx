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

  return (
    <div className="asistencia-exequial-container">
      <button onClick={onVolver} className="btn-volver-top">
        ← Volver
      </button>

      {/* Hero Section */}
      <div className="exequial-hero">
        <div className="hero-content">
          <div className="hero-icon">�️</div>
          <h1>{seguro.titulo}</h1>
          <p className="hero-precio">Desde ${seguro.precio}/mes</p>
          <p className="hero-descripcion">{seguro.descripcion}</p>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <span className="placeholder-icon">🛡️</span>
            <p>Protegiendo a las familias ecuatorianas</p>
          </div>
        </div>
      </div>

      {/* Características Section */}
      {seguro.caracteristicas && seguro.caracteristicas.length > 0 && (
        <div className="beneficios-section">
          <h2>✨ Características</h2>
          <div className="beneficios-grid">
            {seguro.caracteristicas.map((caracteristica, index) => (
              <div key={index} className="beneficio-card">
                <div className="beneficio-icon">✓</div>
                <p>{caracteristica}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coberturas Section */}
      {seguro.coberturas && seguro.coberturas.length > 0 && (
        <div className="porque-section">
          <h2>💝 Coberturas Incluidas</h2>
          <div className="cobertura-list">
            {seguro.coberturas.map((cobertura, index) => (
              <div key={index} className="cobertura-item">
                <span className="cobertura-icon">🏥</span>
                <p>{cobertura}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requisitos Section */}
      {seguro.requisitos && seguro.requisitos.length > 0 && (
        <div className="requisitos-section">
          <h2>✅ Requisitos</h2>
          <div className="requisitos-list">
            {seguro.requisitos.map((requisito, index) => (
              <div key={index} className="requisito-item">
                <span className="requisito-icon">📋</span>
                <p>{requisito}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para Proteger a tu Familia?</h2>
          <p>Contáctanos hoy mismo por WhatsApp para más información</p>
          <div className="cta-buttons">
            <button onClick={onVolver} className="btn-cta-primary">
              📲 Contáctanos
            </button>
            <button onClick={onVolver} className="btn-cta-secondary">
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AsistenciaExequial;
