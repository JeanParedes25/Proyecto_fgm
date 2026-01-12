import './Dashboard.css';

function Dashboard({ usuario, onLogout }) {
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
