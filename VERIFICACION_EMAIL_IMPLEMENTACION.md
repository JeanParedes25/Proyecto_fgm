# Implementación: Verificación por Correo Electrónico

**Fecha**: 1 de febrero de 2026
**Estado**: ✅ COMPLETADO

---

## Resumen

Se implementó verificación por correo electrónico mediante **Resend** para dos flujos principales:
1. **Registro de usuario** - Verificación obligatoria antes de iniciar sesión
2. **Recuperación de contraseña** - Código enviado después de validar preguntas de seguridad

---

## Cambios Backend

### 1. Actualización del Modelo (Usuario)

**Archivo**: [backend/src/models/usuario.js](backend/src/models/usuario.js)

Campos agregados:
- `codigoCorreo` - Código numérico temporall
- `codigoCorreoExpira` - Fecha/hora de expiración del código
- `verificadoCorreo` - Boolean para marcar si el email fue verificado

```javascript
codigoCorreo: { type: String, default: null },
codigoCorreoExpira: { type: Date, default: null },
verificadoCorreo: { type: Boolean, default: false }
```

### 2. Actualización de AuthController

**Archivo**: [backend/src/controllers/authController.js](backend/src/controllers/authController.js)

#### Importaciones nuevas:
```javascript
const { enviarCodigoVerificacion, enviarCodigoRecuperacion } = require('../services/emailService');
const CODIGO_VERIFICACION_TIEMPO = 10 * 60 * 1000; // 10 minutos
```

#### Función generadora de código:
```javascript
const generarCodigoVerificacion = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
};
```

#### Cambios en métodos existentes:

**`exports.register()`**
- Genera código al crear usuario
- Envía código por Resend
- Marca usuario como no verificado (`verificadoCorreo: false`)

**`exports.login()`**
- Verifica que `usuario.verificadoCorreo === true`
- Si no está verificado, retorna error 403 con flag `requiereVerificacion: true`

#### Nuevos endpoints implementados:

**1. `verificarCodigoCorreo()` - POST `/api/auth/verificar-codigo-correo`**
- Valida el código ingresado por el usuario
- Valida que no haya expirado
- Marca usuario como verificado
- Limpia el código del DB

**2. `reenviarCodigoVerificacion()` - POST `/api/auth/reenviar-codigo-verificacion`**
- Genera nuevo código
- Reenvía por Resend
- Actualiza tiempo de expiración

**3. `enviarCodigoRecuperacionPassword()` - POST `/api/auth/enviar-codigo-recuperacion`**
- Valida preguntas de seguridad
- Si son correctas, genera y envía código
- Preparación para cambio de contraseña

**4. `verificarCodigoRecuperacionPassword()` - POST `/api/auth/verificar-codigo-recuperacion`**
- Valida código enviado a correo
- Valida que no haya expirado
- Cambia la contraseña
- Limpia el código del DB

### 3. Actualización de Rutas

**Archivo**: [backend/src/routes/auth.js](backend/src/routes/auth.js)

Nuevas rutas agregadas:
```javascript
// Después del registro
router.post('/verificar-codigo-correo', authController.verificarCodigoCorreo);
router.post('/reenviar-codigo-verificacion', authController.reenviarCodigoVerificacion);

// Recuperación de contraseña con código
router.post('/enviar-codigo-recuperacion', authController.enviarCodigoRecuperacionPassword);
router.post('/verificar-codigo-recuperacion', authController.verificarCodigoRecuperacionPassword);
```

### 4. Servicio de Email (ya existía)

**Archivo**: [backend/src/services/emailService.js](backend/src/services/emailService.js)

Actualizado para usar **Resend** en lugar de Nodemailer:
- Métodos: `enviarCodigoVerificacion()`, `enviarCodigoRecuperacion()`
- Templates HTML personalizados
- Uso de API Key de Resend

### 5. Configuración de Entorno

Agrega a tu `.env`:
```
RESEND_API_KEY=tu_api_key_de_resend
FROM_EMAIL=onboarding@resend.dev
```

---

## Cambios Frontend

### 1. Componente VerificarEmail

**Archivo**: [frontend/src/components/VerificarEmail.jsx](frontend/src/components/VerificarEmail.jsx)

Actualizado para:
- Usar nuevo endpoint `/verificar-codigo-correo`
- Cambiar a 5 dígitos (en lugar de 6)
- Botón "Reenviar código"
- Botón "Volver al inicio de sesión"

### 2. Componente Register

**Archivo**: [frontend/src/components/Register.js](frontend/src/components/Register.js)

Cambios:
- Importa `VerificarEmail`
- Agrega estados: `registroExitoso`, `emailRegistrado`
- Después de registro exitoso, muestra `<VerificarEmail />`
- Usuario debe verificar antes de poder loguear

### 3. Componente Login

**Archivo**: [frontend/src/components/Login.js](frontend/src/components/Login.js)

