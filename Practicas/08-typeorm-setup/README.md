# 08 — TypeORM: instalación y configuración del proyecto

---

## 🎯 ¿Qué vamos a hacer?

Crear un proyecto Node.js con TypeScript e instalar todas las dependencias necesarias para usar TypeORM con MySQL o PostgreSQL.

---

## 🧠 Teoría

### ¿Qué es un ORM?

**O**bject-**R**elational **M**apping. Traduce entre objetos JavaScript y tablas SQL.

```
SIN ORM (escribís SQL a mano)           CON ORM (escribís JavaScript)
─────────────────────────────           ─────────────────────────────
const query = "INSERT INTO cargo        const cargo = new Cargo();
(nombre) VALUES ('Gerente')";           cargo.nombre = "Gerente";
await connection.execute(query);        await repository.save(cargo);
```

El ORM genera el SQL por vos. Ventajas:
- No escribís SQL a mano.
- Menos errores de sintaxis.
- Funciona con MySQL, PostgreSQL, SQLite, etc. sin cambiar código.
- Protege contra inyección SQL.

### ¿Qué es TypeORM?

Es el ORM más popular para TypeScript/JavaScript. Usa **decoradores** (`@Entity`, `@Column`) para definir tablas.

### Dependencias necesarias

| Paquete | ¿Para qué? |
|---|---|
| `typeorm` | El ORM en sí |
| `reflect-metadata` | Necesario para los decoradores |
| `mysql2` o `pg` | Driver de base de datos |
| `typescript` | Lenguaje (TypeORM funciona mejor con TS) |
| `ts-node` | Ejecuta TypeScript sin compilar |
| `@types/node` | Tipos de Node.js para TS |

### ¿Qué base de datos usar?

| BD | Driver | Puerto |
|---|---|---|
| MySQL / MariaDB | `mysql2` | 3306 |
| PostgreSQL | `pg` | 5432 |

Si no tenés ninguna, instalá **XAMPP** (incluye MariaDB/MySQL, fácil de usar).

---

## 📝 Paso a paso

### Paso 1: Inicializar el proyecto

```bash
npm init -y
```

### Paso 2: Instalar TypeORM y driver de BD

**MySQL / MariaDB:**
```bash
npm install typeorm reflect-metadata mysql2
```

**PostgreSQL:**
```bash
npm install typeorm reflect-metadata pg
```

### Paso 3: Instalar TypeScript y herramientas

```bash
npm install --save-dev typescript ts-node @types/node
```

`--save-dev` = dependencia de desarrollo (no se incluye en producción).

### Paso 4: Crear `tsconfig.json`

En la raíz del proyecto:

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

Opciones **obligatorias** para TypeORM:
- `experimentalDecorators: true`
- `emitDecoratorMetadata: true`

### Paso 5: Configurar script en package.json

En `package.json`, dentro de `"scripts"`:

```json
"scripts": {
  "dev": "ts-node src/index.ts",
  "start": "ts-node src/index.ts"
}
```

### Paso 6: Crear carpeta `src/`

Todo el código TypeScript va acá:

```bash
mkdir src
```

---

## ✅ Verificar

Estructura esperada:

```
08-typeorm-setup/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── node_modules/
└── src/
```

```bash
npx tsc --version     # TypeScript instalado
npx typeorm --version # TypeORM instalado
```

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `npx: command not found` | npm no está instalado. Instalá Node.js (incluye npm). |
| `Cannot find module 'typeorm'` | No instalaste las dependencias o estás en la carpeta equivocada. |
| `tsc: command not found` | TypeScript no está instalado globalmente. Usá `npx tsc`. |

---

## 📌 ¿Qué sigue?

En el ejercicio 09 vas a configurar la conexión a la base de datos (`data-source.ts`) y verificar que todo funcione.

---

## 📁 Estructura esperada

```
08-typeorm-setup/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── node_modules/
└── src/
```
