# 05 — Express: instalación y primeras rutas

---

## 🎯 ¿Qué vamos a hacer?

Rehacer el servidor de rutas del ejercicio 03 pero usando **Express.js**, un framework que simplifica muchísimo el código.

---

## 🧠 Teoría

### ¿Qué es un framework?

Un framework es código ya escrito que resuelve problemas comunes. Express resuelve:
- Manejo de rutas (`/cargos`, `/lugares`, etc.)
- Métodos HTTP (GET, POST, PUT, DELETE)
- Lectura del body de las peticiones
- Envío automático de JSON

### ¿Por qué Express?

| http nativo (ejercicio 03) | Express (ejercicio 05) |
|---|---|
| `if (req.url === "/cargos" && req.method === "GET")` | `app.get("/cargos", callback)` |
| `res.writeHead(200, headers)` | Automático |
| `res.end(JSON.stringify(datos))` | `res.json(datos)` |
| ~15 líneas para 3 rutas | ~6 líneas para 3 rutas |

### `npm init -y`

Express no viene con Node. Se instala con **npm** (Node Package Manager).

```bash
npm init -y    # Crea package.json (una sola vez por proyecto)
```

`package.json` es un archivo que describe tu proyecto y sus dependencias. La opción `-y` acepta todos los valores por defecto.

### `npm install express`

```bash
npm install express
```

Esto:
1. Descarga Express de internet.
2. Lo guarda en la carpeta `node_modules/`.
3. Lo registra en `package.json` como dependencia.

A partir de ahí, `require("express")` funciona.

### Métodos principales de Express

| Método | Ejemplo | Qué hace |
|---|---|---|
| `express()` | `const app = express()` | Crea la aplicación |
| `app.get(ruta, fn)` | `app.get("/cargos", ...)` | Maneja GET en esa ruta |
| `app.post(ruta, fn)` | `app.post("/cargos", ...)` | Maneja POST |
| `app.put(ruta, fn)` | `app.put("/cargos/:id", ...)` | Maneja PUT |
| `app.delete(ruta, fn)` | `app.delete("/cargos/:id", ...)` | Maneja DELETE |
| `app.use(fn)` | `app.use(...)` | Middleware genérico (404, etc.) |
| `app.listen(port, fn)` | `app.listen(3000, ...)` | Arranca el servidor |
| `res.json(obj)` | `res.json(cargos)` | Responde con JSON automáticamente |
| `res.status(n)` | `res.status(404)` | Setea el código de estado |

---

## 📝 Paso a paso

### Paso 0: Inicializar npm e instalar Express

En esta carpeta `05-express-intro/`:

```bash
npm init -y
npm install express
```

Se crean `package.json`, `package-lock.json` y la carpeta `node_modules/`.

### Paso 1: Crear `servidor.js`

### Paso 2: Importar Express

```js
const express = require("express");
```

### Paso 3: Crear la aplicación

```js
const app = express();
```

`app` es tu servidor. Todo se configura sobre este objeto.

### Paso 4: Definir los datos (igual que en 03)

```js
const cargos = [
  { id: 1, nombre: "Gerente" },
  { id: 2, nombre: "Analista" },
  { id: 3, nombre: "Desarrollador" },
];

const lugares = [
  { id: 1, nombre: "Lima" },
  { id: 2, nombre: "Arequipa" },
  { id: 3, nombre: "Cusco" },
];
```

### Paso 5: Rutas con `app.get()`

```js
app.get("/", (req, res) => {
  res.json({ mensaje: "Bienvenido a la API" });
});

app.get("/cargos", (req, res) => {
  res.json(cargos);
});

app.get("/lugares", (req, res) => {
  res.json(lugares);
});
```

Compará esto con el ejercicio 03. Cada ruta es una función separada. No hay `if/else`, no hay `writeHead`, no hay `JSON.stringify`. Express hace todo automáticamente.

### Paso 6: Middleware 404

Al final del archivo, después de **TODAS** las rutas:

```js
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
```

`app.use()` actúa como "atrapa-todo". Si ninguna ruta anterior manejó la petición, cae acá.

**IMPORTANTE:** El orden importa. Si ponés el 404 antes de las rutas, todas las peticiones caerán en el 404.

### Paso 7: Escuchar

```js
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
```

No necesitás `hostname`. Express por defecto escucha en todas las interfaces.

---

## ✅ Probar

```bash
node servidor.js
```

```bash
curl http://localhost:3000/
curl http://localhost:3000/cargos
curl http://localhost:3000/lugares
curl http://localhost:3000/inventado
# {"error":"Ruta no encontrada"}
```

---

## 🧪 Experimentá

### Ejercicio 1: Comparar código

Abrí el `servidor.js` del ejercicio 03 y el de este. Contá las líneas. ¿Cuánto menos código hay?

### Ejercicio 2: Agregar `GET /info`

Ruta que devuelva `{ framework: "Express", version: "5.x" }`.

### Ejercicio 3: Probar que el orden importa

Mové el `app.use()` de 404 **arriba** de las rutas. ¿Qué pasa?

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `Cannot find module 'express'` | No ejecutaste `npm install express` |
| `app.get is not a function` | `const app = express` sin los paréntesis |
| El 404 se come todas las rutas | Pusiste `app.use` antes de `app.get` |
| `listen is not a function` | Pusiste `express().listen` sin guardar en variable |
| `res.json is not a function` | Mezclaste http nativo con Express |

---

## 📁 Estructura esperada

```
05-express-intro/
├── README.md
├── package.json
├── package-lock.json
├── node_modules/
└── servidor.js
```
