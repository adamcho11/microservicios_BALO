# Ejemplo gRPC - Trabajador

Este es un ejemplo minimo de gRPC con Node.js y MongoDB usando el modelo completo de Trabajador.

## Archivos

| Archivo | Descripcion |
|---------|-------------|
| `trabajador.proto` | Contrato del servicio (define que metodos existen) |
| `grpc-server.js` | Servidor gRPC que conecta a MongoDB |
| `grpc-client.js` | Cliente de prueba que ejecuta todas las operaciones |

## Instalacion

```bash
npm install @grpc/grpc-js @grpc/proto-loader mongoose
```

O si estas en la carpeta raiz del proyecto (1erParcial-t):

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

## Ejecucion

### Paso 1: Asegurar que MongoDB este corriendo

Si usas Docker Compose del proyecto principal:
```bash
docker-compose up -d mongodb
```

Si es MongoDB local:
```bash
mongod
```

### Paso 2: Iniciar el servidor gRPC

```bash
node grpc-ejemplo/grpc-server.js
```

Deberias ver:
```
[gRPC Server] Conectado a MongoDB
[gRPC Server] Escuchando en 0.0.0.0:50051
```

### Paso 3: Ejecutar el cliente de prueba

En otra terminal:

```bash
node grpc-ejemplo/grpc-client.js
```

El cliente ejecutara automaticamente:
1. Crear un trabajador
2. Listar todos
3. Obtener uno por ID
4. Actualizarlo
5. Borrarlo
6. Verificar el borrado

## Diferencias clave: REST vs GraphQL vs gRPC

| Caracteristica | REST | GraphQL | gRPC |
|----------------|------|---------|------|
| Protocolo | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| Formato | JSON | JSON | Protobuf (binario) |
| Velocidad | Media | Media | Muy rapida |
| Uso ideal | APIs publicas | Frontend flexible | Microservicios internos |
| Contrato | OpenAPI/Swagger | Schema SDL | Archivo .proto |

## Puerto del servidor

- gRPC Server: **50051** (puerto por defecto de gRPC)
- REST API: **3000** (del proyecto principal)
- GraphQL: **3000/graphql** (del proyecto principal)
