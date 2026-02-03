// Servicio para obtener datos de la empresa desde la API

import { API_BASE_URL } from '../constants/config';

const API_URL = `${API_BASE_URL}/api/empresa`;

export const obtenerEmpresa = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Error al obtener datos de la empresa');
  }

  const data = await response.json();

  if (data.success && data.empresa) {
    return data.empresa;
  }

  throw new Error('Datos de empresa no disponibles');
};
