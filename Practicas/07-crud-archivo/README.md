# 07 — CRUD completo con Express + archivo JSON

---

## 🎯 ¿Qué vamos a hacer?

Implementar las 5 operaciones REST para Cargos usando Express + archivo JSON. Esto es lo más parecido a una API real antes de usar base de datos.

| Método | Ruta | Acción | Estado |
|---|---|---|---|
| GET | `/cargos` | Listar todos | 200 |
| GET | `/cargos/:id` | Obtener uno por ID | 200 |
| POST | `/cargos` | Crear nuevo | 201 |
| PUT | `/cargos/:id` | Actualizar existente | 200 |
| DELETE | `/cargos/:id` | Eliminar | 200 |

---

## 🧠 Teoría

### Parámetros de ruta (`:id`)

Express captura segmentos de la URL con `:nombre`:

```js
app.get("/cargos/:id", (req, res) => {
  console.log(req.params.id); // "1", "2", etc. (siempre STRING)
});
```

Siempre convertí a número: `parseInt(req.params.id)`.

### Métodos de Array que vas a necesitar

| Método | Qué hace | Ejemplo |
|---|---|---|
| `array.find(fn)` | Devuelve el primer elemento que cumple la condición | `cargos.find(c => c.id === 5)` |
| `array.findIndex(fn)` | Devuelve el índice del primer elemento que cumple | `cargos.findIndex(c => c.id === 5)` |
| `array.splice(inicio, n)` | Elimina `n` elementos desde `inicio` | `cargos.splice(2, 1)` |

### Middleware para validar ID

Podés crear una función reutilizable:

```js
function validarId(req, res, next) {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido, debe ser un número" });
  }
  next(); // pasar a la ruta
}
```

Y usarla en las rutas que reciben `:id`:

```js
app.get("/cargos/:id", validarId, (req, res) => { ... });
app.put("/cargos/:id", validarId, (req, res) => { ... });
app.delete("/cargos/:id", validarId, (req, res) => { ... });
```

### Tabla de códigos de respuesta

| Código | Significado | Cuándo usarlo |
|---|---|---|
| 200 | OK | GET exitoso, PUT exitoso, DELETE exitoso |
| 201 | Created | POST exitoso |
| 400 | Bad Request | ID no numérico, campo faltante |
| 404 | Not Found | ID no existe, ruta no definida |
| 500 | Server Error | Error inesperado |

---

## 📝 Paso a paso

### Paso 0: Instalar Express

```bash
npm init -y
npm install express
```

### Paso 1: Arrancá desde el 06

Tu `servidor.js` ya tiene `GET /cargos` y `POST /cargos` funcionando. Ahora agregás el resto.

### Paso 2: `GET /cargos/:id` — Obtener uno

```js
app.get("/cargos/:id", validarId, (req, res) => {
  const db = leerDB();
  const id = parseInt(req.params.id);
  const cargo = db.cargos.find(c => c.id === id);

  if (!cargo) {
    return res.status(404).json({ error: "Cargo no encontrado" });
  }

  res.json(cargo);
});
```

### Paso 3: `PUT /cargos/:id` — Actualizar

```js
app.put("/cargos/:id", validarId, (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
  }

  const db = leerDB();
  const id = parseInt(req.params.id);
  const indice = db.cargos.findIndex(c => c.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Cargo no encontrado" });
  }

  db.cargos[indice].nombre = nombre;
  escribirDB(db);

  res.json(db.cargos[indice]);
});
```

### Paso 4: `DELETE /cargos/:id` — Eliminar

```js
app.delete("/cargos/:id", validarId, (req, res) => {
  const db = leerDB();
  const id = parseInt(req.params.id);
  const indice = db.cargos.findIndex(c => c.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Cargo no encontrado" });
  }

  const eliminado = db.cargos.splice(indice, 1)[0];
  escribirDB(db);

  res.json({ mensaje: "Cargo eliminado correctamente", cargo: eliminado });
});
```

`splice(indice, 1)` devuelve un **array** con los elementos eliminados. `[0]` agarra el primero.

### Paso 5: Middleware 404

```js
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
```

---

## ✅ Probar

```bash
# Crear
curl -X POST http://localhost:3000/cargos -H "Content-Type: application/json" -d '{"nombre":"Gerente"}'
curl -X POST http://localhost:3000/cargos -H "Content-Type: application/json" -d '{"nombre":"Analista"}'
curl -X POST http://localhost:3000/cargos -H "Content-Type: application/json" -d '{"nombre":"Dev"}'

# Listar todos
curl http://localhost:3000/cargos

# Obtener uno
curl http://localhost:3000/cargos/1
curl http://localhost:3000/cargos/99  # 404

# Actualizar
curl -X PUT http://localhost:3000/cargos/1 -H "Content-Type: application/json" -d '{"nombre":"Director"}'

# Eliminar
curl -X DELETE http://localhost:3000/cargos/2

# Verificar
curl http://localhost:3000/cargos

# ID inválido
curl http://localhost:3000/cargos/abc  # 400

# Ruta inexistente
curl http://localhost:3000/inventado   # 404
```

---

## 🧪 Experimentá

### Ejercicio 1: CRUD de Lugares

Replicá exactamente el mismo CRUD para `lugares`. Solo cambiás `/cargos` por `/lugares` y `db.cargos` por `db.lugares`.

### Ejercicio 2: Agregar timestamp

En cada POST, agregá `fecha_creacion: new Date().toISOString()` al objeto.

### Ejercicio 3: Buscar por nombre

Agregá una ruta `GET /cargos/buscar?nombre=Gerente` que busque cargos que contengan el texto.

---

## 📌 Resumen de lo que sabés hasta ahora

- Crear servidor con http nativo y con Express.
- Manejar rutas GET, POST, PUT, DELETE.
- Leer parámetros de URL (`:id`).
- Leer body (`req.body`).
- Validar datos.
- Persistir en archivo JSON.
- Manejar errores (400, 404).
- Usar `leerDB()` y `escribirDB()`.

El siguiente paso (ejercicio 08) es reemplazar el archivo JSON por una **base de datos real** usando TypeORM.

---

## 📁 Estructura esperada

```
07-crud-archivo/
├── README.md
├── package.json
├── node_modules/
├── servidor.js
└── base-datos.json
```
