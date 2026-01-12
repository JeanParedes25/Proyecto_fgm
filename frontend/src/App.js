import { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario guardado en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const modoInvitado = localStorage.getItem('modoInvitado');
    
    if (usuarioGuardado) {
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

  const handleRegisterSuccess = (usuarioData) => {
    setUsuario(usuarioData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
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
        />
      )}
      {currentPage === 'register' && !usuario && !isGuest && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      {(usuario || isGuest) && currentPage === 'dashboard' && (
        <Dashboard 
          usuario={usuario}
          isGuest={isGuest}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;