import { useEffect, useState } from 'react';
import './PlanesUsuario.css';

function PlanesUsuario() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/planes');
      if (res.ok) {
        const data = await res.json();
        setPlanes(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error obteniendo planes', e);
    } finally {
      setLoading(false);
    }
  };

  const verDetalles = (plan) => {
    setPlanSeleccionado(plan);
  };

  const cerrarModal = () => {
    setPlanSeleccionado(null);
  };

  if (loading) return <div className="loading-planes">Cargando planes...</div>;

  return (
    <div className="planes-usuario-container">
      <div className="planes-hero">
        <h1>Nuestros Planes Funerarios</h1>
        <p>Elija el plan que mejor se adapte a sus necesidades</p>
      </div>

      {planes.length === 0 ? (
        <div className="no-planes-usuario">
          <p>No hay planes disponibles en este momento</p>
        </div>
      ) : (
        <div className="planes-comparacion">
          {planes.map((plan, index) => (
            <div 
              key={plan._id} 
              className={`plan-usuario-card ${plan.destacado ? 'plan-destacado' : ''}`}
            >
              {plan.destacado && (
                <div className="plan-destacado-badge">
                  <span>★ Recomendado</span>
                </div>
              )}

              <div className="plan-usuario-header">
                <h2>{plan.nombre}</h2>
                <div className="plan-usuario-precio">
                  <span className="precio-simbolo">$</span>
                  <span className="precio-cantidad">{parseFloat(plan.precio || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="plan-usuario-info-basica">
                <div className="info-item">
                  <div>
                    <strong>TIPO DE COFRE</strong>
                    <p>{plan.tipoCofre}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <div>
                    <strong>Duración de Velación</strong>
                    <p>{plan.duracionVelacion}</p>
                  </div>
                </div>
              </div>

              {plan.salasIncluidas && plan.salasIncluidas.length > 0 && (
                <div className="plan-usuario-salas">
                  <h4>🏛️ Salas Incluidas:</h4>
                  <ul>
                    {plan.salasIncluidas.map((sala, idx) => (
                      <li key={idx}>{sala}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="plan-usuario-servicios">
                <h4>Servicios Incluidos:</h4>
                <ul className="servicios-lista">
                  {plan.procedimientos?.formolizacion && (
                    <li>
                      <span className="check">✓</span> Formolización
                    </li>
                  )}
                  {plan.procedimientos?.tanatopraxia && (
                    <li>
                      <span className="check">✓</span> Tanatopraxia
                    </li>
                  )}
                  {plan.procedimientos?.otros && (
                    <li>
                      <span className="check">✓</span> {plan.procedimientos.otros}
                    </li>
                  )}
                  {plan.transporte?.autocarroza && (
                    <li>
                      <span className="check">✓</span> Autocarroza
                    </li>
                  )}
                  {plan.arregloFloral?.incluido && (
                    <li>
                      <span className="check">✓</span> Arreglo floral
                    </li>
                  )}
                  {plan.tramitesLegales?.incluido && (
                    <li>
                      <span className="check">✓</span> Trámites legales
                    </li>
                  )}
                  {plan.mediosComunicacion?.incluido && (
                    <li>
                      <span className="check">✓</span> Medios de comunicación
                    </li>
                  )}
                  {plan.obituariosDomiciliarios?.incluido && (
                    <li>
                      <span className="check">✓</span> Obituarios domiciliarios ({plan.obituariosDomiciliarios.cantidad})
                    </li>
                  )}
                  {(plan.cafeteria?.bebidas || plan.cafeteria?.vasosTermicos) && (
                    <li>
                      <span className="check">✓</span> Cafetería
                    </li>
                  )}
                  {plan.insumosSala?.incluido && (
                    <li>
                      <span className="check">✓</span> Insumos de sala
                    </li>
                  )}
                  {plan.serviciosReligiosos?.incluido && (
                    <li>
                      <span className="check">✓</span> Servicios religiosos
                    </li>
                  )}
                  {plan.mediosDigitales?.videoHomenaje && (
                    <li>
                      <span className="check">✓</span> Video homenaje
                    </li>
                  )}
                  {plan.mediosDigitales?.facebookLive && (
                    <li>
                      <span className="check">✓</span> Facebook Live
                    </li>
                  )}
                  {plan.infraestructura?.incluido && (
                    <li>
                      <span className="check">✓</span> Infraestructura completa
                    </li>
                  )}
                  {plan.equipoFuneraria?.incluido && (
                    <li>
                      <span className="check">✓</span> Equipo profesional de la funeraria
                    </li>
                  )}
                </ul>
              </div>

              <div className="contacto-cta-card">
                <p>Si le gustó este paquete, comuníquese con nuestro asesor.</p>
                <button type="button" className="btn-whatsapp-placeholder">
                  Contactar por WhatsApp
                </button>
              </div>

              <button 
                className="btn-ver-detalles"
                onClick={() => verDetalles(plan)}
              >
                Ver Detalles Completos
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {planSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>×</button>
            
            <div className="modal-header">
              <h2>{planSeleccionado.nombre}</h2>
              <div className="modal-precio">
                ${parseFloat(planSeleccionado.precio || 0).toFixed(2)}
              </div>
            </div>

            <div className="modal-body">
              <section className="modal-section">
                <h3>📋 Información General</h3>
                <p><strong>TIPO DE COFRE:</strong> {planSeleccionado.tipoCofre}</p>
                <p><strong>Duración de Velación:</strong> {planSeleccionado.duracionVelacion}</p>
              </section>

              {planSeleccionado.salasIncluidas && planSeleccionado.salasIncluidas.length > 0 && (
                <section className="modal-section">
                  <h3>🏛️ Salas Incluidas</h3>
                  <ul>
                    {planSeleccionado.salasIncluidas.map((sala, idx) => (
                      <li key={idx}>{sala}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="modal-section">
                <h3>🔬 Procedimientos</h3>
                <ul>
                  {planSeleccionado.procedimientos?.formolizacion && <li>✓ Formolización</li>}
                  {planSeleccionado.procedimientos?.tanatopraxia && <li>✓ Tanatopraxia</li>}
                  {planSeleccionado.procedimientos?.otros && <li>✓ {planSeleccionado.procedimientos.otros}</li>}
                </ul>
              </section>

              {planSeleccionado.transporte?.autocarroza && (
                <section className="modal-section">
                  <h3>🚗 Transporte</h3>
                  <p>✓ Autocarroza incluida</p>
                  {planSeleccionado.transporte.detalles && (
                    <p className="detalles">{planSeleccionado.transporte.detalles}</p>
                  )}
                </section>
              )}

              {planSeleccionado.arregloFloral?.incluido && (
                <section className="modal-section">
                  <h3>💐 Arreglo Floral</h3>
                  <p>✓ Incluido</p>
                  {planSeleccionado.arregloFloral.descripcion && (
                    <p className="detalles">{planSeleccionado.arregloFloral.descripcion}</p>
                  )}
                </section>
              )}

              {planSeleccionado.tramitesLegales?.incluido && (
                <section className="modal-section">
                  <h3>📄 Trámites Legales</h3>
                  <p>✓ Incluido</p>
                  {planSeleccionado.tramitesLegales.descripcion && (
                    <p className="detalles">{planSeleccionado.tramitesLegales.descripcion}</p>
                  )}
                </section>
              )}

              {planSeleccionado.mediosComunicacion?.incluido && (
                <section className="modal-section">
                  <h3>📰 Medios de Comunicación</h3>
                  <p>✓ Incluido</p>
                  {planSeleccionado.mediosComunicacion.descripcion && (
                    <p className="detalles">{planSeleccionado.mediosComunicacion.descripcion}</p>
                  )}
                </section>
              )}

              {planSeleccionado.obituariosDomiciliarios?.incluido && (
                <section className="modal-section">
                  <h3>📰 Obituarios Domiciliarios</h3>
                  <p>✓ {planSeleccionado.obituariosDomiciliarios.cantidad} obituarios incluidos</p>
                </section>
              )}

              {(planSeleccionado.cafeteria?.bebidas || planSeleccionado.cafeteria?.vasosTermicos) && (
                <section className="modal-section">
                  <h3>☕ Cafetería</h3>
                  <ul>
                    {planSeleccionado.cafeteria.bebidas && <li>✓ Bebidas</li>}
                    {planSeleccionado.cafeteria.vasosTermicos && <li>✓ Vasos térmicos</li>}
                  </ul>
                  {planSeleccionado.cafeteria.descripcion && (
                    <p className="detalles">{planSeleccionado.cafeteria.descripcion}</p>
                  )}
                </section>
              )}

              {planSeleccionado.insumosSala?.incluido && (
                <section className="modal-section">
                  <h3>🛋️ Insumos de Sala</h3>
                  <p>✓ Incluido</p>
                  {planSeleccionado.insumosSala.descripcion && (
                    <p className="detalles">{planSeleccionado.insumosSala.descripcion}</p>
                  )}
                </section>
              )}

              {planSeleccionado.serviciosReligiosos?.incluido && (
                <section className="modal-section">
                  <h3>⛪ Servicios Religiosos</h3>
                  <p>✓ Incluido</p>
                  {planSeleccionado.serviciosReligiosos.descripcion && (
                    <p className="detalles">{planSeleccionado.serviciosReligiosos.descripcion}</p>
                  )}
                </section>
              )}

              {(planSeleccionado.mediosDigitales?.videoHomenaje || planSeleccionado.mediosDigitales?.facebookLive) && (
                <section className="modal-section">
                  <h3>📱 Medios Digitales</h3>
                  <ul>
                    {planSeleccionado.mediosDigitales.videoHomenaje && <li>✓ Video homenaje</li>}
                    {planSeleccionado.mediosDigitales.facebookLive && <li>✓ Facebook Live</li>}
                    {planSeleccionado.mediosDigitales.otros && <li>✓ {planSeleccionado.mediosDigitales.otros}</li>}
                  </ul>
                </section>
              )}

              {planSeleccionado.infraestructura?.incluido && (
                <section className="modal-section">
                  <h3>🏢 Infraestructura</h3>
                  <p>✓ Incluido</p>
                  {planSeleccionado.infraestructura.descripcion && (
                    <p className="detalles">{planSeleccionado.infraestructura.descripcion}</p>
                  )}
                </section>
              )}

              {planSeleccionado.equipoFuneraria?.incluido && (
                <section className="modal-section">
                  <h3>👥 Equipo de la Funeraria</h3>
                  <p>✓ Personal profesional incluido</p>
                  {planSeleccionado.equipoFuneraria.descripcion && (
                    <p className="detalles">{planSeleccionado.equipoFuneraria.descripcion}</p>
                  )}
                </section>
              )}

              <div className="modal-footer">
                <p className="contacto-info">
                  Si le gustó este paquete, comuníquese con nuestro asesor.
                </p>
                <button type="button" className="btn-whatsapp-placeholder">
                  Contactar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanesUsuario;
