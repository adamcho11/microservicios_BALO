# 11 — TypeORM: CRUD de Cargo

---

## 🎯 ¿Qué vamos a hacer?

Insertar, leer, actualizar y eliminar cargos usando TypeORM. Lo mismo que hiciste en el ejercicio 07 pero con base de datos real.

---

## 🧠 Teoría

### Repository

Cada entidad tiene un **Repository** que maneja las operaciones de base de datos:

```ts
const cargoRepository = AppDataSource.getRepository(Cargo);
```

### Métodos del Repository

| Método | SQL equivalente | Devuelve |
|---|---|---|
| `save(entidad)` | INSERT | La entidad con ID generado |
| `find()` | SELECT * | Array de entidades |
| `findOneBy({ id })` | SELECT ... WHERE id = ? | Una entidad o null |
| `find({ where: {...} })` | SELECT ... WHERE ... | Array de entidades |
| `update(id, datos)` | UPDATE ... WHERE id = ? | UpdateResult (tiene .affected) |
| `delete(id)` | DELETE ... WHERE id = ? | DeleteResult (tiene .affected) |
| `count()` | SELECT COUNT(*) | Número |

### Crear y guardar

```ts
const cargo = new Cargo();
cargo.nombre = "Gerente";
const resultado = await cargoRepository.save(cargo);
// resultado = Cargo { id: 1, nombre: "Gerente" }
```

`save()` devuelve el objeto con el ID generado por la BD.

### Leer todos

```ts
const cargos = await cargoRepository.find();
// [Cargo { id: 1, nombre: "..." }, ...]
```

### Leer uno

```ts
const cargo = await cargoRepository.findOneBy({ id: 1 });
if (!cargo) {
  console.log("No encontrado");
}
```

### Actualizar

```ts
const resultado = await cargoRepository.update(1, { nombre: "Director" });
console.log(resultado.affected); // 1 si actualizó, 0 si no encontró el ID
```

### Eliminar

```ts
const resultado = await cargoRepository.delete(2);
console.log(resultado.affected); // 1 si eliminó, 0 si no encontró
```

---

## 📝 Paso a paso

### Paso 1: Modificar `src/index.ts`

Estructura general:

```ts
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Cargo } from "./entities/Cargo";

async function main() {
  // 1. Conectar
  await AppDataSource.initialize();
  console.log("✅ BD conectada\n");

  const repo = AppDataSource.getRepository(Cargo);

  // 2. Insertar
  console.log("=== INSERTAR ===");
  // ... tu código

  // 3. Leer todos
  console.log("\n=== LEER TODOS ===");
  // ... tu código

  // 4. Leer uno
  console.log("\n=== LEER UNO ===");
  // ... tu código

  // 5. Actualizar
  console.log("\n=== ACTUALIZAR ===");
  // ... tu código

  // 6. Eliminar
  console.log("\n=== ELIMINAR ===");
  // ... tu código

  await AppDataSource.destroy();
}

main();
```

### Paso 2: INSERTAR

```ts
const c1 = new Cargo();
c1.nombre = "Gerente";
await repo.save(c1);

const c2 = new Cargo();
c2.nombre = "Analista";
await repo.save(c2);

const c3 = new Cargo();
c3.nombre = "Desarrollador";
await repo.save(c3);

console.log("3 cargos insertados");
```

### Paso 3: LEER TODOS

```ts
const cargos = await repo.find();
cargos.forEach(c => console.log(`  ID: ${c.id}, Nombre: ${c.nombre}`));
```

### Paso 4: LEER UNO

```ts
const cargo = await repo.findOneBy({ id: 1 });
if (cargo) {
  console.log(`  Encontrado: ${cargo.nombre}`);
} else {
  console.log("  No encontrado");
}
```

### Paso 5: ACTUALIZAR

```ts
const result = await repo.update(1, { nombre: "Director General" });
console.log(`  Filas actualizadas: ${result.affected}`);

// Verificar
const actualizado = await repo.findOneBy({ id: 1 });
console.log(`  Nuevo nombre: ${actualizado?.nombre}`);
```

### Paso 6: ELIMINAR

```ts
const delResult = await repo.delete(2);
console.log(`  Filas eliminadas: ${delResult.affected}`);

// Listar después de eliminar
const restantes = await repo.find();
console.log(`  Cargos restantes: ${restantes.length}`);
```

---

## ✅ Probar

```bash
npm run dev
```

Salida esperada:

```
✅ BD conectada

=== INSERTAR ===
3 cargos insertados

=== LEER TODOS ===
  ID: 1, Nombre: Gerente
  ID: 2, Nombre: Analista
  ID: 3, Nombre: Desarrollador

=== LEER UNO ===
  Encontrado: Gerente

=== ACTUALIZAR ===
  Filas actualizadas: 1
  Nuevo nombre: Director General

=== ELIMINAR ===
  Filas eliminadas: 1
  Cargos restantes: 2
```

---

## 🧪 Experimentá

### Ejercicio 1: Insertar solo si la tabla está vacía

```ts
const count = await repo.count();
if (count === 0) {
  // insertar datos de prueba
}
```

### Ejercicio 2: Buscar por nombre

```ts
const porNombre = await repo.find({ where: { nombre: "Gerente" } });
```

### Ejercicio 3: Ordenar resultados

```ts
const ordenados = await repo.find({ order: { nombre: "ASC" } });
```

### Ejercicio 4: Limitar resultados

```ts
const primerosDos = await repo.find({ take: 2 });
```

---

## 📌 Resumen

| Ejercicio 07 (JSON) | Ejercicio 11 (TypeORM) |
|---|---|
| `leerDB()` | `AppDataSource.initialize()` |
| `db.cargos.push({...})` | `await repo.save(new Cargo())` |
| `db.cargos` | `await repo.find()` |
| `db.cargos.find(c => c.id === id)` | `await repo.findOneBy({ id })` |
| `db.cargos[indice].nombre = ...` | `await repo.update(id, {...})` |
| `db.cargos.splice(indice, 1)` | `await repo.delete(id)` |
| `escribirDB(db)` | Automático |

---

## 📁 Estructura esperada

```
11-crud-typeorm/
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
