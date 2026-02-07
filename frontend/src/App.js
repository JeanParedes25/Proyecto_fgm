import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Register from './components/Register';
import RecuperarPassword from './components/RecuperarPassword';
import Dashboard from './components/Dashboard';
import Perfil from './components/Perfil';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión desde localStorage al iniciar la app
  useEffect(() => {
    console.log('🔄 [App] Verificando sesión guardada...');
    
    const usuarioGuardado = localStorage.getItem('usuario');
    const modoInvitado = localStorage.getItem('modoInvitado');
    const token = localStorage.getItem('token');
    
    if (usuarioGuardado && token) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        console.log('✅ [App] Sesión encontrada para:', usuarioData.email);
        setUsuario(usuarioData);
        setCurrentPage('dashboard');
      } catch (err) {
        console.error('❌ [App] Error al parsear usuario guardado:', err);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }
    } else if (modoInvitado === 'true') {
      console.log('👤 [App] Sesión de invitado detectada');
      setIsGuest(true);
      setCurrentPage('dashboard');
    } else {
      console.log('🔐 [App] No hay sesión guardada, mostrando login');
    }
    
    setLoading(false);
  }, []);

  const handleLoginSuccess = (usuarioData) => {
    console.log('✅ Login exitoso:', usuarioData.email);
    setUsuario(usuarioData);
    setCurrentPage('dashboard');
    // Scroll a top para mejor UX
    window.scrollTo(0, 0);
  };

  const handleForgotPassword = () => {
    setCurrentPage('recuperar-password');
  };

  const handleRecoverySuccess = () => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('modoInvitado');
    setUsuario(null);
    setIsGuest(false);
    setCurrentPage('login');
  };

  const handleGuestAccess = () => {
    localStorage.setItem('modoInvitado', 'true');
    setIsGuest(true);
    setCurrentPage('dashboard');
  };

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  const handleGoToPerfil = () => {
    setCurrentPage('perfil');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <GoogleOAuthProvider clientId="60783193197-6k6ssrnefi3bfav9em1ov04i9aspekvk.apps.googleusercontent.com">
      <div className="App">
        {currentPage === 'login' && !usuario && !isGuest && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
            onGuestAccess={handleGuestAccess}
            onForgotPassword={handleForgotPassword}
          />
        )}
        {currentPage === 'register' && !usuario && !isGuest && (
          <Register 
            onSwitchToLogin={handleSwitchToLogin}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        {currentPage === 'recuperar-password' && (
          <RecuperarPassword 
            onBackToLogin={handleSwitchToLogin}
            onRecoverySuccess={handleRecoverySuccess}
          />
        )}
        {currentPage === 'perfil' && usuario && (
          <Perfil 
            usuario={usuario}
            onLogout={handleLogout}
            onBack={handleBackToDashboard}
          />
        )}
        {(usuario || isGuest) && currentPage === 'dashboard' && (
          <Dashboard 
            usuario={usuario}
            isGuest={isGuest}
            onLogout={handleLogout}
            onGoToPerfil={handleGoToPerfil}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;