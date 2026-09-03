const express = require("express");
const app = express();
const { router } = require("./usuarios.rutas");
app.use(express.json());
app.use("/v1/usuarios", router);
app.get("/salud", (_req, res) => res.json({ estado: "arriba" }));
module.exports = app;

const swaggerUi = require("swagger-ui-express");
const doc = require("yamljs").load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));


app.use((_req, res) => {
res.status(404).json({
error: { codigo: "RUTA_NO_ENCONTRADA", mensaje: "Ruta inexistente" },
});
});
app.use((err, _req, res, _next) => {
const malJson = err.type === "entity.parse.failed";
console.error(err);
res.status(malJson ? 400 : 500).json({
error: {
codigo: malJson ? "JSON_INVALIDO" : "ERROR_INTERNO",
mensaje: malJson ? "El cuerpo no es JSON válido" : "Error interno",
},
});
});