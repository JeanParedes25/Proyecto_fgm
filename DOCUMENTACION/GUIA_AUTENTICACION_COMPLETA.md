# Sistema de Autenticación Completo - Funeraria San Miguel

## 🎯 Implementación Completada

Se ha implementado un sistema completo de autenticación con todas las características solicitadas.

## 📋 Características Implementadas

### Backend

1. **Modelo Cliente Actualizado** (`backend/src/models/cliente.js`)
   - Campos de verificación de email
   - Códigos de recuperación de contraseña
   - Control de intentos de login
   - Registro de último cambio de contraseña

2. **Servicio de Email** (`backend/src/services/emailService.js`)
   - Envío de códigos de verificación
   - Envío de códigos de recuperación
   - Confirmación de cambio de contraseña
   - Utiliza nodemailer

3. **Controlador de Autenticación** (`backend/src/controllers/authController.js`)
   - Registro con validación de contraseñas
   - Verificación de email
   - Login con bloqueo por intentos fallidos
   - Recuperación de contraseña
   - Cambio de contraseña
   - Reautenticación para acciones sensibles
   - Gestión de perfil

4. **Scripts Útiles**
   - `backend/src/scripts/limpiarClientes.js` - Limpiar base de datos
   - `backend/src/scripts/crearAdmin.js` - Crear administrador automáticamente

5. **Middleware Actualizado** (`backend/src/middleware/auth.js`)
   - Middleware de autenticación
   - Middleware de verificación de rol admin

### Frontend

1. **Componente Register** (`frontend/src/components/Register.js`)
   - Formulario con nombre, email, celular, contraseña
   - Validación de contraseñas coincidentes
   - Mostrar/ocultar contraseña
   - Redirección a verificación de email

2. **Componente VerificarEmail** (`frontend/src/components/VerificarEmail.jsx`)
   - Ingreso de código de 6 dígitos
   - Reenvío de código
   - Validación de código

3. **Componente Login** (`frontend/src/components/Login.js`)
   - Login con email y contraseña
   - Mostrar/ocultar contraseña
   - Link a recuperación de contraseña
   - Redirección a verificación si es necesario

4. **Componente RecuperarPassword** (`frontend/src/components/RecuperarPassword.jsx`)
   - Flujo de 3 pasos
   - Solicitar código
   - Verificar código
   - Establecer nueva contraseña

5. **Componente Perfil** (`frontend/src/components/Perfil.jsx`)
   - Ver información del perfil
   - Editar nombre y celular
   - Cambiar contraseña
   - Reautenticación para acciones sensibles
   - Fecha del último cambio de contraseña

6. **App.js Actualizado**
   - Integración de todos los componentes
   - Manejo de rutas
   - Persistencia de sesión

## 🚀 Pasos para Ejecutar

### 1. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

Se agregó `nodemailer` al package.json.

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` con:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/funeraria

# JWT
JWT_SECRET=clave_secreta_funeraria_2024

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=jeanparedes918@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicación_gmail
```

**Nota Importante sobre Email:**
Para usar Gmail, necesitas crear una "Contraseña de Aplicación":
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos (actívala si no está activa)
3. Contraseñas de aplicaciones
4. Genera una contraseña para "Otra aplicación"
5. Usa esa contraseña en EMAIL_PASSWORD

### 3. Limpiar Base de Datos (Opcional pero Recomendado)

```bash
cd backend
node src/scripts/limpiarClientes.js
```

Esto eliminará todos los clientes existentes para empezar con el nuevo sistema.

### 4. Iniciar el Backend

```bash
cd backend
npm start
```

El administrador se creará automáticamente al iniciar el servidor:
- Email: `jeanparedes918@gmail.com`
- Contraseña temporal: `Admin123!`
- **IMPORTANTE**: Cambiar la contraseña después del primer login

### 5. Iniciar el Frontend

```bash
cd frontend
npm start
```

## 🔐 Política de Contraseñas

