# 📊 ARQUITECTURA: MÓDULO DE CONFIGURACIÓN DE EMPRESA

## 🏗️ DIAGRAMA DE FLUJO

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                           │
└────┬────────────────────────────────────────────────────────────┘
     │
     ├─────────────────────────────────────────────────────────────┐
     │                                                             │
     ▼                                                             ▼
┌──────────────────┐                              ┌───────────────────────┐
│ Usuario Normal   │                              │  Administrador        │
│ (Ver datos)      │                              │  (Ver + Editar)       │
└────────┬─────────┘                              └───────────┬───────────┘
         │                                                    │
         │                                                    │
    ┌────▼────────────────────────────────────────────────────┴────┐
    │                   FRONTEND (React)                            │
    │                                                                │
    │  ┌────────────────────┐         ┌───────────────────────┐   │
    │  │ Footer.js          │         │ AdminEmpresa.jsx      │   │
    │  │ (Dinámico)         │         │ (Lectura + Edición)   │   │
    │  │                    │         │                       │   │
    │  │ - Teléfonos        │         │ - Form validado       │   │
    │  │ - Email            │         │ - Editar/Guardar      │   │
    │  │ - Dirección        │         │ - Cancelar            │   │
    │  │ - Página web       │         │ - Teléfono dinámico   │   │
    │  │ - Derechos         │         │                       │   │
    │  └────────────────────┘         │ - Mensaje éxito/error │   │
    │                                 └───────────────────────┘   │
    │                                                                │
    │  ┌────────────────────┐         ┌───────────────────────┐   │
    │  │ Services.jsx       │         │ useEmpresa Hook       │   │
    │  │ (Dinámico)         │         │ (Reutilizable)        │   │
    │  │                    │         │                       │   │
    │  │ - Teléfonos        │         │ - Obtiene datos       │   │
    │  │ - Email            │         │ - Loading state       │   │
    │  │ - Contacto         │         │ - Error handling      │   │
    │  └────────────────────┘         └───────────────────────┘   │
    │                                                                │
    │  ┌──────────────────────────────────────────────────────┐   │
    │  │ empresaService.js (Capa de Servicios)               │   │
    │  │                                                      │   │
    │  │ - obtenerEmpresa() → API                            │   │
    │  │ - Caché de 5 minutos                                │   │
    │  │ - Fallback a datos por defecto                      │   │
    │  │ - limpiarCache()                                    │   │
    │  └──────────────────────────────────────────────────────┘   │
    │                                                                │
    └────────────────────────┬─────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  HTTP Requests   │
                    │  (Fetch API)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼──────────────────────────────┐
                    │       BACKEND (Node.js/Express)      │
                    │                                      │
                    │  ┌────────────────────────────────┐  │
                    │  │ RUTAS (routes/empresa.js)      │  │
                    │  │                                │  │
                    │  │ GET  /api/empresa              │  │
                    │  │ PUT  /api/empresa (solo admin) │  │
                    │  └────────────┬───────────────────┘  │
                    │               │                      │
                    │  ┌────────────▼───────────────────┐  │
                    │  │ CONTROLADOR                     │  │
                    │  │ (empresaController.js)          │  │
                    │  │                                │  │
                    │  │ - obtenerEmpresa()             │  │
                    │  │ - actualizarEmpresa()          │  │
                    │  │ - Validaciones                 │  │
                    │  │ - Manejo de errores            │  │
                    │  └────────────┬───────────────────┘  │
                    │               │                      │
                    │  ┌────────────▼───────────────────┐  │
                    │  │ MODELO (empresa.js)            │  │
                    │  │                                │  │
                    │  │ - Esquema Mongoose             │  │
                    │  │ - Validaciones                 │  │
                    │  │ - Middlewares pre-save         │  │
                    │  │ - esUnico garantiza 1 doc      │  │
                    │  └────────────┬───────────────────┘  │
                    │               │                      │
                    └───────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │    MongoDB Atlas            │
                    │                             │
                    │ Database: proyecto_fgm      │
                    │ Collection: empresas        │
                    │                             │
                    │ Documento único:            │
                    │ {                           │
                    │  _id: ObjectId              │
                    │  nombreEmpresa: string      │
                    │  direccion: string          │
                    │  telefono: [strings]        │
                    │  correo: string             │
                    │  paginaWeb: string          │
                    │  derechosReservados: string │
                    │  esUnico: true              │
                    │  fechaActualizacion: Date   │
                    │  fechaCreacion: Date        │
                    │ }                           │
                    │                             │
                    └─────────────────────────────┘
