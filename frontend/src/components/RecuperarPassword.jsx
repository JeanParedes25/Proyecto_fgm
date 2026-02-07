import { useState } from 'react';
import './Auth.css';
import { API_BASE_URL } from '../constants/config';

function RecuperarPassword({ onBackToLogin, onRecoverySuccess }) {
  // Estados generales
  const [step, setStep] = useState(1); // 1: email, 2: código + nueva contraseña
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/logo_fgm.png)`,
    backgroundSize: '85%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };

  // Paso 1: Enviar código al correo
  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/enviar-codigo-recuperacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Código enviado a tu correo electrónico');
        setStep(2);
      } else {
        setError(data.error || 'Error al enviar el código');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código y cambiar contraseña
  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verificar-codigo-recuperacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          codigo, 
          newPassword: newPassword,
          confirmPassword: confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Contraseña actualizada exitosamente');
        setTimeout(() => {
          if (onRecoverySuccess) {
            onRecoverySuccess();
          } else {
            onBackToLogin();
          }
        }, 2000);
      } else {
        setError(data.error || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const handleReenviarCodigo = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/enviar-codigo-recuperacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Código reenviado a tu correo electrónico');
      } else {
        setError(data.error || 'Error al reenviar el código');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card">
        <h1>Recuperar Contraseña</h1>
        
        {step === 1 && (
          <form onSubmit={handleEnviarCodigo}>
            <div className="info-message">
              Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>

            <button 
              type="button" 
              className="secondary-button"
              onClick={onBackToLogin}
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCambiarPassword}>
            <div className="info-message">
              Revisa tu correo <strong>{email}</strong> e ingresa el código de verificación (5 dígitos).
            </div>
            
            <div className="form-group">
              <label htmlFor="codigo">Código de Verificación:</label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="12345"
                maxLength="5"
                pattern="\d{5}"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña:</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <small className="password-hint">
                Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>

            <button 
              type="button" 
              className="secondary-button"
              onClick={handleReenviarCodigo}
              disabled={loading}
            >
              Reenviar Código
            </button>

            <button 
              type="button" 
              className="secondary-button"
              onClick={onBackToLogin}
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecuperarPassword;
