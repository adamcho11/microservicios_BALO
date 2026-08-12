# 15 — TypeORM: leer Candidatos con relaciones (JOINs)

---

## 🎯 ¿Qué vamos a hacer?

Consultar candidatos y que en el resultado aparezcan los datos completos del Cargo y Lugar asociados (no solo los IDs).

---

## 🧠 Teoría

### El problema: relaciones no se cargan por defecto

```ts
const candidatos = await candidatoRepo.find();
console.log(candidatos[0].cargo); // undefined ❌
```

TypeORM **no carga las relaciones automáticamente** por eficiencia. Si querés los datos del cargo y lugar, tenés que pedirlos explícitamente.

### `relations`

```ts
const candidatos = await candidatoRepo.find({
  relations: ["cargo", "lugar"],
});
```

Ahora:

```ts
console.log(candidatos[0].cargo.nombre); // "Gerente" ✅
console.log(candidatos[0].lugar.nombre); // "Lima" ✅
```

### SQL generado

TypeORM genera automáticamente los JOINs:

```sql
SELECT candidato.*, cargo.nombre, lugar.nombre
FROM candidato
LEFT JOIN cargo ON candidato.cargo_id = cargo.id
LEFT JOIN lugar ON candidato.lugar_id = lugar.id
```

### Buscar uno con relaciones

```ts
const candidato = await candidatoRepo.findOne({
  where: { ci: "1234567890" },
  relations: ["cargo", "lugar"],
});
```

**Ojo:** `findOneBy` no acepta `relations`. Tenés que usar `findOne` con `where`.

### Filtrar por relación

```ts
// Candidatos con cargo Gerente (id=1)
const gerentes = await candidatoRepo.find({
  where: { cargo: { id: 1 } },
  relations: ["cargo", "lugar"],
});
```

---

## 📝 Paso a paso

### Paso 1: Leer sin relaciones (para ver la diferencia)

```ts
const sinRel = await candidatoRepo.find();
console.log("Sin relations:", sinRel[0]?.cargo); // undefined
```

### Paso 2: Leer con relaciones

```ts
const conRel = await candidatoRepo.find({
  relations: ["cargo", "lugar"],
});
```

### Paso 3: Mostrar formateado

```ts
conRel.forEach(c => {
  console.log(`CI: ${c.ci}`);
  console.log(`Nombre: ${c.nombres} ${c.apellido1} ${c.apellido2}`);
  console.log(`Cargo: ${c.cargo.nombre}`);
  console.log(`Lugar: ${c.lugar.nombre}`);
  console.log("---");
});
```

### Paso 4: Buscar uno específico

```ts
const uno = await candidatoRepo.findOne({
  where: { ci: "1234567890" },
  relations: ["cargo", "lugar"],
});
```

### Paso 5: Filtrar por cargo

```ts
const gerentes = await candidatoRepo.find({
  where: { cargo: { id: 1 } },
  relations: ["cargo", "lugar"],
});
console.log(`Candidatos con cargo Gerente: ${gerentes.length}`);
```

---

## ✅ Probar

```bash
npm run dev
```

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `Cannot read property 'nombre' of undefined` | Olvidaste `relations: [...]` |
| `findOneBy` no carga relaciones | Usá `findOne({ where: {...}, relations: [...] })` |
| Filtro por cargo no funciona | Sintaxis: `where: { cargo: { id: 1 } }`, no `cargo_id: 1` |

---

## 📁 Estructura esperada

```
15-leer-relaciones/
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
