import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants/config';

function AsistenciaExequial({ onVolver }) {
  const [seguro, setSeguro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeguro();
  }, []);

  const fetchSeguro = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/seguros/exequial`);
      if (res.ok) {
        const data = await res.json();
        setSeguro(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>;
  }

  if (!seguro) {
    return (
      <div style={{ padding: '20px' }}>
        <p>No se pudo cargar la información</p>
        <button onClick={onVolver} style={{ padding: '10px 20px', cursor: 'pointer' }}>← Volver</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button onClick={onVolver} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer' }}>
        ← Volver
      </button>

      <h1>🕊️ {seguro.titulo}</h1>
      <h2 style={{ color: '#c49a6c', fontSize: '24px' }}>Precio: ${seguro.precio}/mes</h2>

      <h3 style={{ marginTop: '30px', borderBottom: '2px solid #c49a6c', paddingBottom: '10px' }}>Descripción:</h3>
      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>{seguro.descripcion}</p>

      {seguro.caracteristicas && seguro.caracteristicas.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px', borderBottom: '2px solid #c49a6c', paddingBottom: '10px' }}>📋 Características:</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {seguro.caracteristicas.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {seguro.coberturas && seguro.coberturas.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px', borderBottom: '2px solid #c49a6c', paddingBottom: '10px' }}>🏥 Coberturas:</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {seguro.coberturas.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </>
      )}

      {seguro.requisitos && seguro.requisitos.length > 0 && (
        <>
          <h3 style={{ marginTop: '30px', borderBottom: '2px solid #c49a6c', paddingBottom: '10px' }}>✅ Requisitos:</h3>
          <ul style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {seguro.requisitos.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}

      <button 
        onClick={onVolver}
        style={{ 
          marginTop: '40px', 
          padding: '12px 30px', 
          cursor: 'pointer',
          backgroundColor: '#c49a6c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        ← Volver
      </button>
    </div>
  );
}

export default AsistenciaExequial;
