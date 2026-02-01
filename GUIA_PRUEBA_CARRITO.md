# 🧪 GUÍA DE PRUEBA: CARRITO GLOBAL

**Fecha:** 30 de enero de 2026  
**Sistema:** Carrito Global v3.0  
**Estado:** ✅ Listo para probar  

---

## ✅ Verificación Previa

### Backend Activo

```bash
✅ Servidor corriendo en http://localhost:5000
✅ Conectado a MongoDB
✅ Sin errores en los logs
```

### Frontend Activo

```bash
✅ Servidor en http://localhost:3000 (o 3001)
✅ Sesión iniciada
✅ Token guardado en localStorage
```

---

## 🧪 PRUEBAS PASO A PASO

### PRUEBA 1: Carrito Se Crea Automáticamente

**Objetivo:** Verificar que al obtener el carrito, se crea automáticamente si no existe

**Pasos:**

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. En el navegador, ve a Dashboard
4. Haz clic en "🛒 Mi Carrito"
5. Observa el carrito

**Resultado Esperado:**
- ✅ Carrito se abre sin errores
- ✅ Mensaje: "Tu carrito está vacío"
- ✅ Status 200 en la request

**Verificación en DB:**
```javascript
use proyecto_fgm
db.carrito.findOne({ usuarioId: ObjectId("...") })
// Resultado: carrito con items: [], total: 0
```

---

### PRUEBA 2: Agregar Producto al Carrito

**Objetivo:** Verificar que se puede agregar un producto sin errores 500

**Pasos:**

1. Ve a "🌹 Floristerías"
2. Selecciona un arreglo
3. Cambia cantidad a "3"
4. Haz clic en "🛒 Añadir al carrito"
5. Observa el mensaje

**Resultado Esperado:**
- ✅ Mensaje: "✅ Producto añadido al carrito"
- ✅ Mensaje desaparece en 3 segundos
- ✅ Badge en header muestra: "🛒 Mi Carrito 1"
- ✅ NO hay error 500
- ✅ Status 200 en la request

**Verificación en DB:**
```javascript
db.carrito.findOne({ usuarioId: ObjectId("...") })
// items debe tener 1 elemento
// total debe ser: 3 * precioUnitario
```

---

### PRUEBA 3: Ver Carrito Actualizado

**Objetivo:** Verificar que el carrito muestra los productos correctamente

**Pasos:**

1. Clic en "🛒 Mi Carrito" del header
2. Observa la vista del carrito

**Resultado Esperado:**
- ✅ Se abre la vista del carrito
- ✅ Muestra el producto agregado
- ✅ Muestra cantidad: 3
- ✅ Muestra precio unitario correcto
- ✅ Muestra subtotal: 3 × precio
- ✅ Muestra total general correcto
- ✅ Status 200 en la request

---

### PRUEBA 4: Agregar el Mismo Producto Nuevamente

**Objetivo:** Verificar que suma cantidades, no crea items duplicados

**Pasos:**

1. Ve a "Floristerías"
2. Selecciona el MISMO arreglo
3. Cantidad: "2"
4. Clic en "🛒 Añadir al carrito"
5. Clic en "🛒 Mi Carrito"

**Resultado Esperado:**
- ✅ Solo un item en el carrito
- ✅ Cantidad ahora: 5 (3 + 2)
- ✅ Subtotal recalculado: 5 × precio
- ✅ Total actualizado

**Verificación en DB:**
```javascript
db.carrito.findOne({ usuarioId: ObjectId("...") })
// items.length === 1
// items[0].cantidad === 5
// total === 5 * precio
```

---

### PRUEBA 5: Cambiar Cantidad en la Vista del Carrito

**Objetivo:** Verificar que se puede cambiar cantidad con +/-

**Pasos:**

1. En "Mi Carrito", ubica el producto
2. Clic en "+" para aumentar cantidad
3. Observa cambios

**Resultado Esperado:**
- ✅ Cantidad aumenta a 6
- ✅ Subtotal recalcula automáticamente
- ✅ Total se actualiza
- ✅ Sin errores en consola
- ✅ Status 200 en request

**Verificación:**
```javascript
db.carrito.findOne({ usuarioId: ObjectId("...") })
// items[0].cantidad === 6
```

---

### PRUEBA 6: Disminuir Cantidad

**Objetivo:** Verificar que funciona el botón "-"

**Pasos:**

1. Clic en "-" para disminuir
2. Clic varias veces
3. Observa cambios

**Resultado Esperado:**
- ✅ Cantidad disminuye
- ✅ Subtotal actualiza
- ✅ Total actualiza
- ✅ Mínimo 1 (no puede ser 0)
- ✅ Status 200

---

### PRUEBA 7: Eliminar Producto

**Objetivo:** Verificar que se puede eliminar un producto

**Pasos:**

1. En "Mi Carrito", ubica el producto
2. Clic en botón "🗑️" (eliminar)
3. Confirma la acción

**Resultado Esperado:**
- ✅ Diálogo de confirmación aparece
- ✅ Al confirmar, producto desaparece
- ✅ Total se actualiza a 0
- ✅ Carrito muestra vacío
- ✅ Badge desaparece del header
- ✅ Status 200

**Verificación:**
```javascript
db.carrito.findOne({ usuarioId: ObjectId("...") })
// items.length === 0
// total === 0
```

---

