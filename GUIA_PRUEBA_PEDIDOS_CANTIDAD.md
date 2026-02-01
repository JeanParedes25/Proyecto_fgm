# 🧪 Guía Rápida de Prueba - Pedidos de Flores con Cantidad

## 🚀 Pasos Iniciales

### 1. Iniciar el Backend
```bash
cd backend
npm start
```
**Esperado:** "✅ Servidor corriendo en puerto 5000"

### 2. Iniciar el Frontend
```bash
cd frontend
npm start
```
**Esperado:** Abre en navegador (localhost:3000)

---

## 📋 Prueba 1: Crear Pedido con Cantidad

### Pasos
1. **Iniciar sesión** como usuario normal (no admin)
2. Ir a **"Floristerías"** desde el panel
3. Seleccionar cualquier arreglo floral
4. Hacer clic en **"💳 Hacer Pedido"**

### ✅ Pantalla 1: Formulario
**Debe mostrar:**
- Campo "Nombre de la persona fallecida" (obligatorio)
- Campo "Cantidad de arreglos" (obligatorio)
- Sección "Información del Arreglo":
  - Código: FLRx
  - Descripción: [texto]
  - Precio Unitario: $XX.XX (no el total)
  - **Total: $XX.XX** (calculado dinámicamente)

**Pruebas de cantidad:**
- Dejar en 1 → Total = Precio
- Cambiar a 3 → Total = Precio × 3 ✅
- Cambiar a 5 → Total = Precio × 5 ✅
- Intentar 0 → No acepta
- Intentar -1 → No acepta
- Intentar 1.5 → Solo acepta enteros

**Cuando cantidad es válida:**
- Ingresar nombre de fallecido
- Clic en "Ver Cuentas Bancarias →"

### ✅ Pantalla 2: Cuentas Bancarias
**Debe mostrar:**
```
Cuentas Bancarias para el Pago

┌─────────────────────────────────┐
│ Banco X | Cuenta | Datos        │
└─────────────────────────────────┘

Detalle del Pago:
├─ Precio Unitario: $25.00
├─ Cantidad: 3
└─ Total a Transferir: $75.00

Concepto: Arreglo floral ARRx x 3
```

**Verificar:**
- ✅ Precio unitario correcto
- ✅ Cantidad mostrada
- ✅ Total = Precio × Cantidad
- ✅ Concepto incluye cantidad

### ✅ Pantalla 3: Confirmación
**Debe mostrar:**
```
✅ ¡Pedido Realizado!

Resumen del Pedido
├─ Arreglo: ARRx
├─ Descripción: [texto]
├─ Cantidad: 3
├─ Precio Unitario: $25.00
├─ Destinatario: [nombre]
└─ Total a Pagar: $75.00

[📲 Enviar Comprobante por WhatsApp]
```

**Verificar:**
- ✅ Cantidad mostrada
- ✅ Precio unitario mostrado
- ✅ Total correcto (25 × 3 = 75)

---

## 🗄️ Prueba 2: Verificar MongoDB

### Conectar a MongoDB Compass
```
mongodb://localhost:27017/proyecto_fgm
Colección: pedidos_flores
```

### Buscar último pedido
```json
{ "estado": "pendiente" }
```

### ✅ Verificar Campos
El documento debe contener:
```javascript
{
  "_id": ObjectId("..."),
  "codigoArreglo": "ARRx",
  "precioUnitario": 25.00,
  "cantidad": 3,
  "total": 75.00,
  "nombrePersonaFallecida": "Juan Pérez",
  "nombreCliente": "usuario@email.com",
  "estado": "pendiente",
  "fechaPedido": ISODate("2026-01-30T..."),
  // ... otros campos
}
```

**Validar:**
- [x] `precioUnitario` = 25.00
- [x] `cantidad` = 3
- [x] `total` = 75.00 (calculado correctamente)

---

## 👥 Prueba 3: Ver en "Mis Pedidos"

### Pasos
1. Mantenerse logueado como el usuario que hizo el pedido
2. Ir a **"Mis Pedidos"**

### ✅ Card del Pedido
**Debe mostrar:**
```
Pedido #XXXXX | ⏳ Pendiente
[Fecha y hora]

Arreglo: ARRx
Descripción: Arreglo de flores...
Cantidad: 3
Para: Juan Pérez
Precio Unitario: $25.00
Total: $75.00
```

**Verificar:**
- [x] Cantidad visible
- [x] Precio unitario visible
- [x] Total visible (no el precio unitario)
- [x] Estado correcto

