# 01 — Hola Mundo con Node.js

---

## 🎯 ¿Qué vamos a hacer?

Ejecutar una línea de JavaScript fuera del navegador usando Node.js. Vas a ver tu primer mensaje en la terminal.

---

## 🧠 ¿Qué es Node.js?

Node.js es un programa que ejecuta JavaScript **fuera del navegador**.

```
SIN Node.js                          CON Node.js
─────────────                        ────────────
JavaScript solo corre                 JavaScript corre en:
dentro de Chrome/Firefox              - La terminal
                                      - Un servidor
                                      - Tu computadora directamente
```

Node.js lo creó Ryan Dahl en 2009. Agarró el motor V8 de Google Chrome (el que ejecuta JS dentro del navegador) y lo sacó del navegador para que corra en cualquier lado.

### ¿Para qué sirve Node.js?

- Crear **servidores web** (como Express, que vas a usar más adelante).
- Crear **APIs** (aplicaciones que responden con JSON).
- Leer y escribir **archivos** del sistema.
- Conectarse a **bases de datos** (MySQL, PostgreSQL, MongoDB).
- Herramientas de línea de comandos (CLI).
- Automatizar tareas.

### ¿Qué NO es Node.js?

- No es un lenguaje de programación (el lenguaje es JavaScript).
- No es un framework (es un **entorno de ejecución** o _runtime_).
- No es un navegador (no tiene `document`, `window`, `alert`).

---

## 🔧 Verificar que tenés Node.js instalado

Abrí una terminal y escribí:

```bash
node --version
```

Deberías ver algo como:

```
v20.11.0
```

Si ves un número de versión, está instalado. Si ves un error como `command not found`, instalalo desde https://nodejs.org (descargá la versión LTS).

También verificá npm:

```bash
npm --version
```

```
10.2.4
```

npm es el gestor de paquetes de Node. Viene incluido. Lo vas a usar a partir del ejercicio 05.

---

## 📝 Manos a la obra

### Paso 1: Creá un archivo

En esta carpeta `01-hola-mundo/`, creá un archivo que se llame `hola.js`.

Podés crearlo con el explorador de archivos, con VS Code, o desde la terminal:

```bash
touch hola.js
```

**IMPORTANTE:** La extensión es `.js` (JavaScript). Sin la extensión, Node no sabe qué ejecutar.

### Paso 2: Escribí tu primera línea de código

Abrí `hola.js` y escribí:

```js
console.log("Hola Mundo");
```

Eso es todo. Una sola línea.

### Paso 3: Ejecutalo con Node

En la terminal, dentro de esta carpeta:

```bash
node hola.js
```

Deberías ver:

```
Hola Mundo
```

Eso significa que Node.js leyó tu archivo, ejecutó el código JavaScript, imprimió el mensaje y terminó.

---

## 🔍 ¿Qué pasó acá?

Vamos línea por línea:

```js
console.log("Hola Mundo");
```

| Parte | Significado |
|---|---|
| `console` | Un objeto global de Node.js. Representa la consola/terminal. |
| `.log()` | Un método que imprime texto en la consola. |
| `"Hola Mundo"` | El texto que le pasamos para que imprima. Es un **string** (cadena de texto). |
| `;` | Punto y coma. En JS es opcional en la mayoría de casos, pero es buena práctica. |

Cuando ejecutás `node hola.js`, Node:
1. Lee el archivo `hola.js`.
2. Busca `console.log`.
3. Ejecuta la función `log` con el texto `"Hola Mundo"`.
4. Imprime `Hola Mundo` en la terminal.
5. Termina.

---

## 🧪 Experimentá

Probá estas variantes. Modificá `hola.js`, guardá, y ejecutá `node hola.js` de nuevo.

### Ejercicio 1: Cambiar el mensaje

```js
console.log("Hola, mi nombre es [TU NOMBRE]");
```

### Ejercicio 2: Imprimir varias líneas

```js
console.log("Línea 1");
console.log("Línea 2");
console.log("Línea 3");
```

Salida:

```
Línea 1
Línea 2
Línea 3
```

