const express = require('express');
const mongoose = require('mongoose');
const Trabajador = require('./models/trabajador');

//parte graphql

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// parte swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/empresa_db';

app.use(express.json());

mongoose.connect(MONGO_URI)
    .then (() => {
        console.log('Connected to MongoDB');
    })

// ==========================================
// CONFIGURACION SWAGGER (Documentacion API)
// ==========================================
// swagger-jsdoc lee estos comentarios @swagger y genera un JSON OpenAPI

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Trabajadores',
            version: '1.0.0',
            description: 'API REST + GraphQL para gestionar trabajadores con MongoDB',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Servidor local',
            },
        ],
    },
    // Archivos donde swagger buscara comentarios @swagger
    apis: ['./server.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Ruta donde se mostrara la documentacion interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ==========================================
// ENDPOINTS REST (con documentacion Swagger)
// ==========================================

/**
 * @swagger
 * /trabajador:
 *   get:
 *     summary: Obtener todos los trabajadores
 *     description: Retorna una lista con todos los trabajadores registrados en MongoDB
 *     tags: [Trabajadores]
 *     responses:
 *       200:
 *         description: Lista de trabajadores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64b8f..."
 *                   nombre:
 *                     type: string
 *                     example: "Juan"
 *                   apellido:
 *                     type: string
 *                     example: "Perez"
 *                   cedula:
 *                     type: string
 *                     example: "V12345678"
 *                   cargo:
 *                     type: string
 *                     example: "Desarrollador"
 *                   departamento:
 *                     type: string
 *                     example: "Tecnologia"
 *                   fechaIngreso:
 *                     type: string
 *                     example: "2025-07-20"
 */
app.get('/trabajador', async (req, res) => {
    res.json(await Trabajador.find());
});

/**
 * @swagger
 * /trabajador:
 *   post:
 *     summary: Crear un nuevo trabajador
 *     description: Registra un trabajador en la base de datos
 *     tags: [Trabajadores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, cedula, cargo, departamento, fechaIngreso]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos"
 *               apellido:
 *                 type: string
 *                 example: "Ramirez"
 *               cedula:
 *                 type: string
 *                 example: "V-9876543"
 *               cargo:
 *                 type: string
 *                 example: "Ingeniero DevOps"
 *               departamento:
 *                 type: string
 *                 example: "Infraestructura"
 *               fechaIngreso:
 *                 type: string
 *                 example: "2025-07-20"
 *     responses:
 *       201:
 *         description: Trabajador creado exitosamente
 *       400:
 *         description: Error de validacion (faltan campos requeridos)
 */
app.post('/trabajador', async (req, res) => {
    res.status(201).json(await Trabajador.create(req.body));
});

/**
 * @swagger
 * /trabajador/{id}:
 *   put:
 *     summary: Actualizar un trabajador
 *     description: Modifica los datos de un trabajador existente por su ID
 *     tags: [Trabajadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajador en MongoDB
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               cedula:
 *                 type: string
 *               cargo:
 *                 type: string
 *               departamento:
 *                 type: string
 *               fechaIngreso:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trabajador actualizado
 *       404:
 *         description: Trabajador no encontrado
 */
app.put('/trabajador/:id', async (req, res) => {
    const item = await Trabajador.findByIdAndUpdate(req.params.id, req.body, {new: true});
    item ? res.status(200).json(item) : res.status(404).json({message: 'trabajador not found'});
});

/**
 * @swagger
 * /trabajador/{id}:
 *   delete:
 *     summary: Eliminar un trabajador
 *     description: Borra un trabajador de la base de datos por su ID
 *     tags: [Trabajadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajador en MongoDB
 *     responses:
 *       200:
 *         description: Trabajador eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "trabajador deleted"
 *       404:
 *         description: Trabajador no encontrado
 */
app.delete('/trabajador/:id', async (req, res) => {
    const item = await Trabajador.findByIdAndDelete(req.params.id);
    item ? res.status(200).json({message: 'trabajador deleted'}) : res.status(404).json({message: 'trabajador not found'});
})

//graphql
const schema = buildSchema(
    `
    type Trabajador {
        _id: ID
        nombre: String
        apellido: String
        cedula: String
        cargo: String
        departamento: String
        fechaIngreso: String
    }
    input TrabajadorInput {
        nombre: String
        apellido: String
        cedula: String
        cargo: String
        departamento: String
        fechaIngreso: String
    }
    input TrabajadorUpdateInput {
        nombre: String
        apellido: String
        cedula: String
        cargo: String
        departamento: String
        fechaIngreso: String
    }
    
    type Query {
        obtenerTrabajadores: [Trabajador]
        obtenerTrabajador(_id: ID): Trabajador
    }
    type Mutation {
        crearTrabajador(input: TrabajadorInput): Trabajador
        actualizarTrabajador(_id: ID, input: TrabajadorUpdateInput): Trabajador
        eliminarTrabajador(_id: ID): String
    }
    `
);
const root = {
    obtenerTrabajadores: async () => {
        return await Trabajador.find();
    },
    obtenerTrabajador: async ({_id}) => {
        return await Trabajador.findById(_id);
    },
    crearTrabajador: async ({input}) => {
        const trabajador = new Trabajador(input);
        await trabajador.save();
        return trabajador;
    },
    actualizarTrabajador: async ({_id, input}) => {
        const trabajador = await Trabajador.findByIdAndUpdate(_id, input, {new: true});  
        if (!trabajador) {
            throw new Error('Trabajador no encontrado');
        }
        return trabajador;
    },
    eliminarTrabajador: async ({_id}) => {
        await Trabajador.findByIdAndDelete(_id);
        return 'Trabajador eliminado';
    }

};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(PORT,() => {
    console.log('Servidor corriendo en puerto: ' + PORT);
    console.log('Documentacion Swagger disponible en: http://localhost:' + PORT + '/api-docs');
    console.log('GraphQL Playground disponible en: http://localhost:' + PORT + '/graphql');
});