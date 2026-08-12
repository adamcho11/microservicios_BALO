# 10 — TypeORM: crear la entidad Cargo

---

## 🎯 ¿Qué vamos a hacer?**

Crear la primera **entidad** de TypeORM: la clase `Cargo` que representa la tabla `cargo` en la base de datos.

---

## 🧠 Teoría

### ¿Qué es una entidad?

Una entidad es una **clase TypeScript** decorada con `@Entity()` que TypeORM mapea a una tabla SQL.

```
CLASE TYPESCRIPT                    TABLA SQL
┌────────────────────────┐        ┌─────────────────────┐
│ @Entity("cargo")       │        │ CREATE TABLE cargo ( │
│ export class Cargo {   │        │   id INT PK AUTO_INC │
│   @PrimaryGenColumn()  │ <───>  │   nombre VARCHAR(60) │
│   id: number           │        │ );                   │
│                        │        └─────────────────────┘
│   @Column()            │
│   nombre: string       │
│ }                      │
└────────────────────────┘
```

### Decoradores principales

| Decorador | Sobre | ¿Qué hace? |
|---|---|---|
| `@Entity("nombre_tabla")` | Clase | Marca la clase como entidad. El string es el nombre de la tabla (opcional, por defecto usa el nombre de la clase en minúsculas). |
| `@PrimaryGeneratedColumn()` | Propiedad | Clave primaria autoincremental (1, 2, 3...) |
| `@Column({ opciones })` | Propiedad | Columna normal. Acepta opciones. |

### Opciones de `@Column()`

| Opción | Tipo | Descripción |
|---|---|---|
| `type` | string | Tipo SQL: `"varchar"`, `"int"`, `"text"`, `"boolean"` |
| `length` | number | Longitud máxima (para varchar) |
| `nullable` | boolean | ¿Permite NULL? (default: true) |
| `unique` | boolean | ¿Valor único? (default: false) |
| `default` | valor | Valor por defecto |

Si no especificás opciones, TypeORM infiere:
- `string` → `varchar(255)`
- `number` → `int`
- `boolean` → `boolean`

---

## 📝 Paso a paso

### Paso 1: Crear carpeta `src/entities/`

Organizá tus entidades en una carpeta separada.

### Paso 2: Crear `src/entities/Cargo.ts`

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

**Explicación línea por línea:**

- `import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"` — importa los decoradores.
- `@Entity("cargo")` — esta clase es la tabla `cargo`.
- `export class Cargo` — exportamos para poder usarla en otros archivos.
- `@PrimaryGeneratedColumn()` — `id` es clave primaria, autoincremental.
- `@Column({ type: "varchar", length: 60 })` — `nombre` es varchar de máximo 60 caracteres.

### Paso 3: Registrar la entidad en `data-source.ts`

Abrí `src/data-source.ts` y agregá:

```ts
import { Cargo } from "./entities/Cargo";

entities: [Cargo],
```

Esto le dice a TypeORM: "Cargo es una tabla, sincronizala".

---

## ✅ Probar

```bash
npm run dev
```

Con `logging: true`, deberías ver en consola:

```sql
CREATE TABLE `cargo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
```

Verificá en tu cliente de BD (phpMyAdmin, pgAdmin, TablePlus):

```sql
DESCRIBE cargo;
-- MySQL
-- Field   | Type        | Null | Key | Extra
-- id      | int         | NO   | PRI | auto_increment
-- nombre  | varchar(60) | YES  |     |
```

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| Tabla no se crea | Olvidaste agregar `Cargo` al array `entities` en `data-source.ts` |
| `SyntaxError: Invalid character '@'` | Olvidaste `experimentalDecorators: true` en `tsconfig.json` |
| `reflect-metadata` no funciona | Olvidaste `import "reflect-metadata"` al inicio de `index.ts` |

---

## 📁 Estructura esperada

```
10-entidad-cargo/
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
