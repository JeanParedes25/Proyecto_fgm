import { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario guardado en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
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
    setUsuario(null);
    setCurrentPage('login');
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
      {currentPage === 'login' && !usuario && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
      {currentPage === 'register' && !usuario && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      {usuario && currentPage === 'dashboard' && (
        <Dashboard 
          usuario={usuario}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;