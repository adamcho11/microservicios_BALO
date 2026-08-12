# 13 — TypeORM: entidad Candidato con relaciones

---

## 🎯 ¿Qué vamos a hacer?

Crear la entidad `Candidato`, que se relaciona con `Cargo` y `Lugar` mediante claves foráneas.

---

## 🧠 Teoría

### La tabla Candidato

| Columna | Tipo | Descripción |
|---|---|---|
| `ci` | VARCHAR(12) | Cédula de identidad — **PK manual** |
| `nombres` | VARCHAR(60) | Nombres del candidato |
| `apellido1` | VARCHAR(30) | Primer apellido |
| `apellido2` | VARCHAR(40) | Segundo apellido |
| `cargo_id` | INT | FK → cargo.id |
| `lugar_id` | INT | FK → lugar.id |

### `@ManyToOne`

Relación "muchos a uno": muchos candidatos pueden tener el mismo cargo.

```ts
@ManyToOne(() => Cargo)
@JoinColumn({ name: "cargo_id" })
cargo: Cargo;
```

- `@ManyToOne(() => Cargo)` — la flecha `() => Cargo` evita referencias circulares.
- `@JoinColumn({ name: "cargo_id" })` — nombre de la columna FK en la BD.
- `cargo: Cargo` — **la propiedad es del tipo Cargo**, no number.

### ¿Qué pasa en la BD?

TypeORM traduce esto a:

```sql
CREATE TABLE candidato (
  ci VARCHAR(12) PRIMARY KEY,
  nombres VARCHAR(60),
  apellido1 VARCHAR(30),
  apellido2 VARCHAR(40),
  cargo_id INT,
  lugar_id INT,
  FOREIGN KEY (cargo_id) REFERENCES cargo(id),
  FOREIGN KEY (lugar_id) REFERENCES lugar(id)
);
```

**Las columnas `cargo_id` y `lugar_id` existen en la BD pero NO en tu clase TypeScript.** En TypeScript la propiedad es `cargo` (tipo `Cargo`) y `lugar` (tipo `Lugar`).

### `@PrimaryColumn` vs `@PrimaryGeneratedColumn`

| Decorador | Cuándo usarlo |
|---|---|
| `@PrimaryGeneratedColumn()` | El ID lo genera la BD automáticamente (1, 2, 3...) |
| `@PrimaryColumn()` | El ID lo asigna el usuario (ej: cédula) |

`ci` usa `@PrimaryColumn` porque es un valor que ingresa el usuario (la cédula).

---

## 📝 Paso a paso

### Paso 1: Crear `src/entities/Candidato.ts`

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

### Paso 2: Registrar en `data-source.ts`

```ts
import { Candidato } from "./entities/Candidato";

entities: [Cargo, Lugar, Candidato],
```

**El orden importa.** `Cargo` y `Lugar` deben estar antes que `Candidato` porque Candidato tiene FKs hacia ellos.

---

## ✅ Probar

```bash
npm run dev
```

Con `logging: true`, deberías ver la creación de la tabla `candidato` con las FKs. Verificá en la BD.

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `EntityMetadataNotFound` | No registraste `Candidato` en `entities` |
| Error de FK (no encuentra cargo/lugar) | `Cargo` y `Lugar` no están en `entities` o están después de `Candidato` |
| `@PrimaryColumn` no funciona | La escribiste mal (ej: `@PrimaryKeyColumn`). Es `@PrimaryColumn`. |
| No se puede importar Cargo/Lugar | Verificá que `Cargo.ts` y `Lugar.ts` tengan `export class`. |

---

## 📌 Importante

- La propiedad en la clase es `cargo: Cargo`, no `cargo_id: number`.
- En la BD SÍ existe `cargo_id`, pero **no la declarás en la clase**. TypeORM la crea automáticamente por el `@JoinColumn`.
- Para asignar un cargo a un candidato usás `candidato.cargo = { id: 1 } as Cargo`, no `candidato.cargo_id = 1`.

---

## 📁 Estructura esperada

```
13-entidad-candidato/
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
