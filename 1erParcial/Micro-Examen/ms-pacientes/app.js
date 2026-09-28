
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/api/v1/pacientes', async (req, res) => {
  const query = 'SELECT * FROM pacientes';
  db.query(query, (err, results) => {
    res.status(200).json(results);
  });
});

app.get('/api/v1/pacientes/:id', async (req, res) => {
    const [results] = await db.promise().query('SELECT * FROM pacientes WHERE id = ?', [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ codigo: 'NO_ENCONTRADO', mensaje: 'Paciente no existe' });
    }
    res.status(200).json(results[0]);
});

app.post('/api/v1/pacientes', async (req, res) => {
  const { ci, nombre, apellido, fecha_nacimiento, telefono, seguro } = req.body;

  if (!ci || !nombre || !apellido || !fecha_nacimiento || !telefono || !seguro) {
    return res.status(422).json({ codigo: 'DATOS_INVALIDOS', mensaje: 'Faltan campos obligatorios' });
  }
    const [result] = await db.promise().query(
      'INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES (?, ?, ?, ?, ?, ?)',
      [ci, nombre, apellido, fecha_nacimiento, telefono, seguro]
    );
    res.status(201).json({
      id: result.insertId,
      ci,
      nombre,
      apellido,
      fecha_nacimiento,
      telefono,
      seguro
    });
});

//app.update('/api/v1')

app.delete('/api/v1/pacientes/:id', async (req, res) => {
    const [result] = await db.promise().query('DELETE FROM pacientes WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ codigo: 'NO_ENCONTRADO', mensaje: 'Paciente no existe' });
    }
    res.status(200).json({codigo: 'Borrado', mensaje: 'Paciente borrado'});
  });


app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});