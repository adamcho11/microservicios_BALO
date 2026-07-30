console.log('inicio del programa');

setTimeout(() => {
  console.log('ejecutando tarea 1');
}, 2000);

setImmediate(() => {
  console.log('ejecutando tarea 2');
}, 1000);

console.log('fin del programa');