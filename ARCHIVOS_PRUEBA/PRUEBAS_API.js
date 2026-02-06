// Ejemplo de pruebas rápidas en la consola del navegador
// Ejecuta estos comandos en la consola del navegador (F12)

// 1. Hacer un registro
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log('Registro:', data))
.catch(err => console.error('Error:', err));

// 2. Hacer un login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log('Login:', data))
.catch(err => console.error('Error:', err));

// 3. Obtener todos los clientes registrados
fetch('http://localhost:5000/api/clientes')
  .then(res => res.json())
  .then(data => console.log('Clientes:', data))
  .catch(err => console.error('Error:', err));
