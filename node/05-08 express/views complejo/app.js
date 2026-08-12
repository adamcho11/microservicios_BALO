const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

//comfiguramos motor ejs
app.set("views", "./views");
app.set("view engine", "ejs");
//middleware para servir archivos estaticos

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    const productos = [
        { nombre: 'Producto 1', precio: 10 },
        { nombre: 'Producto 2', precio: 20 },
        { nombre: 'Producto 3', precio: 30 }
    ];
    res.render('productos', { productos });
});

//ruta para mostrar en el formulario

app.get('/', (req, res) => {
    res.render('bienvenido');
});


app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});