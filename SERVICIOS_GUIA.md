# 🎁 GESTIÓN DE SERVICIOS EXEQUIALES - GUÍA RÁPIDA

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de gestión de servicios exequiales que permite al administrador editar, crear y eliminar servicios que se reflejan automáticamente en el panel del usuario.

## 🔐 Acceso al Panel de Administración

**Email:** israelmendoza18@hotmail.com  
**Contraseña:** admin123

---

## 📊 Nuevas Características Implementadas

### 1. **Backend - API REST de Servicios**

#### Endpoints disponibles:

- **GET** `/api/servicios` - Obtener todos los servicios activos (público)
- **GET** `/api/servicios/:id` - Obtener un servicio específico (público)
- **POST** `/api/servicios` - Crear nuevo servicio (requiere autenticación)
- **PUT** `/api/servicios/:id` - Actualizar servicio (requiere autenticación)
- **DELETE** `/api/servicios/:id` - Eliminar servicio (requiere autenticación)

#### Archivos creados/modificados:

- ✅ `backend/src/models/servicio.js` - Modelo de base de datos
- ✅ `backend/src/controllers/servicioController.js` - Controlador de servicios
- ✅ `backend/src/routes/servicios.js` - Rutas de la API
- ✅ `backend/src/server.js` - Integración de rutas
- ✅ `backend/src/scripts/initServicios.js` - Script de inicialización

### 2. **Frontend - Componente Administrativo**

#### Nuevo Componente: `AdminServicios.jsx`

El administrador puede:

✅ **Ver todos los servicios** con información resumida  
✅ **Crear nuevos servicios** con formulario completo  
✅ **Editar servicios existentes** con validaciones  
✅ **Eliminar servicios** con confirmación de seguridad  

#### Formulario incluye campos para:

- 📝 Nombre del servicio
- 😊 Icono (emoji)
- 🎨 Color de identificación (selector de color)
- 📄 Descripción corta
- 💬 Introducción/descripción general
- 📍 Salas de velación (array dinámico)
- 👥 Capacidad
- ✓ Lista de servicios incluidos (array dinámico)
- ⭐ Servicios adicionales (array dinámico)
- 💎 Valores agregados sin costo (array dinámico)
- 🏢 Servicios extra incluidos (array dinámico)
- 🚗 Opción de marcar como servicio de transporte

#### Archivos creados/modificados:

- ✅ `frontend/src/components/AdminServicios.jsx` - Componente principal
- ✅ `frontend/src/components/AdminServicios.css` - Estilos
- ✅ `frontend/src/components/Dashboard.js` - Integración en panel admin

### 3. **Frontend - Componente de Usuario**

#### Modificaciones en `Services.jsx`

- ✅ Ahora trae servicios desde la API de MongoDB
- ✅ Muestra servicios por defecto si la BD está vacía
- ✅ Interfaz dinámica basada en datos
- ✅ Refleja cambios en tiempo real cuando el admin edita servicios

---

## 🚀 Cómo Usar el Sistema

### Para el Administrador:

1. **Inicia sesión** en el panel de administración
2. **Haz clic en "🎁 Servicios"** en la navegación principal
3. **Crea, edita o elimina servicios** usando el formulario

#### Ejemplo de Creación:

```
Nombre: Servicio Exequial Estándar
Icono: ⚱️
Color: #c49a6c
Descripción: Servicio completo y accesible
Introducción: [Tu texto de introducción]
Salas: Sala A, Sala B, Sala C
...
```

### Para el Usuario:

1. **Inicia sesión** normalmente
2. **Haz clic en "🕊️ Servicios Exequiales"** en el panel de usuario
3. **Visualiza los servicios** que el administrador ha creado
4. **Haz clic en cada servicio** para ver los detalles completos

---

## 📊 Estructura de Datos - Modelo Servicio

```javascript
{
  nombre: String (requerido, único),
  icono: String (requerido),
  color: String (requerido, código hex),
  descripcion: String,
  introduccion: String (requerido),
  includes: [String], // Array de servicios incluidos
  additional: [String], // Servicios adicionales
  noChargeServices: [String], // Sin costo extra
  extraServices: [String], // Servicios incluidos extras
  halls: [String], // Salas de velación
  capacity: String,
  isTransport: Boolean, // Para servicios de transporte
  activo: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Flujo de Sincronización

```
Admin edita servicio en BD
        ↓
API actualiza MongoDB
        ↓
Usuario ve cambios en tiempo real
(al recargar la página o navegar a servicios)
```

---

## ✨ Servicios Inicializados por Defecto

El sistema viene con **3 servicios preconfigurados**:

1. ⚱️ **Servicio Exequial Estándar** - Servicio completo y accesible
2. 👑 **Servicio Exequial VIP Premium** - Moderna sala de velación con servicios premium
3. 🚗 **Servicio de Transporte** - Modernas unidades móviles

Puedes editar estos servicios o crear nuevos en cualquier momento.

---

## 🛠️ Troubleshooting

### Los servicios no aparecen en el frontend:

1. Verifica que el servidor backend está corriendo en `http://localhost:5000`
2. Ejecuta el script de inicialización: `node backend/src/scripts/initServicios.js`
3. Recarga la página en el navegador (Ctrl+F5)

### El botón de Servicios no aparece en el admin:

1. Verifica que iniciaste sesión con el email: `israelmendoza18@hotmail.com`
2. Recarga la página del dashboard

### Los cambios del admin no se reflejan en el usuario:

1. Recarga la página de servicios del usuario (Ctrl+F5)
2. Verifica que la API está respondiendo correctamente

---

## 📝 Notas Importantes

- Todos los campos con asterisco (*) son requeridos
- Los nombres de servicios deben ser únicos
- Los arrays dinámicos permiten agregar múltiples elementos
- Los cambios son inmediatos en la base de datos
- El sistema tiene validación en cliente y servidor

---

## 🎉 ¡Sistema Listo para Usar!

El panel de administración está completamente funcional y permite gestionar todos los servicios exequiales de forma sencilla e intuitiva.

**Última actualización:** 13 de Enero de 2026
