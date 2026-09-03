const { Router } = require("express");
const { fallo } = require("./errores");
const repositorio = require("./repositorio");
const router = Router();

const CORREO = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;

function validarUsuario(cuerpo = {}) {
  const d = [];
  const { nombre, correo, edad } = cuerpo;

  if (!nombre || String(nombre).trim().length < 3) {
    d.push({ campo: "nombre", problema: "mínimo 3 caracteres" });
  }

  if (!CORREO.test(String(correo || ""))) {
    d.push({ campo: "correo", problema: "formato inválido" });
  }

  if (!Number.isInteger(edad) || edad <= 0 || edad > 120) {
    d.push({ campo: "edad", problema: "entero entre 1 y 120" });
  }

  return d;
}

router.get("/", async (_req, res) => res.json(await repositorio.listar()));

router.post("/", async (req, res) => {
  const d = validarUsuario(req.body);

  if (d.length) {
    return fallo(
      res,
      400,
      "VALIDACION",
      "La solicitud tiene campos inválidos",
      d,
    );
  }
  const { nombre, correo, edad } = req.body;
  const repetido = await repositorio.porCorreo(correo);
  if (repetido) {
    return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
  }
  try {
    const resultado = await repositorio.crear({ nombre, correo, edad });
    const usuario = { id: resultado.insertedId.toString(), nombre, correo, edad };
    res.status(201).location(`/usuarios/${usuario.id}`).json(usuario);
  } catch (err) {
    if (err.code === 11000) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }
    throw err;
  }
});

router.get("/:id", async (req, res) => {
  const usuario = await repositorio.obtener(req.params.id);
  if (!usuario) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  res.json({ id: usuario._id.toString(), nombre: usuario.nombre, correo: usuario.correo, edad: usuario.edad });
});

router.put("/:id", async (req, res) => {
  const usuario = await repositorio.actualizar(req.params.id, req.body);
  if (!usuario) return fallo(res, 404, "NO_ENCONTRADO", "No encontrado");
  res.json({ id: usuario._id.toString(), nombre: usuario.nombre, correo: usuario.correo, edad: usuario.edad });
});

router.delete("/:id", async (req, res) => {
  const resultado = await repositorio.borrar(req.params.id);
  if (!resultado || resultado.deletedCount === 0) {
    return fallo(res, 404, "NO_ENCONTRADO", "No encontrado");
  }
  res.status(204).end();
});

const TOPE = 100;
router.get("/", async (req, res) => {
const pagina = Math.max(1, Number(req.query.pagina) || 1);
const limite = Math.min(TOPE, Number(req.query.limite) || 20);
const filtro = {};
if (req.query.edadMin) filtro.edad = { $gte: Number(req.query.edadMin) };
const orden = { [req.query.ordenPor || "nombre"]:
req.query.orden === "desc" ? -1 : 1 };
const { datos, total } = await repo.listar(filtro, orden, pagina, limite);
res.json({
datos,
paginacion: { pagina, limite, total,
paginas: Math.ceil(total / limite) },
});
});

module.exports = { router };
