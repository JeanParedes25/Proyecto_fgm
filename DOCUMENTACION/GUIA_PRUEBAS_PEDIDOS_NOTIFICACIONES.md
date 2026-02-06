# 🧪 Guía de Pruebas - Sistema de Notificaciones de Pedidos

**Objetivo**: Verificar que el badge del botón "📦 Pedidos" funciona exactamente como "📬 Notificaciones"

---

## ✅ Paso 1: Preparar el Entorno

### 1.1 Verificar que el Backend esté corriendo
```powershell
cd c:\Proyecto_fgm\backend
node src/server.js
```
✓ Debe mostrar: `Servidor corriendo en http://localhost:5000`

### 1.2 Verificar que el Frontend esté corriendo
```powershell
cd c:\Proyecto_fgm\frontend
npm start
```
✓ Debe abrirse en http://localhost:3000

### 1.3 Verificar Base de Datos
```powershell
cd c:\Proyecto_fgm\backend
node src/scripts/verificarPedidos.js
```
✓ Debe mostrar 4+ pedidos pendientes no vistos

---

## 🧪 Paso 2: Prueba de Visualización Inicial

**Acción**: Ingresar como Administrador

1. Abrir `http://localhost:3000`
2. Iniciar sesión con cuenta admin
3. Ir al Dashboard

**Resultado Esperado**:
- ✅ Botón "📦 Pedidos" muestra badge con número
- ✅ Número coincide con cantidad de pedidos pendientes
- ✅ Badge es similar al de "📬 Notificaciones"

**Screenshots a validar**:
```
┌─────────────────────────────────────┐
│  📬 Notificaciones 1   ← Estilo     │
│  📦 Pedidos 4          ← Igual aquí │
│  🌹 Mis Arreglos                   │
│  📋 Mis Pedidos                    │
└─────────────────────────────────────┘
```

---

## 🧪 Paso 3: Prueba de Polling

**Verificar que se actualiza cada 5 segundos**

1. Con admin en Dashboard, abrir DevTools (F12)
2. Ir a pestaña "Network"
3. Filtrar por `nuevos-count`
4. Observar durante 30 segundos

**Resultado Esperado**:
- ✅ Petición a `/admin/nuevos-count` cada 5 segundos aprox.
- ✅ Response Status: 200
- ✅ Response body: `{"success":true,"count":4}`

**Ejemplo de Network**:
```
GET /api/pedidos-floristerias/admin/nuevos-count  ← cada 5 seg
Status: 200
Response: {"success": true, "count": 4}
```

---

## 🧪 Paso 4: Prueba de Creación de Pedido

**Verificar que el badge se actualiza cuando se crea un pedido**

### 4.1 Separar pantallas
- **Ventana 1**: Admin en Dashboard
- **Ventana 2**: Usuario crear nuevo pedido

### 4.2 Como Usuario:
1. Ingresar como usuario normal
2. Ir a "Floristerías"
3. Crear un nuevo pedido completo
4. Confirmar el pedido

### 4.3 Como Admin (sin recargar):
1. Observar que el badge en "📦 Pedidos" **aumenta** en 1
2. Ejemplo: Si había "4" ahora debe mostrar "5"
3. Verificar que sucede dentro de 5 segundos

**Resultado Esperado**:
- ✅ Badge se actualiza automáticamente
- ✅ No requiere recargar la página
- ✅ Muestra el nuevo conteo

---

## 🧪 Paso 5: Prueba de Limpiar Estado

**Verificar que el badge se limpia al ingresar al módulo**

### 5.1 Estado actual:
- Admin ve badge "📦 Pedidos 5"

### 5.2 Acción:
1. Como admin, hacer clic en "📦 Pedidos"
2. Esperar a que cargue el módulo de pedidos

### 5.3 Resultado Esperado:
- ✅ Badge desaparece automáticamente
- ✅ Botón ahora muestra: "📦 Pedidos" (sin número)
- ✅ Todos los pedidos en el módulo están marcados como "vistos"

**Verificación en DevTools**:
1. Ir a Network
2. Buscar petición a `/admin/marcar-revisados`
3. Status debe ser 200
4. Response: `{"success":true,"mensaje":"Pedidos marcados como vistos"}`

---

## 🧪 Paso 6: Prueba de Refreshing

**Verificar que el estado persiste después de recargar**

### 6.1 Estado actual:
- Todos los pedidos vistos (badge limpio)

### 6.2 Acción:
1. Recargar la página (F5)
2. Admin se mantiene en Dashboard

### 6.3 Resultado Esperado:
- ✅ No hay badge (aún sin mostrar número)
- ✅ Los pedidos siguen marcados como vistos en la BD

---

## 🧪 Paso 7: Prueba de Sincronización

**Verificar que Badge y Notificaciones funcionan juntos**

### 7.1 Crear nuevo pedido
1. Como usuario, crear otro pedido

### 7.2 Resultado Esperado:
- ✅ "📦 Pedidos" muestra nuevo número
- ✅ "📬 Notificaciones" podría también actualizar
- ✅ Ambos se actualizan en menos de 5 segundos

---

## 🧪 Paso 8: Test de Stress

**Crear múltiples pedidos rápidamente**

### 8.1 Acción:
1. Como usuario, crear 3 pedidos en rápida sucesión
2. Observar badge en admin

### 8.2 Resultado Esperado:
- ✅ Badge refleja total correcto
- ✅ Sin errores en Console
- ✅ Sin duplicados en conteo

---

## ⚠️ Checklist de Errores Comunes

| Error | Solución |
|-------|----------|
| Badge no muestra | ✓ Verificar `isAdmin == true` |
| Badge no se actualiza | ✓ Revisar Network → polling cada 5s |
| Badge no se limpia | ✓ Verificar que `activeSection == 'pedidos'` |
| Error 401 en Network | ✓ Token expirado, reiniciar sesión |
| Error 404 en Network | ✓ Verificar backend está corriendo |
| Console errors | ✓ Abrir F12 y revisar qué error específico hay |

---

## 🖥️ Comandos para Debugging

### Ver logs del Backend en tiempo real
```powershell
cd c:\Proyecto_fgm\backend
node src/server.js 2>&1
```

### Verificar estado de la BD
```powershell
cd c:\Proyecto_fgm\backend
node src/scripts/verificarPedidos.js
```

### Ver Network requests en DevTools
```
F12 → Network → Ctrl+Shift+X (filtrar XHR)
```

### Ver Console errors
```
F12 → Console → Filtrar por "Error: "
```

---

## ✨ Validación Final

Cuando todas estas pruebas pasen:

```
✅ Badge se muestra correctamente
✅ Polling actualiza cada 5 segundos
✅ Nuevos pedidos incrementan el badge
✅ Ingresar al módulo limpia el badge
✅ Estado persiste después de refresh
✅ Sincronización con Notificaciones
✅ Sin errores en Console
✅ Estilo visual consistente
```

**→ Sistema de Notificaciones de Pedidos = COMPLETADO** ✅

---

## 📞 Soporte

Si algo no funciona:

1. Revisar que **Backend está corriendo**
2. Revisar que **Frontend está corriendo**
3. Revisar que **está logueado como ADMIN**
4. Revisar **Network tab en DevTools**
5. Revisar **Console en DevTools** para errores
6. Correr scripts de verificación

**¡Cualquier problema, revisar los logs!**
