const fs = require("fs");
const data = 'esto se escribira en el archivo xd';

fs.writeFile('archivo.txt', data, (err) => {
  if (err) throw err;
  console.log('El archivo ha sido creado y los datos han sido escritos.');
});