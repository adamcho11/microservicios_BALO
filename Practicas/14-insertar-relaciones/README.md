# 14 — TypeORM: insertar Candidatos con relaciones

---

## 🎯 ¿Qué vamos a hacer?

Insertar candidatos en la BD vinculados a un Cargo y un Lugar existentes.

---

## 🧠 Teoría

### ¿Cómo se guarda una relación?

**NO se guardan IDs sueltos:**

```ts
// ❌ MAL: no existe la propiedad cargo_id en la clase
candidato.cargo_id = 1;
```

**Se guardan objetos o referencias:**

```ts
// ✅ BIEN: referencia por ID
candidato.cargo = { id: 1 } as Cargo;
```

TypeORM solo necesita el `id` para establecer la FK. No carga el objeto completo.

### Tres formas de asignar relaciones

**Forma 1: Referencia por ID (más simple)**
```ts
candidato.cargo = { id: 1 } as Cargo;
```

El `as Cargo` es necesario porque TypeScript espera un `Cargo`, no un `{ id: number }`. Le decimos "confiá, esto es un Cargo".

**Forma 2: Buscar la entidad primero (más seguro)**
```ts
const cargo = await cargoRepo.findOneBy({ id: 1 });
candidato.cargo = cargo!;  // el ! le dice a TS "sé que no es null"
```

**Forma 3: Guardar con objeto literal**
```ts
await candidatoRepo.save({
  ci: "123",
  nombres: "Juan",
  apellido1: "Pérez",
  apellido2: "Gómez",
  cargo: { id: 1 },
  lugar: { id: 2 },
});
```

---

## 📝 Paso a paso

### Paso 1: Asegurate de tener cargos y lugares

Insertá datos de prueba si no los tenés:

```ts
// Insertar cargos
const cargoRepo = AppDataSource.getRepository(Cargo);
await cargoRepo.save(Object.assign(new Cargo(), { nombre: "Gerente" }));
await cargoRepo.save(Object.assign(new Cargo(), { nombre: "Analista" }));
await cargoRepo.save(Object.assign(new Cargo(), { nombre: "Desarrollador" }));

// Insertar lugares
const lugarRepo = AppDataSource.getRepository(Lugar);
await lugarRepo.save(Object.assign(new Lugar(), { nombre: "Lima" }));
await lugarRepo.save(Object.assign(new Lugar(), { nombre: "Arequipa" }));
await lugarRepo.save(Object.assign(new Lugar(), { nombre: "Cusco" }));
```

### Paso 2: Buscar cargo y lugar deseados

```ts
const cargoGerente = await cargoRepo.findOneBy({ id: 1 });
const lugarLima = await lugarRepo.findOneBy({ id: 1 });
```

### Paso 3: Crear y guardar candidato

```ts
const candidatoRepo = AppDataSource.getRepository(Candidato);

const candidato = new Candidato();
candidato.ci = "1234567890";
candidato.nombres = "Juan Carlos";
candidato.apellido1 = "Pérez";
candidato.apellido2 = "Gómez";
candidato.cargo = cargoGerente!;
candidato.lugar = lugarLima!;

await candidatoRepo.save(candidato);
console.log("✅ Candidato creado:", candidato.ci);
```

### Paso 4: Insertar varios candidatos

Creá al menos 3 con diferentes cargos y lugares.

---

## ✅ Probar

```bash
npm run dev
```

Verificá en la BD:

```sql
SELECT c.ci, c.nombres, c.apellido1, ca.nombre AS cargo, l.nombre AS lugar
FROM candidato c
JOIN cargo ca ON c.cargo_id = ca.id
JOIN lugar l ON c.lugar_id = l.id;
```

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `Cannot set property 'cargo' of undefined` | Olvidaste `new Candidato()` |
| `null value in column "cargo_id"` | `cargo` o `lugar` es `null`/`undefined` |
| `duplicate key` (PK repetida) | El `ci` ya existe. La PK debe ser única. |
| `foreign key constraint fails` | El `cargo.id` o `lugar.id` no existe |
| TypeScript: `Type '{ id: number }' is not assignable to type 'Cargo'` | Usá `as Cargo` o buscá la entidad primero |

---

## 📁 Estructura esperada

```
14-insertar-relaciones/
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
