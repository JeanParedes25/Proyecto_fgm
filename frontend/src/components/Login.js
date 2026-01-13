import { useState } from 'react';
import './Auth.css';

function Login({ onLoginSuccess, onSwitchToRegister, onGuestAccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        
        // Mostrar prompt de registro si el login falla (excepto errores de conexión)
        // Esto cubre: usuario no encontrado, contraseña incorrecta, email no existe, etc.
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

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card">
        <h1>Inicio de Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
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
                    Crear Cuenta Ahora
                  </button>
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
        <p className="switch-auth">
          ¿No tienes cuenta?{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToRegister}
          >
            Regístrate aquí
          </button>
        </p>
        <div className="guest-access">
          <button 
            type="button" 
            className="guest-button"
            onClick={onGuestAccess}
          >
            🔓 Continuar como Invitado
          </button>
          <p className="guest-info">Acceso limitado a contenido público</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
