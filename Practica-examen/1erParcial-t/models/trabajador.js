const mongoose = require('mongoose');

const trabajadorSchema = new mongoose.Schema({
    nombre: {type:String, required:true},
    apellido: {type:String, required:true},
    cedula: {type:String, required:true},
    cargo: {type:String, required:true},
    departamento: {type:String, required:true},
    fechaIngreso: {type:Date, required:true},
});

module.exports = mongoose.model('Trabajador', trabajadorSchema);