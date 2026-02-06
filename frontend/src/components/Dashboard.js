import './Dashboard.css';
import './NotificacionesBadge.css';
import Footer from './Footer';
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  const [cambioPedidosNoLeidos, setCambioPedidosNoLeidos] = useState(0);
  const [pedidosNuevosAdmin, setPedidosNuevosAdmin] = useState(0);
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [successUsuarios, setSuccessUsuarios] = useState('');
  const [pedidosUsuario, setPedidosUsuario] = useState([]);
  const [loadingPedidosUsuario, setLoadingPedidosUsuario] = useState(false);
  const [pedidosFloresData, setPedidosFloresData] = useState([]);
  const [loadingPedidosFlores, setLoadingPedidosFlores] = useState(true);
  const [estadisticasUsuario, setEstadisticasUsuario] = useState({
    totalPedidos: 0,
    articulosEnviados: 0
  });
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario'
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

  // Cargar conteo de pedidos nuevos para admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchPedidosNuevos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pedidos-floristerias/admin/nuevos-count', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPedidosNuevosAdmin(data.count || 0);
        }
      } catch (err) {
        console.error('Error al obtener conteo de pedidos nuevos:', err);
      }
    };

    fetchPedidosNuevos();
    const interval = setInterval(fetchPedidosNuevos, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, [isAdmin]);

  // Cargar cambios de pedidos no leídos para usuarios normales
  useEffect(() => {
    if (isAdmin) return;

    const fetchCambiosPedidos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pedidos-floristerias/cambios-no-leidos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCambioPedidosNoLeidos(data.count || 0);
        }
      } catch (err) {
        console.error('Error al obtener cambios de pedidos:', err);
      }
    };

    fetchCambiosPedidos();
    const interval = setInterval(fetchCambiosPedidos, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, [isAdmin]);

  // Marcar cambios de pedidos como vistos cuando accede a la sección
  useEffect(() => {
    if (isAdmin || activeSection !== 'misPedidos') return;

    const marcarComoVistos = async () => {
      try {
        await fetch('http://localhost:5000/api/pedidos-floristerias/cambios-como-vistos', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCambioPedidosNoLeidos(0);
      } catch (err) {
        console.error('Error al marcar cambios como vistos:', err);
      }
    };

    marcarComoVistos();
  }, [activeSection, isAdmin]);

  // Marcar pedidos como revisados cuando admin accede a la sección
  useEffect(() => {
    if (!isAdmin || activeSection !== 'pedidos') return;

    const marcarComoRevisados = async () => {
      try {
        await fetch('http://localhost:5000/api/pedidos-floristerias/admin/marcar-revisados', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPedidosNuevosAdmin(0);
      } catch (err) {
        console.error('Error al marcar pedidos como revisados:', err);
      }
    };

    marcarComoRevisados();
  }, [activeSection, isAdmin]);

  // Cargar pedidos y estadísticas del usuario
  useEffect(() => {
    if (isAdmin) return;

    const fetchPedidosUsuario = async () => {
      try {
        setLoadingPedidosUsuario(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/pedidos-floristerias/mis-pedidos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const pedidos = data.pedidos || [];
          setPedidosUsuario(pedidos);
          
          // Calcular estadísticas
          const totalPedidos = pedidos.length;
          const articulosEnviados = pedidos.reduce((sum, p) => sum + (p.cantidad || 0), 0);
          
          setEstadisticasUsuario({
            totalPedidos,
            articulosEnviados
          });
        }
      } catch (error) {
        console.error('Error al cargar pedidos del usuario:', error);
      } finally {
        setLoadingPedidosUsuario(false);
      }
    };

    fetchPedidosUsuario();
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

  // Cargar estadísticas de pedidos flores para el gráfico del dashboard
  useEffect(() => {
    if (!isAdmin) return;

    const fetchPedidosFlores = async () => {
      try {
        setLoadingPedidosFlores(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/estadisticas/admin/pedidos-flores', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPedidosFloresData(data.datos || []);
        } else {
          console.error('Error al obtener datos de pedidos flores');
          setPedidosFloresData([]);
        }
      } catch (error) {
        console.error('Error al cargar pedidos flores:', error);
        setPedidosFloresData([]);
      } finally {
        setLoadingPedidosFlores(false);
      }
    };

    fetchPedidosFlores();
    // Recargar cada 30 segundos
    const interval = setInterval(fetchPedidosFlores, 30000);
    return () => clearInterval(interval);
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
          rol: nuevoUsuario.rol
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessUsuarios('Usuario creado exitosamente');
        setNuevoUsuario({
          nombre: '',
          email: '',
          password: '',
          rol: 'usuario'
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
        <Footer />
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
            📦 Pedidos {pedidosNuevosAdmin > 0 && <span className="badge-notif">{pedidosNuevosAdmin}</span>}
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
        </nav>

        {activeSection === 'dashboard' && (
          <>
            <div className="welcome-section admin-welcome">
              <h2>¡Bienvenido, {usuario.nombre}! 🎉</h2>
              <div className="admin-badge">ADMINISTRADOR</div>
              <div className="user-info">
                <p><strong>Email:</strong> <a href={`mailto:${usuario.email}`} style={{color: '#8b7355', textDecoration: 'none', fontWeight: '600'}}>{usuario.email}</a></p>
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

            <div className="charts-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
              <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>📊 Estadísticas Generales</h3>
                <Bar
                  data={{
                    labels: ['Usuarios', 'Obituarios', 'Flores', 'Servicios', 'Hoy'],
                    datasets: [
                      {
                        label: 'Cantidad',
                        data: [
                          stats.usuarios_totales,
                          stats.obituarios_totales,
                          stats.pedidos_florales,
                          stats.servicios_totales,
                          stats.registrados_hoy
                        ],
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.8)',
                          'rgba(153, 102, 255, 0.8)',
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(255, 159, 64, 0.8)',
                          'rgba(75, 192, 75, 0.8)'
                        ],
                        borderColor: [
                          'rgb(54, 162, 235)',
                          'rgb(153, 102, 235)',
                          'rgb(255, 99, 132)',
                          'rgb(255, 159, 64)',
                          'rgb(75, 192, 75)'
                        ],
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>

              <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>🥧 Distribución de Servicios</h3>
                <Pie
                  data={{
                    labels: ['Usuarios', 'Obituarios', 'Flores', 'Servicios'],
                    datasets: [
                      {
                        label: 'Cantidad',
                        data: [
                          stats.usuarios_totales || 1,
                          stats.obituarios_totales || 1,
                          stats.pedidos_florales || 1,
                          stats.servicios_totales || 1
                        ],
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.8)',
                          'rgba(153, 102, 255, 0.8)',
                          'rgba(255, 99, 132, 0.8)',
                          'rgba(255, 159, 64, 0.8)'
                        ],
                        borderColor: [
                          'rgb(54, 162, 235)',
                          'rgb(153, 102, 255)',
                          'rgb(255, 99, 132)',
                          'rgb(255, 159, 64)'
                        ],
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Pedidos de Flores Confirmados</h3>
              {loadingPedidosFlores ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Cargando datos...</p>
                </div>
              ) : pedidosFloresData && pedidosFloresData.length > 0 ? (
                <Bar
                  data={{
                    labels: pedidosFloresData.map(item => item.codigo),
                    datasets: [
                      {
                        label: 'Cantidad Vendida',
                        data: pedidosFloresData.map(item => item.cantidad),
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top'
                      },
                      title: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>No existen pedidos confirmados aún.</p>
                </div>
              )}
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
        <Footer />
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
          📦 Mis Pedidos {cambioPedidosNoLeidos > 0 && <span className="badge-notif">{cambioPedidosNoLeidos}</span>}
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
          🕯️ Obituario Online
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
            <h2>¡Bienvenido, {usuario.nombre}! 💐</h2>
            <p className="welcome-subtitle">Gracias por confiar en Funerales Gonzalo Mendoza</p>
            <div className="welcome-message-institutional">
              <p>🕊️ Estamos aquí para acompañarte en los momentos más importantes de tu vida, brindándote servicios con respeto, dignidad y dedicación.</p>
            </div>
          </div>

          {/* Estadísticas Personales */}
          <div className="personal-stats-section">
            <h3>📊 Tus Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-icon">📦</span>
                <h4>{estadisticasUsuario.totalPedidos}</h4>
                <p>Pedidos Realizados</p>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🌹</span>
                <h4>{estadisticasUsuario.articulosEnviados}</h4>
                <p>Artículos Enviados</p>
              </div>
            </div>
          </div>

          {/* Último Pedido */}
          {pedidosUsuario.length > 0 && (
            <div className="last-order-section">
              <h3>📦 Estado del Último Pedido</h3>
              {(() => {
                const ultimoPedido = pedidosUsuario[0];
                const estados = {
                  'pendiente': { icon: '⏳', color: '#ffa500', descripcion: 'Tu pedido está siendo procesado. Nos comunicaremos contigo pronto.' },
                  'confirmado': { icon: '✅', color: '#4caf50', descripcion: 'Tu pedido ha sido confirmado y está en preparación.' },
                  'cancelado_admin': { icon: '❌', color: '#f44336', descripcion: 'Tu pedido fue cancelado por el administrador.' },
                  'cancelado_usuario': { icon: '❌', color: '#f44336', descripcion: 'Tu pedido fue cancelado por ti.' }
                };
                const estadoInfo = estados[ultimoPedido.estado] || estados['pendiente'];
                const codigoPedido = ultimoPedido?._id ? ultimoPedido._id.slice(-6) : '------';
                
                return (
                  <div className="order-card">
                    <div className="order-header">
                      <div className="order-status" style={{ borderLeft: `4px solid ${estadoInfo.color}` }}>
                        <span className="status-icon">{estadoInfo.icon}</span>
                        <h4>{ultimoPedido.estado.toUpperCase()}</h4>
                        <span className="order-code">Pedido #{codigoPedido}</span>
                      </div>
                      <div className="order-date">
                        <span>{new Date(ultimoPedido.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <div className="order-info">
                      <p><strong>Dirección:</strong> {ultimoPedido.direccionEntrega || 'No disponible'}</p>
                      <p><strong>Total:</strong> ${Number(ultimoPedido.total || 0).toFixed(2)}</p>
                    </div>
                    <div className="order-what-now">
                      <h5>¿Qué sucede ahora?</h5>
                      <p>{estadoInfo.descripcion}</p>
                    </div>
                    <div className="order-progress">
                      <div className="progress-track">
                        <div className={`progress-step ${['pendiente', 'confirmado'].includes(ultimoPedido.estado) ? 'active' : ''}`}>
                          <span>📋</span>
                          <p>Pendiente</p>
                        </div>
                        <div className={`progress-step ${ultimoPedido.estado === 'confirmado' ? 'active' : ''}`}>
                          <span>📦</span>
                          <p>Confirmado</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Historial de Pedidos Recientes */}
          {pedidosUsuario.length > 1 && (
            <div className="recent-orders-section">
              <h3>📋 Historial de Pedidos Recientes</h3>
              <div className="orders-timeline">
                {pedidosUsuario.slice(0, 5).map((pedido, index) => (
                  <div key={pedido._id} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="marker-number">{index + 1}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="order-summary">
                        <h5>Pedido #{pedido._id ? pedido._id.slice(-6) : '------'}</h5>
                        <span className={`status-badge status-${pedido.estado}`}>{pedido.estado}</span>
                      </div>
                      <p className="order-date">{new Date(pedido.createdAt).toLocaleDateString('es-ES')}</p>
                      <p className="order-amount">${Number(pedido.total || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje Motivacional / Acompañamiento */}
          <div className="accompaniment-message">
            <div className="message-box">
              <h4>💝 Nuestro Compromiso Contigo</h4>
              <p>En Funerales Gonzalo Mendoza, creemos que cada momento requiere respeto, dedicación y acompañamiento genuino. Ya sea ordenando flores, utilizando nuestros servicios o confiándonos sus momentos especiales, queremos que sepa que estamos aquí para usted y su familia.</p>
              <p className="message-footer">Porque en los momentos que importan, la calidad y el cuidado marcan la diferencia.</p>
            </div>
          </div>

          <div className="user-info-compact">
            <p><strong>Email:</strong> <a href={`mailto:${usuario.email}`} style={{color: '#8b7355', textDecoration: 'none', fontWeight: '600'}}>{usuario.email}</a></p>
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
              <p>
                Celular: <a href="tel:+593992829095" style={{color: '#8b7355', textDecoration: 'none', fontWeight: '600'}}>099 28 29 095</a> | <a href="tel:+593999090860" style={{color: '#8b7355', textDecoration: 'none', fontWeight: '600'}}>099 90 90 860</a>
              </p>
              <p>
                Oficina: <a href="tel:+59332944608" style={{color: '#8b7355', textDecoration: 'none', fontWeight: '600'}}>032 944 608</a>
              </p>
            </div>
            <div className="info-card">
              <h4>📧 Email</h4>
              <p>
                <a href="mailto:israelmendoza18@hotmail.com" style={{color: '#8b7355', textDecoration: 'none', fontWeight: '600'}}>israelmendoza18@hotmail.com</a>
              </p>
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
      <Footer />
    </div>
  );
}

export default Dashboard;
