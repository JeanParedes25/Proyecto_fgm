import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

function Login({ onLoginSuccess, onSwitchToRegister, onGuestAccess, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/logo_fgm.png)`,
    backgroundSize: '85%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y datos en localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('usuario', JSON.stringify(data.cliente));
        onLoginSuccess(data.cliente);
      } else {
        const errorMsg = data.error || 'Error en el login';
        setError(errorMsg);
        setShowRegisterPrompt(true);
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    setShowRegisterPrompt(false);
    setError('');
    onSwitchToRegister();
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        onLoginSuccess(data.usuario);
      } else {
        setError(data.error || 'Error en el login con Google');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al iniciar sesión con Google');
  };

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card">
        <h1>Inicio de Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group floating-label-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={email ? 'has-value' : ''}
            />
            <label htmlFor="email">✉️ Correo Electrónico</label>
          </div>
          <div className="form-group floating-label-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={password ? 'has-value' : ''}
            />
            <label htmlFor="password">🔒 Contraseña</label>
          </div>
          <div className="show-password-container">
            <input
              type="checkbox"
              id="showPasswordCheck"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="showPasswordCheck">Mostrar contraseña</label>
          </div>
          {error && (
            <div className="error-message">
              {error}
              {showRegisterPrompt && (
                <div className="register-prompt">
                  <p>Parece que no estás registrado aún.</p>
                  <button 
                    type="button"
                    className="register-prompt-btn"
                    onClick={handleRegisterRedirect}
                  >
                    Regístrate aquí
                  </button>
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            locale="es"
          />
        </div>

        <div className="auth-links">
          <button 
            type="button" 
            className="link-button"
            onClick={() => onForgotPassword()}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="auth-cta">
          <button type="button" className="cta-outline" onClick={onSwitchToRegister}>
             Crear cuenta nueva
          </button>
          {onGuestAccess && (
            <button type="button" className="cta-outline secondary" onClick={onGuestAccess}>
               Explorar como invitado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
