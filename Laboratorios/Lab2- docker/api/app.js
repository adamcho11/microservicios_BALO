const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
res.json({
mensaje: 'API de Tareas funcionando dentro de un contenedor',
host: os.hostname(),
version: process.env.APP_VERSION || '1.0.0'
});
});
app.get('/salud', (req, res) => res.json({ estado: 'ok' }));
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));