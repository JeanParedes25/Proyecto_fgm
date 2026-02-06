import { useEffect, useState } from 'react';
import './PlanesUsuario.css';
import { API_BASE_URL, WHATSAPP_NUMBER } from '../constants/config';

function PlanesUsuario() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planExpandido, setPlanExpandido] = useState(null);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/planes`);
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

  const togglePlan = (planId) => {
    setPlanExpandido(planExpandido === planId ? null : planId);
  };

  const contactarWhatsApp = (plan) => {
    const telefono = WHATSAPP_NUMBER;
    const mensaje = `Hola, estoy interesado en el plan funerario ${plan.nombre}, quisiera más información.`;
    const url = `https://wa.me/${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="loading-planes">Cargando planes...</div>;

  return (
    <div className="planes-usuario-container">
      <div className="planes-hero-compact">
        <h2>Nuestros Planes Funerarios</h2>
        <p>Elija el plan que mejor se adapte a sus necesidades</p>
      </div>

      {planes.length === 0 ? (
        <div className="no-planes-usuario">
          <p>No hay planes disponibles en este momento</p>
        </div>
      ) : (
        <div className="planes-grid-compact">
          {planes.map((plan) => {
            const expandido = planExpandido === plan._id;
            
            return (
              <div 
                key={plan._id} 
                className={`plan-card-compact ${plan.destacado ? 'destacado' : ''} ${expandido ? 'expandido' : ''}`}
              >
                {plan.destacado && (
                  <div className="badge-recomendado">★ Recomendado</div>
                )}

                <div className="plan-compact-header" onClick={() => togglePlan(plan._id)}>
                  <div className="plan-header-layout">
                    <div className="plan-imagen-container">
                      <img src={`${process.env.PUBLIC_URL}/logo_fgm.png`} alt="Plan Funerario" className="plan-imagen-default" />
                    </div>
                    <div className="plan-info-container">
                      <h3>{plan.nombre}</h3>
                      <div className="plan-info-previa">
                        <div className="info-previa-item">
                          <strong>Tipo de Cofre:</strong>
                          <span>{plan.tipoCofre}</span>
                        </div>
                        <div className="info-previa-item">
                          <strong>Duración de Velación:</strong>
                          <span>{plan.duracionVelacion}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        className="btn-ver-mas"
                      >
                        {expandido ? ' Ocultar detalles' : ' Ver más detalles'}
                      </button>
                    </div>
                  </div>
                </div>

                {expandido && (
                  <div className="plan-detalles-expandido">
                    <div className="detalles-content">
                      <div className="info-basica">
                        <div className="info-item">
                          <strong>Tipo de Cofre:</strong>
                          <p>{plan.tipoCofre}</p>
                        </div>
                        <div className="info-item">
                          <strong>Duración de Velación:</strong>
                          <p>{plan.duracionVelacion}</p>
                        </div>
                      </div>

                      {plan.cremacion && (
                        <div className="seccion-detalle">
                          <h4>🔥 Cremación</h4>
                          {plan.detallesCremacion && plan.detallesCremacion.length > 0 && (
                            <ul>
                              {plan.detallesCremacion.map((detalle, idx) => (
                                <li key={idx}>✓ {detalle}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {plan.salasIncluidas && plan.salasIncluidas.length > 0 && (
                        <div className="seccion-detalle">
                          <h4>🏛️ Acondicionamiento de la sala</h4>
                          <ul>
                            {plan.salasIncluidas.map((sala, idx) => (
                              <li key={idx}>✓ {sala}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(plan.procedimientos?.formolizacion || plan.procedimientos?.tanatopraxia || plan.procedimientos?.otros) && (
                        <div className="seccion-detalle">
                          <h4>🔬 Procedimientos</h4>
                          <ul>
                            {plan.procedimientos.formolizacion && <li>✓ Formolización</li>}
                            {plan.procedimientos.tanatopraxia && <li>✓ Tanatopraxia</li>}
                            {plan.procedimientos.otros && <li>✓ {plan.procedimientos.otros}</li>}
                          </ul>
                        </div>
                      )}

                      {plan.transporte?.autocarroza && (
                        <div className="seccion-detalle">
                          <h4>🚗 Transporte</h4>
                          <p>✓ Autocarroza incluida</p>
                          {plan.transporte.detalles && <p className="detalles-texto">{plan.transporte.detalles}</p>}
                        </div>
                      )}

                      {plan.arregloFloral?.incluido && (
                        <div className="seccion-detalle">
                          <h4>💐 Arreglo Floral</h4>
                          <p>✓ Incluido</p>
                          {plan.arregloFloral.descripcion && <p className="detalles-texto">{plan.arregloFloral.descripcion}</p>}
                        </div>
                      )}

                      {plan.tramitesLegales?.incluido && (
                        <div className="seccion-detalle">
                          <h4>📄 Trámites Legales</h4>
                          <p>✓ Incluido</p>
                          {plan.tramitesLegales.descripcion && <p className="detalles-texto">{plan.tramitesLegales.descripcion}</p>}
                        </div>
                      )}

                      {plan.mediosComunicacion?.incluido && (
                        <div className="seccion-detalle">
                          <h4>📰 Medios de Comunicación</h4>
                          <p>✓ Incluido</p>
                          {plan.mediosComunicacion.descripcion && <p className="detalles-texto">{plan.mediosComunicacion.descripcion}</p>}
                        </div>
                      )}

                      {plan.obituariosDomiciliarios?.incluido && (
                        <div className="seccion-detalle">
                          <h4>📰 Obituarios Domiciliarios</h4>
                          <p>✓ {plan.obituariosDomiciliarios.cantidad} obituarios incluidos</p>
                        </div>
                      )}

                      {(plan.cafeteria?.bebidas || plan.cafeteria?.vasosTermicos) && (
                        <div className="seccion-detalle">
                          <h4>☕ Cafetería</h4>
                          <ul>
                            {plan.cafeteria.bebidas && <li>✓ Bebidas</li>}
                            {plan.cafeteria.vasosTermicos && <li>✓ Vasos térmicos</li>}
                          </ul>
                          {plan.cafeteria.descripcion && <p className="detalles-texto">{plan.cafeteria.descripcion}</p>}
                        </div>
                      )}

                      {plan.insumosSala?.incluido && (
                        <div className="seccion-detalle">
                          <h4>🛋️ Insumos de Sala</h4>
                          <p>✓ Incluido</p>
                          {plan.insumosSala.descripcion && <p className="detalles-texto">{plan.insumosSala.descripcion}</p>}
                        </div>
                      )}

                      {plan.serviciosReligiosos?.incluido && (
                        <div className="seccion-detalle">
                          <h4>⛪ Servicios Religiosos</h4>
                          <p>✓ Incluido</p>
                          {plan.serviciosReligiosos.descripcion && <p className="detalles-texto">{plan.serviciosReligiosos.descripcion}</p>}
                        </div>
                      )}

                      {(plan.mediosDigitales?.videoHomenaje || plan.mediosDigitales?.facebookLive || plan.mediosDigitales?.otros) && (
                        <div className="seccion-detalle">
                          <h4>📱 Medios Digitales</h4>
                          <ul>
                            {plan.mediosDigitales.videoHomenaje && <li>✓ Video homenaje</li>}
                            {plan.mediosDigitales.facebookLive && <li>✓ Facebook Live</li>}
                            {plan.mediosDigitales.otros && <li>✓ {plan.mediosDigitales.otros}</li>}
                          </ul>
                        </div>
                      )}

                      {plan.infraestructura?.incluido && (
                        <div className="seccion-detalle">
                          <h4>🏢 Infraestructura</h4>
                          <p>✓ Incluido</p>
                          {plan.infraestructura.descripcion && <p className="detalles-texto">{plan.infraestructura.descripcion}</p>}
                        </div>
                      )}

                      {plan.equipoFuneraria?.incluido && (
                        <div className="seccion-detalle">
                          <h4>👥 Equipo de la Funeraria</h4>
                          <p>✓ Personal profesional incluido</p>
                          {plan.equipoFuneraria.descripcion && <p className="detalles-texto">{plan.equipoFuneraria.descripcion}</p>}
                        </div>
                      )}
                    </div>

                    <div className="plan-footer">
                      <p className="contacto-mensaje">¿Le interesa este plan? Contáctenos para más información</p>
                      <button 
                        type="button"
                        className="btn-whatsapp-expandido"
                        onClick={() => contactarWhatsApp(plan)}
                      >
                        📲 Contactar por WhatsApp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PlanesUsuario;
