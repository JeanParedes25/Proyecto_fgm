// PRUEBAS DE IMÁGENES - SERVICIOS Y FLORISTERÍAS
// Ejecutar en la consola del navegador en admin panel

/**
 * PRUEBA 1: Verificar que las URLs se construyen correctamente
 */
async function pruebaObtenerServicios() {
  console.log('🧪 Prueba 1: Obtener servicios con URLs de imágenes');
  try {
    const response = await fetch('http://localhost:5000/api/servicios', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    console.log('✅ Servicios obtenidos:', data);
    
    data.servicios?.forEach((s, i) => {
      console.log(`  Servicio ${i + 1}: ${s.nombre}`);
      if (s.fotos && s.fotos.length > 0) {
        s.fotos.forEach((f, j) => {
          console.log(`    Foto ${j + 1}: ${f.url} (${f.descripcion || 'sin desc'})`);
        });
      }
    });
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

/**
 * PRUEBA 2: Verificar que las URLs de floristerías funcionan
 */
async function pruebaObtenerFlores() {
  console.log('🧪 Prueba 2: Obtener flores con URLs de imágenes');
  try {
    const response = await fetch('http://localhost:5000/api/floristerias', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    console.log('✅ Flores obtenidas:', data);
    
    data.flores?.forEach((f, i) => {
      console.log(`  Flor ${i + 1}: ${f.codigo}`);
      if (f.fotos && f.fotos.length > 0) {
        f.fotos.forEach((foto, j) => {
          console.log(`    Foto ${j + 1}: ${foto.url} (${foto.descripcion || 'sin desc'})`);
        });
      }
    });
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

/**
 * PRUEBA 3: Verificar que la imagen se descarga desde el servidor
 */
async function pruebaDescargarImagen(fotoUrl) {
  console.log(`🧪 Prueba 3: Descargar imagen desde ${fotoUrl}`);
  try {
    const response = await fetch(fotoUrl);
    if (response.ok) {
      console.log(`✅ Imagen disponible: ${response.status} ${response.statusText}`);
      console.log(`   Tipo: ${response.headers.get('content-type')}`);
    } else {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
    }
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

/**
 * PRUEBA 4: Verificar capacidades de upload
 */
async function pruebaCrearServicioConFoto() {
  console.log('🧪 Prueba 4: Crear servicio con foto de prueba');
  
  // Crear una imagen de prueba (1x1 pixel JPG en base64)
  const jpgBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';
  
  const blob = new Blob([atob(jpgBase64)], { type: 'image/jpeg' });
  const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
  
  const formData = new FormData();
  formData.append('nombre', 'Servicio de Prueba');
  formData.append('descripcion', 'Este es un servicio de prueba de imágenes');
  formData.append('precio', '100.00');
  formData.append('activo', 'true');
  formData.append('fotos[]', file);
  formData.append('fotoMeta[0][descripcion]', 'Foto de prueba');
  
  try {
    const response = await fetch('http://localhost:5000/api/servicios', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Servicio creado exitosamente:');
      console.log('   ID:', data.servicio._id);
      console.log('   Fotos:', data.servicio.fotos);
    } else {
      console.error('❌ Error:', data.mensaje);
    }
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

// Ejecutar pruebas
console.log('╔══════════════════════════════════════════════════╗');
console.log('║   PRUEBAS DE IMÁGENES - SERVICIOS Y FLORISTERÍAS   ║');
console.log('╚══════════════════════════════════════════════════╝\n');

console.log('📋 Comandos disponibles:');
console.log('  • pruebaObtenerServicios()     - Obtener servicios con fotos');
console.log('  • pruebaObtenerFlores()        - Obtener flores con fotos');
console.log('  • pruebaDescargarImagen(url)   - Descargar una imagen');
console.log('  • pruebaCrearServicioConFoto() - Crear servicio de prueba\n');

console.log('Ejecuta los comandos uno a uno en la consola:');
console.log('  > pruebaObtenerServicios()');
console.log('  > pruebaObtenerFlores()');
console.log('  > pruebaCrearServicioConFoto()\n');
