# 04 — Leer y escribir archivos (módulo fs)

---

## 🎯 ¿Qué vamos a hacer?

Aprender a usar el módulo `fs` (File System) de Node.js para leer y escribir archivos en disco. Esto es la base para simular una base de datos con archivos JSON.

---

## 🧠 Teoría

### El módulo `fs`

Node.js incluye `fs` para manipular archivos. **No necesita instalación.**

```js
const fs = require("fs");
```

### Métodos que vamos a usar

| Método | ¿Qué hace? | ¿Síncrono? |
|---|---|---|
| `fs.existsSync(ruta)` | Verifica si un archivo/carpeta existe | Sí |
| `fs.readFileSync(ruta, "utf8")` | Lee todo el archivo y devuelve string | Sí |
| `fs.writeFileSync(ruta, datos)` | Escribe datos en un archivo | Sí |

Usamos las versiones **síncronas** (con `Sync` al final) por simplicidad. Las versiones sin `Sync` (`fs.readFile`, `fs.writeFile`) son asíncronas y usan callbacks, como viste en `30-07`.

### Síncrono vs Asíncrono

```js
// Síncrono: bloquea hasta que termina
const datos = fs.readFileSync("archivo.txt", "utf8");
console.log(datos);
console.log("Esto se ejecuta DESPUÉS de leer");

// Asíncrono: no bloquea
fs.readFile("archivo.txt", "utf8", (err, datos) => {
  console.log(datos);
});
console.log("Esto se ejecuta ANTES de leer (porque es asíncrono)");
```

### `JSON.parse()` y `JSON.stringify()`

Son métodos globales de JavaScript (no de Node). No necesitás `require`.

```
OBJETO JS  ──JSON.stringify()──>  TEXTO JSON
{ a: 1 }                         '{"a":1}'

TEXTO JSON  ──JSON.parse()──>  OBJETO JS
'{"a":1}'                        { a: 1 }
```

- `JSON.stringify(obj, null, 2)`: el `null, 2` agrega indentación de 2 espacios para que el archivo sea legible.
- `JSON.parse(texto)`: lanza error si el texto no es JSON válido.

### `__dirname`

Variable global de Node. Contiene la ruta absoluta de la carpeta donde está tu script.

```js
console.log(__dirname);
// /Users/adam/.../Practicas/04-modulo-fs
```

**Siempre usá `__dirname`** para construir rutas de archivos. No uses `"./archivo.txt"` porque depende de dónde ejecutaste `node`.

---

## 📝 Paso a paso

### Paso 1: Creá `base-datos.js`

En esta carpeta.

### Paso 2: Importá `fs` y definí la ruta

```js
const fs = require("fs");
const rutaArchivo = __dirname + "/base-datos.json";
```

### Paso 3: Función `leerDB()`

Esta función debe:
1. Verificar si el archivo existe (`fs.existsSync`).
2. Si **no existe**: crear un objeto inicial `{ cargos: [], lugares: [], candidatos: [] }`, guardarlo con `writeFileSync` y devolverlo.
3. Si **sí existe**: leerlo con `readFileSync`, parsearlo con `JSON.parse` y devolverlo.

```js
function leerDB() {
  if (!fs.existsSync(rutaArchivo)) {
    const datosIniciales = { cargos: [], lugares: [], candidatos: [] };
    fs.writeFileSync(rutaArchivo, JSON.stringify(datosIniciales, null, 2));
    return datosIniciales;
  }
  const contenido = fs.readFileSync(rutaArchivo, "utf8");
  return JSON.parse(contenido);
}
```

### Paso 4: Función `escribirDB(datos)`

Recibe un objeto, lo convierte a JSON indentado y lo escribe.

```js
function escribirDB(datos) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2));
}
```

### Paso 5: Probar

```js
// Leer (primera vez: crea el archivo con arrays vacíos)
const db = leerDB();
console.log("Cargos antes:", db.cargos);

// Agregar datos
db.cargos.push({ id: 1, nombre: "Gerente" });
db.cargos.push({ id: 2, nombre: "Analista" });
db.lugares.push({ id: 1, nombre: "Lima" });

// Guardar
escribirDB(db);
console.log("Datos guardados.");

// Volver a leer para verificar
const db2 = leerDB();
console.log("Cargos después:", db2.cargos);
console.log("Lugares:", db2.lugares);
```

---

## ✅ Probar

```bash
node base-datos.js
```

**Primera ejecución:**

```
Cargos antes: []
Datos guardados.
Cargos después: [ { id: 1, nombre: 'Gerente' }, { id: 2, nombre: 'Analista' } ]
Lugares: [ { id: 1, nombre: 'Lima' } ]
```

**Segunda ejecución:**

```
Cargos antes: [ { id: 1, nombre: 'Gerente' }, { id: 2, nombre: 'Analista' } ]
Datos guardados.
Cargos después: [ { id: 1, nombre: 'Gerente' }, { id: 2, nombre: 'Analista' }, { id: 1, nombre: 'Gerente' }, { id: 2, nombre: 'Analista' } ]
```

Fijate que la segunda vez **se duplican** los datos. Esto pasa porque nuestro código de prueba agrega datos cada vez que se ejecuta. En ejercicios futuros lo corregiremos.

Abrí `base-datos.json`. Deberías ver el JSON con indentación:

```json
{
  "cargos": [
    { "id": 1, "nombre": "Gerente" },
    { "id": 2, "nombre": "Analista" }
  ],
  "lugares": [
    { "id": 1, "nombre": "Lima" }
  ],
  "candidatos": []
}
```

---

## 🧪 Experimentá

### Ejercicio 1: Leer y mostrar solo los lugares

```js
const db = leerDB();
db.lugares.forEach(lugar => {
  console.log(`ID: ${lugar.id}, Nombre: ${lugar.nombre}`);
});
```

### Ejercicio 2: Borrar el archivo y volver a ejecutar

Borrá `base-datos.json` y ejecutá de nuevo. Se debe recrear automáticamente.

### Ejercicio 3: Agregar candidatos

Agregá un candidato al array `db.candidatos` con esta estructura:

```js
db.candidatos.push({
  ci: "1234567890",
  nombres: "Juan",
  apellido1: "Pérez",
  apellido2: "Gómez"
});
```

---

## 🐛 Errores comunes

| Error | Causa |
|---|---|
| `no such file or directory` | Usaste ruta relativa en vez de `__dirname` |
| `Unexpected token in JSON` | El archivo se corrompió. Borralo y ejecutá de nuevo. |
| `readFileSync` devuelve símbolos raros | Olvidaste el segundo argumento `"utf8"` |
| El JSON aparece todo pegado en una línea | Usá `JSON.stringify(datos, null, 2)` con los 3 argumentos |
| `fs is not defined` | Olvidaste `const fs = require("fs")` |

---

## 📌 Resumen

| Concepto | Código |
|---|---|
| Importar fs | `const fs = require("fs")` |
| ¿Existe archivo? | `fs.existsSync(ruta)` |
| Leer archivo | `fs.readFileSync(ruta, "utf8")` |
| Escribir archivo | `fs.writeFileSync(ruta, texto)` |
| Ruta segura | `__dirname + "/archivo.json"` |
| Objeto a JSON | `JSON.stringify(objeto, null, 2)` |
| JSON a objeto | `JSON.parse(texto)` |

---

## 📁 Estructura esperada

```
04-modulo-fs/
├── README.md
├── base-datos.js
└── base-datos.json   ← se genera al ejecutar
```
