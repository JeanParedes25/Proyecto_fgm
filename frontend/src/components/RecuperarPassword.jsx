import { useState } from 'react';
import './Auth.css';

function RecuperarPassword({ onBackToLogin, onRecoverySuccess }) {
  const [step, setStep] = useState(1); // 1: email, 2: código, 3: nueva contraseña
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

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/solicitar-recuperacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Código enviado. Revisa tu correo electrónico');
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Error al solicitar código');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verificar-codigo-recuperacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, codigo })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Código válido. Ahora puedes cambiar tu contraseña');
        setTimeout(() => {
          setStep(3);
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Código inválido');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestablecerPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/restablecer-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, codigo, newPassword, confirmPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Contraseña actualizada exitosamente');
        setTimeout(() => {
          onRecoverySuccess();
        }, 2000);
      } else {
        setError(data.error || 'Error al actualizar contraseña');
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

        {/* Paso 1: Solicitar código */}
        {step === 1 && (
          <>
            <p className="recovery-info">
              Ingrese el correo electrónico con el que realizó su registro. Debe coincidir exactamente.
            </p>
            <form onSubmit={handleSolicitarCodigo}>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  autoFocus
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>
          </>
        )}

        {/* Paso 2: Verificar código */}
        {step === 2 && (
          <>
            <p className="recovery-info">
              Hemos enviado un código de 6 dígitos a: <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerificarCodigo}>
              <div className="form-group">
                <label htmlFor="codigo">Código de Recuperación:</label>
                <input
                  type="text"
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  placeholder="000000"
                  maxLength="6"
                  pattern="\d{6}"
                  autoFocus
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <button type="submit" disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar Código'}
              </button>
            </form>
          </>
        )}

        {/* Paso 3: Nueva contraseña */}
        {step === 3 && (
          <>
            <p className="recovery-info">
              Ingresa tu nueva contraseña
            </p>
            <form onSubmit={handleRestablecerPassword}>
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
                    autoFocus
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
                <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
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
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          </>
        )}

        <div className="auth-links">
          <button 
            type="button" 
            className="link-button"
            onClick={onBackToLogin}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecuperarPassword;
