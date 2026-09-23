const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    cedula_de_identidad: {type: String, required: true},
    cargo:{type: String, required: false},
    departamento: {type: String, required: false},
    fecha_de_ingreso: {type: Date, required: false},
})
module.exports = mongoose.model('Worker', workerSchema)