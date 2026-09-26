const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// ============================================
// CLIENTE gRPC - PARA PROBAR EL SERVIDOR
// ============================================
// Este archivo se conecta al servidor gRPC y ejecuta operaciones de prueba

// 1. Cargar el archivo .proto (mismo archivo que usa el servidor)
const pkgDef = protoLoader.loadSync(__dirname + '/trabajador.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(pkgDef).trabajador;

// 2. Crear el cliente apuntando al servidor
const client = new proto.TrabajadorService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// ============================================
// FUNCION AUXILIAR: Promisificar las llamadas
// ============================================
// gRPC usa callbacks, pero con Promesas el codigo es mas limpio

function llamar(metodo, datos) {
  return new Promise((resolve, reject) => {
    client[metodo](datos, (err, respuesta) => {
      if (err) reject(err);
      else resolve(respuesta);
    });
  });
}

// ============================================
// PRUEBAS: Ejecutar operaciones una tras otra
// ============================================

async function probar() {
  try {
    console.log('=== [CLIENTE gRPC] Iniciando pruebas ===\n');

    // 1. CREAR un trabajador
    console.log('1. Creando trabajador...');
    const nuevo = await llamar('Crear', {
      nombre: 'Carlos',
      apellido: 'Ramirez',
      cedula: 'V-9876543',
      cargo: 'Ingeniero DevOps',
      departamento: 'Infraestructura',
      fechaIngreso: '2025-07-20'
    });
    console.log('   Creado:', nuevo);
    const idCreado = nuevo.id;

    // 2. LISTAR todos los trabajadores
    console.log('\n2. Listando trabajadores...');
    const lista = await llamar('Listar', {});
    console.log('   Total:', lista.items.length);
    lista.items.forEach(t => {
      console.log(`   - ${t.nombre} ${t.apellido} | ${t.cargo} | ${t.departamento}`);
    });

    // 3. OBTENER el trabajador que acabamos de crear
    console.log('\n3. Obteniendo trabajador por ID...');
    const uno = await llamar('Obtener', { id: idCreado });
    console.log('   Encontrado:', uno.nombre, uno.apellido, '- Cédula:', uno.cedula);

    // 4. ACTUALIZAR el cargo
    console.log('\n4. Actualizando cargo...');
    const actualizado = await llamar('Actualizar', {
      id: idCreado,
      datos: {
        nombre: 'Carlos',
        apellido: 'Ramirez',
        cedula: 'V-9876543',
        cargo: 'Lider DevOps',  // <-- Cambiamos el cargo
        departamento: 'Infraestructura',
        fechaIngreso: '2025-07-20'
      }
    });
    console.log('   Nuevo cargo:', actualizado.cargo);

    // 5. BORRAR el trabajador
    console.log('\n5. Borrando trabajador...');
    await llamar('Borrar', { id: idCreado });
    console.log('   Borrado exitosamente');

    // 6. VERIFICAR que se borro (listar de nuevo)
    console.log('\n6. Verificando despues de borrar...');
    const listaFinal = await llamar('Listar', {});
    console.log('   Total ahora:', listaFinal.items.length);

    console.log('\n=== [CLIENTE gRPC] Pruebas completadas ===');
    process.exit(0);

  } catch (err) {
    console.error('\n[ERROR]', err.message);
    process.exit(1);
  }
}

// Esperar 1 segundo para asegurar que el servidor esta listo
setTimeout(probar, 1000);
