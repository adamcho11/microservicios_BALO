const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');

// ============================================
// 1. CONEXION A MONGODB
// ============================================
// Nos conectamos a la misma base de datos que usa el proyecto principal
// Si usas Docker: mongodb://mongodb:27017/empresa_db
// Si es local:    mongodb://localhost:27017/empresa_db

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/empresa_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('[gRPC Server] Conectado a MongoDB'))
  .catch(err => console.error('[gRPC Server] Error MongoDB:', err));

// ============================================
// 2. DEFINIR MODELO (igual que en tu proyecto)
// ============================================
const trabajadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  cedula: { type: String, required: true },
  cargo: { type: String, required: true },
  departamento: { type: String, required: true },
  fechaIngreso: { type: Date, required: true },
});

const Trabajador = mongoose.model('Trabajador', trabajadorSchema);

// ============================================
// 3. CARGAR EL ARCHIVO .PROTO
// ============================================
// protoLoader convierte el archivo .proto en un objeto JavaScript usable

const pkgDef = protoLoader.loadSync(__dirname + '/trabajador.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(pkgDef).trabajador;

// ============================================
// 4. IMPLEMENTAR LOS METODOS DEL SERVICIO
// ============================================
// Cada funcion aqui responde a un "rpc" definido en el .proto
// call = objeto con los datos enviados por el cliente
// callback = funcion que usamos para responder al cliente

const server = new grpc.Server();

server.addService(proto.TrabajadorService.service, {

  // LISTAR TODOS
  Listar: async (_, callback) => {
    try {
      const data = await Trabajador.find();
      
      // Convertir cada documento MongoDB al formato del .proto
      const items = data.map(doc => ({
        id: doc._id.toString(),
        nombre: doc.nombre,
        apellido: doc.apellido,
        cedula: doc.cedula,
        cargo: doc.cargo,
        departamento: doc.departamento,
        fechaIngreso: doc.fechaIngreso.toISOString().split('T')[0], // "2025-07-20"
      }));

      callback(null, { items });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // OBTENER UNO POR ID
  Obtener: async (call, callback) => {
    try {
      const doc = await Trabajador.findById(call.request.id);
      if (!doc) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Trabajador no encontrado' });
      }

      callback(null, {
        id: doc._id.toString(),
        nombre: doc.nombre,
        apellido: doc.apellido,
        cedula: doc.cedula,
        cargo: doc.cargo,
        departamento: doc.departamento,
        fechaIngreso: doc.fechaIngreso.toISOString().split('T')[0],
      });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // CREAR NUEVO
  Crear: async (call, callback) => {
    try {
      const { nombre, apellido, cedula, cargo, departamento, fechaIngreso } = call.request;
      
      const doc = await Trabajador.create({
        nombre,
        apellido,
        cedula,
        cargo,
        departamento,
        fechaIngreso: new Date(fechaIngreso), // Convertir string a Date de MongoDB
      });

      callback(null, {
        id: doc._id.toString(),
        nombre: doc.nombre,
        apellido: doc.apellido,
        cedula: doc.cedula,
        cargo: doc.cargo,
        departamento: doc.departamento,
        fechaIngreso: doc.fechaIngreso.toISOString().split('T')[0],
      });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // ACTUALIZAR
  Actualizar: async (call, callback) => {
    try {
      const { id, datos } = call.request;
      const updateData = { ...datos };
      
      // Si viene fechaIngreso, convertirla a Date
      if (updateData.fechaIngreso) {
        updateData.fechaIngreso = new Date(updateData.fechaIngreso);
      }

      const doc = await Trabajador.findByIdAndUpdate(id, updateData, { new: true });
      if (!doc) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Trabajador no encontrado' });
      }

      callback(null, {
        id: doc._id.toString(),
        nombre: doc.nombre,
        apellido: doc.apellido,
        cedula: doc.cedula,
        cargo: doc.cargo,
        departamento: doc.departamento,
        fechaIngreso: doc.fechaIngreso.toISOString().split('T')[0],
      });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // BORRAR
  Borrar: async (call, callback) => {
    try {
      const doc = await Trabajador.findByIdAndDelete(call.request.id);
      if (!doc) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'Trabajador no encontrado' });
      }
      callback(null, {});
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  }

});

// ============================================
// 5. ARRANCAR EL SERVIDOR
// ============================================

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err) => {
  if (err) {
    console.error('Error iniciando servidor:', err);
    return;
  }
  console.log(`[gRPC Server] Escuchando en ${PORT}`);
  server.start();
});
