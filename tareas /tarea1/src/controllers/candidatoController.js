const AppDataSource = require("../database");

const candidatoRepository =
    AppDataSource.getRepository("Candidato");

const cargoRepository =
    AppDataSource.getRepository("Cargo");

const lugarRepository =
    AppDataSource.getRepository("Lugar");


const listar = async (req, res) => {

    try {

        const candidatos = await candidatoRepository.find({
            relations: {
                cargo: true,
                lugar: true
            }
        });

        res.render("candidatos/index", {
            candidatos
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al listar candidatos");
    }
};


const formularioCrear = async (req, res) => {

    const cargos = await cargoRepository.find();
    const lugares = await lugarRepository.find();

    res.render("candidatos/crear", {
        cargos,
        lugares
    });
};


const crear = async (req, res) => {

    try {

        const candidato =
            candidatoRepository.create(req.body);

        await candidatoRepository.save(candidato);

        res.redirect("/candidatos");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al crear candidato");
    }
};


const formularioEditar = async (req, res) => {

    try {

        const candidato =
            await candidatoRepository.findOne({
                where: {
                    ci: req.params.ci
                }
            });

        const cargos = await cargoRepository.find();
        const lugares = await lugarRepository.find();

        res.render("candidatos/editar", {
            candidato,
            cargos,
            lugares
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Error");
    }
};


const actualizar = async (req, res) => {

    try {

        await candidatoRepository.update(
            req.params.ci,
            req.body
        );

        res.redirect("/candidatos");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al actualizar");
    }
};


const eliminar = async (req, res) => {

    try {

        await candidatoRepository.delete(
            req.params.ci
        );

        res.redirect("/candidatos");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error al eliminar");
    }
};


module.exports = {
    listar,
    formularioCrear,
    crear,
    formularioEditar,
    actualizar,
    eliminar
};