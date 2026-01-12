# Sistema de Autenticación - Proyecto FGM

## 📋 Descripción
Sistema completo de autenticación con Login y Registro para la aplicación Proyecto_fgm.

## ✨ Características Implementadas

### Backend
- ✅ Modelo Cliente actualizado con campos de autenticación (nombre, email, password)
- ✅ Controlador de autenticación con funciones de registro y login
- ✅ Rutas de autenticación (/api/auth/register y /api/auth/login)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos
- ✅ Verificación de email duplicado

### Frontend
- ✅ Componente de Login
- ✅ Componente de Registro
- ✅ Dashboard (panel de control después de loguearse)
- ✅ Manejo de sesiones con localStorage
- ✅ Diseño responsive y atractivo
- ✅ Mensajes de error y éxito

## 🚀 Cómo Usar

### 1. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno
Asegúrate de que el archivo `.env` en la carpeta `backend` tenga:
```
MONGO_URI=mongodb://localhost:27017/Proyecto_fgm
PORT=5000
```

### 3. Ejecutar el Backend
```bash
cd backend
npm start
# o si tienes npm start configurado
node src/server.js
```

### 4. Ejecutar el Frontend
```bash
cd frontend
npm start
```

El frontend se abrirá en `http://localhost:3000`

## 📝 Flujo de la Aplicación

1. **Página de Inicio**: El usuario ve el formulario de Login
2. **Registro**: Si no tiene cuenta, puede hacer clic en "Regístrate aquí"
3. **Después del Registro**: Se redirige automáticamente al Dashboard
4. **Dashboard**: Muestra la bienvenida y los datos del usuario
5. **Cerrar Sesión**: El botón "Cerrar Sesión" limpia localStorage y vuelve a Login

## 🔒 Datos de Prueba

Puedes registrar un nuevo usuario directamente desde la aplicación:

**Ejemplo:**
- Nombre: Juan Pérez
- Email: juan@example.com
- Contraseña: password123

## 📂 Estructura de Archivos Creados

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.js (NUEVO)
│   ├── routes/
│   │   └── auth.js (NUEVO)
│   └── models/
│       └── cliente.js (ACTUALIZADO)

frontend/
└── src/
    └── components/
        ├── Login.js (NUEVO)
        ├── Register.js (NUEVO)
        ├── Dashboard.js (NUEVO)
        ├── Auth.css (NUEVO)
        └── Dashboard.css (NUEVO)
```

## 🔧 Cambios en Archivos Existentes

### Backend
- **server.js**: Agregadas las rutas de autenticación
- **package.json**: Agregada la dependencia bcrypt
- **models/cliente.js**: Actualizado el esquema con campos de autenticación

### Frontend
- **App.js**: Lógica completa de manejo de autenticación y navegación
- **App.css**: Estilos globales actualizados

## 💡 Notas Importantes

1. Las contraseñas se encriptan automáticamente con bcrypt antes de guardarse
2. Los datos del usuario se guardan en localStorage (para pruebas)
3. La sesión persiste al recargar la página
4. Se valida que las contraseñas coincidan en el registro
5. Se valida que la contraseña tenga al menos 6 caracteres
6. El email debe ser único en la base de datos

## 🎨 Diseño

- **Colores**: Gradiente púrpura-azul moderno
- **Responsive**: Funciona en dispositivos móviles y escritorio
- **Interactivo**: Botones con efectos hover y transiciones

## ❌ Solución de Problemas

**Si no conecta con el backend:**
- Verifica que el servidor esté corriendo en puerto 5000
- Revisa la consola del navegador para ver errores CORS
- Asegúrate de que MongoDB esté corriendo

**Si bcrypt no se instala:**
```bash
npm install --legacy-peer-deps
```

---

¡Listo! Tu sistema de autenticación está completo y funcionando. 🎉
