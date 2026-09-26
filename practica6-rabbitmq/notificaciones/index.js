require("dotenv").config();
const amqp = require("amqplib");

const COLA = process.env.COLA;
const LIMITE = 3;

// Efecto contable: cupos por curso
const cupos = { "COM-600": 30 };

// Registro de eventos procesados (en produccion: tabla con clave unica)
const procesados = new Set();

async function enviarCorreo(evento) {
  console.log("[correo] enviando a", evento.correo, "por", evento.id);
  await new Promise((r) => setTimeout(r, 1500));
  console.log("[correo] enviado a", evento.correo);
}

function descontarCupo(evento) {
  cupos[evento.curso] = (cupos[evento.curso] ?? 30) - 1;
  console.log("[cupos]", evento.curso, "quedan", cupos[evento.curso]);
}

async function procesar(evento) {
  if (!evento.correo || !evento.correo.includes("@")) {
    throw new Error("correo invalido: " + evento.correo);
  }
  await enviarCorreo(evento);
  descontarCupo(evento);
  console.log("[correo] bienvenida enviada a", evento.correo);
}

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL);
  const canal = await conexion.createChannel();
  await canal.assertQueue(COLA, { durable: true });
  canal.prefetch(1);
  console.log("[correo] esperando mensajes en", COLA);

  canal.consume(COLA, async (mensaje) => {
    if (mensaje === null) return;

    const id = mensaje.properties.messageId;

    // Idempotencia: si ya procesamos este evento, solo confirmamos
    if (procesados.has(id)) {
      console.log("[idempotencia] evento repetido", id, "- se ignora");
      return canal.ack(mensaje);
    }

    const muertes = mensaje.properties.headers["x-death"];
    const intentos = muertes ? muertes[0].count : 0;

    if (intentos >= LIMITE) {
      console.error("[correo] sin mas intentos: a la cola muerta");
      canal.sendToQueue("notificaciones.muertos", mensaje.content, {
        persistent: true,
      });
      return canal.ack(mensaje);
    }

    try {
      await procesar(JSON.parse(mensaje.content.toString()));
      procesados.add(id);
      canal.ack(mensaje);
    } catch (e) {
      console.error("[correo] intento", intentos + 1, "fallido:", e.message);
      canal.nack(mensaje, false, false);
    }
  }, { noAck: false });
}

main().catch((e) => { console.error(e.message); process.exit(1); });
