# 17 — API REST: CRUD de Lugares

---

## 🎯 ¿Qué vamos a hacer?

Repetir el CRUD del ejercicio 16 pero para la entidad `Lugar`. Mismo patrón, distinta entidad.

---

## 🧠 Teoría

### El patrón es idéntico

Cambiás `Cargo` por `Lugar` y `/api/cargos` por `/api/lugares`. Todo lo demás es igual. Esto te muestra que una vez que tenés el patrón, agregar nuevas entidades es muy rápido.

### Plantilla mental para cualquier CRUD

```
app.get("/api/entidad", async (req, res) => {
  const repo = AppDataSource.getRepository(Entidad);
  res.json(await repo.find());
});

app.get("/api/entidad/:id", async (req, res) => {
  const dato = await repo.findOneBy({ id: parseInt(req.params.id) });
  if (!dato) return res.status(404)...
  res.json(dato);
});

app.post("/api/entidad", async (req, res) => {
  const entidad = new Entidad();
  entidad.nombre = req.body.nombre;
  res.status(201).json(await repo.save(entidad));
});

app.put("/api/entidad/:id", async (req, res) => {
  await repo.update(id, { nombre: req.body.nombre });
  res.json(await repo.findOneBy({ id }));
});

app.delete("/api/entidad/:id", async (req, res) => {
  await repo.delete(id);
  res.json({ mensaje: "Eliminado" });
});
```

---

## 📝 Paso a paso

### Paso 1: Copiá `index.ts` del ejercicio 16

### Paso 2: Cambiá

- `Cargo` → `Lugar`
- `cargo` → `lugar`
- `/api/cargos` → `/api/lugares`

### Paso 3: Importá Lugar

```ts
import { Lugar } from "./entities/Lugar";
```

### Paso 4: Asegurate de registrar Lugar en `data-source.ts`

```ts
entities: [Cargo, Lugar],
```

---

## ✅ Probar

```bash
curl http://localhost:3000/api/lugares
curl -X POST http://localhost:3000/api/lugares -H "Content-Type: application/json" -d '{"nombre":"Lima"}'
curl http://localhost:3000/api/lugares/1
curl -X PUT http://localhost:3000/api/lugares/1 -H "Content-Type: application/json" -d '{"nombre":"Lima Metropolitana"}'
curl -X DELETE http://localhost:3000/api/lugares/2
```

---

## 🤔 Para pensar

¿Cómo harías para no repetir código entre el CRUD de Cargo y Lugar? (Pista: funciones genéricas, clases base, o un helper de rutas). Por ahora duplicar está bien para practicar.

---

## 📁 Estructura esperada

```
17-api-lugares/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    ├── index.ts
    └── entities/
        ├── Cargo.ts
        └── Lugar.ts
```
