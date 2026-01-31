import './Dashboard.css';
import './NotificacionesBadge.css';
import AdminAudit from './AdminAudit';
import AdminObituarios from './AdminObituarios';
import AdminServicios from './AdminServicios';
import AdminFloristerias from './AdminFloristerias';
import AdminNotificaciones from './AdminNotificaciones';
import AdminCuentasBancarias from './AdminCuentasBancarias';
import AdminPlanes from './AdminPlanes';
import AdminPedidos from './AdminPedidos';
import ObituariosPublicos from './ObituariosPublicos';
import Services from './Services';
import Floristerias from './Floristerias';
import PlanesUsuario from './PlanesUsuario';
import SeguroPrevisor from './SeguroPrevisor';
import MisPedidos from './MisPedidos';
import { useState, useEffect } from 'react';
import { WHATSAPP_URL } from '../constants/config';

function Dashboard({ usuario, isGuest, onLogout, onGoToPerfil }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    usuarios_totales: 0,
    obituarios_totales: 0,
    pedidos_florales: 0,
    servicios_totales: 0,
    registrados_hoy: 0
  });
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [successUsuarios, setSuccessUsuarios] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',
    comidaFavorita: '',
    primeraMascota: '',
    ciudadNacimiento: ''
  });
  const isAdmin = usuario?.rol === 'admin' || usuario?.email === 'israelmendoza18@hotmail.com';

  // Cargar contador de notificaciones no leídas
  useEffect(() => {
    if (!isAdmin) return;

    const fetchNotificacionesCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notificaciones/no-leidas', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotificacionesNoLeidas(data.count || 0);
        }
      } catch (err) {
        console.error('Error al obtener contador de notificaciones:', err);
      }
    };

    fetchNotificacionesCount();
    const interval = setInterval(fetchNotificacionesCount, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, [isAdmin]);


  // Cargar estadísticas en tiempo real
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Obtener estadísticas generales
        const responseStats = await fetch('http://localhost:5000/api/estadisticas', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        let estadisticas = {
          usuarios_totales: 0,
          obituarios_totales: 0,
          pedidos_florales: 0,
          servicios_totales: 0,
          registrados_hoy: 0
        };
        
        if (responseStats.ok) {
          const dataStats = await responseStats.json();
          estadisticas = { ...estadisticas, ...dataStats };
        }
        
        setStats(estadisticas);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    if (isAdmin) {
      fetchStats();
      // Recargar estadísticas cada 30 segundos
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    setErrorUsuarios('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUsuariosAdmin(data.usuarios || []);
      } else {
        setErrorUsuarios(data.mensaje || 'Error al cargar usuarios');
      }
    } catch (err) {
      setErrorUsuarios('Error de conexión al cargar usuarios');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeSection === 'users') {
      fetchUsuarios();
    }
  }, [isAdmin, activeSection]);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setErrorUsuarios('');
    setSuccessUsuarios('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          password: nuevoUsuario.password,
          rol: nuevoUsuario.rol,
          preguntasSeguridad: {
            comidaFavorita: nuevoUsuario.comidaFavorita,
            primeraMascota: nuevoUsuario.primeraMascota,
            ciudadNacimiento: nuevoUsuario.ciudadNacimiento
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessUsuarios('Usuario creado exitosamente');
        setNuevoUsuario({
          nombre: '',
          email: '',
          password: '',
          rol: 'usuario',
          comidaFavorita: '',
          primeraMascota: '',
          ciudadNacimiento: ''
        });
        fetchUsuarios();
      } else {
        setErrorUsuarios(data.mensaje || 'No se pudo crear el usuario');
      }
    } catch (err) {
      setErrorUsuarios('Error de conexión al crear usuario');
    }
  };

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

        <div className="guest-cards">
          <div className="guest-card">
            <span>🕯️</span>
            <h4>Obituarios</h4>
            <p>Consulta obituarios publicados y homenajes.</p>
          </div>
          <div className="guest-card">
            <span>📍</span>
            <h4>Ubicación</h4>
            <p>España y Olmedo, Riobamba, Ecuador.</p>
          </div>
          <div className="guest-card">
            <span>📞</span>
            <h4>Contacto</h4>
            <p>Asistencia inmediata y líneas disponibles.</p>
          </div>
        </div>

        <div className="guest-nav">
          <button 
            className={activeSection === 'info' ? 'active' : ''}
            onClick={() => setActiveSection('info')}
          >
            📖 Información
          </button>
          <button 
            className={activeSection === 'obituarios' ? 'active' : ''}
            onClick={() => setActiveSection('obituarios')}
          >
            🕯️ Ver Obituarios
          </button>
        </div>

        {activeSection === 'obituarios' ? (
          <ObituariosPublicos />
        ) : (
          <>
            <div className="content-section">
              <h3>📖 Contenido Público</h3>
              <div className="public-content">
                <div className="info-card">
                  <h4>🏢 Sobre Nosotros</h4>
                  <p>Funerales «Gonzalo Mendoza», Servicios funerarios de calidad, nuestra misión es acompañar a las familias durante los momentos más difíciles y ofrecer la mejor despedida a sus seres queridos.</p>
                </div>
                <div className="info-card">
                  <h4>📞 Contacto</h4>
                  <p>Celular: 099 28 29 095 | 099 90 90 860</p>
                  <p>Oficina: 032 944 608</p>
                  <p>Correo: israelmendoza18@hotmail.com</p>
                </div>
                <div className="info-card">
                  <h4>📍 Ubicación</h4>
                  <p>España y Olmedo, Riobamba, Ecuador</p>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h3>¿Quieres acceder a más funcionalidades?</h3>
              <button className="cta-button" onClick={onLogout}>
                Iniciar Sesión
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Vista de Administrador
  if (isAdmin) {
    return (
      <div className="dashboard-container admin-dashboard">
        <header className="dashboard-header">
          <h1>🛡️ Panel de Administración</h1>
          <div className="header-actions">
            {onGoToPerfil && (
              <button className="perfil-btn" onClick={onGoToPerfil}>
                👤 Mi Perfil
              </button>
            )}
            <button className="logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </div>
        </header>

        <nav className="admin-nav">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeSection === 'users' ? 'active' : ''}
            onClick={() => setActiveSection('users')}
          >
            👥 Usuarios
          </button>
          <button 
            className={activeSection === 'obituarios' ? 'active' : ''}
            onClick={() => setActiveSection('obituarios')}
          >
            🕯️ Obituarios
          </button>
          <button 
            className={activeSection === 'servicios' ? 'active' : ''}
            onClick={() => setActiveSection('servicios')}
          >
            🎁 Servicios
          </button>
          <button 
            className={activeSection === 'floristerias' ? 'active' : ''}
            onClick={() => setActiveSection('floristerias')}
          >
            🌹 Floristerías
          </button>
          <button 
            className={activeSection === 'pedidos' ? 'active' : ''}
            onClick={() => setActiveSection('pedidos')}
          >
            📦 Pedidos
          </button>
          <button 
            className={`${activeSection === 'notificaciones' ? 'active' : ''} ${notificacionesNoLeidas > 0 ? 'con-notificaciones' : ''}`}
            onClick={() => setActiveSection('notificaciones')}
          >
            📬 Notificaciones {notificacionesNoLeidas > 0 && <span className="badge-notif">{notificacionesNoLeidas}</span>}
          </button>
          <button 
            className={activeSection === 'cuentasBancarias' ? 'active' : ''}
            onClick={() => setActiveSection('cuentasBancarias')}
          >
            🏦 Cuentas Bancarias
          </button>
          <button 
            className={activeSection === 'planes' ? 'active' : ''}
            onClick={() => setActiveSection('planes')}
          >
            📋 Planes Funerarios
          </button>
          <button 
            className={activeSection === 'seguroPrevisor' ? 'active' : ''}
            onClick={() => setActiveSection('seguroPrevisor')}
          >
            🛡️ Seguro Previsor Prepago
          </button>
          <button 
            className={activeSection === 'audit' ? 'active' : ''}
            onClick={() => setActiveSection('audit')}
          >
            📋 Auditoría
          </button>
          <button 
            className={activeSection === 'settings' ? 'active' : ''}
            onClick={() => setActiveSection('settings')}
          >
            ⚙️ Configuración
          </button>
        </nav>

        {activeSection === 'dashboard' && (
          <>
            <div className="welcome-section admin-welcome">
              <h2>¡Bienvenido, {usuario.nombre}! 🔐</h2>
              <div className="admin-badge">ADMINISTRADOR</div>
              <div className="user-info">
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>ID:</strong> {usuario.id}</p>
                <p><strong>Rol:</strong> Administrador</p>
              </div>
            </div>

            <div className="admin-stats">
              <div className="stat-card">
                <h3>{stats.usuarios_totales}</h3>
                <p>Usuarios Totales</p>
              </div>
              <div className="stat-card">
                <h3>{stats.obituarios_totales}</h3>
                <p>Obituarios</p>
              </div>
              <div className="stat-card">
                <h3>{stats.pedidos_florales}</h3>
                <p>Pedidos Flores</p>
              </div>
              <div className="stat-card">
                <h3>{stats.servicios_totales}</h3>
                <p>Servicios</p>
              </div>
              <div className="stat-card">
                <h3>{stats.registrados_hoy}</h3>
                <p>Registros Hoy</p>
              </div>
            </div>

            <div className="content-section">
              <h3>📖 Información de la Empresa</h3>
              <div className="public-content">
                <div className="info-card">
                  <h4>🏢 Sobre Nosotros</h4>
                  <p>Funerales «Gonzalo Mendoza», Servicios funerarios de calidad, nuestra misión es acompañar a las familias durante los momentos más difíciles y ofrecer la mejor despedida a sus seres queridos.</p>
                </div>
                <div className="info-card">
                  <h4>📞 Contacto</h4>
                  <p>Celular: 099 28 29 095 | 099 90 90 860</p>
                  <p>Oficina: 032 944 608</p>
                  <p>Correo: israelmendoza18@hotmail.com</p>
                </div>
                <div className="info-card">
                  <h4>📍 Ubicación</h4>
                  <p>España y Olmedo, Riobamba, Ecuador</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'users' && (
          <div className="admin-section">
            <h2>👥 Gestión de Usuarios</h2>
            <div className="users-management">
              <form className="users-form" onSubmit={handleCrearUsuario}>
                <div className="users-form-grid">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={nuevoUsuario.nombre}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                      required
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo</label>
                    <input
                      type="email"
                      value={nuevoUsuario.email}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                      required
                      placeholder="correo@dominio.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      value={nuevoUsuario.password}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-group">
                    <label>Rol</label>
                    <select
                      value={nuevoUsuario.rol}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                    >
                      <option value="admin">Administrador</option>
                      <option value="usuario">Usuario normal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comida favorita</label>
                    <input
                      type="text"
                      value={nuevoUsuario.comidaFavorita}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, comidaFavorita: e.target.value })}
                      required
                      placeholder="Ej: Pizza"
                    />
                  </div>
                  <div className="form-group">
                    <label>Primera mascota</label>
                    <input
                      type="text"
                      value={nuevoUsuario.primeraMascota}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, primeraMascota: e.target.value })}
                      required
                      placeholder="Ej: Firulais"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ciudad de nacimiento</label>
                    <input
                      type="text"
                      value={nuevoUsuario.ciudadNacimiento}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, ciudadNacimiento: e.target.value })}
                      required
                      placeholder="Ej: Riobamba"
                    />
                  </div>
                </div>
                {errorUsuarios && <div className="error-message">{errorUsuarios}</div>}
                {successUsuarios && <div className="success-message">{successUsuarios}</div>}
                <button className="action-btn primary" type="submit">
                  ➕ Crear Usuario
                </button>
              </form>

              <div className="users-table">
                <div className="users-table-header">
                  <span>Nombre</span>
                  <span>Correo</span>
                  <span>Rol</span>
                  <span>Fecha</span>
                </div>
                {loadingUsuarios ? (
                  <div className="users-table-placeholder">
                    <p>Cargando usuarios...</p>
                  </div>
                ) : usuariosAdmin.length === 0 ? (
                  <div className="users-table-placeholder">
                    <p>No hay usuarios registrados.</p>
                  </div>
                ) : (
                  usuariosAdmin.map((user) => (
                    <div key={user._id} className="users-table-row">
                      <span>{user.nombre}</span>
                      <span>{user.email}</span>
                      <span className={`rol-badge ${user.rol}`}>{user.rol === 'admin' ? 'Administrador' : 'Usuario'}</span>
                      <span>{new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'obituarios' && (
          <AdminObituarios />
        )}

        {activeSection === 'servicios' && (
          <AdminServicios />
        )}

        {activeSection === 'floristerias' && (
          <AdminFloristerias />
        )}

        {activeSection === 'pedidos' && (
          <AdminPedidos />
        )}

        {activeSection === 'notificaciones' && (
          <AdminNotificaciones />
        )}

        {activeSection === 'cuentasBancarias' && (
          <AdminCuentasBancarias />
        )}

        {activeSection === 'planes' && (
          <AdminPlanes />
        )}

        {activeSection === 'seguroPrevisor' && (
          <SeguroPrevisor />
        )}

        {activeSection === 'audit' && (
          <AdminAudit />
        )}

        {activeSection === 'settings' && (
          <div className="admin-section">
            <h2>⚙️ Configuración del Sistema</h2>
            <div className="settings-panel">
              <div className="setting-group">
                <h3>General</h3>
                <label>
                  <input type="checkbox" defaultChecked /> Permitir registro de nuevos usuarios
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Modo mantenimiento
                </label>
              </div>
              <div className="setting-group">
                <h3>Notificaciones</h3>
                <label>
                  <input type="checkbox" defaultChecked /> Enviar emails de confirmación
                </label>
                <label>
                  <input type="checkbox" /> Notificaciones push
                </label>
              </div>
              <button className="action-btn primary">💾 Guardar Cambios</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vista de Usuario Normal
  return (
    <div className="dashboard-container user-dashboard">
      <header className="dashboard-header">
        <h1>🕊️ Panel de Usuario</h1>
        <div className="header-actions">
          {onGoToPerfil && (
            <button className="perfil-btn" onClick={onGoToPerfil}>
              👤 Mi Perfil
            </button>
          )}
          <button className="logout-btn" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="user-nav">
        <button 
          className={activeSection === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveSection('dashboard')}
        >
          📊 Mi Dashboard
        </button>
        <button 
          className={activeSection === 'services' ? 'active' : ''}
          onClick={() => setActiveSection('services')}
        >
          🕊️ Servicios
        </button>
        <button 
          className={activeSection === 'floristerias' ? 'active' : ''}
          onClick={() => setActiveSection('floristerias')}
        >
          🌹 Floristerías
        </button>
        <button 
          className={activeSection === 'misPedidos' ? 'active' : ''}
          onClick={() => setActiveSection('misPedidos')}
        >
          📦 Mis Pedidos
        </button>
        <button 
          className={activeSection === 'planes' ? 'active' : ''}
          onClick={() => setActiveSection('planes')}
        >
          📋 Planes Funerarios
        </button>
        <button 
          className={activeSection === 'seguroPrevisor' ? 'active' : ''}
          onClick={() => setActiveSection('seguroPrevisor')}
        >
          🛡️ Seguro Previsor Prepago
        </button>
        <button 
          className={activeSection === 'obituario' ? 'active' : ''}
          onClick={() => setActiveSection('obituario')}
        >
          📰 Obituario Online
        </button>
        <button 
          className={activeSection === 'contacto' ? 'active' : ''}
          onClick={() => setActiveSection('contacto')}
        >
          📞 Contacto
        </button>
      </nav>

      {activeSection === 'dashboard' && (
        <>
          <div className="welcome-section user-welcome">
            <h2>¡Bienvenido, {usuario.nombre}! 💝</h2>
            <p className="welcome-subtitle">Gracias por confiar en Funerales Gonzalo Mendoza</p>
            <div className="user-info">
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>ID:</strong> {usuario.id}</p>
            </div>
          </div>

          <div className="content-section">
            <h3>📖 Información de la Empresa</h3>
            <div className="public-content">
              <div className="info-card">
                <h4>🏢 Sobre Nosotros</h4>
                <p>Funerales «Gonzalo Mendoza», Servicios funerarios de calidad, nuestra misión es acompañar a las familias durante los momentos más difíciles y ofrecer la mejor despedida a sus seres queridos.</p>
              </div>
              <div className="info-card">
                <h4>📞 Contacto</h4>
                <p>Celular: 099 28 29 095 | 099 90 90 860</p>
                <p>Oficina: 032 944 608</p>
                <p>Correo: israelmendoza18@hotmail.com</p>
              </div>
              <div className="info-card">
                <h4>📍 Ubicación</h4>
                <p>España y Olmedo, Riobamba, Ecuador</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'services' && (
        <Services usuario={usuario} onBack={() => setActiveSection('dashboard')} />
      )}

      {activeSection === 'floristerias' && (
        <Floristerias usuario={usuario} onBack={() => setActiveSection('dashboard')} />
      )}

      {activeSection === 'misPedidos' && (
        <MisPedidos onBack={() => setActiveSection('dashboard')} />
      )}

      {activeSection === 'planes' && (
        <PlanesUsuario />
      )}

      {activeSection === 'seguroPrevisor' && (
        <SeguroPrevisor />
      )}

      {activeSection === 'obituario' && (
        <ObituariosPublicos />
      )}

      {activeSection === 'contacto' && (
        <div className="content-section">
          <h2>📞 Contáctenos</h2>
          <div className="public-content">
            <div className="info-card">
              <h4>📞 Teléfonos</h4>
              <p>Celular: 099 28 29 095 | 099 90 90 860</p>
              <p>Oficina: 032 944 608</p>
            </div>
            <div className="info-card">
              <h4>📧 Email</h4>
              <p>israelmendoza18@hotmail.com</p>
            </div>
            <div className="info-card">
              <h4>📍 Dirección</h4>
              <p>España y Olmedo, Riobamba, Ecuador</p>
            </div>
            <div className="info-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <h4>💬 Escríbenos por WhatsApp</h4>
              <button 
                className="btn-whatsapp-contacto"
                onClick={() => window.open(WHATSAPP_URL, '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #25d366, #1ebe5d)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                📱 Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
