# 🚀 INICIO RÁPIDO: CONFIGURACIÓN DE EMPRESA

## ✅ ¿QUÉ SE IMPLEMENTÓ?

Un módulo completo de Configuración de Empresa que centraliza todos los datos institucionales.

---

## 🎯 LO MÁS IMPORTANTE

### Backend
✅ **Modelo:** `backend/src/models/empresa.js`  
✅ **Controlador:** `backend/src/controllers/empresaController.js`  
✅ **Rutas:** `backend/src/routes/empresa.js`  
✅ **Seeding:** `backend/src/scripts/seedEmpresa.js`  

### Frontend
✅ **Panel Admin:** `frontend/src/components/AdminEmpresa.jsx`  
✅ **Hook:** `frontend/src/hooks/useEmpresa.js`  
✅ **Servicio:** `frontend/src/services/empresaService.js`  
✅ **Footer actualizado:** `frontend/src/components/Footer.js`  

---

## 🏃 PRIMEROS PASOS

### 1. Iniciar Backend
```bash
cd backend
npm start
```
Deberías ver en consola:
```
✅ Datos de empresa insertados correctamente
```

### 2. Acceder como Admin
- Email: `israelmendoza18@hotmail.com`
- Dashboard → 🏢 Configuración de Empresa

### 3. Verificar
- Panel de admin muestra datos en modo lectura
- Click "Editar" para modificar
- Click "Guardar" para actualizar BD

---

## 📱 ENDPOINTS

```bash
# Obtener datos (público)
GET http://localhost:5000/api/empresa

# Actualizar datos (solo admin)
PUT http://localhost:5000/api/empresa
Header: Authorization: Bearer <token>
Body: { nombreEmpresa, direccion, telefono, correo, paginaWeb, derechosReservados }
```

---

## 🎨 INTERFACES

### Footer
- Datos dinámicos desde `/api/empresa`
- Se actualiza automáticamente
- Teléfonos y email clicables

### AdminEmpresa (Panel Admin)
- Modo lectura por defecto
- Botón "Editar" para habilitar forma
- Validación de campos
- Manejo dinámico de teléfonos
- Mensajes de éxito/error

### Services
- Teléfono y email dinámicos
- Consume datos de BD

---

## 🔑 CARACTERÍSTICAS

✅ Base de datos única (garantizado con `esUnico: true`)  
✅ Seeding automático al iniciar  
✅ API pública (GET) y protegida (PUT)  
✅ Panel de admin con edición  
✅ Caché de 5 minutos en frontend  
✅ Fallback a datos por defecto  
✅ Sin datos hardcodeados  
✅ Validación en frontend y backend  
✅ Fecha de actualización automática  
✅ Hook reutilizable para otros componentes  

---

## 🧪 PRUEBA RÁPIDA

1. Backend corriendo ✅
2. Ir a Dashboard → Configuración de Empresa ✅
3. Verificar que muestra:
   - Nombre: "Funerales Gonzalo Mendoza"
   - Dirección: "España 19-31 y Olmedo, Riobamba - Ecuador"
   - Teléfonos: 099 282 9095, 032 944 608, 098 402 1738
   - Email: israelmendoza18@hotmail.com
   - Web: www.funeralesgonzalomendoza.com

4. Click "Editar" y cambiar un campo
5. Click "Guardar cambios"
6. Verificar que se actualiza ✅
7. Ir al Footer y verificar que refleja el cambio ✅

---

## 📂 ARCHIVOS NUEVOS

```
✨ BACKEND:
   - models/empresa.js
   - controllers/empresaController.js
   - routes/empresa.js
   - scripts/seedEmpresa.js

✨ FRONTEND:
   - components/AdminEmpresa.jsx
   - components/AdminEmpresa.css
   - hooks/useEmpresa.js
   - services/empresaService.js

✏️ ACTUALIZADOS:
   - backend/src/server.js
   - frontend/src/components/Footer.js
   - frontend/src/components/Services.jsx
   - frontend/src/components/Dashboard.js

📚 DOCUMENTACIÓN:
   - CONFIGURACION_EMPRESA_IMPLEMENTACION.md
   - ARQUITECTURA_CONFIGURACION_EMPRESA.md
   - GUIA_PRUEBA_CONFIGURACION_EMPRESA.md
```

---

## 🔧 PERSONALIZACIÓN

Cambiar datos por defecto:

### Backend - seedEmpresa.js
```javascript
const datosEmpresa = {
  nombreEmpresa: "Tu nombre",
  direccion: "Tu dirección",
  telefono: ["Tu teléfono"],
  correo: "tu@correo.com",
  paginaWeb: "www.tuslitio.com",
  derechosReservados: "© Tu empresa. Derechos..."
};
```

### Frontend - empresaService.js
```javascript
const datosEmpresaPorDefecto = () => ({
  nombreEmpresa: "Tu nombre",
  // ... resto de datos
});
```

---

## 🚀 PRÓXIMAS MEJORAS

- [ ] Agregar upload de logo
- [ ] Agregar redes sociales
- [ ] Historial de cambios
- [ ] Exportar a PDF
- [ ] Multi-idioma

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Dónde se guardan los datos?**  
R: En MongoDB, colección `empresas`

**P: ¿Puedo editar desde el frontend?**  
R: Solo admin puede, en Dashboard → Configuración de Empresa

**P: ¿Qué pasa si borro la colección?**  
R: Se recreará automáticamente al iniciar servidor con datos por defecto

**P: ¿Puedo tener múltiples empresas?**  
R: No, el sistema garantiza UN solo documento con `esUnico: true`

**P: ¿Los datos son públicos?**  
R: Sí, GET es público. PUT solo para admin.

**P: ¿Cuánto demora en actualizarse el Footer?**  
R: Inmediato en admin. Usuarios: hasta 5 minutos (caché)

---

## 📞 DATOS ACTUALES

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

## 📖 DOCUMENTACIÓN COMPLETA

- [Implementación Detallada](CONFIGURACION_EMPRESA_IMPLEMENTACION.md)
- [Arquitectura y Diagramas](ARQUITECTURA_CONFIGURACION_EMPRESA.md)
- [Guía de Pruebas](GUIA_PRUEBA_CONFIGURACION_EMPRESA.md)

---

**¡Implementación completada!** ✅
