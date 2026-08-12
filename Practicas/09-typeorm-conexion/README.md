# 09 — TypeORM: conectar a la base de datos

---

## 🎯 ¿Qué vamos a hacer?

Crear la configuración de conexión (`data-source.ts`) y un `index.ts` que verifique que TypeORM puede conectarse a la base de datos.

---

## 🧠 Teoría

### `DataSource`

Es el objeto central de TypeORM. Representa una conexión a **una** base de datos.

```ts
const AppDataSource = new DataSource({
  type: "mysql",         // tipo de BD
  host: "localhost",     // dirección
  port: 3306,            // puerto
  username: "root",      // usuario
  password: "",          // contraseña
  database: "candidatos_db",  // nombre de la BD
  entities: [],          // tus entidades (por ahora vacío)
  synchronize: true,     // crear tablas automáticamente
  logging: true,         // mostrar SQL en consola
});
```

### ⚠️ Crear la base de datos manualmente

TypeORM crea tablas automáticamente (`synchronize: true`), pero **NO crea la base de datos**. Tenés que crearla vos:

**MySQL (phpMyAdmin, terminal, Workbench):**
```sql
CREATE DATABASE candidatos_db;
```

**PostgreSQL (pgAdmin, psql, terminal):**
```sql
CREATE DATABASE candidatos_db;
```

### `AppDataSource.initialize()`

Inicia la conexión. Devuelve una **Promise**:

```ts
AppDataSource.initialize()
  .then(() => console.log("Conectado!"))
  .catch(err => console.error("Error:", err));
```

O con async/await:

```ts
async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado!");
  } catch (error) {
    console.error("Error:", error);
  }
}
main();
```

### Configuraciones típicas

**XAMPP (MariaDB/MySQL, macOS):**
```ts
type: "mysql",
port: 3306,
username: "root",
password: "",
```

**Postgres.app (macOS):**
```ts
type: "postgres",
port: 5432,
username: "tu_usuario_mac",
password: "",
```

**MySQL con Docker:**
```ts
type: "mysql",
port: 3307,  // según mapeo
username: "root",
password: "password123",
```

---

## 📝 Paso a paso

### Paso 1: Crear `src/data-source.ts`

```ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",                 // o "postgres"
  host: "localhost",
  port: 3306,                    // 5432 para PostgreSQL
  username: "root",              // ajustá según tu BD
  password: "",                  // ajustá según tu BD
  database: "candidatos_db",
  entities: [],                  // vacío por ahora
  synchronize: true,
  logging: true,
});
```

### Paso 2: Crear `src/index.ts`

```ts
import "reflect-metadata";
import { AppDataSource } from "./data-source";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión a la base de datos exitosa");
    console.log(`📦 Base de datos: ${AppDataSource.options.database}`);

    await AppDataSource.destroy();
    console.log("🔌 Conexión cerrada");
  } catch (error) {
    console.error("❌ Error al conectar:", error);
  }
}

main();
```

### Paso 3: Crear la base de datos

Antes de ejecutar, asegurate de que la BD `candidatos_db` exista:

**MySQL:**
```sql
CREATE DATABASE candidatos_db;
```

**PostgreSQL:**
```sql
CREATE DATABASE candidatos_db;
```

---

## ✅ Probar

```bash
npm run dev
```

**Éxito:**
```
✅ Conexión a la base de datos exitosa
📦 Base de datos: candidatos_db
🔌 Conexión cerrada
```

**Error típico (BD no existe):**
```
❌ Error al conectar: Error: ER_BAD_DB_ERROR: Unknown database 'candidatos_db'
```
Solución: `CREATE DATABASE candidatos_db;`

**Error típico (servidor no corre):**
```
❌ Error al conectar: Error: connect ECONNREFUSED 127.0.0.1:3306
```
Solución: iniciá XAMPP/Postgres.app.

**Error típico (credenciales incorrectas):**
```
❌ Error al conectar: Error: Access denied for user 'root'@'localhost'
```
Solución: verificá usuario y contraseña en `data-source.ts`.

---

## 🐛 Errores comunes

| Error | Solución |
|---|---|
| `ER_BAD_DB_ERROR` | Creá la BD con `CREATE DATABASE candidatos_db;` |
| `ECONNREFUSED` | Iniciá el servidor de base de datos |
| `Access denied` | Usuario/contraseña incorrectos |
| `Client does not support authentication protocol` | (MySQL 8+) Ejecutá: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;` |

---

## 📁 Estructura esperada

```
09-typeorm-conexion/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    └── index.ts
```
