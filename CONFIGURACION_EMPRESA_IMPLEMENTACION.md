# 🏢 IMPLEMENTACIÓN: MÓDULO DE CONFIGURACIÓN DE EMPRESA

**Fecha:** 2 de febrero de 2026  
**Estado:** ✅ COMPLETADO

---

## 📋 RESUMEN DE CAMBIOS

Se implementó un módulo completo de Configuración de Empresa que centraliza todos los datos institucionales y elimina hardcoding en el frontend.

---

## 🗄️ BASE DE DATOS

### Modelo: `Empresa`

**Archivo:** `backend/src/models/empresa.js`

**Campos:**
- `nombreEmpresa` (String) - Nombre de la empresa
- `direccion` (String) - Dirección física
- `telefono` (Array[String]) - Lista de teléfonos
- `correo` (String) - Email de contacto
- `paginaWeb` (String) - Sitio web
- `derechosReservados` (String) - Texto de derechos
- `esUnico` (Boolean) - Garantiza un solo documento
- `fechaActualizacion` (Date) - Última actualización
- `fechaCreacion` (Date) - Fecha de creación

**Datos Iniciales (Seeding):**
```javascript
{
  nombreEmpresa: "Funerales Gonzalo Mendoza",
  direccion: "España 19-31 y Olmedo, Riobamba - Ecuador",
  telefono: ["099 282 9095", "032 944 608", "098 402 1738"],
  correo: "israelmendoza18@hotmail.com",
  paginaWeb: "www.funeralesgonzalomendoza.com",
  derechosReservados: "© Funerales Gonzalo Mendoza. Todos los derechos reservados."
}
```

---

## ⚙️ BACKEND

### Controlador: `empresaController.js`

**Archivos:**
- `backend/src/controllers/empresaController.js`
- `backend/src/routes/empresa.js`

### Endpoints

#### GET `/api/empresa`
- **Acceso:** Público
- **Función:** Obtener información de la empresa
- **Respuesta:**
```json
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
    "fechaActualizacion": "2026-02-02T...",
    "fechaCreacion": "2026-02-02T..."
  }
}
```

#### PUT `/api/empresa`
- **Acceso:** Solo administrador (requiere token JWT)
- **Función:** Actualizar información de la empresa
- **Validaciones:**
  - Solo admin puede editar
  - Campos requeridos: nombreEmpresa, direccion, telefono, correo
  - `telefono` debe ser array
- **Respuesta:**
```json
{
  "success": true,
  "mensaje": "Información de la empresa actualizada correctamente",
  "empresa": { ... }
}
```

---

## 🎨 FRONTEND

### Componentes Creados

#### 1. **AdminEmpresa.jsx**
**Archivo:** `frontend/src/components/AdminEmpresa.jsx`

**Características:**
- ✅ Modo solo lectura por defecto
- ✅ Botón "Editar" para habilitar edición
- ✅ Validaciones de campos
- ✅ Manejo dinámico de teléfonos (agregar/eliminar)
- ✅ Actualización automática de `fechaActualizacion`
- ✅ Mensajes de éxito/error

**Estados:**
- Vista de Lectura: Información organizada en grupos
- Vista de Edición: Formulario con validaciones

#### 2. **Footer.js** (Actualizado)
**Archivo:** `frontend/src/components/Footer.js`

**Cambios:**
- Ahora consume datos de `/api/empresa`
- Genera año actual automáticamente
- Fallback a datos por defecto si hay error
- Renderiza teléfonos dinámicamente

#### 3. **useEmpresa Hook**
**Archivo:** `frontend/src/hooks/useEmpresa.js`

**Funcionalidad:**
- Hook personalizado para obtener datos de la empresa
- Retorna: `{ empresa, loading, error }`
- Ideal para usar en cualquier componente

#### 4. **empresaService.js**
**Archivo:** `frontend/src/services/empresaService.js`

**Características:**
- Servicio centralizado para API
- Sistema de caché (5 minutos)
- Fallback a datos por defecto
- Función `obtenerEmpresa()`
- Función `limpiarCache()`

### Componentes Actualizados

#### 1. **Dashboard.js**
- Agregado import de `AdminEmpresa`
- Nuevo botón: "🏢 Configuración de Empresa"
- Nueva sección en menú admin
- Renderizado de `AdminEmpresa` al seleccionar

#### 2. **Services.jsx**
- Ahora usa hook `useEmpresa`
- Datos de contacto dinámicos desde API
- Sin hardcoding de teléfonos ni emails

---

## 🔌 INTEGRACIÓN CON SERVER

**Archivo:** `backend/src/server.js`

