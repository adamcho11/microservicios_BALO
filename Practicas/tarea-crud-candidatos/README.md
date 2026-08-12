# Tarea — CRUD Candidatos, Cargos y Lugar con TypeORM + Express + EJS

Guía paso a paso para tu proyecto final.

---

## 📋 Especificaciones

### Tablas

**Cargo** (`cargo`)
| Columna | Tipo |
|---|---|
| `id` | INT, PK, AUTO_INCREMENT |
| `nombre` | VARCHAR(60) |

**Lugar** (`lugar`)
| Columna | Tipo |
|---|---|
| `id` | INT, PK, AUTO_INCREMENT |
| `nombre` | VARCHAR(60) |

**Candidato** (`candidato`)
| Columna | Tipo |
|---|---|
| `ci` | VARCHAR(12), PK |
| `nombres` | VARCHAR(60) |
| `apellido1` | VARCHAR(30) |
| `apellido2` | VARCHAR(40) |
| `cargo_id` | INT, FK → cargo.id |
| `lugar_id` | INT, FK → lugar.id |

---

## 🔧 Tecnologías

- Node.js + TypeScript
- Express.js
- TypeORM
- EJS (motor de plantillas)
- MySQL o PostgreSQL

---

## 📐 Arquitectura del proyecto

```
mi-proyecto-crud/
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts        ← conexión a la BD
    ├── index.ts              ← servidor Express + rutas
    ├── entities/
    │   ├── Cargo.ts
    │   ├── Lugar.ts
    │   └── Candidato.ts
    └── views/
        ├── cargos/
        │   ├── lista.ejs
        │   └── formulario.ejs
        ├── lugares/
        │   ├── lista.ejs
        │   └── formulario.ejs
        └── candidatos/
            ├── lista.ejs
            └── formulario.ejs
```

---

## 🚀 Paso a paso para construir el proyecto

### Fase 1: Setup del proyecto

**1. Crear carpeta e inicializar:**
```bash
mkdir mi-proyecto-crud
cd mi-proyecto-crud
npm init -y
```

**2. Instalar dependencias:**
```bash
npm install typeorm reflect-metadata mysql2 express ejs
npm install --save-dev typescript ts-node @types/node @types/express
```

**3. Crear `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**4. Configurar `package.json` scripts:**
```json
"scripts": {
  "dev": "ts-node src/index.ts",
  "start": "ts-node src/index.ts"
}
```

**5. Crear estructura de carpetas:**
```bash
mkdir -p src/entities src/views/cargos src/views/lugares src/views/candidatos
```

**6. Crear la base de datos:**
```sql
CREATE DATABASE candidatos_db;
```

---

### Fase 2: Conexión a la base de datos (`src/data-source.ts`)

```ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Cargo } from "./entities/Cargo";
import { Lugar } from "./entities/Lugar";
import { Candidato } from "./entities/Candidato";

export const AppDataSource = new DataSource({
  type: "mysql",           // o "postgres"
  host: "localhost",
  port: 3306,              // 5432 para PostgreSQL
  username: "root",
  password: "",
  database: "candidatos_db",
  entities: [Cargo, Lugar, Candidato],
  synchronize: true,
  logging: true,
});
```

---

### Fase 3: Entidades

**`src/entities/Cargo.ts`:**
```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("cargo")
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 60 })
  nombre: string;
}
```

**`src/entities/Lugar.ts`:**
```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("lugar")
export class Lugar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 60 })
  nombre: string;
}
```

**`src/entities/Candidato.ts`:**
```ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cargo } from "./Cargo";
import { Lugar } from "./Lugar";

@Entity("candidato")
export class Candidato {
  @PrimaryColumn({ type: "varchar", length: 12 })
  ci: string;

  @Column({ type: "varchar", length: 60 })
  nombres: string;

  @Column({ type: "varchar", length: 30 })
  apellido1: string;

  @Column({ type: "varchar", length: 40 })
  apellido2: string;

