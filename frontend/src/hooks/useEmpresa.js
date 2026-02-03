import { useState, useEffect } from 'react';
import { obtenerEmpresa } from '../services/empresaService';

/**
 * Hook personalizado para obtener datos de la empresa
 * Retorna los datos de la empresa y un estado de carga
 */
export const useEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        setLoading(true);
        const datosEmpresa = await obtenerEmpresa();
        setEmpresa(datosEmpresa);
        setError(null);
      } catch (err) {
        console.error('Error al cargar empresa:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresa();
  }, []);

  return { empresa, loading, error };
};
