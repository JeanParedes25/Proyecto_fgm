/**
 * Construye URL completa para archivos estáticos
 * @param {string} path - Ruta relativa del archivo (ej: '/uploads/servicios/imagen.jpg')
 * @returns {string} URL completa
 */
function buildFullUrl(path) {
  if (!path) return path;
  
  // Si ya es una URL completa, devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Obtener BASE_URL del entorno, con fallback a localhost
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  
  // Asegurar que path empiece con /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
}

/**
 * Convierte URLs relativas a absolutas en un array de fotos
 * @param {Array} fotos - Array de objetos {url, descripcion}
 * @returns {Array} Array con URLs absolutas
 */
function buildFotosUrls(fotos) {
  if (!Array.isArray(fotos)) return fotos;
  
  return fotos.map(foto => ({
    ...foto,
    url: buildFullUrl(foto.url)
  }));
}

module.exports = {
  buildFullUrl,
  buildFotosUrls
};