  @ManyToOne(() => Cargo)
  @JoinColumn({ name: "cargo_id" })
  cargo: Cargo;

  @ManyToOne(() => Lugar)
  @JoinColumn({ name: "lugar_id" })
  lugar: Lugar;
}
```

---

### Fase 4: Servidor Express con EJS (`src/index.ts`)

```ts
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import { Cargo } from "./entities/Cargo";
import { Lugar } from "./entities/Lugar";
import { Candidato } from "./entities/Candidato";

async function main() {
  await AppDataSource.initialize();
  console.log("✅ BD conectada");

  const app = express();
  app.set("view engine", "ejs");
  app.set("views", __dirname + "/views");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ============ RUTAS CARGOS ============

  // Listar
  app.get("/cargos", async (req, res) => {
    const cargos = await AppDataSource.getRepository(Cargo).find();
    res.render("cargos/lista", { cargos, titulo: "Cargos" });
  });

  // Formulario nuevo
  app.get("/cargos/nuevo", (req, res) => {
    res.render("cargos/formulario", { titulo: "Nuevo Cargo", cargo: null });
  });

  // Crear (POST)
  app.post("/cargos", async (req, res) => {
    const cargo = new Cargo();
    cargo.nombre = req.body.nombre;
    await AppDataSource.getRepository(Cargo).save(cargo);
    res.redirect("/cargos");
  });

  // Formulario editar
  app.get("/cargos/:id/editar", async (req, res) => {
    const id = parseInt(req.params.id);
    const cargo = await AppDataSource.getRepository(Cargo).findOneBy({ id });
    if (!cargo) return res.status(404).send("No encontrado");
    res.render("cargos/formulario", { titulo: "Editar Cargo", cargo });
  });

  // Actualizar (POST)
  app.post("/cargos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await AppDataSource.getRepository(Cargo).update(id, { nombre: req.body.nombre });
    res.redirect("/cargos");
  });

  // Eliminar (POST)
  app.post("/cargos/:id/eliminar", async (req, res) => {
    const id = parseInt(req.params.id);
    await AppDataSource.getRepository(Cargo).delete(id);
    res.redirect("/cargos");
  });

  // ============ RUTAS LUGARES ============

  app.get("/lugares", async (req, res) => {
    const lugares = await AppDataSource.getRepository(Lugar).find();
    res.render("lugares/lista", { lugares, titulo: "Lugares" });
  });

  app.get("/lugares/nuevo", (req, res) => {
    res.render("lugares/formulario", { titulo: "Nuevo Lugar", lugar: null });
  });

  app.post("/lugares", async (req, res) => {
    const lugar = new Lugar();
    lugar.nombre = req.body.nombre;
    await AppDataSource.getRepository(Lugar).save(lugar);
    res.redirect("/lugares");
  });

  app.get("/lugares/:id/editar", async (req, res) => {
    const id = parseInt(req.params.id);
    const lugar = await AppDataSource.getRepository(Lugar).findOneBy({ id });
    if (!lugar) return res.status(404).send("No encontrado");
    res.render("lugares/formulario", { titulo: "Editar Lugar", lugar });
  });

  app.post("/lugares/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await AppDataSource.getRepository(Lugar).update(id, { nombre: req.body.nombre });
    res.redirect("/lugares");
  });

  app.post("/lugares/:id/eliminar", async (req, res) => {
    const id = parseInt(req.params.id);
    await AppDataSource.getRepository(Lugar).delete(id);
    res.redirect("/lugares");
  });

  // ============ RUTAS CANDIDATOS ============

  app.get("/candidatos", async (req, res) => {
    const candidatos = await AppDataSource.getRepository(Candidato).find({
      relations: ["cargo", "lugar"],
    });
    res.render("candidatos/lista", { candidatos, titulo: "Candidatos" });
  });

  app.get("/candidatos/nuevo", async (req, res) => {
    const cargos = await AppDataSource.getRepository(Cargo).find();
    const lugares = await AppDataSource.getRepository(Lugar).find();
    res.render("candidatos/formulario", {
      titulo: "Nuevo Candidato",
      candidato: null,
      cargos,
      lugares,
    });
  });

  app.post("/candidatos", async (req, res) => {
    const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    const candidato = new Candidato();
    candidato.ci = ci;
    candidato.nombres = nombres;
    candidato.apellido1 = apellido1;
    candidato.apellido2 = apellido2 || "";
    candidato.cargo = { id: parseInt(cargo_id) } as Cargo;
    candidato.lugar = { id: parseInt(lugar_id) } as Lugar;
    await AppDataSource.getRepository(Candidato).save(candidato);
    res.redirect("/candidatos");
  });

  app.get("/candidatos/:ci/editar", async (req, res) => {
    const candidato = await AppDataSource.getRepository(Candidato).findOne({
      where: { ci: req.params.ci },
      relations: ["cargo", "lugar"],
    });
    if (!candidato) return res.status(404).send("No encontrado");
    const cargos = await AppDataSource.getRepository(Cargo).find();
    const lugares = await AppDataSource.getRepository(Lugar).find();
    res.render("candidatos/formulario", {
      titulo: "Editar Candidato",
      candidato,
      cargos,
      lugares,
    });
  });

  app.post("/candidatos/:ci", async (req, res) => {
    const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    const repo = AppDataSource.getRepository(Candidato);
    const candidato = await repo.findOne({
      where: { ci: req.params.ci },
      relations: ["cargo", "lugar"],
    });
    if (!candidato) return res.status(404).send("No encontrado");

    if (nombres) candidato.nombres = nombres;
    if (apellido1) candidato.apellido1 = apellido1;
    if (apellido2 !== undefined) candidato.apellido2 = apellido2;
    if (cargo_id) candidato.cargo = { id: parseInt(cargo_id) } as Cargo;
    if (lugar_id) candidato.lugar = { id: parseInt(lugar_id) } as Lugar;

    await repo.save(candidato);
    res.redirect("/candidatos");
  });

  app.post("/candidatos/:ci/eliminar", async (req, res) => {
    await AppDataSource.getRepository(Candidato).delete(req.params.ci);
    res.redirect("/candidatos");
  });

  // ============ INICIO ============

  app.get("/", (req, res) => {
    res.render("inicio");
  });

  // ============ ESCUCHAR ============

  app.listen(3000, () => {
    console.log("🚀 http://localhost:3000");
  });
}

