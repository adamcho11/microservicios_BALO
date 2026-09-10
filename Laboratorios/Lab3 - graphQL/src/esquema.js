const typeDefs = `#graphql
type DetalleVenta {
producto: String!
cantidad: Int!
precioUnitario: Float!
}
type Venta {
id: ID!
fecha: String!
total: Float!
detalle: [DetalleVenta!]!
}
type Query {
ventas: [Venta!]!
venta(id: ID!): Venta
}
input DetalleVentaInput {
producto: String!
cantidad: Int!
precioUnitario: Float!
}
input VentaInput {
id: ID
fecha: String!
detalle: [DetalleVentaInput!]!
}
type Mutation {
crearVenta(input: VentaInput!): Venta
}
`;

module.exports = typeDefs;