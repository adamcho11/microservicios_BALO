# 20 — Vistas con formularios

---

## 🎯 ¿Qué vamos a hacer?

Agregar formularios HTML en las vistas para **crear** cargos desde el navegador, no solo desde curl/Postman.

---

## 🧠 Teoría

### Flujo crear desde formulario

```
Navegador                          Servidor
   │                                  │
   │ GET /cargos/nuevo                │
   │─────────────────────────────────>│ renderiza formulario.ejs
   │<─── HTML con <form> ────────────│
   │                                  │
   │ POST /cargos                     │
   │ Body: nombre=Gerente             │
   │─────────────────────────────────>│ guarda en BD
   │<─── Redirect 302 /cargos ───────│
   │                                  │
   │ GET /cargos                      │
   │─────────────────────────────────>│ renderiza lista actualizada
```

### El `<form>` HTML

```html
<form method="POST" action="/cargos">
  <label>Nombre:</label>
  <input type="text" name="nombre" required>
  <button type="submit">Guardar</button>
</form>
```

- `method="POST"`: envía los datos al servidor.
- `action="/cargos"`: a qué URL se envían.
- `name="nombre"`: el nombre del campo (llega a `req.body.nombre`).

### `express.urlencoded()`

Cuando un `<form>` HTML envía datos, no los manda como JSON sino como **URL-encoded**:

```
nombre=Gerente&descripcion=Jefe
```

Necesitás este middleware:

```ts
app.use(express.urlencoded({ extended: true }));
```

**IMPORTANTE:** Necesitás **tanto** `express.json()` (para APIs/JSON) **como** `express.urlencoded()` (para formularios HTML).

### Redirect después de POST (PRG: Post-Redirect-Get)

Después de crear/actualizar/eliminar, **no renderices** una vista. Redirigí a otra ruta:

```ts
res.redirect("/cargos");
```

Esto evita que si el usuario refresca la página, el formulario se reenvíe.

---

## 📝 Paso a paso

### Paso 1: Agregar middleware

```ts
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

### Paso 2: Ruta para mostrar el formulario

```ts
app.get("/cargos/nuevo", async (req, res) => {
  res.render("formulario-cargo", { titulo: "Nuevo Cargo" });
});
```

### Paso 3: Vista `views/formulario-cargo.ejs`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title><%= titulo %></title>
</head>
<body>
  <h1><%= titulo %></h1>

  <form method="POST" action="/cargos">
    <label>Nombre del cargo:</label>
    <input type="text" name="nombre" required maxlength="60">
    <button type="submit">Guardar</button>
  </form>

  <br>
  <a href="/cargos">← Volver a la lista</a>
</body>
</html>
```

### Paso 4: Modificar el POST para redirigir

```ts
app.post("/cargos", async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).send("El nombre es obligatorio");
    }

    const repo = AppDataSource.getRepository(Cargo);
    const cargo = new Cargo();
    cargo.nombre = nombre;
    await repo.save(cargo);

    res.redirect("/cargos"); // ← redirect, no render
  } catch (error) {
    res.status(500).send("Error al crear cargo");
  }
});
```

### Paso 5: Agregar link al formulario en la lista

En `views/cargos.ejs`, agregá:

```html
<a href="/cargos/nuevo">+ Nuevo Cargo</a>
```

---

## ✅ Probar

1. Entrá a `http://localhost:3000/cargos`.
2. Clic en "+ Nuevo Cargo".
3. Llená el formulario y guardá.
4. Deberías volver a la lista con el nuevo cargo.

---

## 📁 Estructura esperada

```
20-formularios-vistas/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    ├── index.ts
    ├── entities/
    └── views/
        ├── cargos.ejs
        └── formulario-cargo.ejs
```
