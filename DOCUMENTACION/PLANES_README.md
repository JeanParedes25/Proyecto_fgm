# Módulo de Planes Funerarios

## 📋 Descripción
El módulo de Planes Funerarios permite al administrador crear, editar y gestionar planes funerarios que se muestran automáticamente a los usuarios.

## 🗄️ Base de Datos

### Configuración de MongoDB
Los planes se guardan en la base de datos **proyecto_fgm** en MongoDB.

**Colección:** `plans`
**Ubicación:** `mongodb://localhost:27017/proyecto_fgm`

### Estructura de la Colección
Cada plan incluye:
- Información básica (nombre, precio, tipo de cofre, duración)
- Salas incluidas (array)
- Procedimientos (formolización, tanatopraxia)
- Transporte (autocarroza)
- Servicios adicionales (florales, legales, cafetería, etc.)
- Medios digitales (video homenaje, Facebook Live)
- Estados (activo/inactivo, destacado)

## 🚀 Uso

### Para Administradores
1. Iniciar sesión como administrador
2. En el panel de administración, hacer clic en **"📋 Planes Funerarios"**
3. Hacer clic en **"+ Nuevo Plan"**
4. Completar todos los campos del formulario
5. Guardar el plan

**Funciones disponibles:**
- ✅ Crear nuevo plan
- ✏️ Editar plan existente
- 🗑️ Eliminar plan (soft delete)
- ⭐ Destacar/quitar destacado
- 👁️ Ver todos los planes (activos e inactivos)

### Para Usuarios
Los usuarios pueden:
- Ver todos los planes activos
- Comparar precios y servicios
- Ver planes destacados (recomendados)
- Ver detalles completos en modal

## 🔧 Scripts Útiles

### Verificar Planes en la Base de Datos
```bash
cd backend
node src/scripts/verificarPlanes.js
```

Este script muestra:
- Si existe la colección 'plans'
- Cantidad de planes totales, activos y destacados
- Lista completa de planes con su estado

### Crear Planes de Ejemplo
```bash
cd backend
node src/scripts/seedPlanes.js
```

Este script crea 3 planes de ejemplo:
- Plan Económico ($550)
- Plan Básico ($850)
- Plan Completo ($1,500) - ⭐ Destacado

## 🎨 Diseño
Los colores del módulo están sincronizados con el diseño general:
- **Color principal:** #c49a6c (beige/marrón)
- **Color secundario:** #a77c4f
- **Fondo:** rgba(245, 242, 237, 0.95)
- **Bordes:** rgba(196, 154, 108, 0.2)

## 📡 API Endpoints

### Rutas Públicas (usuarios)
- `GET /api/planes` - Obtener todos los planes activos
- `GET /api/planes/:id` - Obtener un plan específico

### Rutas Protegidas (admin) - Requieren autenticación
- `GET /api/planes/admin/todos` - Obtener todos los planes (incluidos inactivos)
- `POST /api/planes` - Crear nuevo plan
- `PUT /api/planes/:id` - Actualizar plan
- `DELETE /api/planes/:id` - Eliminar plan (soft delete)
- `DELETE /api/planes/:id/permanente` - Eliminar permanentemente
- `PATCH /api/planes/:id/destacado` - Cambiar estado destacado

## 🔒 Seguridad
- Las operaciones de creación, edición y eliminación requieren autenticación
- Solo los administradores pueden gestionar planes
- Los usuarios solo pueden ver planes activos
- Los planes eliminados se desactivan (soft delete) en lugar de borrarse

## 📝 Archivos del Módulo

### Backend
- `backend/src/models/plan.js` - Modelo de MongoDB
- `backend/src/controllers/planController.js` - Lógica de negocio
- `backend/src/routes/planes.js` - Definición de rutas
- `backend/src/scripts/verificarPlanes.js` - Script de verificación
- `backend/src/scripts/seedPlanes.js` - Script de datos de prueba

### Frontend
- `frontend/src/components/AdminPlanes.jsx` - Panel de administración
- `frontend/src/components/AdminPlanes.css` - Estilos del panel admin
- `frontend/src/components/PlanesUsuario.jsx` - Vista de usuario
- `frontend/src/components/PlanesUsuario.css` - Estilos vista usuario

## ✨ Características Especiales
- ⭐ Sistema de planes destacados (recomendados)
- 📱 Diseño responsive para móviles
- 🎨 Modal de detalles completos
- 🔄 Actualización automática de la lista
- 💾 Soft delete (no se pierden datos)
- 🎯 Validación de formularios
- 🌟 Efectos visuales y animaciones

## 🐛 Solución de Problemas

### Los planes no aparecen
1. Verificar que el servidor backend esté corriendo: `http://localhost:5000`
2. Verificar conexión a MongoDB
3. Ejecutar `node src/scripts/verificarPlanes.js`

### Error al crear plan
1. Verificar que todos los campos requeridos estén completos
2. Verificar que el token de autenticación sea válido
3. Revisar la consola del navegador para errores

### Los colores no se ven bien
1. Limpiar caché del navegador
2. Verificar que el archivo `AdminPlanes.css` esté actualizado
3. Reiniciar el servidor de desarrollo
