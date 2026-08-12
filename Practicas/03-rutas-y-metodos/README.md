# 03 — Rutas y Métodos HTTP

---

## 🎯 ¿Qué vamos a hacer?

El mismo servidor del ejercicio 02, pero ahora responde **diferente según la URL** que pide el cliente.

---

## 🧠 Teoría

### `req.url`

Cuando el navegador pide `http://localhost:3000/cargos`, el servidor recibe:

```js
req.url    // "/cargos"  (SOLO la ruta, no incluye dominio ni puerto)
req.method // "GET"      (el método HTTP)
```

### Rutas que vamos a manejar

| URL | Respuesta |
|---|---|
| `GET /` | Página de inicio |
| `GET /cargos` | Lista de cargos (hardcodeada por ahora) |
| `GET /lugares` | Lista de lugares (hardcodeada por ahora) |
| Cualquier otra | Error 404 |

### Estructura de decisión

```js
if (req.url === "/cargos" && req.method === "GET") {
  // responder con cargos
} else if (req.url === "/lugares" && req.method === "GET") {
  // responder con lugares
} else {
  // 404
}
```

### Métodos HTTP básicos

| Método | Significado | Cuándo se usa |
|---|---|---|
| GET | Leer/Obtener | Ver una página, obtener datos |
| POST | Crear | Enviar un formulario, crear un registro |
| PUT | Actualizar | Modificar un registro existente |
| DELETE | Eliminar | Borrar un registro |

---

## 📝 Paso a paso

### Paso 1: Copiá la base del 02

Arrancá con el `servidor.js` que ya tenés.

### Paso 2: Definí los datos (arrays hardcodeados)

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

### Paso 3: Usá `if / else if / else` según `req.url`

Dentro del callback de `createServer`:

```js
res.setHeader("Content-Type", "application/json");

if (req.url === "/" && req.method === "GET") {
  res.writeHead(200);
  res.end(JSON.stringify({ mensaje: "Bienvenido a la API" }));

} else if (req.url === "/cargos" && req.method === "GET") {
  res.writeHead(200);
  res.end(JSON.stringify(cargos));

} else if (req.url === "/lugares" && req.method === "GET") {
  res.writeHead(200);
  res.end(JSON.stringify(lugares));

} else {
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
}
```

Observaciones importantes:

- `res.setHeader("Content-Type", "application/json")` va **una sola vez** al principio. Todas las respuestas son JSON.
- `JSON.stringify(objeto)` convierte el objeto/array a texto JSON.
- Verificamos **tanto** `req.url` **como** `req.method`. Por ahora todos son GET, pero prepara para el POST más adelante.
- El `else` final atrapa todo lo que no coincidió antes.

### Paso 4: `server.listen` igual que en 02

---

## ✅ Probar

```bash
node servidor.js
```

En otra terminal con `curl`:

```bash
curl http://localhost:3000/
# {"mensaje":"Bienvenido a la API"}

curl http://localhost:3000/cargos
# [{"id":1,"nombre":"Gerente"},...]

curl http://localhost:3000/lugares
# [{"id":1,"nombre":"Lima"},...]

curl http://localhost:3000/inventado
# {"error":"Ruta no encontrada"}
```

Para ver el código de estado HTTP:

```bash
curl -i http://localhost:3000/cargos
# HTTP/1.1 200 OK
# Content-Type: application/json
# ...

curl -i http://localhost:3000/otracosa
# HTTP/1.1 404 Not Found
# ...
```

---

## 🧪 Experimentá

### Ejercicio 1: Agregar una nueva ruta

Agregá `GET /info` que devuelva:

```json
{ "servidor": "Node.js", "version": "1.0.0" }
```

### Ejercicio 2: Responder en formato texto para la raíz

Cambiá `GET /` para que responda con `Content-Type: text/html` y devuelva un `<h1>` en lugar de JSON.

### Ejercicio 3: ¿Qué pasa si no validás `req.method`?

Probá hacer `curl -X POST http://localhost:3000/cargos` sin validar el método en el if.

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| Todas las rutas devuelven lo mismo | Pusiste `=` (asignación) en vez de `===` (comparación) |
| 404 no funciona nunca | El `else` está mal indentado y cuelga de un `if` anterior |
| `req.url` da `/favicon.ico` | El navegador pide el favicon automáticamente. Ignoralo. |
| Respuesta vacía o `undefined` | Olvidaste `JSON.stringify()` |

---

## 📌 Resumen

| Concepto | Código |
|---|---|
| Leer URL | `req.url` |
| Leer método | `req.method` |
| Comparar rutas | `if (req.url === "/cargos")` |
| Responder 404 | `res.writeHead(404)` |
| Enviar JSON | `res.end(JSON.stringify(datos))` |

---

## 📁 Estructura esperada

```
03-rutas-y-metodos/
├── README.md
└── servidor.js
```
