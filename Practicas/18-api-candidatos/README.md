# 18 — API REST: CRUD de Candidatos

---

## 🎯 ¿Qué vamos a hacer?

Crear endpoints REST para Candidatos. Lo nuevo: manejar **relaciones** (cargo_id, lugar_id) en el POST y PUT, y devolver los datos relacionados en GET.

---

## 🧠 Teoría

### POST con relaciones

El cliente envía:

```json
{
  "ci": "1234567890",
  "nombres": "Juan",
  "apellido1": "Pérez",
  "apellido2": "Gómez",
  "cargo_id": 1,
  "lugar_id": 2
}
```

En el servidor, creás el candidato y asignás las relaciones por ID:

```ts
candidato.cargo = { id: body.cargo_id } as Cargo;
candidato.lugar = { id: body.lugar_id } as Lugar;
```

### GET con relaciones

Siempre incluí `relations`:

```ts
await repo.find({ relations: ["cargo", "lugar"] });
```

### PUT con relaciones

Buscás el candidato existente, actualizás campos y relaciones, y usás `save()`:

```ts
const candidato = await repo.findOne({ where: { ci }, relations: ["cargo", "lugar"] });
candidato.nombres = body.nombres;
candidato.cargo = { id: body.cargo_id } as Cargo;
await repo.save(candidato);
```

### La PK es `ci` (string)

Las rutas usan `:ci` en lugar de `:id`:

```ts
app.get("/api/candidatos/:ci", ...)
app.put("/api/candidatos/:ci", ...)
app.delete("/api/candidatos/:ci", ...)
```

No usás `parseInt` porque `ci` es string.

---

## 📝 Paso a paso

### Paso 1: Copiá `index.ts` del 16 como base

Mantené las rutas de Cargo, agregá las de Candidato.

### Paso 2: `GET /api/candidatos`

```ts
app.get("/api/candidatos", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Candidato);
    const candidatos = await repo.find({ relations: ["cargo", "lugar"] });
    res.json(candidatos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener candidatos" });
  }
});
```

### Paso 3: `GET /api/candidatos/:ci`

```ts
app.get("/api/candidatos/:ci", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Candidato);
    const candidato = await repo.findOne({
      where: { ci: req.params.ci },
      relations: ["cargo", "lugar"],
    });

    if (!candidato) return res.status(404).json({ error: "Candidato no encontrado" });

    res.json(candidato);
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
});
```

### Paso 4: `POST /api/candidatos`

Validaciones necesarias:
- `ci` requerido.
- `nombres` requerido.
- `apellido1` requerido.
- `cargo_id` requerido (número).
- `lugar_id` requerido (número).
- `ci` no duplicado.

```ts
app.post("/api/candidatos", async (req, res) => {
  try {
    const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;

    if (!ci || !nombres || !apellido1 || !cargo_id || !lugar_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const repo = AppDataSource.getRepository(Candidato);

    // Verificar CI duplicado
    const existente = await repo.findOneBy({ ci });
    if (existente) {
      return res.status(400).json({ error: "Ya existe un candidato con ese CI" });
    }

    const candidato = new Candidato();
    candidato.ci = ci;
    candidato.nombres = nombres;
    candidato.apellido1 = apellido1;
    candidato.apellido2 = apellido2 || "";
    candidato.cargo = { id: cargo_id } as Cargo;
    candidato.lugar = { id: lugar_id } as Lugar;

    const resultado = await repo.save(candidato);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear candidato" });
  }
});
```

### Paso 5: `PUT /api/candidatos/:ci`

```ts
app.put("/api/candidatos/:ci", async (req, res) => {
  try {
    const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    const repo = AppDataSource.getRepository(Candidato);

    const candidato = await repo.findOne({
      where: { ci: req.params.ci },
      relations: ["cargo", "lugar"],
    });

    if (!candidato) return res.status(404).json({ error: "Candidato no encontrado" });

    if (nombres) candidato.nombres = nombres;
    if (apellido1) candidato.apellido1 = apellido1;
    if (apellido2 !== undefined) candidato.apellido2 = apellido2;
    if (cargo_id) candidato.cargo = { id: cargo_id } as Cargo;
    if (lugar_id) candidato.lugar = { id: lugar_id } as Lugar;

    const actualizado = await repo.save(candidato);
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});
```

### Paso 6: `DELETE /api/candidatos/:ci`

```ts
app.delete("/api/candidatos/:ci", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Candidato);
    const result = await repo.delete(req.params.ci);

    if (result.affected === 0) return res.status(404).json({ error: "Candidato no encontrado" });

    res.json({ mensaje: "Candidato eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});
```

---

## ✅ Probar

```bash
# Crear
curl -X POST http://localhost:3000/api/candidatos \
  -H "Content-Type: application/json" \
  -d '{"ci":"1234567890","nombres":"Juan","apellido1":"Pérez","apellido2":"Gómez","cargo_id":1,"lugar_id":2}'

# Listar (debe incluir cargo.nombre y lugar.nombre)
curl http://localhost:3000/api/candidatos

# Obtener uno
curl http://localhost:3000/api/candidatos/1234567890

# Actualizar
curl -X PUT http://localhost:3000/api/candidatos/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"nombres":"Juan Carlos","cargo_id":2}'

# Eliminar
curl -X DELETE http://localhost:3000/api/candidatos/1234567890
```

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `foreign key constraint fails` | `cargo_id` o `lugar_id` no existen |
| `duplicate key` | El `ci` ya existe |
| Las relaciones no aparecen en GET | Olvidaste `relations: ["cargo", "lugar"]` |

---

## 📁 Estructura esperada

```
18-api-candidatos/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    ├── index.ts
    └── entities/
        ├── Cargo.ts
        ├── Lugar.ts
        └── Candidato.ts
```
