# 19 — Vistas con EJS: configurar y mostrar datos

---

## 🎯 ¿Qué vamos a hacer?

Instalar y configurar **EJS** como motor de plantillas en Express para generar páginas HTML dinámicamente desde el servidor.

---

## 🧠 Teoría

### ¿Qué es un motor de plantillas?

Genera HTML en el servidor mezclando una **plantilla** (HTML con placeholders) con **datos** (de la BD).

```
PLANTILLA EJS                    +  DATOS               =  HTML FINAL
─────────────────────────────       ──────────              ──────────────
<h1><%= titulo %></h1>            { titulo: "Cargos" }     <h1>Cargos</h1>
<ul>                               { cargos: [...] }       <ul>
<% cargos.forEach(c => { %>                                   <li>Gerente</li>
  <li><%= c.nombre %></li>                                    <li>Analista</li>
<% }) %>                                                   </ul>
</ul>
```

### ¿Por qué EJS?

- Es el más simple de configurar (viene integrado con Express).
- Sintaxis cercana a HTML puro.
- Usa JavaScript para la lógica (`if`, `forEach`, etc.).

### Etiquetas EJS

| Etiqueta | ¿Qué hace? |
|---|---|
| `<%= variable %>` | Imprime el valor (escapa HTML) |
| `<%- variable %>` | Imprime el valor (sin escapar) |
| `<% código %>` | Ejecuta código JS (no imprime nada) |
| `<%# comentario %>` | Comentario (no visible en el HTML final) |

### Configuración en Express

```js
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
```

- `view engine`: qué motor usar (`"ejs"`).
- `views`: carpeta donde están las plantillas `.ejs`.

### `res.render()`

```js
app.get("/cargos", async (req, res) => {
  const repo = AppDataSource.getRepository(Cargo);
  const cargos = await repo.find();
  res.render("cargos", { cargos: cargos, titulo: "Lista de Cargos" });
});
```

Express busca `views/cargos.ejs`, lo procesa con los datos, y envía el HTML resultante.

---

## 📝 Paso a paso

### Paso 0: Instalar

```bash
npm install express ejs
npm install --save-dev @types/express
```

EJS **no necesita** `@types/ejs` porque se configura directamente en Express.

### Paso 1: Configurar Express en `index.ts`

```ts
const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
```

### Paso 2: Crear carpeta `src/views/`

```bash
mkdir src/views
```

### Paso 3: Crear `src/views/cargos.ejs`

Una plantilla EJS es básicamente HTML con etiquetas `<% %>`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title><%= titulo %></title>
  <style>
    table { border-collapse: collapse; width: 60%; margin: 20px auto; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    th { background: #f0f0f0; }
  </style>
</head>
<body>
  <h1><%= titulo %></h1>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
      </tr>
    </thead>
    <tbody>
      <% if (cargos.length === 0) { %>
        <tr><td colspan="2">No hay cargos registrados.</td></tr>
      <% } else { %>
        <% cargos.forEach(cargo => { %>
          <tr>
            <td><%= cargo.id %></td>
            <td><%= cargo.nombre %></td>
          </tr>
        <% }) %>
      <% } %>
    </tbody>
  </table>
</body>
</html>
```

### Paso 4: Ruta para renderizar la vista

```ts
app.get("/cargos", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Cargo);
    const cargos = await repo.find();
    res.render("cargos", { cargos, titulo: "Lista de Cargos" });
  } catch (error) {
    res.status(500).send("Error al cargar los datos");
  }
});
```

---

## ✅ Probar

```bash
npm run dev
```

Abrí en el navegador: `http://localhost:3000/cargos`

Deberías ver una tabla HTML con los cargos de la base de datos.

---

## 🧪 Experimentá

### Ejercicio 1: Vista para Lugares

Creá `views/lugares.ejs` y la ruta `GET /lugares`. Misma estructura, distinta entidad.

### Ejercicio 2: Agregar estilos CSS

Mejorá el diseño con más CSS dentro del `<style>`.

---

## 📁 Estructura esperada

```
19-vistas-ejs/
├── README.md
├── package.json
├── tsconfig.json
├── node_modules/
└── src/
    ├── data-source.ts
    ├── index.ts
    ├── entities/
    │   ├── Cargo.ts
    │   ├── Lugar.ts
    │   └── Candidato.ts
    └── views/
        └── cargos.ejs
```
