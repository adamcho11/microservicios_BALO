const express = require('express');
const connectDB = require('./db/database');
const workerRoutes = require('./routes/trabajadorRoutes');

const app = express();

app.use(express.json());
app.use('/api/trabajadores', workerRoutes);
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor en http://localhost:' + PORT);
});

module.exports = app;