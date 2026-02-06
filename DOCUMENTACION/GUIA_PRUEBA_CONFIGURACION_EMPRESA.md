/**
 * GUÍA DE PRUEBA: MÓDULO DE CONFIGURACIÓN DE EMPRESA
 * 
 * Esta guía te ayudará a verificar que todos los componentes funcionan correctamente
 */

// ============================================
// 1. PRUEBA DEL BACKEND
// ============================================

/**
 * PASO 1: Verificar Seeding
 * 
 * Al iniciar el servidor (npm start), deberías ver en la consola:
 * ✅ La empresa ya existe en la base de datos
 * O
 * ✅ Datos de empresa insertados correctamente
 * 
 * Esto indica que los datos iniciales se cargaron correctamente
 */

// ============================================
// 2. PRUEBA DE ENDPOINTS
// ============================================

/**
 * PRUEBA 1: GET /api/empresa (Obtener datos)
 * 
 * URL: http://localhost:5000/api/empresa
 * Método: GET
 * Headers: Ninguno requerido (acceso público)
 * 
 * Respuesta esperada:
 */
{
  "success": true,
  "empresa": {
    "_id": "...",
    "nombreEmpresa": "Funerales Gonzalo Mendoza",
    "direccion": "España 19-31 y Olmedo, Riobamba - Ecuador",
    "telefono": ["099 282 9095", "032 944 608", "098 402 1738"],
    "correo": "israelmendoza18@hotmail.com",
    "paginaWeb": "www.funeralesgonzalomendoza.com",
    "derechosReservados": "© Funerales Gonzalo Mendoza. Todos los derechos reservados.",
    "esUnico": true,
    "fechaActualizacion": "2026-02-02T...",
    "fechaCreacion": "2026-02-02T..."
  }
}

/**
 * PRUEBA 2: PUT /api/empresa (Actualizar datos - Solo Admin)
 * 
 * URL: http://localhost:5000/api/empresa
 * Método: PUT
 * Headers: 
 *   - Content-Type: application/json
 *   - Authorization: Bearer <token_admin>
 * 
 * Body:
 */
{
  "nombreEmpresa": "Funerales Gonzalo Mendoza",
  "direccion": "España 19-31 y Olmedo, Riobamba - Ecuador",
  "telefono": ["099 282 9095", "032 944 608", "098 402 1738"],
  "correo": "israelmendoza18@hotmail.com",
  "paginaWeb": "www.funeralesgonzalomendoza.com",
  "derechosReservados": "© Funerales Gonzalo Mendoza. Todos los derechos reservados."
}

/**
 * Respuesta esperada:
 */
{
  "success": true,
  "mensaje": "Información de la empresa actualizada correctamente",
  "empresa": { ... }
}

// ============================================
// 3. PRUEBA DEL FOOTER
// ============================================

/**
 * PASO 1: Abre cualquier página con Footer
 * - Dashboard
 * - Servicios
 * - Obituarios
 * 
 * PASO 2: Verifica que el Footer muestre:
 * ✅ Nombre: "Funerales Gonzalo Mendoza"
 * ✅ Dirección: "España 19-31 y Olmedo, Riobamba - Ecuador"
 * ✅ Teléfonos clicables: 099 282 9095, 032 944 608, 098 402 1738
 * ✅ Email clicable: israelmendoza18@hotmail.com
 * ✅ Página web clicable: www.funeralesgonzalomendoza.com
 * ✅ Año actual en derechos: © 2026 Funerales Gonzalo Mendoza
 * 
 * PASO 3: Prueba los enlaces
 * - Click en teléfono: Debe abrir llamada
 * - Click en email: Debe abrir cliente de email
 * - Click en web: Debe abrir en navegador
 */

// ============================================
// 4. PRUEBA DEL PANEL ADMIN
// ============================================

/**
 * PASO 1: Iniciar sesión como administrador
 * Email: israelmendoza18@hotmail.com
 * Password: (tu contraseña admin)
 * 
 * PASO 2: Navegar a "🏢 Configuración de Empresa"
 * 
 * PASO 3: Verificar modo lectura (por defecto)
 * ✅ Todos los campos deben estar en modo lectura (no editables)
 * ✅ Se debe mostrar un botón "✏️ Editar"
 * ✅ Se debe mostrar "Última Actualización: ..." con la fecha
 * 
 * PASO 4: Click en "✏️ Editar"
 * ✅ Los campos deben habilitarse para edición
 * ✅ Se debe mostrar un formulario con validación
 * ✅ Se deben mostrar botones:
 *    - "💾 Guardar cambios"
 *    - "❌ Cancelar"
 * 
 * PASO 5: Modificar un campo y guardar
 * Ejemplo: Cambiar nombre a "Funerales Gonzalo Mendoza - Modificado"
 * ✅ Debe aparecer mensaje verde: "Información de la empresa actualizada correctamente"
 * ✅ El componente debe volver a modo lectura
 * ✅ El cambio debe persistir (recargar página)
 * ✅ "Última Actualización" debe actualizarse
 * 
 * PASO 6: Probar edición de teléfonos
 * ✅ Click "➕ Agregar teléfono" para agregar más
 * ✅ Click "✕" para eliminar un teléfono
 * ✅ Validación: No puede dejar teléfono vacío
 * 
 * PASO 7: Cancelar edición
 * ✅ Si hay cambios sin guardar, click "❌ Cancelar"
 * ✅ Los cambios se deben descartar
 * ✅ Volver a modo lectura
 */

