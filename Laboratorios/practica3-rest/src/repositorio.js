const { MongoClient, ObjectId } = require("mongodb");
let col;
async function conectar() {
const cliente = await new MongoClient(process.env.MONGO_URL).connect();
col = cliente.db(process.env.MONGO_DB).collection("usuarios");
await col.createIndex({ correo: 1 }, { unique: true });
return cliente;
}
const aId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);
module.exports = {
conectar,
listar: () => col.find({}).toArray(),
crear: (u) => col.insertOne(u),
obtener: (id) => (aId(id) ? col.findOne({ _id: aId(id) }) : null),
actualizar: async (id, u) => {
const oid = aId(id);
if (!oid) return null;
const resultado = await col.updateOne({ _id: oid }, { $set: u });
return resultado.matchedCount ? col.findOne({ _id: oid }) : null;
},
borrar: (id) => col.deleteOne({ _id: aId(id) }),
porCorreo: (correo) => col.findOne({ correo }),
};