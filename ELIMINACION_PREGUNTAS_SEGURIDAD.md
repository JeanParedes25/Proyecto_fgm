# ✅ ELIMINACIÓN COMPLETA DE PREGUNTAS DE SEGURIDAD

## 📋 Resumen
Se ha eliminado por completo el sistema de preguntas de seguridad del proyecto. Ahora **SOLO** se usa verificación por correo electrónico con códigos de 5 dígitos para:
- ✅ Registro de nuevos usuarios
- ✅ Recuperación de contraseña

---

## 🔧 CAMBIOS REALIZADOS

### 1️⃣ Backend - Modelo de Usuario
**Archivo**: `backend/src/models/usuario.js`

**Eliminado**:
```javascript
preguntasSeguridad: [{
  pregunta: String,
  respuesta: String
}]
```

✅ El modelo ahora solo tiene campos esenciales para verificación por email.

---

### 2️⃣ Backend - Controlador de Autenticación
**Archivo**: `backend/src/controllers/authController.js`

#### Métodos ELIMINADOS (6 métodos, ~330 líneas):
1. ❌ `verificarPreguntasSeguridad()` - Validaba respuestas de preguntas
2. ❌ `obtenerPreguntasSeguridad()` - Obtenía preguntas por email
3. ❌ `restablecerPassword()` - Restablecía con preguntas + email
4. ❌ `recuperarPorPreguntas()` - Recuperación sin email
5. ❌ `registrarIntentoFallidoRecuperacion()` - Bloqueaba por intentos fallidos
6. ❌ `restablecerPasswordConToken()` - Token temporal por preguntas

#### Métodos SIMPLIFICADOS:

**`register()`**:
- ❌ Antes: Validaba y guardaba 3 preguntas de seguridad
- ✅ Ahora: Solo valida datos básicos (nombre, email, celular, password)

**`enviarCodigoRecuperacionPassword()`**:
- ❌ Antes: Requería `{email, preguntasSeguridad: [{pregunta, respuesta}, ...]}` (55 líneas)
- ✅ Ahora: Solo requiere `{email}` (35 líneas)

---

### 3️⃣ Backend - Rutas
**Archivo**: `backend/src/routes/auth.js`

#### Rutas ELIMINADAS (6 endpoints):
```javascript
❌ POST /obtener-preguntas
❌ POST /verificar-preguntas
❌ POST /restablecer-password
❌ POST /recuperar-por-preguntas
❌ POST /registrar-intento-fallido
❌ POST /restablecer-con-token
```

#### Rutas ACTIVAS:
```javascript
✅ POST /register
✅ POST /verificar-codigo-correo
✅ POST /reenviar-codigo-verificacion
✅ POST /login
✅ POST /enviar-codigo-recuperacion
✅ POST /verificar-codigo-recuperacion
```

---

### 4️⃣ Frontend - Registro
**Archivo**: `frontend/src/components/Register.js`

#### ELIMINADO:
- ❌ Estados: `pregunta1, pregunta2, pregunta3, respuesta1, respuesta2, respuesta3`
- ❌ Array `preguntasDisponibles`
- ❌ 6 campos de formulario (3 selects de preguntas + 3 inputs de respuestas)
- ❌ Validación de preguntas únicas
- ❌ Envío de `preguntasSeguridad` al backend

#### RESULTADO:
- ✅ Formulario simplificado: nombre, email, celular, password
- ✅ Después de registro exitoso → `VerificarEmail.jsx`
- ✅ Card actualizada: "🔐 Preguntas de seguridad" → "📧 Verificación por correo"

---

### 5️⃣ Frontend - Recuperación de Contraseña
**Archivo**: `frontend/src/components/RecuperarPassword.jsx`

#### ANTES (Multi-step complejo):
- Paso 0: Ingresar email
- Paso 1-3: Responder 3 preguntas de seguridad
- Paso 4: Ingresar código de email
- Paso 5: Nueva contraseña

#### AHORA (2 pasos simples):
- **Paso 1**: Ingresar email → Enviar código
- **Paso 2**: Ingresar código (5 dígitos) + Nueva contraseña

#### Características:
- ✅ Botón "Reenviar Código"
- ✅ Validación de código (exactamente 5 dígitos)
- ✅ Validación de contraseña (requisitos de seguridad)
- ✅ Sin límites de intentos
- ✅ Sin bloqueos por intentos fallidos

