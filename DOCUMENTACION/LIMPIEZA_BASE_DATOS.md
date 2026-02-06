# Limpieza de Base de Datos y Configuración de Administrador

## 📋 Resumen de Cambios

Se ha realizado una limpieza completa de la base de datos para:
- Eliminar usuarios de prueba (usuario@gmail.com, user@gmail.com, admin@gmail.com)
- Establecer **fgmtransmisiones@gmail.com** como único administrador
- Transferir datos de admin@gmail.com a fgmtransmisiones@gmail.com
- Eliminar referencias a usuarios de prueba en el código

## 🔐 Credenciales del Administrador

**Email:** fgmtransmisiones@gmail.com
**Contraseña:** FGM2024!Admin

⚠️ **IMPORTANTE:** Cambiar esta contraseña después del primer inicio de sesión

## 🚀 Cómo Ejecutar la Limpieza

Desde la carpeta `backend`:

```bash
npm run limpiar-db
```

Este script:
1. ✅ Elimina usuarios de prueba (usuario@gmail.com, user@gmail.com, admin@gmail.com)
2. ✅ Elimina todos los pedidos realizados por usuario@gmail.com
3. ✅ Transfiere todos los pedidos de admin@gmail.com a fgmtransmisiones@gmail.com
4. ✅ Transfiere todos los obituarios de admin@gmail.com a fgmtransmisiones@gmail.com
5. ✅ Crea el usuario fgmtransmisiones@gmail.com si no existe
6. ✅ Asigna rol de administrador a fgmtransmisiones@gmail.com

## 📝 Archivos Modificados

### Backend
- ✅ `backend/src/scripts/crearAdmin.js` - Usa fgmtransmisiones@gmail.com como admin
- ✅ `backend/src/scripts/seedClientes.js` - Solo crea el admin, no usuarios de prueba
- ✅ `backend/src/scripts/limpiarBaseDatos.js` - **NUEVO** Script de limpieza
- ✅ `backend/package.json` - Agregado comando `npm run limpiar-db`

### Frontend
- ✅ `frontend/src/components/AsistenciaPrepago.jsx` - Eliminada referencia a israelmendoza18@hotmail.com
- ✅ `frontend/src/components/Dashboard.js` - Eliminada referencia a israelmendoza18@hotmail.com

## 🎯 Comportamiento del Sistema

### Registro de Nuevos Usuarios
- Cualquier usuario que se registre será **usuario normal** (rol: 'usuario')
- No se asigna automáticamente el rol de administrador

### Inicio de Sesión con Google
- Si fgmtransmisiones@gmail.com inicia sesión con Google:
  - Se verifica el email
  - Si ya existe en la base de datos, se mantiene su rol admin
  - Si no existe, se crea con rol admin automáticamente (por la lógica de crearAdmin)

### Creación de Nuevos Administradores
- Solo un administrador puede crear otros administradores
- Esto se hace desde el panel de administración
- Los nuevos usuarios normales no pueden auto-asignarse rol admin

## 🔄 Flujo de Trabajo

1. **Primera vez:**
   ```bash
   cd backend
   npm run limpiar-db
   ```

2. **Iniciar el backend:**
   ```bash
   npm start
   ```

3. **Iniciar sesión:**
   - Email: fgmtransmisiones@gmail.com
   - Contraseña: FGM2024!Admin
   - O usar inicio de sesión con Google

4. **Cambiar contraseña:**
   - Ir a Perfil > Cambiar Contraseña
   - Establecer una contraseña segura

## ⚠️ Seguridad

- Solo fgmtransmisiones@gmail.com tiene rol admin por defecto
- Cualquier otro usuario debe ser promovido a admin manualmente
- Las referencias a correos específicos en el código han sido eliminadas
- El sistema verifica el rol en la base de datos, no el email hardcodeado

## 📊 Verificación

Después de ejecutar el script, verás:

```
🧹 Iniciando limpieza de base de datos...
   ✅ Usuario eliminado: usuario@gmail.com
   ✅ Usuario eliminado: admin@gmail.com
   📦 Transferidos X pedidos a fgmtransmisiones@gmail.com
   ✅ Usuario admin@gmail.com eliminado después de transferir datos

📊 Resumen de limpieza:
   👥 Total usuarios: X
   👑 Administradores: 1
   👤 Usuarios normales: X
   ✅ Admin actual: fgmtransmisiones@gmail.com

✅ Limpieza completada exitosamente

🔐 CREDENCIALES DE ADMINISTRADOR:
   Email: fgmtransmisiones@gmail.com
   Contraseña: FGM2024!Admin
   ⚠️  Por favor, cambiar esta contraseña después del primer login
```

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
cd backend
npm install
```

### Error de conexión a MongoDB
Verificar que MongoDB esté corriendo y la variable `MONGO_URI` en `.env` esté configurada correctamente.

### El usuario no tiene permisos de admin
1. Verificar en la base de datos que el campo `rol` sea 'admin'
2. Limpiar localStorage del navegador
3. Volver a iniciar sesión

## 📞 Contacto

Para soporte adicional, contactar al equipo de desarrollo.
