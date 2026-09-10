const { ObjectId } = require("mongodb");
const { colVentas } = require("./db");
const resolvers = {
  Query: {
    ventas: () => colVentas().find({}).toArray(),
    venta: (_p, { id }) => colVentas().findOne({ _id: new ObjectId(id) }),
  },
  Venta: {
    id: (venta) => venta._id.toString(),
  },
  Mutation: {
    crearVenta: async (_p, { input }) => {
      const total = input.detalle.reduce(
        (s, d) => s + d.cantidad * d.precioUnitario,
        0,
      );
      const doc = { fecha: input.fecha, total, detalle: input.detalle };
      const filtro = input.id
        ? { _id: new ObjectId(input.id) }
        : { _id: new ObjectId() };
      const r = await colVentas().findOneAndUpdate(
        filtro,
        { $set: doc },
        { upsert: true, returnDocument: "after" },
      );

      return r;
    },
    cambiarCantidad: async (_p, { detalleId, cantidad }) => {
      if (cantidad <= 0) {
        throw new Error("La cantidad debe ser mayor que cero");
      }
      await q("UPDATE detalle_venta SET cantidad = ? WHERE id = ?", [
        cantidad,
        detalleId,
      ]);
      const filas = await q(
        "SELECT id, producto, cantidad, precio_unitario AS " +
          "precioUnitario FROM detalle_venta WHERE id = ?",
        [detalleId],
      );
      if (!filas[0]) throw new Error("No existe el ítem " + detalleId);
      return filas[0];
    },
  },
};
module.exports = resolvers;