**Cambios:**
1. Importación de rutas de empresa
2. Registro de ruta: `app.use('/api/empresa', empresaRouter)`
3. Ejecución de script de seeding: `seedearEmpresa()`

---

## 📱 PUNTOS DE CONSUMO

Los datos de la empresa se consumen en:

### ✅ IMPLEMENTADOS:
1. ✅ **Footer Global** - Todos los teléfonos, email, nombre, derechos
2. ✅ **Componente AdminEmpresa** - Panel de administración
3. ✅ **Services.jsx** - Información de contacto en servicio

### 📌 RECOMENDADOS (para futuras actualizaciones):
- Floristerias.jsx
- ObituariosPublicos.jsx
- Perfil.jsx
- Cualquier componente que muestre información de contacto

---

## 🚀 CARACTERÍSTICAS

### ✅ Implementadas:

1. **Base de Datos Única**
   - Un solo documento garantizado con `esUnico: true`
   - Índice único en MongoDB

2. **Seeding Automático**
   - Se ejecuta al iniciar el servidor
   - Crea documento si no existe
   - Datos por defecto listos

3. **API RESTful**
   - GET público para obtener datos
   - PUT protegido solo para admin
   - Validaciones robustas

4. **Panel de Administrador**
   - Modo lectura seguro por defecto
   - Edición con botón explícito
   - Validación de campos
   - Manejo de teléfonos dinámico

5. **Servicio Frontend**
   - Caché de 5 minutos
   - Fallback a datos por defecto
   - Hook reutilizable

6. **Sin Hardcoding**
   - Footer dinámico
   - Contacto en Services dinámico
   - Fácil de mantener y actualizar

---

## 🔐 RESTRICCIONES APLICADAS

✅ No editar al entrar  
✅ No duplicar registros  
✅ No usar datos fijos en frontend  
✅ Todo se lee desde MongoDB  
✅ Solo admin puede editar  
✅ Validación de campos completa  

---

## 📝 ARCHIVO DE SEEDING

**Archivo:** `backend/src/scripts/seedEmpresa.js`

Verifica si existe empresa en BD:
- Si existe: No hace nada
- Si no existe: Inserta documento con datos por defecto

---

## 🧪 PRUEBA RÁPIDA

### 1. Backend
```bash
cd backend
npm start
# Verifica en consola: "✅ Datos de empresa insertados correctamente"
```

### 2. Frontend - GET Empresa
```bash
curl http://localhost:5000/api/empresa
```

### 3. Frontend - Panel Admin
- Ir a Dashboard → 🏢 Configuración de Empresa
- Verificar datos en modo lectura
- Click "Editar" para habilitar formulario
- Modificar datos y guardar

---

## 📂 ESTRUCTURA DE ARCHIVOS NUEVOS

```
backend/
├── src/
│   ├── models/
│   │   └── empresa.js ✨ NUEVO
│   ├── controllers/
│   │   └── empresaController.js ✨ NUEVO
│   ├── routes/
│   │   └── empresa.js ✨ NUEVO
│   └── scripts/
│       └── seedEmpresa.js ✨ NUEVO

frontend/
├── src/
│   ├── components/
│   │   ├── AdminEmpresa.jsx ✨ NUEVO
│   │   ├── AdminEmpresa.css ✨ NUEVO
│   │   ├── Footer.js ✏️ ACTUALIZADO
│   │   ├── Services.jsx ✏️ ACTUALIZADO
│   │   └── Dashboard.js ✏️ ACTUALIZADO
│   ├── hooks/
│   │   └── useEmpresa.js ✨ NUEVO
│   └── services/
│       └── empresaService.js ✨ NUEVO
```

---

## 🔄 FLUJO DE DATOS

```
Backend:
MongoDB (empresa collection)
    ↓
empresaController (GET/PUT)
    ↓
API: /api/empresa

Frontend:
empresaService.js (caché + fetch)
    ↓
useEmpresa hook
    ↓
Componentes (Footer, AdminEmpresa, Services, etc.)
```

---

## ✨ PRÓXIMAS MEJORAS (Opcionales)

1. Agregar validación de email en backend
2. Agregar búsqueda de teléfonos en dashboard
3. Historial de cambios de empresa
4. Exportar configuración a PDF
5. Multi-idioma para derechosReservados

---

## 📌 NOTAS IMPORTANTES

- El caché de 5 minutos en `empresaService.js` evita llamadas excesivas
- Los datos por defecto en Frontend son idénticos a los del seeding
- El hook `useEmpresa` es reutilizable en cualquier componente
- El sistema garantiza que solo exista un documento de empresa
- Admin solo puede editar, no eliminar la empresa

---

**Implementación completada exitosamente** ✅
