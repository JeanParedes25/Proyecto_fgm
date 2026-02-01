# 🧪 Guía Rápida de Prueba - Comprobantes en PDF

## 🚀 Pasos para Probar

### 1. Iniciar la Aplicación

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 2. Crear un Pedido de Prueba

1. **Iniciar sesión** como usuario (no administrador)
2. Ir a **"Floristerías"** desde el panel
3. Seleccionar un arreglo floral
4. Ingresar nombre de persona fallecida
5. Completar el pedido (ir hasta WhatsApp)

### 3. Cambiar Estado a Confirmado (Como Admin)

**Opción A: Desde MongoDB Compass**
```javascript
// Buscar el pedido en la colección 'pedidofloristerias'
db.pedidofloristerias.updateOne(
  { _id: ObjectId("ID_DEL_PEDIDO") },
  { $set: { estado: "confirmado" } }
)
```

**Opción B: Desde Panel de Admin**
1. Iniciar sesión como **administrador** (israel mendoza)
2. Ir a **"Pedidos de Floristerías"**
3. Cambiar estado del pedido a **"Confirmado"**

### 4. Generar Comprobante

1. **Cerrar sesión** de admin
2. **Iniciar sesión** como el usuario que hizo el pedido
3. Ir a **"Mis Pedidos"**
4. Ver el pedido con estado **"Confirmado"**
5. Hacer clic en **"📄 Generar comprobante"**

### 5. Verificar el PDF

**✅ Debe cumplir:**
- Se abre en una **NUEVA PESTAÑA** del navegador
- Formato **A4** (210mm x 297mm)
- Muestra **marca de agua** con logo FGM (baja opacidad)
- **Logo** en el encabezado
- **Número de comprobante** (CMP-XXXXXX)
- **Fecha** de emisión
- **Datos del cliente** correctos
- **Detalle del pedido** en tabla
- **Totales** visibles
- Sello **"CONFIRMADO"** en verde
- Mensaje de agradecimiento
- Pie de página

### 6. Probar Descarga e Impresión

**Descargar:**
- Desde el visor PDF del navegador
- Botón de descarga o **Ctrl+S**
- Archivo: `CMP-XXXXXX.pdf`

**Imprimir:**
- Desde el visor PDF del navegador
- Botón de imprimir o **Ctrl+P**
- Verificar vista previa en **formato A4**
- Márgenes correctos
- Contenido no cortado

---

## 🔍 Casos de Prueba

### ✅ Caso 1: Pedido CONFIRMADO
- **Acción:** Clic en "Generar comprobante"
- **Resultado:** PDF se abre en nueva pestaña
- **Estado:** ✅ OK

### ✅ Caso 2: Pedido PENDIENTE
- **Acción:** Clic en "Ver comprobante" (botón gris)
- **Resultado:** Modal con mensaje de espera
- **Estado:** ✅ OK

### ✅ Caso 3: Múltiples Generaciones
- **Acción:** Generar comprobante varias veces
- **Resultado:** Cada vez abre nueva pestaña con mismo PDF
- **Estado:** ✅ OK

---

## 🐛 Problemas Comunes

### Problema: No veo el logo en el PDF
**Solución:** Verificar que existe `frontend/public/logo_fgm.png`

### Problema: El navegador bloquea la nueva pestaña
**Solución:** Permitir pop-ups para localhost:3000

### Problema: El PDF no se descarga
**Solución:** Hacer clic derecho en el PDF > "Guardar como"

---

## 📊 Checklist de Verificación

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Usuario creado y logueado
- [ ] Pedido creado exitosamente
- [ ] Pedido cambiado a estado "confirmado"
- [ ] PDF se genera al hacer clic en botón
- [ ] PDF se abre en nueva pestaña
- [ ] Formato A4 visible
- [ ] Marca de agua presente
- [ ] Logo en encabezado
- [ ] Número de comprobante correcto
- [ ] Datos del cliente correctos
- [ ] Detalle del pedido correcto
- [ ] Totales correctos
- [ ] PDF descargable
- [ ] PDF imprimible
- [ ] Vista actual no se cierra

---

## 🎯 Resultado Esperado

Un comprobante profesional en PDF que:
- Se genera instantáneamente
- Se abre en nueva pestaña
- Tiene formato A4 estricto
- Es descargable e imprimible
- Contiene todos los datos requeridos
- Tiene diseño profesional tipo fiscal

---

**Tiempo estimado de prueba:** 10-15 minutos  
**Última actualización:** 30 de enero de 2026
