import { useState } from 'react';
import './Auth.css';

function Login({ onLoginSuccess, onSwitchToRegister, onGuestAccess, onNeedVerification, onForgotPassword }) {
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
        
        // Si necesita verificación, redirigir
        if (data.needsVerification) {
          setTimeout(() => {
            onNeedVerification(email);
          }, 2000);
        } else {
          setShowRegisterPrompt(true);
        }
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

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card">
        <h1>Inicio de Sesión</h1>
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        <div className="auth-links">
          <button 
            type="button" 
            className="link-button"
            onClick={() => onForgotPassword()}
          >
            ¿Olvidaste tu contraseña?
          </button>
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToRegister}
          >
            ¿No tienes cuenta? Regístrate
          </button>
          {onGuestAccess && (
            <button 
              type="button" 
              className="link-button guest-link"
              onClick={onGuestAccess}
            >
              Continuar como invitado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
