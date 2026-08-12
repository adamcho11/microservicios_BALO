# 21 — CRUD completo con vistas

---

## 🎯 ¿Qué vamos a hacer?

Completar las vistas para que desde el navegador se pueda **crear, editar y eliminar** cargos. Uniendo todo lo visto hasta ahora.

---

## 🧠 Teoría

### Rutas necesarias para completar el CRUD con vistas

| Método | Ruta | Acción |
|---|---|---|
| GET | `/cargos` | Listar todos (vista con tabla) |
| GET | `/cargos/nuevo` | Mostrar formulario de creación |
| POST | `/cargos` | Procesar creación → redirect a lista |
| GET | `/cargos/:id/editar` | Mostrar formulario de edición pre-llenado |
| POST | `/cargos/:id` | Procesar edición → redirect a lista |
| POST | `/cargos/:id/eliminar` | Procesar eliminación → redirect a lista |

### Editar: formulario pre-llenado

El formulario de edición es similar al de creación, pero con los valores actuales en los `value`:

```html
<input type="text" name="nombre" value="<%= cargo.nombre %>">
```

Y el `action` apunta a la ruta de actualización:

```html
<form method="POST" action="/cargos/<%= cargo.id %>">
  <input type="text" name="nombre" value="<%= cargo.nombre %>">
  <button type="submit">Actualizar</button>
</form>
```

### Eliminar: formulario oculto o botón con POST

HTML solo permite GET y POST en formularios. Para eliminar usamos un formulario con POST:

```html
<form method="POST" action="/cargos/<%= cargo.id %>/eliminar" style="display:inline;">
  <button type="submit" onclick="return confirm('¿Eliminar?')">Eliminar</button>
</form>
```

---

## 📝 Paso a paso

### Paso 1: Ruta para mostrar formulario de edición

```ts
app.get("/cargos/:id/editar", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(Cargo);
    const cargo = await repo.findOneBy({ id });

    if (!cargo) return res.status(404).send("Cargo no encontrado");

    res.render("formulario-cargo", {
      titulo: "Editar Cargo",
      cargo: cargo, // para pre-llenar el formulario
    });
  } catch (error) {
    res.status(500).send("Error");
  }
});
```

### Paso 2: Modificar `formulario-cargo.ejs` para soportar edición

```html
<form method="POST" action="<%= cargo ? '/cargos/' + cargo.id : '/cargos' %>">
  <label>Nombre:</label>
  <input type="text" name="nombre" value="<%= cargo ? cargo.nombre : '' %>" required>
  <button type="submit"><%= cargo ? 'Actualizar' : 'Guardar' %></button>
</form>
```

Si `cargo` existe → modo edición. Si no → modo creación.

### Paso 3: Ruta para procesar edición (POST a `/cargos/:id`)

```ts
app.post("/cargos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;

    const repo = AppDataSource.getRepository(Cargo);
    await repo.update(id, { nombre });
    res.redirect("/cargos");
  } catch (error) {
    res.status(500).send("Error al actualizar");
  }
});
```

### Paso 4: Ruta para eliminar

```ts
app.post("/cargos/:id/eliminar", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(Cargo);
    await repo.delete(id);
    res.redirect("/cargos");
  } catch (error) {
    res.status(500).send("Error al eliminar");
  }
});
```

### Paso 5: Actualizar `cargos.ejs` con botones de editar/eliminar

```html
<% cargos.forEach(cargo => { %>
  <tr>
    <td><%= cargo.id %></td>
    <td><%= cargo.nombre %></td>
    <td>
      <a href="/cargos/<%= cargo.id %>/editar">Editar</a>
      <form method="POST" action="/cargos/<%= cargo.id %>/eliminar" style="display:inline;">
        <button type="submit" onclick="return confirm('¿Eliminar este cargo?')">Eliminar</button>
      </form>
    </td>
  </tr>
<% }) %>
```

---

## ✅ Probar

1. `http://localhost:3000/cargos` → ver lista.
2. Clic en "+ Nuevo Cargo" → llenar → guardar.
3. Clic en "Editar" → modificar → actualizar.
4. Clic en "Eliminar" → confirmar → desaparece.

---

## 📁 Estructura esperada

```
21-crud-vistas-completo/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    ├── index.ts
    ├── entities/
    │   ├── Cargo.ts
    │   ├── Lugar.ts
    │   └── Candidato.ts
    └── views/
        ├── cargos.ejs
        └── formulario-cargo.ejs
```
