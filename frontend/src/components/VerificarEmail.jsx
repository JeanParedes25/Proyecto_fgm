import { useState } from 'react';
import './Auth.css';
import { API_BASE_URL } from '../constants/config';

function VerificarEmail({ email, emailFallo = false, onVerificationSuccess, onBackToLogin }) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [falloEmail, setFalloEmail] = useState(emailFallo);
  const [skipVerification, setSkipVerification] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/api/auth/verificar-codigo-correo`, {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/reenviar-codigo-verificacion`, {
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
        
        {falloEmail && (
          <div className="warning-message" style={{ marginBottom: '20px', color: '#f39c12', backgroundColor: '#fff3cd', padding: '12px', borderRadius: '6px', border: '1px solid #f39c12' }}>
            ⚠️ El código de verificación no se envió correctamente a tu correo. Puedes reintentarlo o continuar sin verificación por ahora.
          </div>
        )}
        
        {!skipVerification ? (
          <>
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
                onClick={() => setSkipVerification(true)}
              >
                Continuar sin Verificación
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="success-message" style={{ marginBottom: '20px' }}>
              ✅ Registro completado exitosamente
            </div>
            <p>Tu cuenta ha sido creada. Puedes iniciar sesión con tus credenciales.</p>
            <button 
              type="button"
              className="primary-button"
              onClick={onBackToLogin}
              style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#c49a6c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerificarEmail;
