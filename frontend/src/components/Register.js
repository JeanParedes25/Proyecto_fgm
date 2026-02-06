import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import VerificarEmail from './VerificarEmail';
import './Auth.css';

function Register({ onSwitchToLogin }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [emailRegistrado, setEmailRegistrado] = useState('');

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
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          nombre, 
          email, 
          celular, 
          password, 
          confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.mensaje);
        setEmailRegistrado(email);
        setRegistroExitoso(true);
      } else {
        setError(data.error || 'Error en el registro');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
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
        setSuccess('Registrado e iniciando sesión...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.error || 'Error en el registro con Google');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al registrarse con Google');
  };

  // Si el registro fue exitoso, mostrar verificación de correo
  if (registroExitoso) {
    return (
      <VerificarEmail
        email={emailRegistrado}
        onVerificationSuccess={() => {
          onSwitchToLogin();
        }}
        onBackToLogin={onSwitchToLogin}
      />
    );
  }

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card">
        <h1>Registro</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group floating-label-group">
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={nombre ? 'has-value' : ''}
            />
            <label htmlFor="nombre">👤 Nombre Completo</label>
          </div>
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
              type="tel"
              id="celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
              className={celular ? 'has-value' : ''}
            />
            <label htmlFor="celular">📱 Número de Celular</label>
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
          <small className="password-hint">
            Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)
          </small>
          <div className="form-group floating-label-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={confirmPassword ? 'has-value' : ''}
            />
            <label htmlFor="confirmPassword">🔐 Repetir Contraseña</label>
          </div>
          <div className="show-password-container">
            <input
              type="checkbox"
              id="showConfirmPasswordCheck"
              checked={showConfirmPassword}
              onChange={(e) => setShowConfirmPassword(e.target.checked)}
            />
            <label htmlFor="showConfirmPasswordCheck">Mostrar contraseña</label>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
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
            text="signup_with"
            locale="es"
          />
        </div>

        <p className="switch-auth">
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button" 
            className="link-button"
            onClick={onSwitchToLogin}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