main().catch(console.error);
```

---

### Fase 5: Vistas EJS

**`src/views/inicio.ejs`:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Sistema de Candidatos</title>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 50px auto; text-align: center; }
    a { display: block; margin: 15px; padding: 15px; background: #007bff; color: white;
        text-decoration: none; border-radius: 8px; font-size: 18px; }
    a:hover { background: #0056b3; }
  </style>
</head>
<body>
  <h1>Sistema de Gestión de Candidatos</h1>
  <a href="/cargos">Gestionar Cargos</a>
  <a href="/lugares">Gestionar Lugares</a>
  <a href="/candidatos">Gestionar Candidatos</a>
</body>
</html>
```

**`src/views/cargos/lista.ejs`:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title><%= titulo %></title>
  <style>
    body { font-family: Arial; max-width: 800px; margin: 30px auto; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; }
    th { background: #007bff; color: white; }
    a, button { padding: 5px 10px; text-decoration: none; border-radius: 4px; }
    .btn-edit { background: #ffc107; color: black; }
    .btn-delete { background: #dc3545; color: white; border: none; cursor: pointer; }
    .btn-new { background: #28a745; color: white; padding: 10px 20px; display: inline-block; margin-bottom: 15px; }
    .btn-back { background: #6c757d; color: white; padding: 10px 20px; display: inline-block; }
  </style>
</head>
<body>
  <h1><%= titulo %></h1>
  <a href="/cargos/nuevo" class="btn-new">+ Nuevo Cargo</a>

  <table>
    <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
    <tbody>
      <% if (cargos.length === 0) { %>
        <tr><td colspan="3" style="text-align:center;">No hay cargos registrados.</td></tr>
      <% } %>
      <% cargos.forEach(cargo => { %>
        <tr>
          <td><%= cargo.id %></td>
          <td><%= cargo.nombre %></td>
          <td>
            <a href="/cargos/<%= cargo.id %>/editar" class="btn-edit">Editar</a>
            <form method="POST" action="/cargos/<%= cargo.id %>/eliminar" style="display:inline;">
              <button type="submit" class="btn-delete" onclick="return confirm('¿Eliminar?')">Eliminar</button>
            </form>
          </td>
        </tr>
      <% }) %>
    </tbody>
  </table>

  <a href="/" class="btn-back">← Volver al inicio</a>
</body>
</html>
```

**`src/views/cargos/formulario.ejs`:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"><title><%= titulo %></title>
  <style>
    body { font-family: Arial; max-width: 500px; margin: 50px auto; }
    label { display: block; margin: 10px 0 5px; }
    input { width: 100%; padding: 8px; box-sizing: border-box; }
    button { margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    a { display: inline-block; margin-top: 10px; color: #6c757d; }
  </style>
</head>
<body>
  <h1><%= titulo %></h1>
  <form method="POST" action="<%= cargo ? '/cargos/' + cargo.id : '/cargos' %>">
    <label>Nombre:</label>
    <input type="text" name="nombre" value="<%= cargo ? cargo.nombre : '' %>" required maxlength="60">
    <button type="submit"><%= cargo ? 'Actualizar' : 'Guardar' %></button>
  </form>
  <a href="/cargos">← Volver</a>
</body>
</html>
```

**`src/views/lugares/lista.ejs`** — Igual que `cargos/lista.ejs`, cambiá `cargos` por `lugares` y `Cargo` por `Lugar`.

**`src/views/lugares/formulario.ejs`** — Igual que `cargos/formulario.ejs`, cambiá `cargo` por `lugar` y las rutas.

**`src/views/candidatos/lista.ejs`:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"><title><%= titulo %></title>
  <style>
    body { font-family: Arial; max-width: 1000px; margin: 30px auto; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; }
    th { background: #007bff; color: white; }
    .btn-edit { background: #ffc107; color: black; padding: 5px 10px; text-decoration: none; border-radius: 4px; }
    .btn-delete { background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
    .btn-new { background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-bottom: 15px; }
    .btn-back { background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; }
  </style>
</head>
<body>
  <h1><%= titulo %></h1>
  <a href="/candidatos/nuevo" class="btn-new">+ Nuevo Candidato</a>

  <table>
    <thead>
      <tr>
        <th>CI</th><th>Nombres</th><th>Apellido 1</th><th>Apellido 2</th><th>Cargo</th><th>Lugar</th><th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <% if (candidatos.length === 0) { %>
        <tr><td colspan="7" style="text-align:center;">No hay candidatos registrados.</td></tr>
      <% } %>
      <% candidatos.forEach(c => { %>
        <tr>
          <td><%= c.ci %></td>
          <td><%= c.nombres %></td>
          <td><%= c.apellido1 %></td>
          <td><%= c.apellido2 %></td>
          <td><%= c.cargo.nombre %></td>
          <td><%= c.lugar.nombre %></td>
          <td>
            <a href="/candidatos/<%= c.ci %>/editar" class="btn-edit">Editar</a>
            <form method="POST" action="/candidatos/<%= c.ci %>/eliminar" style="display:inline;">
              <button type="submit" class="btn-delete" onclick="return confirm('¿Eliminar?')">Eliminar</button>
            </form>
          </td>
        </tr>
      <% }) %>
    </tbody>
  </table>

  <a href="/" class="btn-back">← Volver al inicio</a>
</body>
</html>
```

**`src/views/candidatos/formulario.ejs`:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"><title><%= titulo %></title>
  <style>
    body { font-family: Arial; max-width: 500px; margin: 30px auto; }
    label { display: block; margin: 10px 0 5px; }
    input, select { width: 100%; padding: 8px; box-sizing: border-box; }
    button { margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    a { display: inline-block; margin-top: 10px; color: #6c757d; }
  </style>
</head>
<body>
  <h1><%= titulo %></h1>

  <form method="POST" action="<%= candidato ? '/candidatos/' + candidato.ci : '/candidatos' %>">

    <label>CI:</label>
    <input type="text" name="ci" value="<%= candidato ? candidato.ci : '' %>"
           required maxlength="12" <%= candidato ? 'readonly' : '' %>>

    <label>Nombres:</label>
    <input type="text" name="nombres" value="<%= candidato ? candidato.nombres : '' %>" required maxlength="60">

    <label>Primer Apellido:</label>
    <input type="text" name="apellido1" value="<%= candidato ? candidato.apellido1 : '' %>" required maxlength="30">

    <label>Segundo Apellido:</label>
    <input type="text" name="apellido2" value="<%= candidato ? candidato.apellido2 : '' %>" maxlength="40">

    <label>Cargo:</label>
    <select name="cargo_id" required>
      <option value="">Seleccione un cargo</option>
      <% cargos.forEach(cargo => { %>
        <option value="<%= cargo.id %>"
          <%= candidato && candidato.cargo && candidato.cargo.id === cargo.id ? 'selected' : '' %>>
          <%= cargo.nombre %>
        </option>
      <% }) %>
    </select>

    <label>Lugar:</label>
    <select name="lugar_id" required>
      <option value="">Seleccione un lugar</option>
      <% lugares.forEach(lugar => { %>
        <option value="<%= lugar.id %>"
          <%= candidato && candidato.lugar && candidato.lugar.id === lugar.id ? 'selected' : '' %>>
          <%= lugar.nombre %>
        </option>
      <% }) %>
    </select>

    <button type="submit"><%= candidato ? 'Actualizar' : 'Guardar' %></button>
  </form>

  <a href="/candidatos">← Volver</a>
</body>
</html>
```

---

## ✅ Verificación final

1. **Crear la BD:** `CREATE DATABASE candidatos_db;`
2. **Instalar dependencias:** `npm install`
3. **Ejecutar:** `npm run dev`
4. Abrí `http://localhost:3000` y probá:
   - Crear, editar y eliminar cargos.
   - Crear, editar y eliminar lugares.
   - Crear un candidato seleccionando cargo y lugar de los `<select>`.
   - Ver la tabla de candidatos con `cargo.nombre` y `lugar.nombre`.
   - Editar y eliminar candidatos.

---

## 📊 Rúbrica de autoevaluación

| Requisito | ¿Funciona? |
|---|---|
| Cargos: crear, listar, editar, eliminar | ☐ |
| Lugares: crear, listar, editar, eliminar | ☐ |
| Candidatos: crear con selects de cargo y lugar | ☐ |
| Candidatos: listar mostrando cargo.nombre y lugar.nombre | ☐ |
| Candidatos: editar con formulario pre-llenado | ☐ |
| Candidatos: eliminar con confirmación | ☐ |
| Los datos persisten al reiniciar el servidor | ☐ |
| Validaciones básicas (campos requeridos) | ☐ |
| Menú de navegación entre secciones | ☐ |

---

## 🎯 Siguientes pasos (mejoras opcionales)

- Agregar **paginación** en las tablas.
- Agregar **búsqueda/filtro** de candidatos por nombre o cargo.
- Agregar **validación** de CI duplicado al crear/editar.
- Separar rutas en archivos (`routes/cargos.ts`, `routes/lugares.ts`, `routes/candidatos.ts`).
- Usar `PATCH` para actualización parcial en lugar de `POST`.
- Agregar manejo de errores con `flash messages`.
