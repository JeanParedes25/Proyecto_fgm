import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../constants/config';
import VerificarEmail from './VerificarEmail';
import './Auth.css';

function Register({ onSwitchToLogin, onLoginSuccess }) {
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
  const [emailFallo, setEmailFallo] = useState(false);
  const [emailYaExiste, setEmailYaExiste] = useState(false);

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
    setEmailYaExiste(false);
    setLoading(true);

    try {
      console.log('🔄 Enviando solicitud de registro a:', `${API_BASE_URL}/api/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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

      console.log('📥 Respuesta recibida:', response.status, response.statusText);

      const data = await response.json();
      console.log('📦 Datos recibidos:', data);

      if (response.ok) {
        console.log('✅ Registro exitoso');
        setSuccess(data.mensaje);
        setEmailRegistrado(email);
        setEmailFallo(data.emailFallo || false);
        setLoading(false);
        setRegistroExitoso(true);
      } else {
        console.log('❌ Error en registro:', data.error);
        const errorMsg = data.error || 'Error en el registro';
        // Si el email ya está registrado, agregar sugerencia de inicio de sesión
        if (errorMsg.toLowerCase().includes('ya está registrado') || errorMsg.toLowerCase().includes('ya existe')) {
          setError(errorMsg + ' Por favor, inicie sesión.');
          setEmailYaExiste(true);
        } else {
          setError(errorMsg);
          setEmailYaExiste(false);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('💥 Error en catch:', err);
      setError('Error de conexión: ' + err.message);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('🔵 Google signup callback ejecutado');
    setError('');
    setLoading(true);

    try {
      console.log('📤 Enviando token de Google al backend...');
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      console.log('📥 Respuesta backend:', response.status);
      const data = await response.json();
      console.log('📦 Datos:', { token: data.token ? '✅' : '❌', usuario: data.usuario?.email });

      if (response.ok && data.token && data.usuario) {
        console.log('✅ Google signup exitoso, guardando en localStorage...');
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        console.log('💾 Datos guardados en localStorage');
        
        // Ejecutar callback del padre para actualizar estado y redirigir al dashboard
        console.log('🎯 Ejecutando callback de login exitoso...');
        onLoginSuccess(data.usuario);
        
        // El componente padre (App.js) se encargará de cambiar a dashboard
      } else {
        console.error('❌ Error en respuesta:', data);
        setError(data.error || 'Error en el registro con Google');
        setLoading(false);
      }
    } catch (err) {
      console.error('💥 Error en handleGoogleSuccess:', err);
      setError('Error de conexión: ' + err.message);
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('🔴 Error Google OAuth:', error);
    setError('Error al registrarse con Google');
  };

  // Si el registro fue exitoso, mostrar verificación de correo
  if (registroExitoso) {
    return (
      <VerificarEmail
        email={emailRegistrado}
        emailFallo={emailFallo}
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
          {emailYaExiste && (
            <button 
              type="button"
              className="secondary-button"
              onClick={onSwitchToLogin}
              style={{ marginBottom: '10px', width: '100%', backgroundColor: '#c49a6c', color: 'white' }}
            >
              Ir a Iniciar Sesión
            </button>
          )}
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
