# 📸 Implementación de Imágenes en Servicios y Floristerías

## ✅ Cambios Realizados

### Backend - Controladores

#### **servicioController.js**
- ✅ Actualizado `obtenerServicios()` - Agrega URLs completas a las fotos
- ✅ Actualizado `obtenerServicioPorId()` - Agrega URLs completas a las fotos
- ✅ Mantiene la estructura `fotos[]` con `url` y `descripcion`
- ✅ Genera URLs absolutas: `http://localhost:5000/uploads/servicios/...`

#### **floristeriasController.js**
- ✅ Actualizado `obtenerFlores()` - Agrega URLs completas a las fotos
- ✅ Actualizado `obtenerFlorPorId()` - Agrega URLs completas a las fotos
- ✅ Actualizado `crearFlor()` - Ahora maneja múltiples fotos (antes: imagen singular)
- ✅ Actualizado `actualizarFlor()` - Maneja múltiples fotos con `fotosExistentes`
- ✅ Actualizado `eliminarFlor()` - Elimina múltiples archivos
- ✅ Estructura de fotos: `{url, descripcion}`

### Backend - Rutas

#### **servicios.js** (Sin cambios necesarios)
- ✅ Ya está configurado correctamente con `upload.array('fotos[]', 4)`
- ✅ Permite hasta 4 imágenes por servicio
- ✅ Archivos permitidos: `.jpg`, `.png`
- ✅ Tamaño máximo: 50MB

#### **floristerias.js** (Actualizado)
- ✅ Cambió de `upload.single('imagen')` a `upload.array('fotos[]', 4)`
- ✅ Ahora permite hasta 4 imágenes por flor
- ✅ Manejo de errores mejorado: "Error al subir imágenes"
- ✅ Archivos permitidos: `.jpg`, `.png`

### Frontend - Componentes

#### **AdminServicios.jsx**
- ✅ Mejorada visualización de fotos existentes con preview
- ✅ Grid de galerías con imágenes (`fotos-preview`)
- ✅ Inputs para editar descripción de cada foto
- ✅ Botones para eliminar fotos
- ✅ Muestra galerería en las tarjetas de servicios

#### **AdminFloristerias.jsx**
- ✅ Eliminado código duplicado
- ✅ Mejorada visualización de fotos existentes con preview
- ✅ Grid de galerías con imágenes (`fotos-preview`)
- ✅ Inputs para editar descripción de cada foto
- ✅ Botones para eliminar fotos
- ✅ Muestra galería de múltiples fotos en las tarjetas

### Frontend - Estilos CSS

#### **AdminServicios.css**
```css
.fotos-preview { }        /* Grid de previsualizaciones */
.foto-item { }            /* Contenedor individual de foto */
.foto-item img { }        /* Imagen con object-fit: cover */
.foto-item input { }      /* Input para descripción */
.foto-item button { }     /* Botón eliminar */
.servicio-fotos { }       /* Galería en tarjeta */
.servicio-fotos img { }   /* Imágenes en tarjeta */
```

#### **AdminFloristerias.css**
```css
.fotos-preview { }        /* Grid de previsualizaciones */
.foto-item { }            /* Contenedor individual de foto */
.foto-item img { }        /* Imagen con object-fit: cover */
.foto-item input { }      /* Input para descripción */
.foto-item button { }     /* Botón eliminar */
.flor-images { }          /* Galería en tarjeta */
.flor-images img { }      /* Imágenes en tarjeta */
```

## 📁 Estructura de Carpetas

```
backend/uploads/
├── servicios/          ✅ Existe
├── floristerias/       ✅ Existe
└── obituarios/         ✅ Existe (referencia)
```

## 🔄 Flujo de Subida de Imágenes

### Crear Servicio/Flor:
1. Usuario selecciona 1-4 imágenes (.jpg/.png)
2. Se muestran previsualizaciones en el formulario
3. Usuario puede editar descripción de cada foto
4. Al enviar, se envían las imágenes via `FormData`
5. Backend guarda en `/uploads/servicios/` o `/uploads/floristerias/`
6. Backend devuelve la URL: `/uploads/servicios/servicio-timestamp.jpg`
7. Frontend convierte a URL absoluta: `http://localhost:5000/uploads/servicios/...`

