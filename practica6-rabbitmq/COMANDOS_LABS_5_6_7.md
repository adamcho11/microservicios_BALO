# PRACTICA 6 - LABORATORIOS 5, 6 y 7
# Comandos paso a paso

# ============================================================
# PREPARACION (hacer antes de cualquier lab)
# ============================================================

# 1. Asegurarse que el broker esta corriendo
cd /Users/adamleanos/Documents/2-2026/microservicios_BALO/practica6-rabbitmq
docker compose ps

# Si no esta corriendo:
docker compose up -d
docker compose logs rabbitmq | tail -5

# 2. Crear la topologia basica (exchange + cola + binding)
node setup.js

# 3. Levantar el productor (Terminal 1)
cd inscripciones
node index.js

# 4. Levantar el consumidor (Terminal 2)
cd notificaciones
node index.js

# ============================================================
# LABORATORIO 5 - Confirmaciones y durabilidad
# ============================================================

# ---------- CAPTURA 14: Mensaje de Unacked a Ready ----------
# PASO 1: Asegurarse que el consumidor esta corriendo (Terminal 2)
cd /Users/adamleanos/Documents/2-2026/microservicios_BALO/practica6-rabbitmq/notificaciones
node index.js

# PASO 2: Publicar una inscripcion (Terminal 3)
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Pedro Prueba","correo":"pedro@usfx.bo","curso":"COM-600"}'

# PASO 3: Mientras el consumidor dice "[correo] enviando a...",
#         presionar Ctrl+C en la Terminal 2 (consumidor)
#         IMPORTANTE: cortar ANTES de que diga "[correo] enviado"

# PASO 4: Ir a consola web RabbitMQ
# http://localhost:15672
# Queues and Streams -> notificaciones.correo
# Ver que el mensaje paso de Unacked a Ready
# CAPTURA 14: Screenshot de la cola mostrando Ready=1, Unacked=0

# ---------- CAPTURA 15: Mensaje perdido con noAck true ----------
# PASO 1: Modificar notificaciones/index.js
# Cambiar esta linea:
#     }, { noAck: false });
# Por esta:
#     }, { noAck: true });
# Y comentar o borrar: canal.ack(mensaje);

# PASO 2: Guardar y reiniciar consumidor (Terminal 2)
cd /Users/adamleanos/Documents/2-2026/microservicios_BALO/practica6-rabbitmq/notificaciones
node index.js

# PASO 3: Publicar inscripcion (Terminal 3)
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Test NoAck","correo":"test@usfx.bo","curso":"COM-600"}'

# PASO 4: Mientras dice "enviando...", cortar consumidor con Ctrl+C

# PASO 5: Ir a consola web
# Queues and Streams -> notificaciones.correo
# Ver Ready=0 (el mensaje se perdio!)
# CAPTURA 15: Screenshot mostrando cola en cero

# PASO 6: IMPORTANTE - Revertir el cambio!
# Volver a poner { noAck: false } y descomentar canal.ack(mensaje)

# ---------- CAPTURA 16: Cola durable vs Transient ----------
# PASO 1: En consola web RabbitMQ
# Queues and Streams -> Add a new queue
#   Name: prueba.volatil
#   Type: Classic
#   Durability: Transient
# Click Add queue

# PASO 2: Enlazar la cola al exchange
# Ir a Exchanges -> inscripciones -> Bindings
#   To queue: prueba.volatil
#   Routing key: inscripcion.confirmada
# Click Bind

# PASO 3: Detener consumidor (Ctrl+C en Terminal 2)

# PASO 4: Publicar 2 inscripciones (Terminal 3)
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Test1","correo":"t1@usfx.bo","curso":"COM-600"}'

curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Test2","correo":"t2@usfx.bo","curso":"COM-600"}'

# PASO 5: Verificar que ambas colas tienen mensajes
# Consola web: Queues and Streams
# notificaciones.correo -> Ready=2
# prueba.volatil -> Ready=2

# PASO 6: Reiniciar el broker
docker compose restart rabbitmq

# PASO 7: Esperar a que arranque
docker compose logs rabbitmq | tail -5
# Esperar "Server startup complete"

# PASO 8: Ir a consola web -> Queues and Streams
# Ver que notificaciones.correo sigue con sus 2 mensajes
# Ver que prueba.volatil DESAPARECIO (cola transitoria)
# CAPTURA 16: Screenshot mostrando la cola durable con mensajes
#              y la cola transitoria ausente

# ============================================================
# LABORATORIO 6 - Reintentos y cola de mensajes muertos
# ============================================================

