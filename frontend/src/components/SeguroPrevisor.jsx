import { useState } from 'react';
import AsistenciaExequial from './AsistenciaExequial';
import AsistenciaPrepago from './AsistenciaPrepago';
import './SeguroPrevisor.css';

function SeguroPrevisor() {
  const [vistaActual, setVistaActual] = useState('menu'); // menu, exequial, prepago

  return (
    <div className="seguro-previsor-container">
      {vistaActual === 'menu' && (
        <div className="seguro-menu">
          <div className="seguro-hero">
            <h1>🛡️ Seguro Previsor Prepago</h1>
            <p>Protege a tu familia con nuestros servicios de asistencia</p>
          </div>

          <div className="seguro-opciones">
            <div className="opcion-card" onClick={() => setVistaActual('exequial')}>
              <div className="opcion-icon">🕊️</div>
              <h2>Asistencia Exequial</h2>
              <p>Servicio familiar exequial desde $1 mensual</p>
              <button className="btn-opcion">Ver Información</button>
            </div>

            <div className="opcion-card" onClick={() => setVistaActual('prepago')}>
              <div className="opcion-icon">💳</div>
              <h2>Asistencia Prepago</h2>
              <p>Planifica con anticipación tu servicio</p>
              <button className="btn-opcion">Ver Información</button>
            </div>
          </div>
        </div>
      )}

      {vistaActual === 'exequial' && (
        <AsistenciaExequial onVolver={() => setVistaActual('menu')} />
      )}

      {vistaActual === 'prepago' && (
        <AsistenciaPrepago onVolver={() => setVistaActual('menu')} />
      )}
    </div>
  );
}

export default SeguroPrevisor;