```

---

## 🔄 FLUJO DE LECTURA (GET)

```
Usuario
   ↓
Frontend Component (Footer, Services, AdminEmpresa)
   ↓
useEmpresa Hook / useEffect
   ↓
empresaService.obtenerEmpresa()
   ↓
Verificar caché (5 min)
   ├─ Si válido → Retornar caché
   └─ Si inválido → Fetch API
   ↓
GET /api/empresa (Público)
   ↓
empresaController.obtenerEmpresa()
   ↓
Buscar en BD: db.empresas.findOne({ esUnico: true })
   ├─ Existe → Retornar
   └─ No existe → Crear con defaults
   ↓
Renderizar en Frontend
```

---

## 🔄 FLUJO DE EDICIÓN (PUT)

```
Admin
   ↓
AdminEmpresa.jsx → Click "Editar"
   ↓
Modo Lectura → Modo Edición (Formulario)
   ↓
Admin modifica campos
   ↓
Admin click "Guardar"
   ↓
Validación en Frontend:
├─ nombreEmpresa requerido
├─ direccion requerida
├─ telefono requerido (no vacío)
└─ correo requerido
   ↓
Si válido → Continuar
Si inválido → Mostrar error
   ↓
PUT /api/empresa (Con token JWT)
   ↓
Middleware: auth.js (verificar token)
   ↓
Middleware: isAdmin.js (verificar rol = admin)
   ↓
empresaController.actualizarEmpresa()
   ↓
Validación en Backend:
├─ Campos obligatorios
├─ telefono es array
└─ Usuario es admin
   ↓
Si válido → Continuar
Si inválido → 400/403 Error
   ↓
findOneAndUpdate({ esUnico: true }, datos)
   ├─ Actualiza documento
   ├─ Set upsert: true (crear si no existe)
   └─ Actualiza fechaActualizacion
   ↓
Retornar documento actualizado
   ↓
Frontend: Limpiar caché
   ↓
Mostrar "Información actualizada correctamente"
   ↓
Modo Edición → Modo Lectura
   ↓
