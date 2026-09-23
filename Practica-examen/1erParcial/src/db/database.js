const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/trabajador', {
})
.then(()=> console.log('MongoDB conectado'))
.catch((err)=> console.log("Error al conectar a MongoDB: " + err));