// ============================================
// 5. PRUEBA DE SERVICIOS (COMPONENTS)
// ============================================

/**
 * PASO 1: Ir a "Servicios" desde el dashboard
 * 
 * PASO 2: Seleccionar un servicio para ver detalles
 * 
 * PASO 3: Verificar sección "¿Desea más información?"
 * ✅ Debe mostrar teléfonos desde BD (NO hardcodeados)
 * ✅ Debe mostrar email desde BD (NO hardcodeados)
 * ✅ Datos deben coincidir con los del Footer
 * ✅ Botón "📱 Contáctanos Ahora" debe funcionar (abrir WhatsApp)
 */

// ============================================
// 6. VERIFICACIÓN DE BASES DE DATOS
// ============================================

/**
 * En MongoDB Compass o CLI:
 * 
 * Database: proyecto_fgm
 * Collection: empresas
 * 
 * Documento esperado:
 * - _id: ObjectId
 * - nombreEmpresa: string
 * - direccion: string
 * - telefono: array of strings
 * - correo: string
 * - paginaWeb: string
 * - derechosReservados: string
 * - esUnico: true
 * - fechaActualizacion: Date
 * - fechaCreacion: Date
 * 
 * Debe haber EXACTAMENTE UN documento en la colección
 */

// ============================================
// 7. PRUEBAS DE ERROR (Casos Negativos)
// ============================================

/**
 * PRUEBA 1: Usuario no admin intenta editar
 * - Debe recibir error 403 "No tienes permisos"
 * 
 * PRUEBA 2: Faltan campos obligatorios en PUT
 * - Debe recibir error 400 "Los campos ... son requeridos"
 * 
 * PRUEBA 3: Teléfono no es array
 * - Debe recibir error 400 "El campo telefono debe ser un array"
 * 
 * PRUEBA 4: Sin token en PUT
 * - Debe recibir error 401 "Acceso no autorizado"
 */

// ============================================
// 8. CHECKLIST FINAL
// ============================================

/**
 * ✅ Seeding automático al iniciar servidor
 * ✅ GET /api/empresa funciona (público)
 * ✅ PUT /api/empresa funciona (solo admin)
 * ✅ Footer muestra datos dinámicos
 * ✅ Panel admin existe y es accesible
 * ✅ Modo lectura por defecto
 * ✅ Botón "Editar" funciona
 * ✅ Edición con validación funciona
 * ✅ Guardar cambios actualiza BD
 * ✅ fechaActualizacion se actualiza
 * ✅ Manejo de teléfonos dinámicos funciona
 * ✅ Services muestra datos dinámicos
 * ✅ Sin datos hardcodeados en frontend
 * ✅ Caché de 5 minutos funciona
 * ✅ Fallback a datos por defecto si hay error
 * ✅ Mensajes de éxito/error se muestran
 * ✅ Un solo documento en BD garantizado
 */

// ============================================
// 9. COMANDOS ÚTILES PARA PRUEBAS
// ============================================

// Obtener empresa via curl
curl http://localhost:5000/api/empresa

// Actualizar empresa via curl (requiere token)
curl -X PUT http://localhost:5000/api/empresa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -d '{
    "nombreEmpresa": "Funerales Gonzalo Mendoza",
    "direccion": "España 19-31 y Olmedo, Riobamba - Ecuador",
    "telefono": ["099 282 9095", "032 944 608", "098 402 1738"],
    "correo": "israelmendoza18@hotmail.com",
    "paginaWeb": "www.funeralesgonzalomendoza.com",
    "derechosReservados": "© Funerales Gonzalo Mendoza. Todos los derechos reservados."
  }'

// Ver colección empresa en MongoDB
db.empresas.find()

// Contar documentos
db.empresas.countDocuments()

// Actualizar manualmente en MongoDB
db.empresas.updateOne(
  { esUnico: true },
  { $set: { nombreEmpresa: "Nuevo Nombre" } }
)
