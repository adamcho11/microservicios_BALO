const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Lugar",
    tableName: "lugares",

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