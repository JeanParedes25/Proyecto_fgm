# 🧪 GUÍA RÁPIDA DE PRUEBAS - CARRITO DE FLORES

**Fecha:** 30 de enero de 2026  
**Sistema:** Carrito de compras para arreglos florales  

---

## ⚡ INICIO RÁPIDO

### Paso 1: Verificar Backend

```bash
cd c:\Proyecto_fgm\backend
npm start
```

✅ Debe mostrar: "Servidor corriendo en http://localhost:5000"

### Paso 2: Verificar Frontend

```bash
cd c:\Proyecto_fgm\frontend
npm start
```

✅ Debe abrir: http://localhost:3000

---

## 🎯 PRUEBA 1: AÑADIR PRODUCTO AL CARRITO

### Pasos:

1. **Iniciar sesión**
   - Email: (cualquier usuario existente)
   - Password: (contraseña del usuario)

2. **Navegar a Floristerías**
   - Clic en "🌹 Floristerías"

3. **Seleccionar un arreglo**
   - Clic en cualquier tarjeta de arreglo floral
   - Clic en "Ver Detalles →"

4. **Configurar cantidad**
   - Ver el selector de cantidad (por defecto: 1)
   - Cambiar a "3"

5. **Añadir al carrito**
   - Clic en "🛒 Añadir al carrito"

### ✅ Resultado Esperado:

```
✅ Producto añadido al carrito
```

- ✅ Mensaje aparece en color verde
- ✅ Mensaje desaparece después de 3 segundos
- ✅ NO redirige a otra pantalla
- ✅ Botón muestra "Añadiendo..." temporalmente

---

## 🎯 PRUEBA 2: ACUMULAR PRODUCTOS

### Pasos:

1. **Añadir producto A1 con cantidad 2**
   - Seleccionar arreglo A1
   - Cantidad: 2
   - Clic en "🛒 Añadir al carrito"
   - Ver mensaje de confirmación

2. **Añadir mismo producto A1 con cantidad 3**
   - Sin salir de la vista, cambiar cantidad a 3
   - Clic nuevamente en "🛒 Añadir al carrito"

3. **Verificar en base de datos**
   ```bash
   # MongoDB Compass o CLI
   use proyecto_fgm
   db.carritosflores.find().pretty()
   ```

### ✅ Resultado Esperado:

```json
{
  "items": [
    {
      "codigo": "A1",
      "cantidad": 5,        // 2 + 3
      "subtotal": 225.00    // precio × 5
    }
  ],
  "total": 225.00
}
```

---

## 🎯 PRUEBA 3: VALIDACIÓN DE CANTIDAD

### Pasos:

1. **Seleccionar un arreglo**
   - Ver detalles de cualquier arreglo

2. **Intentar cantidad inválida**
   - Escribir "0" en el input de cantidad
   - Clic en "🛒 Añadir al carrito"

3. **Intentar cantidad negativa**
   - Escribir "-1" en el input
   - Clic en "🛒 Añadir al carrito"

### ✅ Resultado Esperado:

- ✅ Alert: "Por favor, verifica que la cantidad sea válida (mínimo 1)"
- ✅ Producto NO se añade al carrito
- ✅ Input no acepta valores < 1

---

## 🎯 PRUEBA 4: PEDIDO DIRECTO (SIN CARRITO)

### Pasos:

1. **Seleccionar un arreglo**
   - Ver detalles

2. **Hacer pedido directo**
   - Clic en "💳 Hacer Pedido" (NO en carrito)

3. **Llenar formulario**
   - Nombre del fallecido: "Juan Pérez"
   - Cantidad: 2

4. **Continuar con el flujo**
   - Ver cuentas bancarias
   - Confirmar pedido

### ✅ Resultado Esperado:

- ✅ Flujo funciona exactamente igual que antes
- ✅ Pedido se crea en `pedidos_flores` (NO en carrito)
- ✅ Redirige a confirmación
- ✅ Botón WhatsApp disponible

---

## 🎯 PRUEBA 5: API - OBTENER CARRITO

### Request:

```bash
# Reemplazar <TOKEN> con tu token JWT
curl -X GET http://localhost:5000/api/carrito \
  -H "Authorization: Bearer <TOKEN>"
```

### ✅ Resultado Esperado (carrito vacío):

```json
{
  "mensaje": "Carrito obtenido correctamente",
  "carrito": {
    "_id": "...",
    "usuario": "...",
    "items": [],
    "total": 0,
    "fechaCreacion": "2026-01-30T...",
    "fechaActualizacion": "2026-01-30T..."
  }
}
```

### ✅ Resultado Esperado (con productos):

```json
{
  "mensaje": "Carrito obtenido correctamente",
  "carrito": {
    "items": [
      {
        "productoId": "...",
        "codigo": "A1",
        "descripcion": "Rosas rojas",
        "precioUnitario": 45.00,
        "cantidad": 5,
        "subtotal": 225.00
      },
      {
        "productoId": "...",
        "codigo": "A2",
        "descripcion": "Lirios blancos",
        "precioUnitario": 35.00,
        "cantidad": 2,
        "subtotal": 70.00
      }
    ],
    "total": 295.00
  }
}
```

---

