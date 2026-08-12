# 02 — Servidor HTTP nativo de Node.js

---

## 🎯 ¿Qué vamos a hacer?

Crear un servidor web usando **solo Node.js**, sin instalar nada extra. Cuando entres a `http://localhost:3000`, verás tu mensaje.

---

## 🧠 Teoría

### ¿Qué es un servidor web?

Un programa que **escucha** en un puerto y **responde** cada vez que alguien se conecta.

```
VOS (navegador)                  SERVIDOR (Node.js)
     │                                │
     │─── "dame la página" ─────────>│
     │                                │  ejecuta tu código
     │<── "acá tenés" ───────────────│
```

### El módulo `http`

Node.js incluye un módulo llamado `http`. **No necesitás instalar nada**. Se importa así:

```js
const http = require("http");
```

### `createServer()`

El método principal de `http` es `createServer()`. Recibe una **función** que se ejecuta cada vez que llega una petición:

```js
const server = http.createServer((req, res) => {
  // req = request (lo que pide el cliente)
  // res = response (cómo responder)
});
```

### ¿Qué son `127.0.0.1` y `3000`?

| Concepto | Explicación |
|---|---|
| `127.0.0.1` | Dirección IP de tu propia computadora (localhost). |
| `3000` | Puerto. Un número entre 0 y 65535. Es como un "canal". |

Cada servidor en tu máquina usa un puerto diferente. Si dos servidores usan el mismo puerto, el segundo da error `EADDRINUSE`.

### El objeto `res` (response)

| Método | Qué hace |
|---|---|
| `res.writeHead(codigo, headers)` | Escribe código de estado y cabeceras HTTP |
| `res.end(texto)` | Envía la respuesta y CIERRA la conexión |

**NUNCA te olvides de `res.end()`**. Sin eso, el navegador se queda esperando infinitamente.

### ¿Qué es un código de estado HTTP?

| Código | Significado | Cuándo usarlo |
|---|---|---|
| 200 | OK | Todo salió bien |
| 404 | Not Found | La ruta no existe |
| 500 | Internal Server Error | Error en el servidor |

---

## 📝 Paso a paso

### Paso 1: Creá `servidor.js`

En esta carpeta `02-modulo-http/`, creá un archivo `servidor.js`.

### Paso 2: Importá el módulo `http`

```js
const http = require("http");
```

### Paso 3: Definí host y puerto

```js
const hostname = "127.0.0.1";
const port = 3000;
```

127.0.0.1 = localhost. El puerto 3000 es una convención en Node.js.

### Paso 4: Creá el servidor

```js
const server = http.createServer((req, res) => {
  // Acá adentro manejás CADA petición
});
```

### Paso 5: Responder algo

Dentro del callback:

```js
res.writeHead(200, { "Content-Type": "text/plain" });
res.end("Hola desde mi primer servidor Node.js\n");
```

- `writeHead(200, {...})`: el código 200 (OK) y el header que dice que la respuesta es texto plano.
- `"Content-Type": "text/plain"`: le dice al navegador cómo interpretar la respuesta.
- `res.end(...)`: envía el texto y cierra.

### Paso 6: Escuchar en el puerto

```js
server.listen(port, hostname, () => {
  console.log(`Servidor corriendo en http://${hostname}:${port}`);
});
```

El tercer argumento (la función flecha) se ejecuta cuando el servidor **ya arrancó**.

---

## ✅ Probar

En la terminal:

```bash
node servidor.js
```

Deberías ver:

```
Servidor corriendo en http://127.0.0.1:3000
```

Abrí tu navegador en `http://localhost:3000`. Deberías ver el mensaje.

Para detenerlo: `Ctrl + C`.

---

## 🧪 Experimentá

### Ejercicio 1: Cambiar el mensaje

Cambiá el texto que envía `res.end()`.

### Ejercicio 2: Agregar más información

```js
const respuesta = `Hora del servidor: ${new Date().toISOString()}`;
res.end(respuesta);
```

### Ejercicio 3: Responder con HTML

Cambiá `"text/plain"` por `"text/html"` y enviá esto:

```js
res.end("<h1>Hola</h1><p>Esto es HTML</p>");
```

El navegador ahora renderiza el HTML (título grande + párrafo).

### Ejercicio 4: Log de cada petición

Agregá un `console.log` antes de responder:

```js
console.log(`Petición recibida: ${req.url}`);
```

Cada vez que refresques el navegador, verás el log en la terminal.

---

## 🐛 Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `EADDRINUSE :::3000` | Ya hay un servidor corriendo en el puerto 3000 | Cerrá el otro (`Ctrl+C`) o usá otro puerto |
| El navegador se queda cargando | Olvidaste `res.end()` | Agregá `res.end()` |
| `require is not defined` | Estás ejecutando en el navegador, no en Node | Ejecutá con `node servidor.js` |
| `listen is not a function` | No guardaste `createServer` en una variable | `const server = http.createServer(...)` |

---

## 📌 Resumen

| Concepto | Código |
|---|---|
| Importar http | `const http = require("http")` |
| Crear servidor | `http.createServer((req, res) => { ... })` |
| Escribir respuesta | `res.writeHead(200, {...}); res.end(...)` |
| Escuchar puerto | `server.listen(3000, "127.0.0.1", () => {...})` |
| Detener servidor | `Ctrl + C` |

---

## 📁 Estructura esperada

```
02-modulo-http/
├── README.md
└── servidor.js
```
