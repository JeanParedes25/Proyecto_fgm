# 🚀 Inicio Rápido - Sistema de Autenticación

## Prerequisitos
- ✅ Node.js instalado
- ✅ MongoDB instalado y corriendo
- ✅ Git Bash o PowerShell

## Pasos de Inicio

### 1. Configurar Variables de Entorno

Crea el archivo `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/funeraria
JWT_SECRET=clave_secreta_funeraria_2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=jeanparedes918@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicación_aqui
```

### 2. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### 3. (Opcional) Limpiar Base de Datos

Si quieres empezar desde cero:

```bash
cd backend
node src/scripts/limpiarClientes.js
```

### 4. Iniciar Backend

```bash
cd backend
npm start
```

El administrador se creará automáticamente:
- Email: `jeanparedes918@gmail.com`
- Contraseña: `Admin123!`

### 5. Iniciar Frontend (en otra terminal)

```bash
cd frontend
npm start
```

El navegador se abrirá automáticamente en http://localhost:3000

## 📧 Configurar Email de Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en 2 pasos (actívala)
3. Contraseñas de aplicaciones
4. Selecciona "Correo" y "Otro (nombre personalizado)"
5. Copia la contraseña generada
6. Pégala en `backend/.env` como `EMAIL_PASSWORD`

## 🧪 Probar el Sistema

### Como Usuario Nuevo
1. Clic en "Regístrate"
2. Completa el formulario
3. Revisa tu email para el código de verificación
4. Ingresa el código
5. Inicia sesión

### Como Administrador
1. Email: `jeanparedes918@gmail.com`
2. Contraseña: `Admin123!`
3. **IMPORTANTE**: Cambia la contraseña después del primer login

### Probar Recuperación de Contraseña
1. Clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu email
3. Revisa tu email para el código
4. Ingresa el código
5. Establece nueva contraseña

### Probar Perfil
1. Inicia sesión
2. Clic en "👤 Mi Perfil"
3. Reautentica con tu contraseña
4. Edita tus datos o cambia tu contraseña

## 🐛 Solución Rápida de Problemas

### Error: "Cannot find module 'nodemailer'"
```bash
cd backend
npm install
```

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo
- Verifica la URL en `backend/.env`

### Email no se envía
- Verifica EMAIL_USER y EMAIL_PASSWORD en .env
- Usa contraseña de aplicación de Gmail, no tu contraseña normal
- Activa verificación en 2 pasos en Google

### Error de compilación en Frontend
```bash
cd frontend
rm -rf node_modules/.cache
npm start
```

## 📝 Credenciales por Defecto

**Administrador:**
- Email: `jeanparedes918@gmail.com`
- Contraseña: `Admin123!`
- Rol: admin
- Verificado: Sí

**Usuario de Prueba:**
- Debes registrarte manualmente
- Verificar email con código
- Contraseña debe cumplir política:
  - Mínimo 8 caracteres
  - 1 mayúscula
  - 1 minúscula
  - 1 número
  - 1 carácter especial

## 🎯 URLs Importantes

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 📚 Documentación Completa

Ver `GUIA_AUTENTICACION_COMPLETA.md` para más detalles.

## ✅ Verificación Rápida

Sistema funcionando correctamente si:
- ✅ Backend inicia sin errores
- ✅ Frontend carga en el navegador
- ✅ Puedes registrar un nuevo usuario
- ✅ Recibes email con código de verificación
- ✅ Puedes iniciar sesión después de verificar
- ✅ Puedes acceder al perfil
- ✅ Puedes cambiar contraseña

¡Listo! El sistema está completamente configurado y funcionando. 🎉