---

## 🔄 FLUJOS ACTUALES

### Registro de Usuario:
```
1. Usuario completa formulario (nombre, email, celular, password)
2. Backend genera código de 5 dígitos
3. Backend envía código vía Resend
4. Frontend muestra VerificarEmail.jsx
5. Usuario ingresa código
6. Backend valida y marca verificadoCorreo = true
7. Usuario puede iniciar sesión
```

### Recuperación de Contraseña:
```
1. Usuario ingresa email
2. Backend genera código de 5 dígitos
3. Backend envía código vía Resend
4. Usuario ingresa código + nueva contraseña
5. Backend valida código y actualiza contraseña
6. Usuario inicia sesión con nueva contraseña
```

---

## 📧 Servicio de Email
**Resend** - `backend/src/services/emailService.js`

- API Key: Variable de entorno `RESEND_API_KEY`
- Remitente: `onboarding@resend.dev`
- Límite gratuito: 3,000 emails/mes
- Códigos: 5 dígitos numéricos
- Expiración: 10 minutos

---

## 🎯 BENEFICIOS

### Seguridad:
- ✅ Sin dependencia de respuestas memorizadas
- ✅ Sin bloqueos accidentales por olvido
- ✅ Códigos temporales (10 min)
- ✅ Un solo punto de verificación (email)

### Usabilidad:
- ✅ Proceso más rápido (2 pasos vs 5 pasos)
- ✅ No recordar 3 preguntas + respuestas
- ✅ Flujo intuitivo y estándar
- ✅ Menos fricción en registro

### Mantenibilidad:
- ✅ ~400 líneas de código eliminadas
- ✅ Menos endpoints que mantener
- ✅ Lógica más simple y clara
- ✅ Menor superficie de ataque

---

## 🗄️ Base de Datos
**MongoDB - Colección `usuarios`**

### Campos ELIMINADOS:
```javascript
❌ preguntasSeguridad: Array
❌ intentosRecuperacion: Number
❌ bloqueadoHasta: Date
❌ tokenRecuperacion: String
```

### Campos ACTIVOS para verificación:
```javascript
✅ email: String
✅ password: String (bcrypt)
✅ verificadoCorreo: Boolean
✅ codigoCorreo: String
✅ codigoCorreoExpira: Date
```

---

## ⚠️ IMPORTANTE
- Los usuarios existentes con preguntas de seguridad guardadas NO se verán afectados
- El campo `preguntasSeguridad` simplemente quedará ignorado en documentos existentes
- Todos los usuarios (nuevos y existentes) usarán recuperación por email

---

## 🧪 PRUEBAS RECOMENDADAS

### 1. Registro:
1. Completar formulario sin preguntas
2. Verificar email con código
3. Iniciar sesión

### 2. Recuperación:
1. Click en "¿Olvidaste tu contraseña?"
2. Ingresar email
3. Revisar correo y copiar código
4. Ingresar código + nueva contraseña
5. Iniciar sesión con nueva contraseña

### 3. Reenvío:
1. En verificación de email, click en "Reenviar código"
2. Verificar que llega nuevo código
3. Código anterior debe ser invalidado

---

## 📝 Archivos Modificados

**Backend**:
- ✅ `backend/src/models/usuario.js` (eliminado campo)
- ✅ `backend/src/controllers/authController.js` (6 métodos eliminados, 2 simplificados)
- ✅ `backend/src/routes/auth.js` (6 rutas eliminadas)

**Frontend**:
- ✅ `frontend/src/components/Register.js` (formulario simplificado)
- ✅ `frontend/src/components/RecuperarPassword.jsx` (reescrito completamente)

**Sin cambios**:
- ✅ `backend/src/services/emailService.js` (Resend funcionando)
- ✅ `frontend/src/components/VerificarEmail.jsx` (funciona correctamente)
- ✅ `frontend/src/components/Login.js` (bloquea usuarios no verificados)

---

## ✅ Estado Final
**SISTEMA COMPLETAMENTE MIGRADO A VERIFICACIÓN POR EMAIL**

No hay restos de código de preguntas de seguridad en:
- ❌ Modelo de datos
- ❌ Endpoints backend
- ❌ Formularios frontend
- ❌ Lógica de autenticación

**Todo el sistema usa SOLO códigos de verificación por email vía Resend.**