Las contraseñas deben cumplir:
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial (!@#$%^&*)

## 🛡️ Características de Seguridad

1. **Encriptación**: Todas las contraseñas se almacenan con bcrypt
2. **JWT**: Tokens con expiración de 7 días
3. **Verificación de Email**: Código de 6 dígitos con expiración de 15 minutos
4. **Bloqueo de Cuenta**: Después de 5 intentos fallidos (15 minutos de bloqueo)
5. **Recuperación Segura**: Código temporal para restablecer contraseña
6. **Reautenticación**: Para acciones sensibles (editar perfil, cambiar contraseña)
7. **Validación Doble**: Frontend y Backend

## 📧 Flujos de Usuario

### Registro
1. Usuario completa formulario con todos los datos
2. Sistema valida contraseñas
3. Se envía código de verificación al email
4. Usuario ingresa código
5. Cuenta activada → puede hacer login

### Login
1. Usuario ingresa email y contraseña
2. Sistema verifica email y contraseña
3. Si no está verificado → redirección a verificación
4. Si credenciales correctas → acceso al dashboard
5. Intentos fallidos se registran

### Recuperación de Contraseña
1. Usuario solicita recuperación con su email
2. Sistema envía código de 6 dígitos
3. Usuario ingresa código
4. Usuario establece nueva contraseña
5. Se envía confirmación por email

### Perfil
1. Usuario accede a su perfil desde dashboard
2. Para editar datos sensibles, debe reautenticarse
3. Puede cambiar contraseña con validación de la actual
4. Ve fecha del último cambio de contraseña

## 🔧 Administrador

El administrador tiene:
- Email fijo: `jeanparedes918@gmail.com`
- Rol: admin
- isVerified: true (no necesita verificación)
- Contraseña temporal: `Admin123!`
- Acceso completo al panel de administración

## 📝 Archivos Creados/Modificados

### Backend
- ✅ `backend/src/models/cliente.js` (actualizado)
- ✅ `backend/src/services/emailService.js` (nuevo)
- ✅ `backend/src/controllers/authController.js` (reemplazado)
- ✅ `backend/src/routes/auth.js` (actualizado)
- ✅ `backend/src/middleware/auth.js` (actualizado)
- ✅ `backend/src/scripts/limpiarClientes.js` (actualizado)
- ✅ `backend/src/scripts/crearAdmin.js` (actualizado)
- ✅ `backend/package.json` (actualizado con nodemailer)

### Frontend
- ✅ `frontend/src/components/Register.js` (actualizado)
- ✅ `frontend/src/components/Login.js` (actualizado)
- ✅ `frontend/src/components/VerificarEmail.jsx` (nuevo)
- ✅ `frontend/src/components/RecuperarPassword.jsx` (nuevo)
- ✅ `frontend/src/components/Perfil.jsx` (nuevo)
- ✅ `frontend/src/components/Perfil.css` (nuevo)
- ✅ `frontend/src/components/Auth.css` (actualizado)
- ✅ `frontend/src/components/Dashboard.js` (actualizado)
- ✅ `frontend/src/components/Dashboard.css` (actualizado)
- ✅ `frontend/src/App.js` (actualizado)

## 🎨 Funcionalidades de UI

- Botones para mostrar/ocultar contraseñas (👁️/🙈)
- Mensajes de error y éxito claros
- Validación en tiempo real
- Diseño responsivo
- Indicadores de carga
- Modales para reautenticación
- Badges de rol (admin/cliente)

## ⚠️ Notas Importantes

1. **Email**: Asegúrate de configurar correctamente las credenciales de email en el `.env`
2. **MongoDB**: Debe estar corriendo antes de iniciar el backend
3. **Puerto**: Backend en puerto 5000, Frontend en puerto 3000
4. **CORS**: Ya está configurado para desarrollo
5. **Producción**: Cambiar JWT_SECRET y configurar HTTPS en producción

## 🐛 Solución de Problemas

### Email no se envía
- Verifica EMAIL_USER y EMAIL_PASSWORD en .env
- Usa una contraseña de aplicación de Gmail, no tu contraseña normal
- Verifica que la verificación en 2 pasos esté activada

### Error de conexión a MongoDB
- Asegúrate de que MongoDB esté corriendo
- Verifica MONGODB_URI en .env

### Token inválido
- El token expira en 7 días
- Cierra sesión y vuelve a iniciar sesión

## ✅ Testing

Para probar el sistema:

1. **Limpiar base de datos**: `node src/scripts/limpiarClientes.js`
2. **Iniciar backend**: El admin se crea automáticamente
3. **Registrar nuevo usuario**: Completa formulario → Verificar email
4. **Login como usuario**: Verifica que necesite email verificado
5. **Probar recuperación**: "Olvidé mi contraseña" → Código → Nueva contraseña
6. **Acceder a perfil**: Editar datos → Cambiar contraseña
7. **Login como admin**: `jeanparedes918@gmail.com` / `Admin123!`

¡El sistema está listo para usar! 🚀
