import { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import VerificarEmail from './components/VerificarEmail';
import RecuperarPassword from './components/RecuperarPassword';
import Dashboard from './components/Dashboard';
import Perfil from './components/Perfil';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emailToVerify, setEmailToVerify] = useState('');

  // Verificar si hay usuario guardado en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const modoInvitado = localStorage.getItem('modoInvitado');
    const token = localStorage.getItem('token');
    
    if (usuarioGuardado && token) {
      setUsuario(JSON.parse(usuarioGuardado));
      setCurrentPage('dashboard');
    } else if (modoInvitado === 'true') {
      setIsGuest(true);
      setCurrentPage('dashboard');
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (usuarioData) => {
    setUsuario(usuarioData);
    setCurrentPage('dashboard');
  };

  const handleNeedVerification = (email) => {
    setEmailToVerify(email);
    setCurrentPage('verificar-email');
  };

  const handleVerificationSuccess = () => {
    setCurrentPage('login');
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
    <div className="App">
      {currentPage === 'login' && !usuario && !isGuest && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
          onGuestAccess={handleGuestAccess}
          onNeedVerification={handleNeedVerification}
          onForgotPassword={handleForgotPassword}
        />
      )}
      {currentPage === 'register' && !usuario && !isGuest && (
        <Register 
          onSwitchToLogin={handleSwitchToLogin}
          onNeedVerification={handleNeedVerification}
        />
      )}
      {currentPage === 'verificar-email' && (
        <VerificarEmail 
          email={emailToVerify}
          onVerificationSuccess={handleVerificationSuccess}
          onBackToLogin={handleSwitchToLogin}
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
  );
}

export default App;