### Editar Servicio/Flor:
1. Se cargan fotos existentes con URLs
2. Usuario puede agregar nuevas fotos
3. Se envía `fotosExistentes` (JSON) + nuevas fotos
4. Backend mantiene fotos existentes + agrega nuevas
5. Backend devuelve lista actualizada

### Eliminar Servicio/Flor:
1. Se elimina el registro de la BD
2. Backend elimina TODOS los archivos asociados
3. Frontend se actualiza automáticamente

## 🖼️ Visualización en Frontend

### AdminServicios.jsx
```jsx
{Array.isArray(s.fotos) && s.fotos.length > 0 && (
  <div className="servicio-fotos">
    {s.fotos.map((foto, idx) => (
      <img key={idx} src={foto.url} alt={`${s.nombre} ${idx + 1}`} />
    ))}
  </div>
)}
```

### AdminFloristerias.jsx
```jsx
{Array.isArray(flor.fotos) && flor.fotos.length > 0 ? (
  flor.fotos.map((foto, idx) => (
    <img key={idx} src={foto.url} alt={`${flor.codigo} ${idx + 1}`} />
  ))
) : (
  <div className="no-image">Sin imágenes</div>
)}
```

## 🧪 Cómo Probar

### 1. Crear Servicio con Imágenes:
- Ir a "Gestión de Servicios Exequiales"
- Clic en "Nuevo Servicio"
- Completar: Nombre, Precio, Descripción
- Seleccionar 1-4 fotos (.jpg/.png)
- Ver previsualizaciones de fotos
- Editar descripción de cada foto (opcional)
- Clic en "Crear servicio"
- Verificar que las imágenes se muestren en la tarjeta

### 2. Editar Servicio:
- Clic en "Editar" en una tarjeta
- Ver fotos existentes con sus URLs
- Opcionalmente agregar nuevas fotos
- Modificar descripciones
- Clic en "Guardar cambios"
- Verificar cambios

### 3. Crear Flor con Imágenes:
- Ir a "Gestión de Floristerías"
- Clic en "Nueva Flor"
- Completar: Código, Precio, Descripción
- Seleccionar 1-4 fotos (.jpg/.png)
- Ver previsualizaciones de fotos
- Editar descripción de cada foto (opcional)
- Clic en "Crear flor"
- Verificar que las imágenes se muestren en la tarjeta

### 4. Verificar Servidor Estático:
```bash
# En navegador:
http://localhost:5000/uploads/servicios/servicio-1705791234-123456789.jpg
http://localhost:5000/uploads/floristerias/flor-1705791234-987654321.png
```

## 🎯 Requisitos Cumplidos

✅ **1. La subida funciona IGUAL que en OBITUARIOS**
- Mismo uso de `multer` con `upload.array()`
- Mismo manejo de `FormData` en frontend
- Misma estructura de fotos: `{url, descripcion}`

✅ **2. Misma topología de carpetas, multer, rutas y express.static**
- `/uploads/servicios/`
- `/uploads/floristerias/`
- Configurado en `server.js`: `app.use('/uploads', express.static(path.join(__dirname, '../uploads')))`

✅ **3. Imágenes guardadas en carpetas correctas**
- Backend: `backend/uploads/servicios/`
- Backend: `backend/uploads/floristerias/`

✅ **4. Archivos permitidos: .jpg y .png**
- `fileFilter` en ambas rutas valida MIME types y extensiones

✅ **5. Backend sirve las imágenes para visualización**
- Express.static configurado en server.js
- URLs retornadas: `/uploads/servicios/archivo.jpg`
- Frontend convierte a: `http://localhost:5000/uploads/servicios/archivo.jpg`

✅ **6. Frontend muestra imagen real, no ícono roto**
- Previsualizaciones con `FileReader` en el formulario
- Galerías en tarjetas muestran `img.url`
- `onError` handler para manejar errores de carga

✅ **7. Solo se modificó lógica de imágenes**
- Formularios intactos
- Estilos intactos (solo agregados nuevos para galerías)
- Lógica de negocio intacta
- Otros campos sin cambios

## 📝 Notas Importantes

- Las imágenes se guardan con nombres únicos: `servicio-{timestamp}-{random}.ext`
- Al eliminar un registro, se eliminan TODOS los archivos asociados
- Las URLs son relativas en BD pero se convierten a absolutas en las respuestas
- Máximo 4 imágenes por servicio/flor (configurable en multer)
- Tamaño máximo por archivo: 50MB
