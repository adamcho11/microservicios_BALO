const worker = require('../models/trabajador');

const obtenerTrabajadores = async (req, res) => {
    try{
        const trabajadores = await worker.find();
        res.json(trabajadores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const crearTrabajador = async(req, res) =>{
    const {nombre, apellido, edad, puesto} = req.body;
    try{
        const nuevoTrabajador = new worker(req.body);
        const resultado = await nuevoTrabajador.save(
            nombre,
            apellido, 
            edad,
            puesto
        );
        res.status(201).json(nuevoTrabajador);
        res.json(resultado);

    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const actualizarTrabajador = async (req, res) => {
    const {id} = req.body;
    const worker = await worker.findById(id);
    if(!worker){
        return res.status(404).json({ message: 'Trabajador no encontrado' });
    }
    try{
        const trabajadorActualizado = await worker.findByIdAndUpdate(id, req.body);
        res.json(trabajadorActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const eliminarTrabajador = async (req, res) =>{
    const {id} = req.body;
    const worker = await worker.findByIdAndDelete(id, req.body);
}

module.exports = {
    obtenerTrabajadores,
    crearTrabajador,
    actualizarTrabajador,
    eliminarTrabajador,
};