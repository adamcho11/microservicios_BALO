# 12 — TypeORM: entidad Lugar

---

## 🎯 ¿Qué vamos a hacer?

Crear la entidad `Lugar` siguiendo exactamente el mismo patrón que `Cargo`. Es un ejercicio de repetición para que el proceso se vuelva automático.

---

## 🧠 Teoría

### Patrón para crear cualquier entidad

```
1. Crear archivo en src/entities/
2. Importar decoradores de typeorm
3. Decorar la clase con @Entity("nombre_tabla")
4. Definir id con @PrimaryGeneratedColumn()
5. Definir propiedades con @Column({...})
6. Exportar la clase
7. Registrar en entities[] de data-source.ts
```

### Especificación de la tabla Lugar

| Columna | Tipo | Restricciones |
|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT |
| `nombre` | VARCHAR(60) | NOT NULL |

Es **exactamente igual** a Cargo. Solo cambia el nombre de la clase y la tabla.

---

## 📝 Paso a paso

### Paso 1: Crear `src/entities/Lugar.ts`

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

### Paso 2: Registrar en `data-source.ts`

```ts
import { Lugar } from "./entities/Lugar";

entities: [Cargo, Lugar],
```

### Paso 3: Probar insertando y leyendo

En `index.ts`:

```ts
const lugarRepo = AppDataSource.getRepository(Lugar);

const l1 = new Lugar();
l1.nombre = "Lima";
await lugarRepo.save(l1);

const l2 = new Lugar();
l2.nombre = "Arequipa";
await lugarRepo.save(l2);

const lugares = await lugarRepo.find();
lugares.forEach(l => console.log(`  ID: ${l.id}, Nombre: ${l.nombre}`));
```

---

## ✅ Probar

```bash
npm run dev
```

Verificá en la BD que la tabla `lugar` se haya creado:

```sql
SELECT * FROM lugar;
```

---

## 🤔 Para pensar

El código de `Lugar.ts` y `Cargo.ts` es casi idéntico. Más adelante podrías crear una "clase base" con `id` y `nombre` para no repetir código. Pero por ahora está bien que sean archivos separados.

---

## 📁 Estructura esperada

```
12-entidad-lugar/
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
