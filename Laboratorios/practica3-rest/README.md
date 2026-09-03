diseño del recurso usuarios
GET /usuarios lista la colección 200
POST /usuarios crea un usuario 201 + cabecera Location
GET /usuarios/:id obtiene uno 200 o 404
PUT /usuarios/:id reemplaza uno completo 200 o 404
PATCH /usuarios/:id modifica parte de uno 200 o 404
DELETE /usuarios/:id elimina uno 204 o 404