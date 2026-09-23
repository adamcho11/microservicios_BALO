const express = require('express');
const {worker} = require('../models/trabajador');
const {obtenerTrabajadores, crearTrabajador, actualizarTrabajador, eliminarTrabajador,} = require('../controller/trabajadoresControllers.js');

const router = express.Router();



router.get('/', obtenerTrabajadores);
router.post('/', crearTrabajador);
router.put('/', actualizarTrabajador);
router.delete('/', eliminarTrabajador);

module.exports = router;