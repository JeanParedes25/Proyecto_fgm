import './Dashboard.css';
import AdminAudit from './AdminAudit';
import Services from './Services';
import { useState } from 'react';

function Dashboard({ usuario, isGuest, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const isAdmin = usuario?.rol === 'admin' || usuario?.email === 'israelmendoza18@hotmail.com';

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
      </div>
    );
  }

  // Vista de Administrador
  if (isAdmin) {
    return (
      <div className="dashboard-container admin-dashboard">
        <header className="dashboard-header">
          <h1>🛡️ Panel de Administración</h1>
          <button className="logout-btn" onClick={onLogout}>
            Cerrar Sesión
          </button>
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
                <h3>25</h3>
                <p>Usuarios Totales</p>
              </div>
              <div className="stat-card">
                <h3>148</h3>
                <p>Registros</p>
              </div>
              <div className="stat-card">
                <h3>12</h3>
                <p>Activos Hoy</p>
              </div>
              <div className="stat-card">
                <h3>100%</h3>
                <p>Sistema Operativo</p>
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
              <button className="action-btn primary">➕ Crear Usuario</button>
              <div className="users-table-placeholder">
                <p>Aquí se mostrará la lista de usuarios registrados con opciones para editar, eliminar y gestionar permisos.</p>
              </div>
            </div>
          </div>
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
        <button className="logout-btn" onClick={onLogout}>
          Cerrar Sesión
        </button>
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
          🕊️ Servicios Exequiales
        </button>
        <button 
          className={activeSection === 'obituario' ? 'active' : ''}
          onClick={() => setActiveSection('obituario')}
        >
          📰 Obituario Online
        </button>
        <button 
          className={activeSection === 'seguro' ? 'active' : ''}
          onClick={() => setActiveSection('seguro')}
        >
          🛡️ Seguro Provisor
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

      {activeSection === 'obituario' && (
        <div className="content-section obituario-section">
          <div className="obituario-header">
            <h2>📰 Obituario Online</h2>
            <p className="obituario-subtitle">Funerales Gonzalo Mendoza</p>
          </div>

          <div className="obituario-search">
            <h3>🔍 Buscador Obituario Online</h3>
            <p className="search-description">Puede utilizar nuestro buscador para encontrar algún servicio mortuorio brindado por Funerales Gonzalo Mendoza.</p>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Ingrese el nombre a buscar..." 
                className="search-input"
              />
              <button className="search-btn">Buscar</button>
            </div>
          </div>

          <div className="servicios-recientes">
            <h3>📋 Servicios Recientes</h3>
            
            <div className="obituario-card">
              <div className="obituario-image">
                <img src="https://i2.wp.com/funeralesgonzalomendoza.com/wp-content/uploads/2021/05/190052437_2851041938496209_4082308709424895814_n.png?w=900&ssl=1" alt="Segundo Enrique Adriano Campoverde" />
              </div>
              
              <div className="obituario-content">
                <div className="obituario-recuerdo">
                  <p className="recuerdo-text">
                    Recordamos tus ojos llenos de alegría y bondad, tu sonrisa cariñosa que nos da la fuerza para seguir adelante, 
                    tu inmensa ternura y generosidad con la que te ganaste el cariño de todos.
                    Tu ejemplo y enseñanzas de hijo, hermano, esposo, padre, abuelito cariñoso, abnegado, responsable, alegre y 
                    solidario perdurarán por siempre.
                  </p>
                </div>

                <div className="parte-mortuorio">
                  <h4>⚱️ Parte Mortuorio</h4>
                  <p className="mortuorio-inicio">
                    Descansa en la paz del Señor el que en vida fue Señor.
                  </p>
                  <p className="difunto-nombre"><strong>Segundo Enrique Adriano Campoverde</strong></p>
                  
                  <div className="familiares-info">
                    <p><strong>Sus padres:</strong> Luis Adriano (+) y Ana Campoverde (+)</p>
                    <p><strong>Su Esposa:</strong> Zoila Victoria Adriano Escudero</p>
                    <p><strong>Sus Hijos:</strong> Fernando, Piedad, Guillermo, Guadalupe (+), Elsa, Margoth y Miriam Adriano Adriano</p>
                    <p><strong>Sus Hijos Políticos:</strong> Elizabeth Cuvi, Luis Tixi, Mariana Echeverría, Juan Bonilla, Mauro Vargas y Juan Pomaino</p>
                    <p><strong>Sus Nietos:</strong> Anderson y Juleidy Adriano Cuvi, Alexandra, Erick y Cristopher Tixi Adriano, María José Adriano Echeverría; Joel, Ariel y Ainhoa Vargas Adriano; Génesis, Danilo, Daniela y Samara Bonilla Adriano; Ismael Cuñes Adriano y Mayte Pomaino Adriano</p>
                    <p><strong>Sus Hermanos:</strong> Humberto (+), Oswaldo (+), Rafael (+), Vicente (+), Gilberto y Narcisa Adriano Campoverde.</p>
                    <p><strong>Sus Hermanos Políticos:</strong> Ana Moromenacho, Olga Cuzquicusma, Dalinda Quiroz, Etelvina Veloz y Gustavo López; Pablo, Domitila, Grimanesa y Rosa Adriano Escudero</p>
                  </div>

                  <div className="comunicado">
                    <p>
                      Tíos, sobrinos, primos y demás familiares tienen el pesar de comunicar su sensible fallecimiento acaecido el 
                      Día Jueves 27 de mayo e invitan a la velación de sus restos mortales desde la sala "B" de Funerales Gonzalo Mendoza, 
                      donde se oficiará sus honras fúnebres, el día Viernes 28 de mayo a las 11 de la mañana y de allí al Cementerio General 
                      para su cristiana sepultura.
                    </p>
                    <p className="agradecimiento">
                      <em>Por este acto de fe cristiana los familiares anticipan su sincero agradecimiento.</em>
                    </p>
                  </div>

                  <div className="datos-servicio">
                    <p><strong>Riobamba, mayo de 2021</strong></p>
                    <p><strong>Funerales Gonzalo Mendoza</strong></p>
                    <p>España y Olmedo | 2944608 / 0992829095</p>
                  </div>
                </div>

                <div className="comentarios-section">
                  <h4>💬 Comparta su comentario con los deudos</h4>
                  
                  <form className="comentarios-form">
                    <div className="form-group">
                      <label>Comentario *</label>
                      <textarea 
                        placeholder="Deja tu comentario aquí..." 
                        rows="5"
                        required
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre *</label>
                        <input type="text" placeholder="Tu nombre" required />
                      </div>
                      <div className="form-group">
                        <label>Correo electrónico *</label>
                        <input type="email" placeholder="Tu correo" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Web (Opcional)</label>
                      <input type="url" placeholder="Tu sitio web" />
                    </div>

                    <div className="form-group checkbox">
                      <label>
                        <input type="checkbox" />
                        Recibir un email con los siguientes comentarios a esta entrada
                      </label>
                      <label>
                        <input type="checkbox" />
                        Recibir un email con cada nueva entrada
                      </label>
                    </div>

                    <button type="submit" className="submit-btn">Publicar Comentario</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'seguro' && (
        <div className="content-section">
          <h2>🛡️ Seguro Provisor</h2>
          <p>Información sobre Seguro Provisor en desarrollo...</p>
        </div>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
