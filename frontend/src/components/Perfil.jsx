import { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil({ usuario, onLogout }) {
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Datos del perfil
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reautenticación
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthAction, setReauthAction] = useState(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setPerfil(data);
        setNombre(data.nombre);
        setCelular(data.celular);
      } else {
        setError('Error al cargar perfil');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const solicitarReautenticacion = (action) => {
    setReauthAction(() => action);
    setShowReauthModal(true);
    setReauthPassword('');
  };

  const handleReautenticar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/reautenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: reauthPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setShowReauthModal(false);
        if (reauthAction) {
          reauthAction();
        }
      } else {
        setError(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    }
  };

  const handleActualizarPerfil = async () => {
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, celular })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Perfil actualizado exitosamente');
        setPerfil({ ...perfil, nombre, celular });
        setEditMode(false);
        // Actualizar localStorage
        const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
        localStorage.setItem('usuario', JSON.stringify({ ...usuarioActual, nombre, celular }));
      } else {
        setError(data.error || 'Error al actualizar perfil');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    }
  };

  const handleCambiarPassword = async () => {
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/cambiar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Contraseña actualizada exitosamente');
        setChangePasswordMode(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Error al cambiar contraseña');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    }
  };

  if (loading) {
    return <div className="perfil-container">Cargando...</div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h1>Mi Perfil</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!editMode && !changePasswordMode && perfil && (
          <div className="perfil-info">
            <div className="perfil-field">
              <label>Nombre:</label>
              <span>{perfil.nombre}</span>
            </div>
            <div className="perfil-field">
              <label>Correo:</label>
              <span>{perfil.email}</span>
            </div>
            <div className="perfil-field">
              <label>Celular:</label>
              <span>{perfil.celular}</span>
            </div>
            <div className="perfil-field">
              <label>Rol:</label>
              <span className={`rol-badge ${perfil.rol}`}>
                {perfil.rol === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
            <div className="perfil-field">
              <label>Contraseña:</label>
              <span>••••••••</span>
            </div>
            {perfil.lastPasswordChange && (
              <div className="perfil-field">
                <label>Último cambio de contraseña:</label>
                <span>{new Date(perfil.lastPasswordChange).toLocaleString('es-PE')}</span>
              </div>
            )}

            <div className="perfil-actions">
              <button 
                className="btn-edit"
                onClick={() => solicitarReautenticacion(() => setEditMode(true))}
              >
                Editar Perfil
              </button>
              <button 
                className="btn-change-password"
                onClick={() => solicitarReautenticacion(() => setChangePasswordMode(true))}
              >
                Cambiar Contraseña
              </button>
              <button className="btn-logout" onClick={onLogout}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {editMode && (
          <div className="perfil-edit">
            <h2>Editar Perfil</h2>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
              />
            </div>
            <div className="form-group">
              <label>Celular:</label>
              <input
                type="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="Número de celular"
              />
            </div>
            <div className="perfil-actions">
              <button className="btn-save" onClick={handleActualizarPerfil}>
                Guardar Cambios
              </button>
              <button className="btn-cancel" onClick={() => setEditMode(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {changePasswordMode && (
          <div className="perfil-edit">
            <h2>Cambiar Contraseña</h2>
            <div className="form-group">
              <label>Contraseña Actual:</label>
              <div className="password-input-container">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Nueva Contraseña:</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <small className="password-hint">
                Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
              </small>
            </div>
            <div className="form-group">
              <label>Confirmar Nueva Contraseña:</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="perfil-actions">
              <button className="btn-save" onClick={handleCambiarPassword}>
                Actualizar Contraseña
              </button>
              <button className="btn-cancel" onClick={() => setChangePasswordMode(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Reautenticación */}
      {showReauthModal && (
        <div className="modal-overlay" onClick={() => setShowReauthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Identidad</h2>
            <p>Por seguridad, ingresa tu contraseña actual</p>
            <div className="form-group">
              <input
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                placeholder="Contraseña actual"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleReautenticar}>
                Confirmar
              </button>
              <button className="btn-cancel" onClick={() => setShowReauthModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
