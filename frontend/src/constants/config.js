// Constantes de configuración de la aplicación

export const WHATSAPP_NUMBER = '593999090860';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const EMPRESA_INFO = {
  nombre: 'Funerales Gonzalo Mendoza',
  telefonos: {
    celular1: '099 28 29 095',
    celular2: '099 90 90 860',
    oficina: '032 944 608'
  },
  email: 'israelmendoza18@hotmail.com',
  direccion: 'España y Olmedo, Riobamba, Ecuador'
};

export const API_BASE_URL = 'http://localhost:5000';

export const buildWhatsAppUrl = () => `https://wa.me/${WHATSAPP_NUMBER}`;
