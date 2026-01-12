# ⚡ Guía Rápida de Inicio

## Paso 1: Verificar que MongoDB esté corriendo
```bash
# En una terminal (MongoDB debe estar en ejecución)
mongod
```

## Paso 2: Iniciar el Backend
```bash
cd backend
npm install  # Solo la primera vez
npm start    # O: node src/server.js
```

Deberías ver:
```
✓ Conectado a MongoDB
Servidor corriendo en http://localhost:5000
```

## Paso 3: Iniciar el Frontend (en otra terminal)
```bash
cd frontend
npm start
```

Automáticamente se abrirá `http://localhost:3000` en tu navegador

## 🎯 Probar la Aplicación

### Registrarse
1. En la pantalla de inicio, haz clic en "Regístrate aquí"
2. Completa el formulario con:
   - **Nombre**: Tu nombre
   - **Email**: un@correo.com
   - **Contraseña**: al menos 6 caracteres
   - **Confirmar Contraseña**: debe coincidir
3. Haz clic en "Registrarse"
4. ¡Automáticamente accederás al Dashboard!

### Iniciar Sesión
1. En la pantalla inicial, completa:
   - **Email**: el que registraste
   - **Contraseña**: la que pusiste
2. Haz clic en "Ingresar"
3. Verás el Dashboard con tu información

### Cerrar Sesión
- Haz clic en el botón rojo "Cerrar Sesión" en la esquina superior derecha

---

## 🗄️ Estructura de Base de Datos

Los usuarios se guardan en la colección "clientes" con esta estructura:

```json
{
  "_id": "ObjectId",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "$2b$10$... (encriptado)",
  "telefono": null,
  "servicio": null,
  "createdAt": "2026-01-12T..."
}
```

---

## ✅ Verificar que Todo Funciona

### Opción 1: Ver en la Base de Datos
```bash
# Abre MongoDB Compass o usa mongosh
use Proyecto_fgm
db.clientes.find()
```

### Opción 2: Revisar la Consola del Navegador
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Intenta registrar o iniciar sesión
4. Deberías ver las peticiones a `/api/auth/register` y `/api/auth/login`
5. La respuesta debe ser exitosa (status 200 o 201)

---

## 🐛 Si Algo No Funciona

### El backend no inicia
```bash
# Verifica que MongoDB esté corriendo
# Revisa la carpeta backend/node_modules existe
cd backend
npm install
```

### El frontend no conecta con el backend
- Asegúrate que el backend esté en http://localhost:5000
- Revisa la consola del navegador (F12) para errores CORS
- Comprueba la pestaña "Network" para ver qué está pasando

### Las contraseñas no se encriptan
- Verifica que bcrypt esté instalado: `npm list bcrypt`
- Reinstala si es necesario: `npm install bcrypt`

---

## 📚 Archivos Importantes

| Archivo | Descripción |
|---------|------------|
| `backend/src/controllers/authController.js` | Lógica de login/registro |
| `backend/src/routes/auth.js` | Rutas de autenticación |
| `backend/src/models/cliente.js` | Esquema de la BD |
| `frontend/src/components/Login.js` | Pantalla de inicio |
| `frontend/src/components/Register.js` | Pantalla de registro |
| `frontend/src/components/Dashboard.js` | Panel de control |

---

¡Listo para usar! 🚀