# ---------- CAPTURA 17: Reintentos fallidos ----------
# PASO 1: Borrar la cola notificaciones.correo desde consola web
# Queues and Streams -> notificaciones.correo -> Delete queue
# Confirmar borrado

# PASO 2: Crear circuito DLQ (Terminal desde raiz)
cd /Users/adamleanos/Documents/2-2026/microservicios_BALO/practica6-rabbitmq
node dlq.js

# PASO 3: Verificar en consola web que existen:
# - notificaciones.correo (con DLX)
# - notificaciones.reintento (con TTL y DLX)
# - notificaciones.muertos

# PASO 4: Levantar consumidor (Terminal 2)
cd /Users/adamleanos/Documents/2-2026/microservicios_BALO/practica6-rabbitmq/notificaciones
node index.js

# PASO 5: Publicar inscripcion con correo INVALIDO (Terminal 3)
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Ana Mal","correo":"ana.punto.usfx.bo","curso":"COM-600"}'

# PASO 6: Observar Terminal 2 (consumidor)
# Deberia mostrar:
# [correo] intento 1 fallido: correo invalido: ana.punto.usfx.bo
# (espera 5 segundos)
# [correo] intento 2 fallido: correo invalido: ana.punto.usfx.bo
# (espera 5 segundos)
# [correo] intento 3 fallido: correo invalido: ana.punto.usfx.bo
# [correo] sin mas intentos: a la cola muerta

# CAPTURA 17: Screenshot de la terminal con los 3 intentos

# ---------- CAPTURA 18: Cola muerta ----------
# PASO 1: Ir a consola web
# Queues and Streams -> notificaciones.muertos
# Ver Ready=1

# PASO 2: Click en notificaciones.muertos -> Get messages
# Ack Mode: Nack message requeue true
# Click Get Message(s)

# PASO 3: Ver el contenido del mensaje fallido
# CAPTURA 18: Screenshot mostrando el mensaje en la cola muerta

# ============================================================
# LABORATORIO 7 - Idempotencia
# ============================================================

# ---------- CAPTURA 19: Doble efecto (sin idempotencia) ----------
# PASO 1: Temporalmente desactivar idempotencia
# En notificaciones/index.js, comentar estas lineas:
#     if (procesados.has(id)) {
#       console.log("[idempotencia] evento repetido", id, "- se ignora");
#       return canal.ack(mensaje);
#     }
# Y tambien comentar: procesados.add(id);

# PASO 2: Reiniciar consumidor (Terminal 2)
cd /Users/adamleanos/Documents/2-2026/microservicios_BALO/practica6-rabbitmq/notificaciones
node index.js

# PASO 3: Publicar una inscripcion (Terminal 3)
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Idem Test","correo":"idem@usfx.bo","curso":"COM-600"}'

# PASO 4: Esperar a que el consumidor la procese (1.5 seg)

# PASO 5: Ir a consola web
# Queues and Streams -> notificaciones.correo -> Get messages
# Ack Mode: Nack message requeue true
# Click Get Message(s) -> el mensaje vuelve a la cola

# PASO 6: El consumidor lo procesa de nuevo
# Ver en Terminal 2:
# [cupos] COM-600 quedan 29
# [cupos] COM-600 quedan 28  <- SE DESCONTO 2 VECES!

# CAPTURA 19: Screenshot de la terminal mostrando el mismo ID
#              procesado 2 veces y cupo descontado 2 veces

# PASO 7: RESTAURAR idempotencia (descomentar las lineas)

# ---------- CAPTURA 20: Idempotencia funciona ----------
# PASO 1: Asegurar que idempotencia esta activa
# Las lineas deben estar asi:
#     if (procesados.has(id)) {
#       console.log("[idempotencia] evento repetido", id, "- se ignora");
#       return canal.ack(mensaje);
#     }
# Y al final del try: procesados.add(id);

# PASO 2: Reiniciar consumidor (Terminal 2)
node index.js

# PASO 3: Publicar inscripcion (Terminal 3)
curl -i -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"estudiante":"Idem OK","correo":"idemok@usfx.bo","curso":"COM-600"}'

# PASO 4: Esperar a que procese

# PASO 5: Reenviar el mismo mensaje desde consola web
# Queues and Streams -> notificaciones.correo -> Get messages
# Ack Mode: Nack message requeue true
# Click Get Message(s)

# PASO 6: Ver en Terminal 2:
# [idempotencia] evento repetido INS-XXXXXXX - se ignora
# El cupo NO se descuenta de nuevo

# CAPTURA 20: Screenshot de la terminal mostrando el mensaje
#              repetido reconocido e ignorado
