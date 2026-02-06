import './Footer.css';
import { EMPRESA_INFO } from '../constants/config';

function Footer() {
  // Obtener año actual
  const anioActual = new Date().getFullYear();

  return (
    <footer className="footer-global">
      <div className="footer-content">
        <div className="footer-empresa">
          <h3>{EMPRESA_INFO.nombre}</h3>
          <p className="tagline">Con respeto y dedicación en los momentos más difíciles</p>
        </div>

        <div className="footer-info">
          <div className="footer-info-item">
            <span className="icon">📍</span>
            <p>
              <strong>Dirección:</strong><br />
              {EMPRESA_INFO.direccion}
            </p>
          </div>

          <div className="footer-info-item">
            <span className="icon">📞</span>
            <p>
              <strong>Teléfonos:</strong><br />
              <a href="tel:+593992829095" className="footer-link">
                {EMPRESA_INFO.telefonos.celular1}
              </a><br />
              <a href="tel:+593999090860" className="footer-link">
                {EMPRESA_INFO.telefonos.celular2}
              </a><br />
              <a href="tel:+59332944608" className="footer-link">
                {EMPRESA_INFO.telefonos.oficina}
              </a>
            </p>
          </div>

          <div className="footer-info-item">
            <span className="icon">✉️</span>
            <p>
              <strong>Email:</strong><br />
              <a href={`mailto:${EMPRESA_INFO.email}`}>
                {EMPRESA_INFO.email}
              </a>
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-copyright">
          <p>© {anioActual} – {EMPRESA_INFO.nombre}</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
