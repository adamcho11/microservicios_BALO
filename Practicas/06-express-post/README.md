# 06 — Express: recibir datos con POST

---

## 🎯 ¿Qué vamos a hacer?

Agregar una ruta `POST /cargos` que reciba datos del cliente, los guarde en `base-datos.json`, y responda con el nuevo cargo creado.

---

## 🧠 Teoría

### ¿Cómo llegan los datos del cliente al servidor?

```
CLIENTE (curl/postman)                    SERVIDOR (Express)
     │                                         │
     │ POST /cargos                            │
     │ Content-Type: application/json          │
     │ {"nombre":"Gerente"}                    │
     │────────────────────────────────────────>│
     │                                         ├─ express.json() parsea el body
     │                                         ├─ req.body = { nombre: "Gerente" }
     │                                         ├─ ejecuta tu código
     │<──────── 201 Created ──────────────────│
```

### Middleware `express.json()`

Express no entiende el body automáticamente. Necesitás un **middleware**:

```js
app.use(express.json());
```

`express.json()` es una función que **devuelve** un middleware. Ese middleware:
1. Lee los bytes del body de la petición.
2. Si el `Content-Type` es `application/json`, lo parsea.
3. Guarda el resultado en `req.body`.

**Sin esto, `req.body` es `undefined`.**

### `req.body`

Contiene el objeto que el cliente envió:

```js
app.post("/cargos", (req, res) => {
  console.log(req.body);        // { nombre: "Gerente" }
  console.log(req.body.nombre); // "Gerente"
});
```

### Destructuring

```js
const { nombre } = req.body;
// Equivale a: const nombre = req.body.nombre;
```

### Códigos de estado para POST

- `201 Created`: "El recurso fue creado exitosamente".
- `400 Bad Request`: "El cliente mandó datos inválidos".

### Combinar `leerDB()` y `escribirDB()` con Express

Vas a usar las mismas funciones del ejercicio 04. La ruta POST:
1. Valida los datos (`req.body`).
2. Lee la DB actual (`leerDB()`).
3. Crea el nuevo objeto con ID.
4. Agrega al array.
5. Guarda (`escribirDB()`).
6. Responde `201` con el objeto creado.

---

## 📝 Paso a paso

### Paso 0: Instalar Express

```bash
npm init -y
npm install express
```

### Paso 1: Crear `servidor.js`

### Paso 2: Importar dependencias

```js
const express = require("express");
const fs = require("fs");
```

### Paso 3: Copiar `leerDB()` y `escribirDB()` del 04

```js
const archivo = __dirname + "/base-datos.json";

function leerDB() {
  if (!fs.existsSync(archivo)) {
    const inicial = { cargos: [], lugares: [], candidatos: [] };
    fs.writeFileSync(archivo, JSON.stringify(inicial, null, 2));
    return inicial;
  }
  return JSON.parse(fs.readFileSync(archivo, "utf8"));
}

function escribirDB(datos) {
  fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));
}
```

### Paso 4: Crear app y agregar middleware

```js
const app = express();
app.use(express.json());
```

### Paso 5: Ruta `GET /cargos`

```js
app.get("/cargos", (req, res) => {
  const db = leerDB();
  res.json(db.cargos);
});
```

### Paso 6: Ruta `POST /cargos`

```js
app.post("/cargos", (req, res) => {
  // 1. Extraer nombre del body
  const { nombre } = req.body;

  // 2. Validar
  if (!nombre) {
    return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
  }

  // 3. Leer DB
  const db = leerDB();

  // 4. Generar nuevo ID
  const nuevoId = db.cargos.length > 0
    ? db.cargos[db.cargos.length - 1].id + 1
    : 1;

  // 5. Crear objeto
  const nuevoCargo = { id: nuevoId, nombre };

  // 6. Agregar al array
  db.cargos.push(nuevoCargo);

  // 7. Guardar en disco
  escribirDB(db);

  // 8. Responder
  res.status(201).json(nuevoCargo);
});
```

Cada paso está comentado. Fijate que:
- Si la validación falla, usamos `return` para que no siga ejecutando.
- El ID se genera basado en el último elemento del array.
- Respondemos `201` (Created), no `200`.

### Paso 7: Escuchar

```js
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
```

---

## ✅ Probar

```bash
node servidor.js
```

```bash
# 1. Listar (vacío al inicio)
curl http://localhost:3000/cargos
# → []

# 2. Crear un cargo
curl -X POST http://localhost:3000/cargos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Gerente"}'
# → {"id":1,"nombre":"Gerente"}

# 3. Crear otro
curl -X POST http://localhost:3000/cargos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Analista"}'
# → {"id":2,"nombre":"Analista"}

# 4. Listar de nuevo
curl http://localhost:3000/cargos
# → [{"id":1,"nombre":"Gerente"},{"id":2,"nombre":"Analista"}]

# 5. Error: sin nombre
curl -X POST http://localhost:3000/cargos \
  -H "Content-Type: application/json" \
  -d '{}'
# → {"error":"El campo 'nombre' es obligatorio"} (400)

# 6. Error: nombre vacío
curl -X POST http://localhost:3000/cargos \
  -H "Content-Type: application/json" \
  -d '{"nombre":""}'
# → {"error":"El campo 'nombre' es obligatorio"} (400)
```

**Probá la persistencia:** detené el servidor (`Ctrl+C`), volvé a iniciarlo y hacé `GET /cargos`. Los datos deberían seguir.

---

## 🧪 Experimentá

### Ejercicio 1: Agregar validación de longitud

Validá que el nombre no exceda 60 caracteres.

### Ejercicio 2: Verificar nombre duplicado

Antes de guardar, verificá que no exista ya un cargo con el mismo nombre.

### Ejercicio 3: Agregar `POST /lugares`

Repetí el patrón para que también se puedan crear lugares vía POST.

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `req.body is undefined` | Olvidaste `app.use(express.json())` |
| `Cannot read property 'nombre' of undefined` | El body está vacío. Revisá el `-H "Content-Type"` en curl |
| El servidor tira error después de responder | Olvidaste `return` en la validación |
| Los IDs empiezan siempre en 1 | El archivo JSON se sobrescribe. Revisá `leerDB()`. |
| `JSON.parse` da error | El archivo se corrompió. Borralo y ejecutá de nuevo. |

---

## 📁 Estructura esperada

```
06-express-post/
├── README.md
├── package.json
├── node_modules/
├── servidor.js
└── base-datos.json
```
