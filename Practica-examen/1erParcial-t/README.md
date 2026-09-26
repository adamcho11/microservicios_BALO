# Proyecto 1erParcial-t - API Trabajadores

Proyecto completo de microservicios con Node.js, Express, MongoDB, GraphQL, gRPC y Swagger.

---

## Tecnologias incluidas

| Tecnologia | Uso | Ruta |
|------------|-----|------|
| **Express** | Framework web | Base del servidor |
| **MongoDB + Mongoose** | Base de datos | `mongodb://localhost:27017/empresa_db` |
| **REST API** | Endpoints HTTP tradicionales | `/trabajador` |
| **GraphQL** | API flexible con queries y mutations | `/graphql` |
| **Swagger/OpenAPI** | Documentacion interactiva de la API REST | `/api-docs` |
| **gRPC** | Comunicacion rapida entre microservicios | Puerto `50051` |
| **Docker** | Contenedores para Node.js y MongoDB | `docker-compose.yml` |

---

## Instalacion

```bash
npm install
```

---

## Ejecucion

### Opcion 1: Con Docker (recomendado)

```bash
docker-compose up -d
```

Levanta MongoDB + Node.js automaticamente.

### Opcion 2: Local (necesitas MongoDB corriendo)

```bash
# Terminal 1: Asegurar MongoDB
docker-compose up -d mongodb
# o mongod si lo tienes instalado localmente

# Terminal 2: Servidor principal (REST + GraphQL + Swagger)
npm run dev
# o: node server.js

# Terminal 3: Servidor gRPC (opcional)
node grpc-ejemplo/grpc-server.js
```

---

## Endpoints y URLs

| Servicio | URL | Descripcion |
|----------|-----|-------------|
| REST API - GET | `http://localhost:3000/trabajador` | Listar trabajadores |
| REST API - POST | `http://localhost:3000/trabajador` | Crear trabajador |
| REST API - PUT | `http://localhost:3000/trabajador/:id` | Actualizar trabajador |
| REST API - DELETE | `http://localhost:3000/trabajador/:id` | Eliminar trabajador |
| **Swagger UI** | **`http://localhost:3000/api-docs`** | **Documentacion interactiva** |
| GraphQL | `http://localhost:3000/graphql` | Playground de GraphQL |
| gRPC Server | `localhost:50051` | Servicio gRPC (sin navegador) |

---

## Swagger - Documentacion Interactiva

### Que es Swagger?

Swagger (ahora llamado OpenAPI) es una herramienta que genera documentacion automatica de tu API REST. A partir de comentarios especiales en el codigo (`@swagger`), crea una pagina web donde puedes:

- **Ver todos los endpoints** con sus parametros y respuestas
- **Probar los endpoints** directamente desde el navegador (sin Postman)
- **Ver ejemplos** de como enviar y recibir datos
- **Descargar** la especificacion OpenAPI en JSON

### Como funciona en este proyecto?

En `server.js`, arriba de cada endpoint REST hay un bloque de comentios como este:

```javascript
/**
 * @swagger
 * /trabajador:
 *   get:
 *     summary: Obtener todos los trabajadores
 *     ...
 */
app.get('/trabajador', ...)
```

La libreria `swagger-jsdoc` lee estos comentarios al iniciar el servidor y genera un archivo JSON OpenAPI. Luego `swagger-ui-express` muestra ese JSON como una pagina web bonita en `/api-docs`.

### Como usarlo?

1. Inicia el servidor: `node server.js`
2. Abre tu navegador en: **`http://localhost:3000/api-docs`**
3. Veras una pagina con todos los endpoints documentados
4. Haz clic en cualquier endpoint (ej: `POST /trabajador`)
5. Presiona "Try it out"
6. Edita el JSON de ejemplo y presiona "Execute"
7. Veras la respuesta del servidor abajo

### Ventajas de usar Swagger

- **No necesitas Postman**: Pruebas directamente desde el navegador
- **Siempre actualizado**: La documentacion se genera del codigo fuente
- **Claro para frontend**: Los desarrolladores del frontend ven exactamente que enviar
- **Estandar industrial**: OpenAPI es el estandar mundial de documentacion de APIs

---

## GraphQL

Accede al playground en `http://localhost:3000/graphql`

### Queries

```graphql
query {
  obtenerTrabajadores {
    _id
    nombre
    apellido
    cargo
  }
}
```

```graphql
query {
  obtenerTrabajador(_id: "64b8f...") {
    nombre
    cedula
    departamento
  }
}
```

### Mutations

```graphql
mutation {
  crearTrabajador(input: {
    nombre: "Carlos"
    apellido: "Ramirez"
    cedula: "V-9876543"
    cargo: "DevOps"
    departamento: "Infraestructura"
    fechaIngreso: "2025-07-20"
  }) {
    _id
    nombre
  }
}
```

```graphql
mutation {
  actualizarTrabajador(_id: "64b8f...", input: {
    cargo: "Lider DevOps"
  }) {
    nombre
    cargo
  }
}
```

```graphql
mutation {
  eliminarTrabajador(_id: "64b8f...")
}
```

---

## gRPC

Ver carpeta `grpc-ejemplo/` para el ejemplo completo.

```bash
# Terminal 1: Servidor gRPC
node grpc-ejemplo/grpc-server.js

# Terminal 2: Cliente de prueba
node grpc-ejemplo/grpc-client.js
```

---

## Estructura de archivos

```
1erParcial-t/
├── server.js                 # Servidor principal (REST + GraphQL + Swagger)
├── models/
│   └── Trabajador.js         # Modelo Mongoose
├── grpc-ejemplo/             # Ejemplo gRPC
│   ├── trabajador.proto      # Contrato gRPC
│   ├── grpc-server.js        # Servidor gRPC
│   ├── grpc-client.js        # Cliente de prueba
│   └── README.md             # Guia gRPC
├── package.json              # Dependencias
├── docker-compose.yml        # Docker (Node + MongoDB)
├── Dockerfile                # Imagen de Node.js
├── .env                      # Variables de entorno
├── .env.example              # Ejemplo de variables
├── README.md                 # Este archivo
└── CODIGO_COMPLETO.pdf       # Todo el codigo en PDF
```

---

## Modelo de datos (Trabajador)

| Campo | Tipo | Requerido | Ejemplo |
|-------|------|-----------|---------|
| nombre | String | Si | "Juan" |
| apellido | String | Si | "Perez" |
| cedula | String | Si | "V-12345678" |
| cargo | String | Si | "Desarrollador" |
| departamento | String | Si | "Tecnologia" |
| fechaIngreso | Date | Si | "2025-07-20" |

---

## Notas importantes

- **Formato de fecha**: Usar `YYYY-MM-DD` (ej: `2025-07-20`). MongoDB lo guarda como `Date`.
- **ID en GraphQL**: Usar `_id` (con guion bajo) para coincidir con MongoDB.
- **ID en REST**: Usar `id` en la URL (ej: `/trabajador/64b8f...`).
- **Swagger**: No documenta GraphQL ni gRPC, solo la parte REST.

---

## Comandos utiles

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo (con nodemon)
npm run dev

# Iniciar en produccion
node server.js

# Generar PDF con todo el codigo
python3 generar_pdf.py

# Docker
 docker-compose up -d        # Levantar todo
 docker-compose down         # Bajar todo
 docker-compose logs -f app  # Ver logs de Node.js
```