---

## 🔐 Prueba 4: Panel Admin

### Pasos
1. **Cerrar sesión** del usuario
2. **Iniciar sesión** como admin (Israel Mendoza)
3. Ir a **"Gestión de Pedidos de Flores"**

### ✅ Card del Pedido en Admin
**Debe mostrar:**
```
Pedido #XXXXX | ⏳ Pendiente
[Fecha y hora]

👤 Cliente
├─ Nombre: usuario
├─ Email: usuario@email.com
└─ Teléfono: 0998794800

🌹 Detalles del Pedido
├─ Arreglo: ARRx
├─ Descripción: Arreglo de...
├─ Para: Juan Pérez
├─ Cantidad: 3
├─ Precio Unitario: $25.00
└─ Total: $75.00

[✅ Confirmar] [❌ Cancelar]
```

**Verificar:**
- [x] Cantidad visible
- [x] Precio unitario visible
- [x] Total visible
- [x] Botones de acción disponibles

### Cambiar Estado
1. Hacer clic en **"✅ Confirmar"**
2. Confirmar en el diálogo
3. **Esperar:** Estado cambia a "Confirmado"
4. Card ahora muestra: "✅ Este pedido ha sido confirmado"

---

## 📄 Prueba 5: Comprobante PDF (Integración)

### Pasos
1. El usuario vuelve a "Mis Pedidos"
2. El pedido ahora muestra estado "Confirmado" ✅
3. Hace clic en **"📄 Generar comprobante"**
4. **Se abre PDF en nueva pestaña**

### ✅ Verificar en PDF
**El PDF debe mostrar:**
```
Arreglo: ARRx
Descripción: Arreglo de...
Cantidad: 3
Precio Unitario: $25.00
Total: $75.00
```

---

## 🔄 Prueba 6: Flujo Completo

### Checklist Final
```
FRONTEND
□ Campo de cantidad visible en formulario
□ Total se actualiza dinámicamente (cantidad × precio)
□ Cantidad validada (≥1, solo enteros)
□ Cantidad mostrada en pantalla de cuentas
□ Cantidad mostrada en resumen de confirmación
□ Cantidad mostrada en "Mis Pedidos"
□ Cantidad mostrada en panel admin

BACKEND
□ Cantidad recibida en API
□ Cantidad validada en controller
□ Total calculado en servidor: precioUnitario × cantidad
□ Datos guardados correctamente en MongoDB
□ Notificaciones incluyen cantidad y total

DATABASE
□ Campo "precioUnitario" presente
□ Campo "cantidad" presente (≥1)
□ Campo "total" presente y correcto
□ Campo "fechaPedido" present

SEGURIDAD
□ Total no se manipula desde frontend
□ Backend recalcula total
□ Precio siempre es unitario
□ Cantidad nunca negativa
□ Sin errores de código
```

---

## 🐛 Problemas Comunes

### Problema: No aparece campo de cantidad
**Solución:** Limpiar cache del navegador (Ctrl+Shift+Delete)

### Problema: Total no se actualiza
**Solución:** Verificar que JavaScript está habilitado
**Código de prueba:** 
```javascript
// En consola del navegador
console.log(document.querySelector('#cantidad').value)
```

### Problema: MongoDB no guarda cantidad
**Solución:** Verificar que el backend está corriendo
```bash
# Terminal del backend
npm start
```

### Problema: Total en DB es incorrecto
**Solución:** Verificar cálculo manual
```javascript
const precioUnitario = 25.00;
const cantidad = 3;
const total = precioUnitario * cantidad; // Debe ser 75.00
```

---

## ⏱️ Tiempo Estimado

- Prueba 1: 10 minutos
- Prueba 2: 5 minutos
- Prueba 3: 3 minutos
- Prueba 4: 5 minutos
- Prueba 5: 3 minutos
- Prueba 6 (Full): 5 minutos

**Total:** ~30 minutos

---

## 📊 Resultado Esperado

Un sistema profesional donde:
1. ✅ Usuario selecciona cantidad
2. ✅ Total se calcula dinámicamente
3. ✅ Datos se guardan correctamente en MongoDB
4. ✅ Visualización correcta en todas las pantallas
5. ✅ Admin puede gestionar pedidos con cantidad
6. ✅ Comprobante PDF incluye cantidad y total

---

**Última actualización:** 30 de enero de 2026  
**Versión:** 1.0  
**Estado:** Listo para pruebas ✅
