function fallo(res, estado, codigo, mensaje, detalles) {
return res.status(estado).json({
error: { codigo, mensaje, detalles: detalles || [] },
});
}
// uso dentro del POST:
// const d = validarUsuario(req.body);
// if (d.length) return fallo(res, 400, "VALIDACION",
// "La solicitud tiene campos inválidos", d);
module.exports = { fallo };