# Prácticas de Node.js — De cero a CRUD con TypeORM + Vistas

22 ejercicios progresivos para dominar Node.js, Express, TypeORM y EJS.

---

## 🗺️ Ruta de aprendizaje

Cada carpeta contiene un `README.md` con una **clase completa**: teoría, paso a paso, ejercicios y errores comunes. **No hay código solución** — la idea es que vos escribas todo.

---

## Fase 1: Node.js puro

| # | Carpeta | Tema |
|---|---|---|
| 01 | [01-hola-mundo](01-hola-mundo/) | Qué es Node.js, `console.log`, ejecutar `.js` |
| 02 | [02-modulo-http](02-modulo-http/) | Servidor HTTP nativo, `createServer`, request/response |
| 03 | [03-rutas-y-metodos](03-rutas-y-metodos/) | `req.url`, `req.method`, if/else por ruta, 404 |
| 04 | [04-modulo-fs](04-modulo-fs/) | `fs.writeFileSync`, `fs.readFileSync`, persistencia JSON |

## Fase 2: Express.js

| # | Carpeta | Tema |
|---|---|---|
| 05 | [05-express-intro](05-express-intro/) | `npm init`, instalar Express, `app.get`, `res.json` |
| 06 | [06-express-post](06-express-post/) | `express.json()`, `req.body`, POST con persistencia JSON |
| 07 | [07-crud-archivo](07-crud-archivo/) | CRUD completo (GET, POST, PUT, DELETE) con archivo JSON |

## Fase 3: TypeORM + TypeScript

| # | Carpeta | Tema |
|---|---|---|
| 08 | [08-typeorm-setup](08-typeorm-setup/) | Instalar TypeORM, TypeScript, `tsconfig.json` |
| 09 | [09-typeorm-conexion](09-typeorm-conexion/) | `DataSource`, conectar a MySQL/PostgreSQL |
| 10 | [10-entidad-cargo](10-entidad-cargo/) | `@Entity`, `@PrimaryGeneratedColumn`, `@Column` |
| 11 | [11-crud-typeorm](11-crud-typeorm/) | `save`, `find`, `findOneBy`, `update`, `delete` |
| 12 | [12-entidad-lugar](12-entidad-lugar/) | Segunda entidad (reforzar patrón) |
| 13 | [13-entidad-candidato](13-entidad-candidato/) | `@ManyToOne`, `@JoinColumn`, PK varchar |
| 14 | [14-insertar-relaciones](14-insertar-relaciones/) | Insertar candidato con cargo y lugar |
| 15 | [15-leer-relaciones](15-leer-relaciones/) | `find` con `relations`, JOINs |

## Fase 4: API REST (Express + TypeORM)

| # | Carpeta | Tema |
|---|---|---|
| 16 | [16-api-cargos](16-api-cargos/) | Rutas CRUD para Cargos |
| 17 | [17-api-lugares](17-api-lugares/) | Rutas CRUD para Lugares |
| 18 | [18-api-candidatos](18-api-candidatos/) | Rutas CRUD para Candidatos con relaciones |

## Fase 5: Vistas con EJS

| # | Carpeta | Tema |
|---|---|---|
| 19 | [19-vistas-ejs](19-vistas-ejs/) | Configurar EJS, `res.render`, tablas HTML |
| 20 | [20-formularios-vistas](20-formularios-vistas/) | Formularios HTML, `urlencoded`, redirect |
| 21 | [21-crud-vistas-completo](21-crud-vistas-completo/) | CRUD completo desde el navegador |

## Proyecto final

| # | Carpeta | Tema |
|---|---|---|
| 🎯 | [tarea-crud-candidatos](tarea-crud-candidatos/) | Guía completa: CRUD de Candidatos, Cargos y Lugar con TypeORM + Express + EJS |

---

## 🚀 Cómo usar esto

1. Empezá por `01-hola-mundo`. Leé el README completo.
2. Escribí tu código en un archivo `.js` o `.ts` dentro de la carpeta.
3. Probá que funcione.
4. Pasá al siguiente.

Cada ejercicio asume que completaste el anterior.

---

## 📦 Requisitos

- Node.js instalado
- MySQL o PostgreSQL instalado y corriendo (desde el ejercicio 09)
- Editor de código (VS Code recomendado)
- Terminal
