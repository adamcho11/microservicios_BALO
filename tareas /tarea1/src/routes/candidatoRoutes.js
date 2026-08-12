const express = require("express");

const controller =
    require("../controllers/candidatoController");

const router = express.Router();

router.get("/", controller.listar);

router.get("/crear", controller.formularioCrear);

router.post("/", controller.crear);

router.get(
    "/editar/:ci",
    controller.formularioEditar
);

router.put(
    "/:ci",
    controller.actualizar
);

router.delete(
    "/:ci",
    controller.eliminar
);

module.exports = router;