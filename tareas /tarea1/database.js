require("reflect-metadata");

const { DataSource } = require("typeorm");

const Candidato = require("./entities/Candidato");
const Cargo = require("./entities/Cargo");
const Lugar = require("./entities/Lugar");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "elecciones",

    entities: [
        Candidato,
        Cargo,
        Lugar
    ],

    synchronize: false
});

module.exports = AppDataSource;