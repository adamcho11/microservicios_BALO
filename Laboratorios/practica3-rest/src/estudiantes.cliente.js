const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const definicion = protoLoader.loadSync(__dirname + "/../proto/estudiantes.proto", {
  keepCase: true,
});
const paquete = grpc.loadPackageDefinition(definicion).estudiantes;
const cliente = new paquete.EstudianteService(
  process.env.GRPC_ADDR || "localhost:50051",
  grpc.credentials.createInsecure(),
);

function obtenerEstudiante(ci) {
  return new Promise((resolver, rechazar) => {
    cliente.ObtenerEstudiante({ ci }, (err, respuesta) => {
      if (err) return rechazar(err);
      resolver(respuesta.estudiante);
    });
  });
}

module.exports = { obtenerEstudiante, grpc };
