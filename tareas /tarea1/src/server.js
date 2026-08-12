const express = require("express");
const methodOverride = require("method-override");

const AppDataSource = require("./database");
const candidatoRoutes = require("./routes/candidatoRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use("/candidatos", candidatoRoutes);

AppDataSource.initialize()
    .then(() => {

        console.log("Base de datos conectada");

        app.listen(3000, () => {
            console.log("Servidor: http://localhost:3000");
        });

    })
    .catch(error => {
        console.error("Error:", error);
    });