const amqp = require("amqplib");

const URL = "amqp://admin:admin123@localhost:5672";

async function setup() {
  const conexion = await amqp.connect(URL);
  const canal = await conexion.createChannel();

  // Exchange directo (Laboratorio 1)
  await canal.assertExchange("inscripciones", "direct", { durable: true });
  console.log("[setup] exchange 'inscripciones' creado");

  // Cola durable (Laboratorio 1)
  await canal.assertQueue("notificaciones.correo", { durable: true });
  console.log("[setup] cola 'notificaciones.correo' creada");

  // Binding (Laboratorio 1)
  await canal.bindQueue("notificaciones.correo", "inscripciones", "inscripcion.confirmada");
  console.log("[setup] binding creado: inscripciones -> notificaciones.correo (inscripcion.confirmada)");

  await conexion.close();
  console.log("[setup] listo!");
}

setup().catch((e) => { console.error(e.message); process.exit(1); });