## 🎯 PRUEBA 6: API - AÑADIR AL CARRITO

### Request:

```bash
curl -X POST http://localhost:5000/api/carrito \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "productoId": "507f1f77bcf86cd799439011",
    "cantidad": 3
  }'
```

### ✅ Resultado Esperado:

```json
{
  "mensaje": "Producto añadido al carrito correctamente",
  "carrito": {
    "items": [
      {
        "productoId": "507f1f77bcf86cd799439011",
        "codigo": "...",
        "descripcion": "...",
        "precioUnitario": 45.00,
        "cantidad": 3,
        "subtotal": 135.00
      }
    ],
    "total": 135.00
  },
  "itemAgregado": { /* detalles del item */ }
}
```

---

## 🔍 VERIFICACIÓN EN BASE DE DATOS

### MongoDB Compass

1. Conectar a: `mongodb://localhost:27017`
2. Base de datos: `proyecto_fgm`
3. Colección: `carritosflores`

### Estructura Esperada:

```javascript
{
  _id: ObjectId("..."),
  usuario: ObjectId("..."),
  items: [
    {
      productoId: ObjectId("..."),
      codigo: "A1",
      descripcion: "Rosas rojas",
      precioUnitario: 45.00,
      cantidad: 5,
      subtotal: 225.00
    }
  ],
  total: 225.00,
  fechaCreacion: ISODate("2026-01-30T..."),
  fechaActualizacion: ISODate("2026-01-30T...")
}
```

### Consultas Útiles:

```javascript
// Ver todos los carritos
db.carritosflores.find().pretty()

// Ver carrito de un usuario específico
db.carritosflores.findOne({ usuario: ObjectId("...") })

// Contar productos en todos los carritos
db.carritosflores.aggregate([
  { $unwind: "$items" },
  { $group: { _id: null, totalProductos: { $sum: "$items.cantidad" } } }
])

// Vaciar todos los carritos (SOLO PARA PRUEBAS)
db.carritosflores.deleteMany({})
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Problema 1: "Cannot POST /api/carrito"

**Causa:** Servidor backend no está corriendo

**Solución:**
```bash
cd c:\Proyecto_fgm\backend
npm start
```

### Problema 2: Error 401 Unauthorized

**Causa:** Token JWT no válido o expirado

**Solución:**
1. Cerrar sesión
2. Iniciar sesión nuevamente
3. Intentar añadir al carrito nuevamente

### Problema 3: Mensaje no desaparece

**Causa:** JavaScript no ejecuta setTimeout

**Solución:**
1. Abrir consola del navegador (F12)
2. Buscar errores en la consola
3. Refrescar página

### Problema 4: Cantidad no se actualiza

**Causa:** Input no está sincronizado con estado

**Solución:**
1. Verificar que el valor cambia en el input
2. Revisar consola por errores
3. Recargar página

### Problema 5: Producto no existe en carrito

**Causa:** ID del producto incorrecto

**Solución:**
```javascript
// En consola del navegador:
console.log(floraSeleccionada._id);
// Verificar que retorna un ID válido
```

---

## 📊 CHECKLIST DE PRUEBAS

### Funcionalidad

- [ ] ✅ Producto se añade al carrito
- [ ] ✅ Mensaje de confirmación aparece
- [ ] ✅ Mensaje desaparece después de 3s
- [ ] ✅ Usuario permanece en la misma pantalla
- [ ] ✅ Cantidad se puede cambiar
- [ ] ✅ Producto acumula cantidad si ya existe
- [ ] ✅ Total se recalcula correctamente
- [ ] ✅ Pedido directo sigue funcionando

### Validaciones

- [ ] ✅ Cantidad mínima = 1
- [ ] ✅ No acepta negativos
- [ ] ✅ No acepta decimales
- [ ] ✅ No acepta texto
- [ ] ✅ Token JWT requerido
- [ ] ✅ Producto debe existir

### UI/UX

- [ ] ✅ Botones lado a lado
- [ ] ✅ Botón se deshabilita al añadir
- [ ] ✅ Texto cambia a "Añadiendo..."
- [ ] ✅ Mensaje verde de confirmación
- [ ] ✅ Hover funciona en botones

### Base de Datos

- [ ] ✅ Carrito se crea automáticamente
- [ ] ✅ Items se guardan correctamente
- [ ] ✅ Subtotal correcto
- [ ] ✅ Total correcto
- [ ] ✅ Fechas se actualizan
- [ ] ✅ Un carrito por usuario

---

## 🚀 SIGUIENTE PASO

Una vez completadas todas las pruebas, el sistema está listo para:

1. **Crear vista de carrito** (opcional)
2. **Implementar checkout desde carrito** (opcional)
3. **Añadir badge con cantidad** (opcional)

---

## 📞 REFERENCIAS

- **Documentación completa:** `CARRITO_FLORES_IMPLEMENTACION.md`
- **Casos de uso:** Ver sección "📊 CASOS DE USO" en documentación
- **API Reference:** Ver endpoints en documentación

---

**Creado por:** GitHub Copilot  
**Fecha:** 30 de enero de 2026  
**Versión:** 1.0  

✅ **GUÍA DE PRUEBAS COMPLETA**
