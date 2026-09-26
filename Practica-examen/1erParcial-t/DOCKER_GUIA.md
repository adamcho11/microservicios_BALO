# GUIA DOCKER Y DOCKER COMPOSE

## 1. DOCKERFILE - Receta para construir tu app

El Dockerfile es como una receta de cocina que crea una imagen (una caja) con tu aplicacion.

### Linea por linea:

```
FROM node:20-alpine
```
Empieza desde la imagen base de Node.js 20 con Alpine Linux (es muy ligera, ~5MB).

```
WORKDIR /app
```
Crea la carpeta /app y se posiciona ahi. Es como hacer cd /app.

```
COPY package*.json ./
```
Copia package.json y package-lock.json al contenedor.

```
RUN npm install
```
Instala las dependencias. Esto se ejecuta UNA SOLA VEZ al construir la imagen.

```
COPY . .
```
Copia TODO el codigo (server.js, models/, etc.) al contenedor.
Lo hacemos despues de npm install para optimizar.

```
EXPOSE 3000
```
Documenta que la app usa el puerto 3000.

```
CMD ["npm", "run", "dev"]
```
Comando que se ejecuta cuando el contenedor ARRANCA.
RUN = al construir | CMD = al iniciar

---

## 2. DOCKER-COMPOSE.YML - Orquestador de contenedores

Compose levanta varios contenedores juntos (tu app + MongoDB) y los conecta.

### Servicio 'app' (tu aplicacion Node.js):

```
app:
  build: .
```
Construye la imagen usando el Dockerfile de esta carpeta.

```
  container_name: Examen_parcial1
```
Nombre fijo del contenedor. Sin esto Docker pone nombres aleatorios.

```
  ports:
    - "3000:3000"
```
Mapeo: puerto_host:puerto_contenedor.
Tu computadora recibe localhost:3000 y lo redirige al contenedor.

```
  environment:
    - MONGO_URI=mongodb://mongo:27017/empresa_db
```
Variable de entorno. Importante: 'mongo' es el nombre del OTRO servicio.
Docker lo convierte automaticamente en IP interna.

```
  depends_on:
    - mongo
```
No inicies 'app' hasta que 'mongo' este creado.

### Servicio 'mongo' (base de datos):

```
mongo:
  image: mongo:latest
```
Usa la imagen oficial de MongoDB desde Docker Hub. No necesita Dockerfile.

```
  ports:
    - "27017:27017"
```
Expone MongoDB para conectarte desde fuera (MongoDB Compass, terminal, etc.)

```
  volumes:
    - mongo-data:/data/db
```
Persistencia: guarda los datos en tu disco duro.
Sin esto, al apagar el contenedor se borra todo.

```
volumes:
  mongo-data:
```
Declara el volumen que Docker gestionara automaticamente.

---

## 3. COMANDOS DOCKER (Base)

```bash
docker images
```
Ver imagenes descargadas/construidas.

```bash
docker build -t nombre-imagen .
```
Construir imagen desde Dockerfile.

```bash
docker run -p 3000:3000 nombre-imagen
```
Correr un contenedor desde una imagen.

```bash
docker ps
```
Ver contenedores corriendo. Usar -a para ver todos.

```bash
docker stop <id>
docker rm <id>
docker rmi <nombre-imagen>
```
Parar, eliminar contenedor, eliminar imagen.

---

## 4. COMANDOS DOCKER COMPOSE (Los mas usados)

```bash
docker-compose up
```
Levantar todos los servicios. Muestra logs en terminal.

```bash
docker-compose up -d
```
Levantar en segundo plano (detached). Libera la terminal.

```bash
docker-compose up -d --build
```
Fuerza reconstruir la imagen. Usalo cuando cambies codigo.

```bash
docker-compose logs
```
Ver logs de todos los servicios.

```bash
docker-compose logs -f app
```
Ver logs de un servicio especifico y seguir escuchando (-f = follow).

```bash
docker-compose down
```
Apagar y eliminar contenedores. Los volumenes se mantienen.

```bash
docker-compose down -v
```
Apagar TODO incluyendo volumenes. CUIDADO: borra la base de datos.

```bash
docker-compose ps
```
Ver estado de los contenedores de este compose.

```bash
docker-compose exec app sh
```
Abrir terminal dentro del contenedor 'app' para debuguear.

---

## 5. DIAGRAMA DE RED

```
TU COMPUTADORA (Host)
  localhost:3000  -->  Contenedor 'app' (Node.js)
  localhost:27017 -->  Contenedor 'mongo' (MongoDB)
  
Red interna Docker:
  app <---> mongo (se comunican por nombre 'mongo')
  
Volumen:
  mongo-data:/data/db (persistencia en disco)
```

---

## 6. DIFERENCIA CLAVE: CMD vs RUN

| Comando | Cuando se ejecuta | Ejemplo |
|---------|-------------------|---------|
| RUN | Al CONSTRUIR la imagen | npm install |
| CMD | Al INICIAR el contenedor | npm run dev |

RUN crea capas en la imagen. CMD es el punto de entrada del contenedor.
