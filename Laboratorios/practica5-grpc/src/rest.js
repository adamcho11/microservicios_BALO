const express = require("express");
const grpc = require("@grpc/grpc-js");
const { obtenerEstudiante } = require("./estudiantes.cliente");

const app = express();
const PUERTO = process.env.HTTP_PORT || 3000;

app.get("/usuarios/:id/expediente", async (req, res) => {
  try {
    const estudiante = await obtenerEstudiante(req.params.id);
    res.json(estudiante);
  } catch (err) {
    if (err.code === grpc.status.NOT_FOUND) return res.status(404).json({ error: err.details });
    if (err.code === grpc.status.UNAVAILABLE) return res.status(503).json({ error: err.details });
    res.status(500).json({ error: "Error interno" });
  }
});

app.listen(PUERTO, () => {
  console.log(`Servicio REST escuchando en el puerto ${PUERTO}`);
});
