const { MongoClient } = require("mongodb");
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "practica4_ventas";
let cliente;
let coleccion;
async function conectar() {
  cliente = await new MongoClient(MONGO_URL).connect();
  coleccion = cliente.db(MONGO_DB).collection("ventas");
  console.log("MongoDB conectado en " + MONGO_URL);
  return cliente;
}
function colVentas() {
  if (!coleccion) throw new Error("Base de datos no conectada");
  return coleccion;
}
module.exports = { conectar, colVentas };