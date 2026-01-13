# Implementación: Múltiples Fotos con Descripción en Obituarios

## Resumen de Cambios
Se ha modificado el sistema de obituarios para permitir que los administradores suban múltiples fotos (sin límite) con descripción individual para cada una.

## Cambios Realizados

### 1. **Backend - Modelo (obituario.js)**
- ✅ Agregado campo `fotos` al schema de MongoDB como array de objetos
- Cada foto contiene:
  - `url`: URL de la imagen
  - `descripcion`: Texto descriptivo de la foto

### 2. **Backend - Controlador (obituarioController.js)**
- ✅ **crearObituario()**: Ahora procesa múltiples archivos y sus descripciones
- ✅ **actualizarObituario()**: Maneja fotos existentes y nuevas fotos a agregar
- ✅ **eliminarObituario()**: Elimina todas las fotos asociadas al eliminar un obituario
- ✅ **obtenerObituarios()**: Retorna array de fotos con URLs completas
- ✅ **obtenerObituarioPorId()**: Retorna fotos del obituario específico
- ✅ **obtenerObituariosRecientes()**: Incluye fotos en la respuesta

### 3. **Backend - Rutas (obituarios.js)**
- ✅ Cambio de `upload.single('imagen')` a `upload.array('fotos[]', 20)`
- Permite subir hasta 20 fotos en una sola solicitud
- Actualizado manejo de errores para múltiples archivos

### 4. **Frontend - Componente (AdminObituarios.jsx)**
- ✅ Reemplazado estado `imagenFile` y `previewImagen` por:
  - `fotos`: Array de fotos existentes con descripción
  - `fotosParaSubir`: Array de nuevas fotos con descripción
  
- ✅ Nuevas funciones:
  - `handleFotoChange()`: Procesa múltiples archivos seleccionados
  - `handleDescripcionFoto()`: Actualiza descripción de fotos nuevas
  - `removeFotoParaSubir()`: Elimina foto antes de subir
  - `removeFotoExistente()`: Elimina foto existente (para edición)

- ✅ Formulario mejorado:
  - Input de archivo con `multiple`
  - Muestra grid de fotos existentes (editables)
  - Muestra grid de nuevas fotos con descripción
  - Botón para eliminar fotos individuales

- ✅ Vista de obituarios:
  - Muestra todas las fotos en grid responsive
  - Muestra descripción debajo de cada foto
  - Mantiene compatibilidad con imagen antigua

### 5. **Frontend - Estilos (AdminObituarios.css)**
- ✅ Agregados estilos para:
  - `.fotos-existentes` y `.fotos-nuevas`: Contenedores con background
  - `.fotos-grid`: Grid responsive para fotos
  - `.foto-item`: Cada foto con textarea para descripción
  - `.btn-remove-foto`: Botón para eliminar fotos
  - `.fotos-grid-view`: Grid para vista de obituarios
  - `.foto-view`: Visualización de fotos con descripción

## Características Nuevas

✅ **Sin límite de fotos**: El usuario puede subir tantas fotos como quiera
✅ **Descripción para cada foto**: Cada foto tiene su propio campo de descripción
✅ **Edición flexible**: Puede agregar, editar o eliminar fotos al editar un obituario
✅ **Vista mejorada**: Las fotos se muestran en grid responsive en la lista de obituarios
✅ **Eliminar fotos**: Al eliminar un obituario, se eliminan automáticamente todas sus fotos del servidor

## Flujo de Uso

### Crear Obituario
1. Hacer clic en "Nuevo Obituario"
2. Llenar datos (nombre, fecha, mensaje, arte)
3. Seleccionar múltiples fotos (Ctrl+Click o Shift+Click)
4. Agregar descripción para cada foto
5. Guardar

### Editar Obituario
1. Hacer clic en "Editar"
2. Se cargan las fotos existentes (editables)
3. Puede agregar más fotos
4. Puede eliminar fotos existentes o nuevas
5. Guardar cambios

## Compatibilidad
- ✅ Se mantiene el campo `imagen_url` para compatibilidad con código existente
- ✅ La primera foto del array se usa como imagen principal
- ✅ Componentes que usan obituarios seguirán funcionando normalmente

## Próximas Mejoras Sugeridas (Opcional)
- Drag & drop para reorganizar fotos
- Compresión automática de imágenes
- Validación de tamaño de imagen
- Modal para ver fotos a pantalla completa