Mostrar datos actualizados
```

---

## 🔐 CAPAS DE SEGURIDAD

```
┌───────────────────────────────────────────────────────────┐
│               CAPAS DE SEGURIDAD                          │
│                                                            │
│  1. FRONTEND                                              │
│     ├─ Validación de campos                               │
│     ├─ Validación de email                                │
│     ├─ Mensajes de error claros                           │
│     └─ UX clara: modo lectura por defecto                 │
│                                                            │
│  2. NETWORK                                               │
│     ├─ HTTPS (en producción)                              │
│     ├─ CORS configurado                                   │
│     └─ Headers seguro de requests                         │
│                                                            │
│  3. BACKEND - MIDDLEWARE                                  │
│     ├─ auth.js: Verificar JWT token                       │
│     ├─ isAdmin.js: Verificar rol = admin                  │
│     └─ express.json(): Validar JSON                       │
│                                                            │
│  4. BACKEND - CONTROLADOR                                 │
│     ├─ Validación de campos obligatorios                  │
│     ├─ Validación de tipos (array, string, etc)           │
│     ├─ Verificación de permisos nuevamente                │
│     └─ Manejo de errores detallado                        │
│                                                            │
│  5. BASE DE DATOS                                         │
│     ├─ Esquema Mongoose con tipos                         │
│     ├─ esUnico: true garantiza un documento               │
│     ├─ Índice único en MongoDB                            │
│     └─ Middleware pre-save para defaults                  │
│                                                            │
│  6. LÓGICA                                                │
│     ├─ Solo admin puede editar                            │
│     ├─ No se puede duplicar registros                     │
│     ├─ El get es público (datos públicos)                 │
│     └─ Timestamp de actualizacion automático              │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
proyecto_fgm/
│
├── backend/
│   └── src/
│       ├── models/
│       │   ├── empresa.js                    ✨ NUEVO
│       │   └── ... (otros modelos)
│       │
│       ├── controllers/
│       │   ├── empresaController.js          ✨ NUEVO
│       │   └── ... (otros controladores)
│       │
│       ├── routes/
│       │   ├── empresa.js                    ✨ NUEVO
│       │   └── ... (otras rutas)
│       │
│       ├── middleware/
│       │   ├── auth.js                       (existente)
│       │   ├── isAdmin.js                    (existente)
│       │   └── ... (otros middlewares)
│       │
│       ├── scripts/
│       │   ├── seedEmpresa.js                ✨ NUEVO
│       │   └── ... (otros scripts)
│       │
│       └── server.js                          ✏️ ACTUALIZADO
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AdminEmpresa.jsx              ✨ NUEVO
│       │   ├── AdminEmpresa.css              ✨ NUEVO
│       │   ├── Footer.js                     ✏️ ACTUALIZADO
│       │   ├── Services.jsx                  ✏️ ACTUALIZADO
│       │   ├── Dashboard.js                  ✏️ ACTUALIZADO
│       │   └── ... (otros componentes)
│       │
│       ├── hooks/
│       │   └── useEmpresa.js                 ✨ NUEVO
│       │
│       ├── services/
│       │   └── empresaService.js             ✨ NUEVO
│       │
│       └── constants/
│           └── config.js                     (existente)
│
└── Documentación/
    ├── CONFIGURACION_EMPRESA_IMPLEMENTACION.md ✨ NUEVO
    └── GUIA_PRUEBA_CONFIGURACION_EMPRESA.md    ✨ NUEVO
```

---

## 🔌 PUNTOS DE INTEGRACIÓN

### Componentes que usan datos de empresa

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPONENTES QUE CONSUMEN DATOS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ ✅ IMPLEMENTADOS:                                                 │
│ ├─ Footer.js              → Todos los datos                     │
│ ├─ AdminEmpresa.jsx       → Todos los datos                     │
│ └─ Services.jsx           → Teléfono, email                     │
│                                                                   │
│ 📌 RECOMENDADOS (próximas actualizaciones):                      │
│ ├─ Floristerias.jsx       → Teléfono, email                     │
│ ├─ ObituariosPublicos.jsx → Teléfono, email                     │
│ ├─ Perfil.jsx             → Información institucional            │
│ ├─ PlanesUsuario.jsx      → Teléfono, email                     │
│ ├─ Auth.js                → Email de soporte                     │
│ └─ (Cualquier componente con contacto)                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 PERFORMANCE

### Optimizaciones implementadas:

1. **Caché de 5 minutos**
   - Evita llamadas repetidas a BD
   - Mejora tiempo de respuesta
   - `limpiarCache()` disponible si es necesario

2. **Hook reutilizable**
   - Lógica centralizada
   - Evita duplicación de código
   - Fácil de mantener

3. **Datos por defecto**
   - Fallback automático si hay error
   - UX no interrumpida
   - Datos consistentes

4. **Índice único en BD**
   - Búsqueda rápida por `esUnico: true`
   - Garantiza un solo documento
   - Evita duplicados

---

## 📊 ESTADÍSTICAS

- **Archivos nuevos:** 8
- **Archivos actualizados:** 4
- **Líneas de código:** ~2,000+
- **Componentes:** 2 (AdminEmpresa + hook useEmpresa)
- **Endpoints:** 2 (GET + PUT)
- **Validaciones:** 6+
- **Mensajes de error:** 8+

---

## 🔗 REFERENCIAS

- [Archivo de implementación](CONFIGURACION_EMPRESA_IMPLEMENTACION.md)
- [Guía de pruebas](GUIA_PRUEBA_CONFIGURACION_EMPRESA.md)
- Backend: `backend/src/models/empresa.js`
- Frontend: `frontend/src/components/AdminEmpresa.jsx`
- Hook: `frontend/src/hooks/useEmpresa.js`
- Servicio: `frontend/src/services/empresaService.js`

