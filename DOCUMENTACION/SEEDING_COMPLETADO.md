# ✅ Seeding de Datos Temporales - COMPLETADO

## Estado Actual

### Base de Datos
- **Base de datos**: `proyecto_fgm`
- **Colección**: `clientes`
- **Estado**: ✅ Con 2 usuarios de prueba

### Usuarios Creados

#### 1. Administrador
- **Email**: `admin@gmail.com`
- **Contraseña**: `admin123`
- **Rol**: `admin`
- **Nombre**: `Administrador`
- **Celular**: `999999999`
- **Verificado**: Sí

#### 2. Usuario Prueba
- **Email**: `usuario@gmail.com`
- **Contraseña**: `user123`
- **Rol**: `cliente`
- **Nombre**: `Usuario Prueba`
- **Celular**: `988888888`
- **Verificado**: Sí

## Características Implementadas

✅ Seeding automático al iniciar el servidor
✅ Creación condicional (solo si no existen usuarios)
✅ Contraseñas hasheadas con bcrypt
✅ Sin duplicación de usuarios
✅ Esquema original de clientes sin cambios
✅ Usuarios verificados (isVerified: true)

## Scripts Disponibles

### 1. Iniciar Servidor (Recomendado)
```bash
cd backend
node src/server.js
```

El servidor:
- Se conecta a MongoDB
- Verifica si existen usuarios
- Si no hay usuarios, crea los 2 usuarios de prueba
- Si hay usuarios, muestra un mensaje y continúa

### 2. Ejecutar Seeding Manual
```bash
cd backend
node src/scripts/seedearAhora.js
```

Este script:
- Muestra los usuarios actuales
- Crea usuarios si la BD está vacía
- Muestra un resumen de usuarios creados

### 3. Limpiar Base de Datos
```bash
cd backend
node src/scripts/limpiarClientes.js
```

Este script:
- Elimina todos los clientes
- Permite empezar desde cero

## Próximos Pasos

### Para Iniciar Sesión Inmediatamente

#### Como Administrador
1. Abre el frontend: `http://localhost:3000`
2. Email: `admin@gmail.com`
3. Contraseña: `admin123`

#### Como Usuario Normal
1. Email: `usuario@gmail.com`
2. Contraseña: `user123`

### Para Desarrollo Futuro

Pendiente:
- ❌ Google Login
- ❌ Recuperación de contraseña
- ❌ Cambios de esquema de clientes
- ❌ Modificación de otras colecciones

## Archivos Modificados/Creados

### Backend

#### Nuevos:
- `backend/src/scripts/seedClientes.js` - Función de seeding
- `backend/src/scripts/seedearAhora.js` - Script ejecutable directo

#### Modificados:
- `backend/src/server.js` - Integración de seeding al iniciar

## Verificación en MongoDB Compass

Para verificar que los usuarios están creados:

1. Abre MongoDB Compass
2. Conecta a `mongodb://localhost:27017`
3. Base de datos: `proyecto_fgm`
4. Colección: `clientes`
5. Deberías ver 2 documentos:
   - admin@gmail.com (rol: admin)
   - usuario@gmail.com (rol: cliente)

## Notas Importantes

⚠️ **Estos usuarios son TEMPORALES para pruebas**
- Están configurados con `isVerified: true` para login inmediato
- Las contraseñas están hasheadas con bcrypt
- No se duplicarán si el servidor se reinicia

✅ **Seguridad**
- Las contraseñas NO se guardan en texto plano
- Se usa bcrypt con salt rounds = 10
- Se valida uniqueness del email

## Estado del Sistema

| Componente | Estado | Detalles |
|-----------|--------|---------|
| MongoDB | ✅ Conectado | En `proyecto_fgm` |
| Seeding | ✅ Completado | 2 usuarios creados |
| Servidor Backend | ✅ Corriendo | En puerto 5000 |
| Usuarios de Prueba | ✅ Disponibles | Admin + Usuario Normal |
| Email Service | ⚠️ Configurar | Error de credenciales (no crítico) |

---

**Sistema listo para probar!** 🚀

El seeding se ejecutó exitosamente. Los usuarios están en MongoDB y listos para usar.
