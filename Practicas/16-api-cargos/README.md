# 16 — API REST: CRUD de Cargos (Express + TypeORM)

---

## 🎯 ¿Qué vamos a hacer?

Crear un servidor Express que exponga endpoints REST para Cargos usando TypeORM como base de datos. Es la unión de lo que aprendiste en el 07 (Express CRUD) y el 11 (TypeORM CRUD).

---

## 🧠 Teoría

### Arquitectura

```
Cliente (curl/postman)  →  Express (rutas)  →  TypeORM (BD)
       │                       │                     │
       │  GET /api/cargos      │  repo.find()        │  SELECT * FROM cargo
       │<──────────────────────│<────────────────────│
       │  JSON                 │  Cargo[]            │  filas
```

### Express + async/await

Las rutas de Express ahora son `async` porque TypeORM usa `await`:

```ts
app.get("/api/cargos", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Cargo);
    const cargos = await repo.find();
    res.json(cargos);
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
});
```

**SIEMPRE usá try/catch.** Si la BD falla, Express no se cuelga.

### Instalación adicional

Necesitás Express y sus tipos:

```bash
npm install express
npm install --save-dev @types/express
```

---

## 📝 Paso a paso

### Paso 0: Instalar

```bash
npm install express
npm install --save-dev @types/express
```

### Paso 1: Estructura de `index.ts`

```ts
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { Cargo } from "./entities/Cargo";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ BD conectada");

    const app = express();
    app.use(express.json());

    // === RUTAS CRUD ===

    // GET /api/cargos
    app.get("/api/cargos", async (req, res) => {
      try {
        const repo = AppDataSource.getRepository(Cargo);
        const cargos = await repo.find();
        res.json(cargos);
      } catch (error) {
        res.status(500).json({ error: "Error al obtener cargos" });
      }
    });

    // GET /api/cargos/:id
    app.get("/api/cargos/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const repo = AppDataSource.getRepository(Cargo);
        const cargo = await repo.findOneBy({ id });

        if (!cargo) return res.status(404).json({ error: "Cargo no encontrado" });

        res.json(cargo);
      } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
      }
    });

    // POST /api/cargos
    app.post("/api/cargos", async (req, res) => {
      try {
        const { nombre } = req.body;
        if (!nombre) return res.status(400).json({ error: "Nombre es obligatorio" });

        const repo = AppDataSource.getRepository(Cargo);
        const cargo = new Cargo();
        cargo.nombre = nombre;

        const resultado = await repo.save(cargo);
        res.status(201).json(resultado);
      } catch (error) {
        res.status(500).json({ error: "Error al crear cargo" });
      }
    });

    // PUT /api/cargos/:id
    app.put("/api/cargos/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const { nombre } = req.body;

        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
        if (!nombre) return res.status(400).json({ error: "Nombre es obligatorio" });

        const repo = AppDataSource.getRepository(Cargo);
        const result = await repo.update(id, { nombre });

        if (result.affected === 0) return res.status(404).json({ error: "Cargo no encontrado" });

        const actualizado = await repo.findOneBy({ id });
        res.json(actualizado);
      } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
      }
    });

    // DELETE /api/cargos/:id
    app.delete("/api/cargos/:id", async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const repo = AppDataSource.getRepository(Cargo);
        const result = await repo.delete(id);

        if (result.affected === 0) return res.status(404).json({ error: "Cargo no encontrado" });

        res.json({ mensaje: "Cargo eliminado correctamente" });
      } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
      }
    });

    // 404 global
    app.use((req, res) => {
      res.status(404).json({ error: "Ruta no encontrada" });
    });

    app.listen(3000, () => {
      console.log("🚀 Servidor en http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Error al iniciar:", error);
  }
}

main();
```

---

## ✅ Probar

```bash
npm run dev
```

Las pruebas son idénticas al ejercicio 07, solo que ahora usás `/api/cargos` en lugar de `/cargos`:

```bash
curl http://localhost:3000/api/cargos
curl -X POST http://localhost:3000/api/cargos -H "Content-Type: application/json" -d '{"nombre":"Gerente"}'
curl http://localhost:3000/api/cargos/1
curl -X PUT http://localhost:3000/api/cargos/1 -H "Content-Type: application/json" -d '{"nombre":"Director"}'
curl -X DELETE http://localhost:3000/api/cargos/2
```

---

## 🔄 Comparación 07 vs 16

| 07 (JSON) | 16 (TypeORM) |
|---|---|
| `const db = leerDB()` | `const repo = AppDataSource.getRepository(Cargo)` |
| `db.cargos` | `await repo.find()` |
| `db.cargos.push({...})` | `new Cargo(); await repo.save(cargo)` |
| `db.cargos.find(...)` | `await repo.findOneBy({id})` |
| `escribirDB(db)` | Automático |
| `parseInt(req.params.id)` | `parseInt(req.params.id)` (igual) |

El patrón de Express no cambió. Solo cambió cómo accedés a los datos.

---

## 📁 Estructura esperada

```
16-api-cargos/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    ├── index.ts
    └── entities/
        └── Cargo.ts
```