### PRUEBA 8: Agregar Múltiples Productos Diferentes

**Objetivo:** Verificar que el carrito maneja múltiples items

**Pasos:**

1. Ve a Floristerías
2. Selecciona arreglo A, cantidad 2, añade al carrito
3. Ve a Floristerías
4. Selecciona arreglo B, cantidad 3, añade al carrito
5. Ve a Floristerías
6. Selecciona arreglo C, cantidad 1, añade al carrito
7. Clic en "🛒 Mi Carrito"

**Resultado Esperado:**
- ✅ Carrito muestra 3 items
- ✅ Totales correctos para cada uno
- ✅ Total general correcto
- ✅ Badge muestra: "🛒 Mi Carrito 3"
- ✅ Status 200

**Verificación:**
```javascript
db.carrito.findOne({ usuarioId: ObjectId("...") })
// items.length === 3
// total === (2*precioA) + (3*precioB) + (1*precioC)
```

---

### PRUEBA 9: Vaciar Carrito

**Objetivo:** Verificar que se puede vaciar completamente

**Pasos:**

1. En "Mi Carrito" con varios productos
2. Clic en "🗑️ Vaciar carrito"
3. Confirma la acción

**Resultado Esperado:**
- ✅ Diálogo de confirmación
- ✅ Al confirmar, todos los items desaparecen
- ✅ Mensaje: "Tu carrito está vacío"
- ✅ Total: 0
- ✅ Badge desaparece
- ✅ Status 200

**Verificación:**
```javascript
db.carrito.findOne({ usuarioId: ObjectId("...") })
// items === []
// total === 0
```

---

### PRUEBA 10: Carrito Persiste (Reload)

**Objetivo:** Verificar que el carrito se mantiene tras reload

**Pasos:**

1. Agregar 1 producto al carrito
2. Badge muestra: "🛒 Mi Carrito 1"
3. Recarga la página (F5)
4. Verifica el carrito

**Resultado Esperado:**
- ✅ Carrito sigue con 1 producto
- ✅ Badge sigue visible con "1"
- ✅ Total correcto
- ✅ Datos persistidos en MongoDB

---

### PRUEBA 11: Token Expirado

**Objetivo:** Verificar comportamiento con token inválido

**Pasos:**

1. Abre DevTools (F12)
2. Consola: `localStorage.removeItem('token')`
3. Intenta acceder al carrito

**Resultado Esperado:**
- ✅ Error 401 (no 500)
- ✅ Redirige a login
- ✅ Inicia sesión nuevamente

---

### PRUEBA 12: Carrito de Otro Usuario

**Objetivo:** Verificar que cada usuario tiene su carrito

**Pasos:**

1. Usuario A: agrega producto al carrito
2. Cierra sesión
3. Usuario B: inicia sesión
4. Accede al carrito

**Resultado Esperado:**
- ✅ Usuario B ve carrito vacío
- ✅ NO ve productos de Usuario A
- ✅ Datos separados en MongoDB

**Verificación:**
```javascript
db.carrito.find({})
// Debe haber 2 documentos (uno por usuario)
```

---

## 🔍 Verificaciones en DevTools

### Network Tab

**Al agregar producto:**
```
POST /api/carrito
Status: 200
Response: 
{
  "success": true,
  "mensaje": "Producto añadido al carrito correctamente",
  "carrito": { ... }
}
```

### Console

**No debe haber errores:**
```
❌ Error de carrito
❌ Error 500
❌ TypeError
✅ Logs limpios
```

### Application / Storage

**localStorage debe tener:**
```javascript
token: "eyJhbGc..."
usuario: "{...}"
```

---

## 📊 Resultados MongoDB

**Después de todas las pruebas:**

```javascript
use proyecto_fgm

// Ver carritos creados
db.carrito.find({}).pretty()

// Resultado esperado:
[
  {
    _id: ObjectId("..."),
    usuarioId: ObjectId("usuario1"),
    items: [
      {
        productoId: ObjectId("..."),
        tipo: "flor",
        codigo: "A1",
        descripcion: "Rosas Rojas",
        precioUnitario: 45,
        cantidad: 5,
        subtotal: 225
      }
    ],
    total: 225,
    estado: "activo",
    createdAt: ISODate("2026-01-30T..."),
    updatedAt: ISODate("2026-01-30T...")
  }
]
```

---

## ✅ Checklist de Pruebas

- [ ] Carrito se crea automáticamente
- [ ] Agregar producto funciona (status 200)
- [ ] Ver carrito funciona
- [ ] Sumar cantidades (mismo producto)
- [ ] Cambiar cantidad con +/-
- [ ] Eliminar producto
- [ ] Vaciar carrito
- [ ] Múltiples productos diferentes
- [ ] Datos persisten tras reload
- [ ] Token expirado maneja bien
- [ ] Cada usuario tiene su carrito
- [ ] No hay error 500 en ningún caso
- [ ] Todos los status son 200
- [ ] MongoDB tiene los datos correctos

---

## 🎯 Resultado Final

Si todas las pruebas pasan: ✅ **CARRITO COMPLETAMENTE FUNCIONAL**

Si hay algún error: 📝 **Reportar con screenshot de DevTools**

---

**Pruebas completadas por:** (Tu nombre)  
**Fecha:** 30 de enero de 2026  
**Estado:** ✅ Todo funciona
