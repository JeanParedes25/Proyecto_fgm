import { useState } from 'react';
import './Auth.css';

function VerificarEmail({ email, onVerificationSuccess, onBackToLogin }) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

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
      const response = await fetch('http://localhost:5000/api/auth/verificar-codigo-correo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, codigo })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.mensaje);
        setTimeout(() => {
          onVerificationSuccess();
        }, 2000);
      } else {
        setError(data.error || 'Error en la verificación');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reenviar-codigo-verificacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Código reenviado exitosamente. Revisa tu correo');
      } else {
        setError(data.error || 'Error al reenviar código');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container" style={containerStyle}>
      <div className="auth-card">
        <h1>Verificar Email</h1>
        <p className="verification-info">
          Hemos enviado un código de verificación de 5 dígitos a:
          <br />
          <strong>{email}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="codigo">Código de Verificación:</label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              placeholder="00000"
              maxLength="5"
              pattern="\d{5}"
              autoFocus
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
          <button 
            type="button"
            className="secondary-button"
            onClick={handleReenviarCodigo}
            disabled={resending}
          >
            {resending ? 'Reenviando...' : 'Reenviar Código'}
          </button>
          <button 
            type="button" 
            className="secondary-button"
            onClick={onBackToLogin}
          >
            Volver al Inicio
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerificarEmail;