Cambios:
- Importa `VerificarEmail`
- Agrega estados: `requiereVerificacion`, `emailPendienteVerificacion`
- Captura error 403 con verificación requerida
- Muestra pantalla de verificación si es necesario

### 4. Componente RecuperarPassword

**Archivo**: [frontend/src/components/RecuperarPassword.jsx](frontend/src/components/RecuperarPassword.jsx)

Cambios principales:
- **Nuevo Paso 0**: Ingresa email
- **Pasos 1-3**: Responde preguntas de seguridad (sin cambios)
- **Nuevo Paso 4**: Ingresa código de 5 dígitos
  - Botón "Reenviar código"
  - Validación de expiración
- **Paso 5**: Nueva contraseña
  - Valida código antes de permitir cambio
  - Usa `/verificar-codigo-recuperacion`

---

## Flujos Implementados

### 📝 Flujo de Registro

```
1. Usuario completa formulario de registro
   ↓
2. Backend genera código (5 dígitos) + guarda en DB
   ↓
3. Resend envía código al correo
   ↓
4. Usuario ve pantalla "Ingresa código"
   ↓
5. Usuario ingresa código
   ↓
6. Backend valida código
   - Si correcto: marca verificadoCorreo = true
   - Si incorrecto: error
   ↓
7. Usuario puede ahora hacer LOGIN
```

### 🔑 Flujo de Recuperar Contraseña

```
1. Usuario ingresa email
   ↓
2. Sistema obtiene preguntas de seguridad del usuario
   ↓
3. Usuario responde 3 preguntas
   ↓
4. Backend valida preguntas
   - Si correctas: genera código + envía por Resend
   - Si incorrectas: bloquea después de N intentos
   ↓
5. Usuario ingresa código enviado a correo
   ↓
6. Backend valida código
   - Si correcto: permite cambiar contraseña
   - Si incorrecto: error
   ↓
7. Usuario ingresa nueva contraseña 2 veces
   ↓
8. Backend actualiza contraseña + limpia código
   ↓
9. Éxito: volver a login
```

---

## Variables de Entorno Necesarias

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev

# Resto (ya existentes)
MONGODB_URI=mongodb://localhost:27017/proyecto_fgm
PORT=5000
```

---

## Seguridad

✅ Códigos de 5 dígitos solo numéricos
✅ Expiración de 10 minutos
✅ Límite de intentos de login (ya existía)
✅ Hash de contraseñas con bcrypt
✅ Preguntas de seguridad sin cambios
✅ Validación en servidor
✅ Sin enlaces de recuperación (solo códigos)

---

## Limitaciones y Consideraciones

⚠️ **Plan Free de Resend**: 3,000 correos/mes (suficiente para pruebas)
⚠️ **Dominio**: Usa `onboarding@resend.dev` para desarrollo. Configurar dominio propio después
⚠️ **Código**: 5 dígitos = 100,000 posibilidades (adecuado con expiración de 10 min)

---

## Pruebas Recomendadas

### Backend
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "celular": "999999999",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "preguntasSeguridad": [
      {"pregunta": "¿Cuál es tu comida favorita?", "respuesta": "pizza"},
      {"pregunta": "¿Nombre de tu primera mascota?", "respuesta": "fluffy"},
      {"pregunta": "¿Ciudad donde naciste?", "respuesta": "lima"}
    ]
  }'
```

### Frontend
1. Registrar nuevo usuario
2. Verificar que recibe email con código
3. Ingresar código en pantalla de verificación
4. Intentar login → debe permitir después de verificar
5. Recuperar contraseña con preguntas → debe pedir código
6. Ingresar código → debe permitir cambiar contraseña

---

## Próximos Pasos (Opcional)

- [ ] Configurar dominio personalizado en Resend
- [ ] Agregar logs/auditoría para códigos enviados
- [ ] Personalizar templates HTML de emails
- [ ] Agregar opción SMS (opcional)
- [ ] Rate limiting por IP

---

## Resumen de Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `backend/src/models/usuario.js` | +3 campos nuevos |
| `backend/src/controllers/authController.js` | +4 métodos nuevos, 2 modificados |
| `backend/src/routes/auth.js` | +4 rutas nuevas |
| `backend/src/services/emailService.js` | Migración a Resend |
| `frontend/src/components/Register.js` | +verificación email |
| `frontend/src/components/Login.js` | +manejo verificación |
| `frontend/src/components/VerificarEmail.jsx` | Actualizado endpoints |
| `frontend/src/components/RecuperarPassword.jsx` | +paso código, flujo mejorado |
| `.env` | +2 variables Resend |

---

## Status

✅ Implementación completada
✅ Sin errores de compilación
✅ Preguntas de seguridad SIN cambios
✅ Verificación por email obligatoria (registro)
✅ Código por email en recuperación de contraseña
✅ Uso de Resend (plan free gratis)

