
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Cargo",
    tableName: "cargos",

    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },

        nombre: {
            type: String,
            length: 100
        }
    }
});