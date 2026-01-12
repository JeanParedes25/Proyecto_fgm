import './Dashboard.css';

function Dashboard({ usuario, isGuest, onLogout }) {
  if (isGuest) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Panel de Control - Modo Invitado</h1>
          <button className="logout-btn" onClick={onLogout}>
            Salir
          </button>
        </header>
        
        <div className="welcome-section guest-welcome">
          <h2>👋 Bienvenido, Invitado</h2>
          <p className="guest-notice">
            🔒 Estás navegando con acceso limitado. Para acceder a todas las funcionalidades, 
            inicia sesión o regístrate.
          </p>
        </div>

        <div className="content-section">
          <h3>📖 Contenido Público</h3>
          <div className="public-content">
            <div className="info-card">
              <h4>🏢 Sobre Nosotros</h4>
              <p>Funerales Gonzalo Mendoza - Más de 30 años de servicio a la comunidad.</p>
            </div>
            <div className="info-card">
              <h4>📞 Contacto</h4>
              <p>Teléfono: +123 456 789</p>
              <p>Email: contacto@fgm.com</p>
            </div>
            <div className="info-card">
              <h4>📍 Ubicación</h4>
              <p>Dirección: Calle Principal #123</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3>¿Quieres acceder a más funcionalidades?</h3>
          <button className="cta-button" onClick={onLogout}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Control</h1>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </header>
      
      <div className="welcome-section">
        <h2>¡Bienvenido, {usuario.nombre}! 👋</h2>
        <div className="user-info">
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>ID:</strong> {usuario.id}</p>
        </div>
      </div>

      <div className="content-section">
        <h3>Este es tu panel de control</h3>
        <p>Aquí podrás gestionar tus datos y servicios.</p>
      </div>
    </div>
  );
}

export default Dashboard;