Cada `console.log` imprime en una línea nueva.

### Ejercicio 3: Imprimir números

```js
console.log(42);
console.log(3.14);
console.log(-10);
```

Fijate que los números van **sin comillas**. Si ponés comillas, es texto (string). Sin comillas, es número.

### Ejercicio 4: Imprimir operaciones matemáticas

```js
console.log(5 + 3);
console.log(10 - 2);
console.log(4 * 3);
console.log(20 / 5);
```

Salida:

```
8
8
12
4
```

Node.js **evalúa** la operación y después imprime el resultado.

### Ejercicio 5: Mezclar texto y variables

```js
const nombre = "Ana";
const edad = 25;
console.log("Nombre:", nombre);
console.log("Edad:", edad);
```

El `console.log` acepta varios argumentos separados por coma. Los imprime con un espacio entre ellos.

### Ejercicio 6: Template strings (backticks)

```js
const nombre = "Carlos";
const edad = 30;
console.log(`Hola, me llamo ${nombre} y tengo ${edad} años`);
```

Las comillas **backtick** (`` ` ``) permiten insertar variables dentro del texto con `${}`. La tecla backtick está a la izquierda del 1 en el teclado.

### Ejercicio 7: Tipos de datos

Creá un archivo `tipos.js` con esto:

```js
console.log(typeof "Hola");       // string
console.log(typeof 42);           // number
console.log(typeof true);         // boolean
console.log(typeof [1, 2, 3]);    // object (array)
console.log(typeof { a: 1 });     // object
console.log(typeof null);         // object (es un bug histórico de JS)
console.log(typeof undefined);    // undefined
```

`typeof` te dice el tipo de dato de una variable o valor.

---

## 📂 ¿Dónde ejecuto `node`?

Siempre ejecutá `node` desde la carpeta donde está tu archivo `.js`, o usá la ruta completa.

**Correcto (desde la misma carpeta):**
```bash
cd 01-hola-mundo
node hola.js
```

**Correcto (desde cualquier carpeta, con ruta relativa):**
```bash
node 01-hola-mundo/hola.js
```

**Correcto (con ruta absoluta):**
```bash
node /Users/adam/.../Practicas/01-hola-mundo/hola.js
```

**Incorrecto:**
```bash
node hola.js   # si no estás en la carpeta donde está el archivo
```

---

## 🐛 Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `command not found: node` | Node.js no está instalado | Instalalo desde nodejs.org |
| `node: command not found` | Igual, no instalado | Instalar Node.js |
| `SyntaxError: Unexpected string` | Olvidaste cerrar comillas: `console.log("Hola)` | Cerrá las comillas |
| `ReferenceError: console is not defined` | Escribiste mal `console` (ej: `consola`, `Console`) | Escribí `console` exactamente |
| `console is not defined` | Escribiste `Console.log` con mayúscula | JavaScript distingue mayúsculas/minúsculas |

### Tip: ¿cómo leer un error?

```
/Users/adam/01-hola-mundo/hola.js:3
console.log("hola);
             ^^^^^
SyntaxError: Invalid or unexpected token
```

La flechita `^` señala **dónde** está el error. `hola.js:3` significa **línea 3**. `SyntaxError` significa que JS no entiende lo que escribiste (error de sintaxis).

---

## ✅ Verificación final

Al terminar, tu carpeta debería tener:

```
01-hola-mundo/
├── README.md    ← este archivo
└── hola.js      ← archivo que creaste vos
```

Ejecutá `node hola.js` y asegurate de que:
- No hay errores en rojo.
- Se imprime el mensaje que esperás.
- Si cambiás el texto y ejecutás de nuevo, el mensaje cambia.

---

## 📌 Resumen de lo aprendido

- Node.js ejecuta JavaScript fuera del navegador.
- `node --version` verifica que esté instalado.
- `console.log()` imprime en la terminal.
- `node archivo.js` ejecuta un archivo.
- Los strings van entre comillas (`""` o `''` o backticks).
- Los números van sin comillas.
- `typeof` dice el tipo de un valor.
- JavaScript distingue mayúsculas de minúsculas.
